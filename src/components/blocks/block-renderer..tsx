import type { PageBlock } from '@/generated/prisma/client';
import { parseBlockData } from '@/lib/blocks/parse';
import { HeroBanner } from './hero-banner';
import { ItemGrid } from './item-grid';
import { ImageText } from './image-text';
import { HorizontalSlider } from './horizontal-slider';

export function BlockRenderer({ block }: { block: PageBlock }) {
  switch (block.type) {
    case 'HERO_BANNER':
      return <HeroBanner data={parseBlockData('HERO_BANNER', block.data)} />;
    case 'ITEM_GRID':
      return <ItemGrid data={parseBlockData('ITEM_GRID', block.data)} />;
    case 'HORIZONTAL_SLIDER':
      return <HorizontalSlider data={parseBlockData('HORIZONTAL_SLIDER', block.data)} />;
    case 'IMAGE_TEXT':
      return <ImageText data={parseBlockData('IMAGE_TEXT', block.data)} />;
    default:
      return null;
  }
}
