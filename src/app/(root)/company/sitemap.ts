import { BASE_URL_FRONTEND } from '@/constants';
import { formatToUrl } from '@/lib/formatters';
import {
  getCompanySitemaps,
  getTotalCompanyCount,
} from '@/services/sitemapHelperFunction';
import { MetadataRoute } from 'next';

export const revalidate = 86400; // cache for 1 day = 60 * 60 * 24

export async function generateSitemaps() {
  // IF IN DEVELOPMENT MODE, RETURN A SINGLE SITEMAP
  if (
    process.env.NEXT_PUBLIC_SITEMAP_ENV === 'staging' ||
    process.env.NEXT_PUBLIC_SITEMAP_ENV === 'development'
  ) {
    return [{ id: 0 }];
  }

  const count = await getTotalCompanyCount();
  const sitemapsNeeded = Math.ceil(count / 3000);
  const sitemaps = [];

  for (let i = 0; i < sitemapsNeeded; i++) {
    sitemaps.push({ id: i });
  }

  return sitemaps;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 3000;
  const end = start + 3000;

  const companies = await getCompanySitemaps(start, end);

  // Use flatMap to return a flattened array of sitemap URLs
  const sitemapUrls = companies.flatMap((company: any) => {
    const companyUrl = `${BASE_URL_FRONTEND}/company/${formatToUrl(
      company.company
    )}/${company.cin}`;

    const urls = [
      {
        url: `${companyUrl}?tab=about`,
        lastModified: new Date().toISOString(),
        priority: 1,
        changeFrequency: 'weekly',
      },
      {
        url: `${companyUrl}?tab=directors`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
        changeFrequency: 'weekly',
      },
      {
        url: `${companyUrl}?tab=charges`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
        changeFrequency: 'weekly',
      },
      {
        url: `${companyUrl}?tab=compliance`,
        lastModified: new Date().toISOString(),
        priority: 0.8,
        changeFrequency: 'weekly',
      },
    ];

    return urls;
  });

  return sitemapUrls;
}
