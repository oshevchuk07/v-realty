import { PropertyStatus } from '@/generated/prisma/enums';

const STATUS_LABEL: Record<PropertyStatus, string> = {
  DRAFT: 'Чернетка',
  ACTIVE: 'В наявності',
  RESERVED: 'Заброньовано',
  SOLD: 'Продано',
  RENTED: 'Здано',
};

const STATUS_COLOR: Record<PropertyStatus, string> = {
  DRAFT: 'bg-border text-text-secondary',
  ACTIVE: 'bg-status-active text-background',
  RESERVED: 'bg-status-reserved text-background',
  SOLD: 'bg-status-sold text-background',
  RENTED: 'bg-status-sold text-background',
};

export type StatusBadgeProps = {
  status: PropertyStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-sm font-medium ${STATUS_COLOR[status]}`}>{STATUS_LABEL[status]}</span>
  );
}
