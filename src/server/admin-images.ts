'use server';

import { revalidatePath } from 'next/cache';
import { cloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from './require-admin';

export async function uploadPropertyImage(propertyId: string, formData: FormData) {
  await requireAdmin();

  const file = formData.get('file');
  if (!(file instanceof File)) throw new Error('No file provided');

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: `properties/${propertyId}`,
      transformation: [
        { overlay: 'mask', gravity: 'south_east', x: 20, y: 20, width: 512, opacity: 90 },
      ],
    });

    const imageCount = await prisma.propertyImage.count({ where: { propertyId } });

    await prisma.propertyImage.create({
      data: {
        propertyId,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        isCover: imageCount === 0,
        order: imageCount,
      },
    });

    revalidatePath(`/admin/properties/${propertyId}/edit`);
  } catch (err) {
    console.error('DEBUG Cloudinary error:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function deletePropertyImage(imageId: string, propertyId: string) {
  await requireAdmin();

  const image = await prisma.propertyImage.findUniqueOrThrow({ where: { id: imageId } });
  await cloudinary.uploader.destroy(image.publicId);
  await prisma.propertyImage.delete({ where: { id: imageId } });

  revalidatePath(`/admin/properties/${propertyId}/edit`);
}

export async function setCoverImage(imageId: string, propertyId: string) {
  await requireAdmin();

  await prisma.$transaction([
    prisma.propertyImage.updateMany({ where: { propertyId }, data: { isCover: false } }),
    prisma.propertyImage.update({ where: { id: imageId }, data: { isCover: true } }),
  ]);

  revalidatePath(`/admin/properties/${propertyId}/edit`);
}