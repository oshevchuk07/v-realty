'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PropertyCard } from '@/components/property/property-card';
import type { Prisma } from '@/generated/prisma/client';

type PropertyWithCover = Prisma.PropertyGetPayload<{ include: { images: true } }>;

export function HorizontalSliderClient({ title, properties }: { title?: string; properties: PropertyWithCover[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true });

  if (properties.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        <div className="flex gap-2">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="rounded border border-border p-1.5 hover:border-accent"
            aria-label="Назад"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="rounded border border-border p-1.5 hover:border-accent"
            aria-label="Вперед"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {properties.map((property) => (
            <div key={property.id} className="min-w-[280px] flex-[0_0_280px]">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
