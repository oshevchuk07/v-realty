'use client';

import { useActionState } from 'react';
import { createAdmin, type AdminFormState } from '@/server/admin-users';

const initialState: AdminFormState = {};

export function CreateAdminForm() {
  const [state, formAction] = useActionState(createAdmin, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-3">
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="rounded border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
      />
      <input
        name="password"
        type="password"
        placeholder="Пароль (мін. 8 символів)"
        required
        minLength={8}
        className="rounded border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
      />
      <button type="submit" className="rounded bg-accent px-3 py-2 font-medium text-accent-foreground">
        Додати
      </button>
    </form>
  );
}
