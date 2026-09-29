import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BLOCK_REGISTRY } from '@/lib/blocks/registry';
import { DeleteBlockButton } from '@/components/admin/delete-block-button';

export default async function BlocksPage() {
  const blocks = await prisma.pageBlock.findMany({
    where: { page: 'home' },
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Блоки головної сторінки</h1>
        <Link href="/admin/blocks/new" className="rounded bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
          + Додати банер
        </Link>
      </div>

      <div className="space-y-2">
        {blocks.map((block) => (
          <div key={block.id} className="flex items-center justify-between rounded border border-border p-3">
            <span>{BLOCK_REGISTRY[block.type].label}</span>
            <div className="flex items-center gap-3">
              <Link href={`/admin/blocks/${block.id}/edit`} className="text-sm text-accent hover:underline">
                Редагувати
              </Link>
              <DeleteBlockButton id={block.id} />
            </div>
          </div>
        ))}
        {blocks.length === 0 && <p className="text-text-secondary">Блоків ще немає</p>}
      </div>
    </div>
  );
}
