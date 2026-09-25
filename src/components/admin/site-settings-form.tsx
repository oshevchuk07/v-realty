'use client';

import { useActionState } from 'react';
import type { SiteSettings } from '@/generated/prisma/client';
import { updateSiteSettings, type SiteSettingsFormState } from '@/server/admin-site-settings';

const inputClass = 'w-full rounded border border-border bg-surface px-3 py-2 outline-none focus:border-accent';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-text-secondary">{label}</span>
      {children}
    </label>
  );
}

const initialState: SiteSettingsFormState = {};

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(updateSiteSettings, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-status-active">Збережено</p>}

      <Field label="Назва сайту">
        <input name="siteName" defaultValue={settings.siteName} required className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="SEO Title">
          <input name="seoTitle" defaultValue={settings.seoTitle ?? ''} className={inputClass} />
        </Field>
        <Field label="SEO Description">
          <input name="seoDescription" defaultValue={settings.seoDescription ?? ''} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Телефон">
          <input name="contactPhone" defaultValue={settings.contactPhone ?? ''} className={inputClass} />
        </Field>
        <Field label="Email">
          <input name="contactEmail" type="email" defaultValue={settings.contactEmail ?? ''} className={inputClass} />
        </Field>
      </div>

      <Field label="Адреса">
        <input name="contactAddress" defaultValue={settings.contactAddress ?? ''} className={inputClass} />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Facebook">
          <input name="socialFacebook" defaultValue={settings.socialFacebook ?? ''} className={inputClass} />
        </Field>
        <Field label="Instagram">
          <input name="socialInstagram" defaultValue={settings.socialInstagram ?? ''} className={inputClass} />
        </Field>
        <Field label="Telegram">
          <input name="socialTelegram" defaultValue={settings.socialTelegram ?? ''} className={inputClass} />
        </Field>
      </div>

      <button type="submit" className="rounded bg-accent px-4 py-2 font-medium text-accent-foreground">
        Зберегти
      </button>
    </form>
  );
}
