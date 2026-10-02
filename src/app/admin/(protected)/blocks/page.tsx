import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SortableBlockList } from '@/components/admin/sortable-block-list';

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
        <Link href="/admin/blocks/new" className="rounded bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
          + Додати блок
        </Link>
      </div>

      {blocks.length === 0 ? <p className="text-text-secondary">Блоків ще немає</p> : <SortableBlockList initialBlocks={blocks} />}
    </div>
  );
}
