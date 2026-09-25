'use client';

import { useState } from 'react';
import Image from 'next/image';
import { uploadSiteLogo } from '@/server/admin-site-settings';

export function LogoUploader({ currentLogoUrl }: { currentLogoUrl: string | null }) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    try {
      await uploadSiteLogo(formData);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {currentLogoUrl && <Image src={currentLogoUrl} alt="Логотип" width={48} height={48} className="rounded" />}
      <form action={handleSubmit} className="flex items-center gap-2">
        <input name="logo" type="file" accept="image/*" required disabled={isUploading} className="text-sm" />
        <button
          type="submit"
          disabled={isUploading}
          className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          {isUploading ? 'Завантаження...' : 'Завантажити'}
        </button>
      </form>
    </div>
  );
}
