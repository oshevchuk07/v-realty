'use server'

import { prisma } from "@/lib/prisma";
import z from "zod"

const leadSchema = z.object({
  name: z.string().min(2, 'Вкажіть Ім’я'),
  phone: z.string().min(7, 'Вкажи номер телефону'),
  message: z.string().optional(),
  propertyId: z.string().optional(),
})

export type LeadFormState = {
  error?: string;
  success?: boolean;
};

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

  const { name, phone, message, propertyId } = parsed.data;

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