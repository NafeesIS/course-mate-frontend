import { getTotalCompanySitemaps } from './sitemapHelperFunctions';

export const revalidate = 86400; // cache for 1 day = 60 * 60 * 24

const getGeneralPageSitemapLinks = () => {
  // Generate sitemap links for general pages
  const generalPageLinks = `
      <sitemap>
        <loc>https://www.filesure.in/sitemap_general_pages.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://www.filesure.in/partners/sitemap.xml</loc>
      </sitemap>
    `;
  return generalPageLinks;
};

const getCompanySitemapLinks = async () => {
  const sitemapsNeeded = await getTotalCompanySitemaps();
  // Generate sitemap links based on total company count
  const sitemapLinks = Array.from({ length: sitemapsNeeded }, (_, i) => {
    const companyId = i;
    return `
          <sitemap>
            <loc>https://www.filesure.in/company/sitemap/${companyId}.xml</loc>
          </sitemap>
        `;
  }).join('');

  return sitemapLinks;
};

export async function GET() {
  const generalPageLinks = getGeneralPageSitemapLinks();
  const companySitemapLinks = await getCompanySitemapLinks();

  const sitemapIndexXml = `<?xml version='1.0' encoding='UTF-8'?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${generalPageLinks}
    ${companySitemapLinks}
  </sitemapindex>`;

  return new Response(sitemapIndexXml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
