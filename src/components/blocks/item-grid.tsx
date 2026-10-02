import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PropertyCard } from '@/components/property/property-card';
import type { BlockData } from '@/lib/blocks/registry';

export async function ItemGrid({ data }: { data: BlockData<'ITEM_GRID'> }) {
  const properties = await prisma.property.findMany({
    where: {
      status: 'ACTIVE',
      ...(data.dealTypeFilter !== 'ALL' ? { dealType: data.dealTypeFilter } : {}),
    },
    include: { images: { where: { isCover: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: data.limit,
  });

  if (properties.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {data.title && <h2 className="text-xl font-semibold">{data.title}</h2>}
        <Link href={data.seeAllLink} className="text-sm text-accent hover:underline">
          Дивитись всі →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
