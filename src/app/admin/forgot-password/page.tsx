'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { requestPasswordReset, type ForgotPasswordState } from '@/server/auth-reset';

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-surface p-6">
        <h1 className="text-lg font-semibold">Відновлення пароля</h1>

        {state.success ? (
          <p className="text-sm text-status-active">Якщо такий email зареєстровано, лист з посиланням вже надіслано.</p>
        ) : (
          <form action={formAction} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full rounded border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
            <button type="submit" className="w-full rounded bg-accent px-3 py-2 font-medium text-accent-foreground">
              Надіслати посилання
            </button>
          </form>
        )}

        <Link href="/admin/login" className="block text-sm text-text-secondary hover:text-text-primary">
          ← Назад до входу
        </Link>
      </div>
    </div>
  );
}
