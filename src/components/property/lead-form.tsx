'use client';

import { useActionState } from 'react';
import { createLead, type LeadFormState } from '@/server/leads';

const initialState: LeadFormState = {};

export function LeadForm({ propertyId }: { propertyId?: string }) {
  const [state, formAction] = useActionState(createLead, initialState);

  if (state.success) {
    return <p className="text-sm text-status-active">Дякуємо! Ми зв&apos;яжемось з вами найближчим часом.</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      {propertyId && <input type="hidden" name="propertyId" value={propertyId} />}

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <input
        name="name"
        placeholder="Ваше ім'я"
        required
        className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Телефон"
        required
        className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <textarea
        name="message"
        placeholder="Коментар (необов'язково)"
        rows={2}
        className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />

      <button type="submit" className="w-full rounded bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
        Залишити заявку
      </button>
    </form>
  );
}
