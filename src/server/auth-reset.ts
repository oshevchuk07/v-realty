'use server';

import crypto from 'crypto';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);
const TOKEN_TTL_MINUTES = 60;

function hashToken(rawToken: string) {
  // Store only the hash — a leaked DB row alone can't be used as a valid reset link
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export type ForgotPasswordState = { success?: boolean };

const emailSchema = z.string().email();

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = emailSchema.safeParse(formData.get('email'));

  // Always report success, whether or not the email exists — prevents using this
  // form to probe which addresses have admin accounts
  if (!parsed.success) return { success: true };

  const user = await prisma.user.findUnique({ where: { email: parsed.data } });
  if (!user) return { success: true };

  const rawToken = crypto.randomBytes(32).toString('hex');

  await prisma.passwordResetToken.create({
    data: {
      token: hashToken(rawToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000),
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password/${rawToken}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: user.email,
    subject: 'Відновлення пароля',
    html: `
      <p>Щоб встановити новий пароль, перейдіть за посиланням (діє ${TOKEN_TTL_MINUTES} хв):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Якщо це були не ви — просто проігноруйте цей лист.</p>
    `,
  });

  return { success: true };
}

export type ResetPasswordState = { error?: string };

const newPasswordSchema = z.string().min(8, 'Пароль має містити щонайменше 8 символів');

export async function resetPassword(
  rawToken: string,
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = newPasswordSchema.safeParse(formData.get('newPassword'));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: hashToken(rawToken) },
  });

  if (!tokenRecord || !tokenRecord.userId || tokenRecord.expiresAt < new Date()) {
    return { error: 'Посилання недійсне або застаріло. Запросіть нове.' };
  }

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { passwordHash: await bcrypt.hash(parsed.data, 10) },
  });

  // Invalidate every outstanding reset token for this user, not just the used one
  await prisma.passwordResetToken.deleteMany({ where: { userId: tokenRecord.userId } });

  redirect('/admin/login?reset=success');
}