import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { StatusBadge } from '@/components/ui/badge';
import { DeletePropertyButton } from '@/components/admin/delete-property-button';

export default async function AdminDashboardPage() {
  const properties = await prisma.property.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Об&apos;єкти</h1>
        <Link href="/admin/properties/new" className="rounded bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
          + Додати об&apos;єкт
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-text-secondary">
            <tr>
              <th className="p-3">Адреса</th>
              <th className="p-3">Статус</th>
              <th className="p-3">Ціна</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-border">
                <td className="p-3">{property.address}</td>
                <td className="p-3">
                  <StatusBadge status={property.status} />
                </td>
                <td className="p-3">{property.priceUsd ? `$${property.priceUsd.toLocaleString('en-US')}` : '—'}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/properties/${property.id}/edit`} className="mr-3 text-accent hover:underline">
                    Редагувати
                  </Link>
                  <DeletePropertyButton id={property.id} />
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-text-secondary">
                  Об&apos;єктів ще немає
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
