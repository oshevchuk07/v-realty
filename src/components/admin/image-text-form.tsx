'use client';

import { useActionState, useRef, useState } from 'react';
import Image from 'next/image';
import { createBlock, updateBlock, uploadBlockImage, type BlockFormState } from '@/server/admin-blocks';
import type { BlockData } from '@/lib/blocks/registry';

const inputClass = 'w-full rounded border border-border bg-surface px-3 py-2 outline-none focus:border-accent';
const initialState: BlockFormState = {};

export function ImageTextForm({ blockId, initialData }: { blockId?: string; initialData?: BlockData<'IMAGE_TEXT'> }) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const action = blockId ? updateBlock.bind(null, blockId, 'IMAGE_TEXT') : createBlock.bind(null, 'IMAGE_TEXT');
  const [state, formAction] = useActionState(action, initialState);

  async function handleFileChange() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.set('file', file);
      const result = await uploadBlockImage(fd);
      if ('url' in result) setImageUrl(result.url);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <div>
        <span className="mb-1 block text-sm text-text-secondary">Зображення</span>
        {imageUrl && (
          <div className="relative mb-2 aspect-video overflow-hidden rounded border border-border">
            <Image src={imageUrl} alt="" fill className="object-cover" />
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" disabled={isUploading} onChange={handleFileChange} className="text-sm" />
        {isUploading && <p className="mt-1 text-sm text-text-secondary">Завантаження...</p>}
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      <label className="block">
        <span className="mb-1 block text-sm text-text-secondary">Розташування зображення</span>
        <select name="imagePosition" defaultValue={initialData?.imagePosition ?? 'left'} className={inputClass}>
          <option value="left">Зліва</option>
          <option value="right">Справа</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-text-secondary">Заголовок</span>
        <input name="title" defaultValue={initialData?.title ?? ''} required className={inputClass} />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-text-secondary">Текст</span>
        <textarea name="text" rows={4} defaultValue={initialData?.text ?? ''} required className={inputClass} />
      </label>

      <button type="submit" className="rounded bg-accent px-4 py-2 font-medium text-accent-foreground">
        Зберегти
      </button>
    </form>
  );
}
