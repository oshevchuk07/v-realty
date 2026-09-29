'use client';

import { deleteBlock } from '@/server/admin-blocks';

export function DeleteBlockButton({ id }: { id: string }) {
  return (
    <button onClick={() => confirm('Видалити цей блок?') && deleteBlock(id)} className="text-sm text-red-400 hover:underline">
      Видалити
    </button>
  );
}
