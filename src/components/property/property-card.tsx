import Link from 'next/link';
import { ImageOff, BedDouble, Ruler, Building2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/badge';
import { PriceTag } from '@/components/ui/price-tag';
import { Property } from '@/generated/prisma/client';

const DEAL_LABEL = { RENT: 'Оренда', SALE: 'Продаж' } as const;

export type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      href={`/objects/${property.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-accent"
    >
      {/* Placeholder until Cloudinary image pipeline is wired up */}
      <div className="flex aspect-[4/3] items-center justify-center bg-background text-text-secondary">
        <ImageOff className="h-8 w-8" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <StatusBadge status={property.status} />
          <span className="text-sm text-text-secondary">{DEAL_LABEL[property.dealType]}</span>
        </div>

        <PriceTag usd={property.priceUsd} uah={property.priceUah} />

        <div>
          <p className="font-medium">{property.address}</p>
          {property.district && <p className="text-sm text-text-secondary">{property.district}</p>}
        </div>

        <div className="flex gap-4 border-t border-border pt-3 text-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <Ruler className="h-4 w-4" /> {property.area} м²
          </span>
          {property.rooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" /> {property.rooms}
            </span>
          )}
          {property.floor && (
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" /> {property.floor}/{property.totalFloors}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
