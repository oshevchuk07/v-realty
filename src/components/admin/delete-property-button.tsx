'use client';

import { deleteProperty } from '@/server/admin-properties';

export function DeletePropertyButton({ id }: { id: string }) {
  return (
    <button
      onClick={() => {
        if (confirm("Видалити цей об'єкт? Дію не можна скасувати.")) {
          deleteProperty(id);
        }
      }}
      className="text-red-400 hover:underline"
    >
      Видалити
    </button>
  );
}
