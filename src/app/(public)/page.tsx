import { Container } from '@/components/ui/container';
import { FilterBar } from '@/components/property/filter-bar';
import { PropertyCard } from '@/components/property/property-card';
import { mockProperties } from '@/lib/mock-properties';
import { DealType } from '@/types/property';

type SearchParams = { deal?: string };

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { deal } = await searchParams;
  const dealFilter = deal === 'RENT' || deal === 'SALE' ? (deal as DealType) : 'ALL';

  const properties =
    dealFilter === 'ALL'
      ? mockProperties
      : mockProperties.filter((p) => p.dealType === dealFilter);

  return (
    <Container>
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