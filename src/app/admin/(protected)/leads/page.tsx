import { prisma } from '@/lib/prisma';

export default async function LeadsPage() {
  const leads = await prisma.leadRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: { property: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Заявки</h1>

      <div className="space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{lead.name}</p>
              <p className="text-sm text-text-secondary">{lead.createdAt.toLocaleString('uk-UA')}</p>
            </div>
            <a href={`tel:${lead.phone}`} className="text-accent">
              {lead.phone}
            </a>
            {lead.message && <p className="mt-1 text-sm text-text-secondary">{lead.message}</p>}
            {lead.property && <p className="mt-2 text-sm text-text-secondary">📍 {lead.property.address}</p>}
          </div>
        ))}
        {leads.length === 0 && <p className="text-text-secondary">Заявок ще немає</p>}
      </div>
    </div>
  );
}
