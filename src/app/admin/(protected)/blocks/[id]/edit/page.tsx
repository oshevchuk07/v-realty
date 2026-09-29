import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { parseBlockData } from '@/lib/blocks/parse';
import { HeroBannerForm } from '@/components/admin/hero-banner-form';

export default async function EditBlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const block = await prisma.pageBlock.findUnique({ where: { id } });
  if (!block) notFound();

  if (block.type === 'HERO_BANNER') {
    const data = parseBlockData('HERO_BANNER', block.data);
    return (
      <div>
        <h1 className="mb-6 text-xl font-semibold">Редагування банера</h1>
        <HeroBannerForm blockId={block.id} initialData={data} />
      </div>
    );
  }

  // Інші типи отримають власну форму на кроці 6
  return <p className="text-text-secondary">Редагування цього типу блоку ще не реалізовано.</p>;
}
