import Image from 'next/image';
import type { BlockData } from '@/lib/blocks/registry';

export function ImageText({ data }: { data: BlockData<'IMAGE_TEXT'> }) {
  return (
    <div className={`flex flex-col gap-6 sm:flex-row ${data.imagePosition === 'right' ? 'sm:flex-row-reverse' : ''}`}>
      <div className="relative aspect-video flex-1 overflow-hidden rounded-lg sm:aspect-square">
        <Image src={data.imageUrl} alt={data.title} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <h2 className="text-xl font-semibold">{data.title}</h2>
        <p className="mt-2 whitespace-pre-line text-text-secondary">{data.text}</p>
      </div>
    </div>
  );
}
