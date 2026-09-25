'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/require-admin';
import { cloudinary } from '@/lib/cloudinary';

const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Невірний формат кольору'),
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

export async function uploadSiteLogo(formData: FormData) {
  await requireAdmin();

  const file = formData.get('logo');
  if (!(file instanceof File)) throw new Error('No file provided');

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  // Fixed public_id + overwrite — logo is a singleton, re-upload replaces
  // the same Cloudinary asset instead of accumulating orphaned files
  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder: 'site',
    public_id: 'logo',
    overwrite: true,
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: { logoUrl: uploaded.secure_url },
    create: { id: 1, logoUrl: uploaded.secure_url },
  });

  revalidatePath('/', 'layout');
}