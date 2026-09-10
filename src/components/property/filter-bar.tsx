import Link from 'next/link';
import { DealType } from '@/types/property';

const OPTIONS: { label: string; value: DealType | 'ALL' }[] = [
  { label: 'Всі', value: 'ALL' },
  { label: 'Оренда', value: 'RENT' },
  { label: 'Продаж', value: 'SALE' },
];

export function FilterBar({ active }: { active: DealType | 'ALL' }) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => (
        <Link
          key={option.value}
          href={option.value === 'ALL' ? '/' : `/?deal=${option.value}`}
          className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
            active === option.value ? 'bg-accent text-accent-foreground' : 'bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
