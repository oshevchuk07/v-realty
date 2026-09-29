'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { cloudinary } from '@/lib/cloudinary';
import { requireAdmin } from '@/server/require-admin';
import { BLOCK_REGISTRY, type BlockTypeKey } from '@/lib/blocks/registry';

export type BlockFormState = { error?: string };

function buildRawData(formData: FormData) {
  // `type`/`order` is not part of the specific block's data — remove before validation
  const { type: _t, order: _o, ...rest } = Object.fromEntries(formData.entries());
  return rest;
}

export async function createBlock(
  type: BlockTypeKey,
  _prevState: BlockFormState,
  formData: FormData,
): Promise<BlockFormState> {
  await requireAdmin();

  const parsed = BLOCK_REGISTRY[type].schema.safeParse(buildRawData(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const maxOrder = await prisma.pageBlock.aggregate({
    where: { page: 'home' },
    _max: { order: true },
  });

  await prisma.pageBlock.create({
    data: { page: 'home', type, order: (maxOrder._max.order ?? -1) + 1, data: parsed.data },
  });

  revalidatePath('/admin/blocks');
  revalidatePath('/');
  redirect('/admin/blocks');
}

export async function updateBlock(
  id: string,
  type: BlockTypeKey,
  _prevState: BlockFormState,
  formData: FormData,
): Promise<BlockFormState> {
  await requireAdmin();

  const parsed = BLOCK_REGISTRY[type].schema.safeParse(buildRawData(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.pageBlock.update({ where: { id }, data: { data: parsed.data } });

  revalidatePath('/admin/blocks');
  revalidatePath('/');
  redirect('/admin/blocks');
}

export async function deleteBlock(id: string) {
  await requireAdmin();
  await prisma.pageBlock.delete({ where: { id } });
  revalidatePath('/admin/blocks');
  revalidatePath('/');
}

// A generic image placeholder for any future block type—not tied to a specific property, unlike `uploadPropertyImage`.
export async function uploadBlockImage(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requireAdmin();

  const file = formData.get('file');
  if (!(file instanceof File)) return { error: 'No file provided' };

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  const uploaded = await cloudinary.uploader.upload(dataUri, { folder: 'blocks' });
  return { url: uploaded.secure_url };
}