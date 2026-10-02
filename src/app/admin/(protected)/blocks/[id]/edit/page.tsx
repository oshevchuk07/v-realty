import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { parseBlockData } from '@/lib/blocks/parse';
import { BLOCK_REGISTRY } from '@/lib/blocks/registry';
import { HeroBannerForm } from '@/components/admin/hero-banner-form';
import { ItemGridForm } from '@/components/admin/item-grid-form';
import { HorizontalSliderForm } from '@/components/admin/horizontal-slider-form';
import { ImageTextForm } from '@/components/admin/image-text-form';

export default async function EditBlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const block = await prisma.pageBlock.findUnique({ where: { id } });
  if (!block) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Редагування: {BLOCK_REGISTRY[block.type].label}</h1>

      {block.type === 'HERO_BANNER' && (
        <HeroBannerForm blockId={block.id} initialData={parseBlockData('HERO_BANNER', block.data)} />
      )}
      {block.type === 'ITEM_GRID' && (
        <ItemGridForm blockId={block.id} initialData={parseBlockData('ITEM_GRID', block.data)} />
      )}
      {block.type === 'HORIZONTAL_SLIDER' && (
        <HorizontalSliderForm blockId={block.id} initialData={parseBlockData('HORIZONTAL_SLIDER', block.data)} />
      )}
      {block.type === 'IMAGE_TEXT' && (
        <ImageTextForm blockId={block.id} initialData={parseBlockData('IMAGE_TEXT', block.data)} />
      )}
    </div>
  );
}