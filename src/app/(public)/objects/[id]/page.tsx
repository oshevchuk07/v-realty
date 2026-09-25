import { notFound } from 'next/navigation';
import { ImageOff } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { StatusBadge } from '@/components/ui/badge';
import { PriceTag } from '@/components/ui/price-tag';
import { getPropertyById } from '@/server/properties';
import { Metadata } from 'next';
import { LeadForm } from '@/components/property/lead-form';
import { getSiteSettings } from '@/server/site-settings';

const DEAL_LABEL = { RENT: 'Оренда', SALE: 'Продаж' } as const;
const TYPE_LABEL = {
  APARTMENT: 'Квартира',
  HOUSE: 'Будинок',
  COMMERCIAL: 'Комерція',
  LAND: 'Ділянка',
} as const;

const DEAL_LABEL_META = { RENT: 'Оренда', SALE: 'Продаж' } as const;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return { title: "Об'єкт не знайдено" };
  }

  const priceLabel = property.priceUsd ? `$${property.priceUsd.toLocaleString('en-US')}` : '';
  const title = `${DEAL_LABEL_META[property.dealType]}: ${property.address} — ${priceLabel}`;
  const description = property.description.slice(0, 155);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: property.images?.[0] ? [property.images[0].url] : [],
    },
  };
}

export type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);
  const settings = await getSiteSettings();

  if (!property) {
    notFound();
  }

  const characteristics = [
    { label: 'Тип угоди', value: DEAL_LABEL[property.dealType] },
    { label: 'Тип нерухомості', value: TYPE_LABEL[property.type] },
    { label: 'Площа', value: `${property.area} м²` },
    ...(property.rooms ? [{ label: 'Кімнати', value: String(property.rooms) }] : []),
    ...(property.floor ? [{ label: 'Поверх', value: `${property.floor} / ${property.totalFloors ?? '—'}` }] : []),
    ...(property.district ? [{ label: 'Район', value: property.district }] : []),
  ];

  return (
    <Container>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          {/* Placeholder gallery until Cloudinary upload pipeline is wired up */}
          <div className="flex aspect-video items-center justify-center rounded-lg border border-border bg-surface text-text-secondary">
            <ImageOff className="h-10 w-10" />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <StatusBadge status={property.status} />
            <span className="text-sm text-text-secondary">{DEAL_LABEL[property.dealType]}</span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold">{property.address}</h1>
          {property.district && <p className="text-text-secondary">{property.district}</p>}

          <div className="mt-4">
            <PriceTag usd={property.priceUsd} uah={property.priceUah} />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border p-4 sm:grid-cols-3">
            {characteristics.map((item) => (
              <div key={item.label}>
                <p className="text-sm text-text-secondary">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">Опис</h2>
            <p className="whitespace-pre-line text-text-secondary">{property.description}</p>
          </div>
        </div>

        {/* Contact block — sticky on desktop, stacks below content on mobile */}
        <aside className="h-fit rounded-lg border border-border bg-surface p-4 lg:sticky lg:top-6">
          <p className="font-medium">Зв&apos;язатись</p>
          <a href={`tel:${settings.contactPhone}`} className="mt-2 block text-accent">
            {settings.contactPhone}
          </a>
          <LeadForm propertyId={property.id} />
        </aside>
      </div>
    </Container>
  );
}
