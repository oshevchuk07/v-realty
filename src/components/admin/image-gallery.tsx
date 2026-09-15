'use client';

import Image from 'next/image';
import type { PropertyImage } from '@/generated/prisma/client';
import { deletePropertyImage, setCoverImage } from '@/server/admin-images';

export function ImageGallery({ images, propertyId }: { images: PropertyImage[]; propertyId: string }) {
  if (images.length === 0) {
    return <p className="text-sm text-text-secondary">Фото ще не додано</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {images.map((image) => (
        <div key={image.id} className="group relative overflow-hidden rounded border border-border">
          <div className="relative aspect-square">
            <Image src={image.url} alt="" fill className="object-cover" />
          </div>
          {image.isCover && (
            <span className="absolute left-1 top-1 rounded bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">
              Обкладинка
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 flex justify-between bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100">
            {!image.isCover && (
              <button onClick={() => setCoverImage(image.id, propertyId)} className="text-xs text-text-secondary hover:text-text-primary">
                Зробити обкладинкою
              </button>
            )}
            <button onClick={() => deletePropertyImage(image.id, propertyId)} className="text-xs text-red-400 hover:underline">
              Видалити
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
