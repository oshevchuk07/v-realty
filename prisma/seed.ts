import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();

  await prisma.property.createMany({
    data: [
      {
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
        description: 'Просторова квартира у центрі міста, після ремонту.',
      },
      {
        dealType: 'RENT',
        type: 'APARTMENT',
        status: 'ACTIVE',
        priceUsd: 350,
        area: 45,
        rooms: 1,
        floor: 2,
        totalFloors: 5,
        district: 'Північний',
        address: 'вул. Київська, 3',
        description: 'Однокімнатна квартира з меблями, поруч школа та магазини.',
      },
      {
        dealType: 'SALE',
        type: 'HOUSE',
        status: 'RESERVED',
        priceUsd: 120000,
        area: 140,
        district: 'Тинне',
        address: 'вул. Лесі Українки, 45',
        description: 'Будинок з ділянкою 6 соток, окреме опалення.',
      },
    ],
  });
}

main()
  .then(async () => {
    console.log('Seed completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });