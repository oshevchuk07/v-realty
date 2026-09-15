import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PropertyForm } from '@/components/admin/property-form';
import { updateProperty } from '@/server/admin-properties';
import { ImageUploader } from '@/components/admin/image-uploader';
import { ImageGallery } from '@/components/admin/image-gallery';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  if (!property) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-6 text-xl font-semibold">Редагування об&apos;єкта</h1>
        <PropertyForm property={property} action={updateProperty.bind(null, id)} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Фото</h2>
        <ImageUploader propertyId={id} />
        <div className="mt-4">
          <ImageGallery images={property.images} propertyId={id} />
        </div>
      </div>
    </div>
  );
}