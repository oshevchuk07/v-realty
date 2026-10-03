'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { requireAdmin } from '@/server/require-admin';

const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AdminFormState = { error?: string };

export async function createAdmin(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = createAdminSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: 'Користувач з таким email вже існує' };

  await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      role: 'ADMIN',
    },
  });

  revalidatePath('/admin/admins');
  return {};
}

// Deal-type notification routing is deliberately separate from auth/role data —
// toggled often (e.g. when an admin goes on leave), so it's a lightweight update
export async function updateAdminNotifications(
  userId: string,
  formData: FormData,
) {
  await requireAdmin();

  const telegramChatId = formData.get('telegramChatId');
  const dealTypes = formData.getAll('notifyDealTypes'); // checkboxes, zero or more values

  await prisma.user.update({
    where: { id: userId },
    data: {
      telegramChatId: typeof telegramChatId === 'string' && telegramChatId ? telegramChatId : null,
      notifyDealTypes: dealTypes as ('RENT' | 'SALE')[],
    },
  });

  revalidatePath('/admin/admins');
}

export async function toggleAdminActive(userId: string, isActive: boolean) {
  const session = await requireAdmin();

  // A user can't deactivate themselves — would lock them out with no one else
  // able to reactivate the account through the UI

  if (session?.user.id === userId && !isActive) {
    return;
  }

  await prisma.user.update({ where: { id: userId }, data: { isActive } });
  revalidatePath('/admin/admins');
}