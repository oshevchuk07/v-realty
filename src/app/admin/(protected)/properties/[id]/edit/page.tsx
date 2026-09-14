import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PropertyForm } from '@/components/admin/property-form';
import { updateProperty } from '@/server/admin-properties';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Редагування об&apos;єкта</h1>
      <PropertyForm property={property} action={updateProperty.bind(null, id)} />
    </div>
  );
}
