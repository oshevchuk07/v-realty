import { prisma } from '@/lib/prisma';
import type { BlockData } from '@/lib/blocks/registry';
import { HorizontalSliderClient } from './horizontal-slider-client';

export async function HorizontalSlider({ data }: { data: BlockData<'HORIZONTAL_SLIDER'> }) {
  const properties = await prisma.property.findMany({
    where: {
      status: 'ACTIVE',
      ...(data.dealTypeFilter !== 'ALL' ? { dealType: data.dealTypeFilter } : {}),
    },
    include: { images: { where: { isCover: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: data.limit,
  });

  return <HorizontalSliderClient title={data.title} properties={properties} />;
}
