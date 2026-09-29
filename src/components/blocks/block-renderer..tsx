import type { PageBlock } from '@/generated/prisma/client';
import { parseBlockData } from '@/lib/blocks/parse';
import { HeroBanner } from './hero-banner';

export function BlockRenderer({ block }: { block: PageBlock }) {
  switch (block.type) {
    case 'HERO_BANNER':
      return <HeroBanner data={parseBlockData('HERO_BANNER', block.data)} />;
    default:
      // Решта типів підключаються на кроці 6 — поки що просто нічого не рендеримо
      return null;
  }
}
