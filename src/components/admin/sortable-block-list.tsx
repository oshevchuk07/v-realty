'use client';

import { useOptimistic, useTransition } from 'react';
import Link from 'next/link';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { PageBlock } from '@/generated/prisma/client';
import { BLOCK_REGISTRY } from '@/lib/blocks/registry';
import { reorderBlocks, toggleBlockVisibility } from '@/server/admin-blocks';
import { DeleteBlockButton } from '@/components/admin/delete-block-button';

function SortableRow({ block, onToggle }: { block: PageBlock; onToggle: (id: string, next: boolean) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between rounded border border-border bg-surface p-3">
      <div className="flex items-center gap-3">
        {/* Drag handle — only this element triggers dragging, not the whole row,
            so links/buttons inside the row stay clickable */}
        <button {...attributes} {...listeners} className="cursor-grab text-text-secondary" aria-label="Перетягнути">
          <GripVertical className="h-4 w-4" />
        </button>
        <span className={block.isVisible ? '' : 'text-text-secondary line-through'}>{BLOCK_REGISTRY[block.type].label}</span>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => onToggle(block.id, !block.isVisible)} className="text-sm text-text-secondary hover:text-text-primary">
          {block.isVisible ? 'Сховати' : 'Показати'}
        </button>
        <Link href={`/admin/blocks/${block.id}/edit`} className="text-sm text-accent hover:underline">
          Редагувати
        </Link>
        <DeleteBlockButton id={block.id} />
      </div>
    </div>
  );
}

export function SortableBlockList({ initialBlocks }: { initialBlocks: PageBlock[] }) {
  const [isPending, startTransition] = useTransition();

  // Optimistic local order — the list reorders instantly on drop, while the
  // real persistence happens in the background via the Server Action
  const [blocks, setOptimisticBlocks] = useOptimistic(initialBlocks, (state, newOrder: PageBlock[]) => newOrder);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex);

    startTransition(async () => {
      setOptimisticBlocks(reordered);
      await reorderBlocks(reordered.map((b) => b.id));
    });
  }

  function handleToggle(id: string, next: boolean) {
    const updated = blocks.map((b) => (b.id === id ? { ...b, isVisible: next } : b));
    startTransition(async () => {
      setOptimisticBlocks(updated);
      await toggleBlockVisibility(id, next);
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className={`space-y-2 ${isPending ? 'opacity-70' : ''}`}>
          {blocks.map((block) => (
            <SortableRow key={block.id} block={block} onToggle={handleToggle} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
