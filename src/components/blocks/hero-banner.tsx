import Image from 'next/image';
import Link from 'next/link';
import type { BlockData } from '@/lib/blocks/registry';

export function HeroBanner({ data }: { data: BlockData<'HERO_BANNER'> }) {
  return (
    <div className="relative flex min-h-[420px] items-end overflow-hidden rounded-lg">
      <Image src={data.imageUrl} alt={data.title} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      <div className="relative z-10 p-8">
        <h1 className="text-3xl font-semibold text-text-primary">{data.title}</h1>
        {data.subtitle && <p className="mt-2 text-text-secondary">{data.subtitle}</p>}
        {data.ctaText && data.ctaLink && (
          <Link href={data.ctaLink} className="mt-4 inline-block rounded bg-accent px-4 py-2 font-medium text-accent-foreground">
            {data.ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}
