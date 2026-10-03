'use client';

import { useTransition } from 'react';
import type { User, DealType } from '@/generated/prisma/client';
import { updateAdminNotifications, toggleAdminActive } from '@/server/admin-users';

const DEAL_TYPES: { value: DealType; label: string }[] = [
  { value: 'RENT', label: 'Оренда' },
  { value: 'SALE', label: 'Продаж' },
];

export function AdminNotificationRow({ admin }: { admin: User }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`rounded border border-border p-4 ${admin.isActive ? '' : 'opacity-50'}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium">{admin.email}</span>
        <button
          onClick={() => startTransition(() => toggleAdminActive(admin.id, !admin.isActive))}
          disabled={isPending}
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          {admin.isActive ? 'Деактивувати' : 'Активувати'}
        </button>
      </div>

      <form
        action={(formData) => startTransition(() => updateAdminNotifications(admin.id, formData))}
        className="flex flex-wrap items-end gap-4"
      >
        <label className="block">
          <span className="mb-1 block text-sm text-text-secondary">Telegram chat_id</span>
          <input
            name="telegramChatId"
            defaultValue={admin.telegramChatId ?? ''}
            placeholder="123456789"
            className="rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>

        <div>
          <span className="mb-1 block text-sm text-text-secondary">Отримувати заявки по</span>
          <div className="flex gap-3">
            {DEAL_TYPES.map((dt) => (
              <label key={dt.value} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" name="notifyDealTypes" value={dt.value} defaultChecked={admin.notifyDealTypes.includes(dt.value)} />
                {dt.label}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isPending} className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
          Зберегти
        </button>
      </form>
    </div>
  );
}
