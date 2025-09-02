import { getPartnersData } from '@/app/(root)/partners/_services/getPartnersData';
import { BASE_URL_FRONTEND } from '@/constants';
import { formatToUrl } from '@/lib/formatters';
import { MetadataRoute } from 'next';

export const revalidate = 86400; // cache for 1 day = 60 * 60 * 24

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const partnersData = await getPartnersData();
  const sitemaps = partnersData?.data.map((partner: any) => {
    return {
      url: `${BASE_URL_FRONTEND}/partners/${formatToUrl(partner.name)}/${partner.partnerId}`,
      lastModified: new Date().toISOString(),
      priority: 1,
      changeFrequency: 'weekly',
    };
  });

  return sitemaps;
}
