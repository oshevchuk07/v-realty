import { DealType, PropertyStatus, PropertyType } from '@/types/property';

export type MockProperty = {
  id: string;
  dealType: DealType;
  type: PropertyType;
  status: PropertyStatus;
  priceUsd: number | null;
  priceUah: number | null;
  area: number;
  rooms: number | null;
  floor: number | null;
  totalFloors: number | null;
  district: string | null;
  address: string;
};

// Placeholder data until Prisma queries replace this file
export const mockProperties: MockProperty[] = [
  {
    id: '1',
    dealType: 'SALE',
    type: 'APARTMENT',
    status: 'ACTIVE',
    priceUsd: 68000,
    priceUah: 2856000,
    area: 62,
    rooms: 2,
    floor: 4,
    totalFloors: 9,
    district: 'Центр',
    address: 'вул. Соборна, 12',
  },
  {
    id: '2',
    dealType: 'RENT',
    type: 'APARTMENT',
    status: 'ACTIVE',
    priceUsd: 350,
    priceUah: null,
    area: 45,
    rooms: 1,
    floor: 2,
    totalFloors: 5,
    district: 'North',
    address: 'вул. Київська, 3',
  },
  {
    id: '3',
    dealType: 'SALE',
    type: 'HOUSE',
    status: 'RESERVED',
    priceUsd: 120000,
    priceUah: null,
    area: 140,
    rooms: 4,
    floor: null,
    totalFloors: null,
    district: 'Тинне',
    address: 'вул. Лесі Українки, 45',
  },
];