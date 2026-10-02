'use client';

import { useActionState } from 'react';
import { createBlock, updateBlock, type BlockFormState } from '@/server/admin-blocks';
import type { BlockData } from '@/lib/blocks/registry';

const inputClass = 'w-full rounded border border-border bg-surface px-3 py-2 outline-none focus:border-accent';
const initialState: BlockFormState = {};

export function ItemGridForm({ blockId, initialData }: { blockId?: string; initialData?: BlockData<'ITEM_GRID'> }) {
  const action = blockId ? updateBlock.bind(null, blockId, 'ITEM_GRID') : createBlock.bind(null, 'ITEM_GRID');
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <label className="block">
        <span className="mb-1 block text-sm text-text-secondary">Заголовок (необов&apos;язково)</span>
        <input name="title" defaultValue={initialData?.title ?? ''} className={inputClass} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm text-text-secondary">Фільтр</span>
          <select name="dealTypeFilter" defaultValue={initialData?.dealTypeFilter ?? 'ALL'} className={inputClass}>
            <option value="ALL">Всі</option>
            <option value="RENT">Оренда</option>
            <option value="SALE">Продаж</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-text-secondary">Кількість (4–10)</span>
          <input name="limit" type="number" min={4} max={10} defaultValue={initialData?.limit ?? 6} className={inputClass} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm text-text-secondary">Посилання &quot;Дивитись всі&quot;</span>
        <input name="seeAllLink" defaultValue={initialData?.seeAllLink ?? '/'} className={inputClass} />
      </label>

      <button type="submit" className="rounded bg-accent px-4 py-2 font-medium text-accent-foreground">
        Зберегти
      </button>
    </form>
  );
}
