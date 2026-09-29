import { Container } from '@/components/ui/container';
import { FilterBar } from '@/components/property/filter-bar';
import { PropertyCard } from '@/components/property/property-card';
import { DealType } from '@/types/property';
import { getActiveProperties } from '@/server/properties';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { BlockRenderer } from '@/components/blocks/block-renderer.';

type SearchParams = { deal?: string };

export const metadata: Metadata = {
  title: "Об'єкти нерухомості — оренда та продаж",
  description: 'Актуальні квартири, будинки та комерційна нерухомість в оренду й на продаж.',
};

export type CatalogPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const blocks = await prisma.pageBlock.findMany({
    where: { page: 'home', isVisible: true },
    orderBy: { order: 'asc' },
  });

  const { deal } = await searchParams;
  const dealFilter = deal === 'RENT' || deal === 'SALE' ? (deal as DealType) : 'ALL';

  const properties = await getActiveProperties(dealFilter === 'ALL' ? undefined : dealFilter);

  return (
    <Container>
      <div className="mb-8 space-y-6">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>

      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-semibold">Об'єкти</h1>
        <FilterBar active={dealFilter} />
      </div>

      {properties.length === 0 ? (
        <p className="text-text-secondary">Об'єктів за цим фільтром поки немає.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </Container>
  );
}
