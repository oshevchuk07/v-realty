'use server'

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import z from "zod"

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_REQUESTS = 3;

const leadSchema = z.object({
  name: z.string().min(2, 'Вкажіть Ім’я'),
  phone: z.string().min(7, 'Вкажи номер телефону'),
  message: z.string().optional(),
  propertyId: z.string().optional(),
  // Hidden honeypot field — real visitors never see or fill it (hidden via CSS,
  // not `type="hidden"`, so basic bots that skip hidden inputs still get caught)
  website: z.string().optional(),
})

export type LeadFormState = {
  error?: string;
  success?: boolean;
};

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  // Vercel sets x-forwarded-for; first entry is the original client
  const forwardedFor = headersList.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() ?? 'unknown';
}


// Telegram delivery is best-effort — a failed notification should never block
// saving the lead itself, since the DB record is the source of truth
async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
  } catch (err) {
    console.error('Telegram notify failed:', err);
  }
}

export async function createLead(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, phone, message, propertyId, website } = parsed.data;

  // Honeypot triggered — silently pretend success so bots don't learn to adapt
  if (website) {
    return { success: true };
  }

  const ip = await getClientIp();
  const recentCount = await prisma.leadRequest.count({
    where: {
      ip,
      createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000) },
    },
  });

  if (recentCount >= RATE_LIMIT_MAX_REQUESTS) {
    return { error: 'Забагато заявок поспіль. Спробуйте пізніше або зателефонуйте напряму.' };
  }

  let propertyLabel = '';
  if (propertyId) {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (property) propertyLabel = `\n📍 ${property.address}`;
  }

  await prisma.leadRequest.create({
    data: { name, phone, message, propertyId: propertyId || null },
  });

  await notifyTelegram(
    `🔔 Нова заявка${propertyLabel}\n👤 ${name}\n📞 ${phone}${message ? `\n💬 ${message}` : ''}`,
  );

  return { success: true };
}