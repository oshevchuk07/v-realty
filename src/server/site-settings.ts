import { cache } from 'react';
import { prisma } from '@/lib/prisma';

// Falls back to sensible defaults if the row somehow doesn't exist yet —
// keeps every consumer from needing its own null-check
export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    settings ?? {
      id: 1,
      siteName: 'Нерухомість',
      seoTitle: null,
      seoDescription: null,
      contactPhone: null,
      contactEmail: null,
      contactAddress: null,
      socialFacebook: null,
      socialInstagram: null,
      socialTelegram: null,
      updatedAt: new Date(),
    }
  );
});