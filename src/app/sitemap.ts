import type { MetadataRoute } from 'next';
import { getActiveProperties } from '@/server/properties';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getActiveProperties();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return [
    { url: baseUrl, lastModified: new Date() },
    ...properties.map((property) => ({
      url: `${baseUrl}/objects/${property.id}`,
      lastModified: property.updatedAt,
    })),
  ];
}