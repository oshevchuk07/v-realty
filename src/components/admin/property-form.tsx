'use client';

import type { Property } from '@/generated/prisma/client';
import { PropertyFormState } from '@/server/admin-properties';
import { useActionState } from 'react';

const DEAL_OPTIONS = [
  { value: 'SALE', label: 'Продаж' },
  { value: 'RENT', label: 'Оренда' },
];
const TYPE_OPTIONS = [
  { value: 'APARTMENT', label: 'Квартира' },
  { value: 'HOUSE', label: 'Будинок' },
  { value: 'COMMERCIAL', label: 'Комерція' },
  { value: 'LAND', label: 'Ділянка' },
];
const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Чернетка' },
  { value: 'ACTIVE', label: 'В наявності' },
  { value: 'RESERVED', label: 'Заброньовано' },
  { value: 'SOLD', label: 'Продано' },
  { value: 'RENTED', label: 'Здано' },
];

const inputClass = 'w-full rounded border border-border bg-surface px-3 py-2 outline-none focus:border-accent';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-text-secondary">{label}</span>
      {children}
    </label>
  );
}

export function PropertyForm({
  property,
  action,
}: {
  property?: Property;
  action: (state: PropertyFormState, formData: FormData) => Promise<PropertyFormState>;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {state.error && <p className="rounded border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-400">{state.error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Тип угоди">
          <select name="dealType" defaultValue={property?.dealType ?? 'SALE'} className={inputClass}>
            {DEAL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Тип нерухомості">
          <select name="type" defaultValue={property?.type ?? 'APARTMENT'} className={inputClass}>
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Статус">
        <select name="status" defaultValue={property?.status ?? 'DRAFT'} className={inputClass}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ціна, $">
          <input name="priceUsd" type="number" defaultValue={property?.priceUsd ?? ''} className={inputClass} />
        </Field>
        <Field label="Ціна, ₴">
          <input name="priceUah" type="number" defaultValue={property?.priceUah ?? ''} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Площа, м²">
          <input name="area" type="number" step="0.1" required defaultValue={property?.area ?? ''} className={inputClass} />
        </Field>
        <Field label="Кімнати">
          <input name="rooms" type="number" defaultValue={property?.rooms ?? ''} className={inputClass} />
        </Field>
        <Field label="Поверх / всього">
          <div className="flex gap-2">
            <input name="floor" type="number" placeholder="Поверх" defaultValue={property?.floor ?? ''} className={inputClass} />
            <input
              name="totalFloors"
              type="number"
              placeholder="Всього"
              defaultValue={property?.totalFloors ?? ''}
              className={inputClass}
            />
          </div>
        </Field>
      </div>

      <Field label="Район">
        <input name="district" defaultValue={property?.district ?? ''} className={inputClass} />
      </Field>

      <Field label="Адреса">
        <input name="address" required defaultValue={property?.address ?? ''} className={inputClass} />
      </Field>

      <Field label="Опис">
        <textarea name="description" required rows={5} defaultValue={property?.description ?? ''} className={inputClass} />
      </Field>

      <button type="submit" className="rounded bg-accent px-4 py-2 font-medium text-accent-foreground">
        {property ? 'Зберегти зміни' : "Додати об'єкт"}
      </button>
    </form>
  );
}
