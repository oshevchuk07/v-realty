import Link from 'next/link';
import { BLOCK_REGISTRY, type BlockTypeKey } from '@/lib/blocks/registry';
import { HeroBannerForm } from '@/components/admin/hero-banner-form';
import { ItemGridForm } from '@/components/admin/item-grid-form';
import { HorizontalSliderForm } from '@/components/admin/horizontal-slider-form';
import { ImageTextForm } from '@/components/admin/image-text-form';

function BlockForm({ type }: { type: BlockTypeKey }) {
  switch (type) {
    case 'HERO_BANNER':
      return <HeroBannerForm />;
    case 'ITEM_GRID':
      return <ItemGridForm />;
    case 'HORIZONTAL_SLIDER':
      return <HorizontalSliderForm />;
    case 'IMAGE_TEXT':
      return <ImageTextForm />;
  }
}

export default async function NewBlockPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const selectedType = type && type in BLOCK_REGISTRY ? (type as BlockTypeKey) : null;

  if (!selectedType) {
    return (
      <div>
        <h1 className="mb-6 text-xl font-semibold">Оберіть тип блоку</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.keys(BLOCK_REGISTRY) as BlockTypeKey[]).map((key) => (
            <Link
              key={key}
              href={`/admin/blocks/new?type=${key}`}
              className="rounded border border-border bg-surface p-4 text-center hover:border-accent"
            >
              {BLOCK_REGISTRY[key].label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Новий блок: {BLOCK_REGISTRY[selectedType].label}</h1>
      <BlockForm type={selectedType} />
    </div>
  );
}