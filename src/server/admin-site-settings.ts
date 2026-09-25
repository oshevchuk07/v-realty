'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/require-admin';

const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactAddress: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialTelegram: z.string().optional(),
});

export type SiteSettingsFormState = { error?: string; success?: boolean };

export async function updateSiteSettings(
  _prevState: SiteSettingsFormState,
  formData: FormData,
): Promise<SiteSettingsFormState> {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });

  // Site settings affect nearly every public page (header, footer, metadata) —
  // revalidating the layout path covers all of them at once
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');

  return { success: true };
}