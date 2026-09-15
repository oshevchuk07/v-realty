'use client';

import { useRef, useState } from 'react';
import { uploadPropertyImage } from '@/server/admin-images';

export function ImageUploader({ propertyId }: { propertyId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    try {
      await uploadPropertyImage(propertyId, formData);
      formRef.current?.reset();
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex items-center gap-3">
      <input name="file" type="file" accept="image/*" required disabled={isUploading} className="text-sm" />
      <button
        type="submit"
        disabled={isUploading}
        className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
      >
        {isUploading ? 'Завантаження...' : 'Додати фото'}
      </button>
    </form>
  );
}
