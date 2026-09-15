import type { DealType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export async function getActiveProperties(dealType?: DealType) {
  return prisma.property.findMany({
    where: {
      status: 'ACTIVE',
      ...(dealType ? { dealType } : {})
    },
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        where: {
          isCover: true
        },
        take: 1
      }
    }
  })
}

export const getPropertyById = cache(async (id: string) => {
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
})