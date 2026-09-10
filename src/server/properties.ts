import type { DealType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getActiveProperties(dealType?: DealType) {
  return prisma.property.findMany({
    where: {
      status: 'ACTIVE',
      ...(dealType ? { dealType } : {})
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getPropertyById(id: string) {
  return prisma.property.findFirst({
    where: { id, status: 'ACTIVE' },
    include: {
      images: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  })
}