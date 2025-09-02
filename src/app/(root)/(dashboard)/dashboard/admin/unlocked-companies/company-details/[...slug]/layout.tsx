import { BASE_URL_FRONTEND } from '@/constants';
import { toCamelCase } from '@/lib/formatters';
import { Metadata } from 'next';

type Props = {
  params: {
    slug: string[];
  };
};

export async function generateMetadata({
  params,
  // searchParams,
}: Props): Promise<Metadata> {
  const [name, cinNo] = params.slug;
  const company =
    name.length > 0 ? toCamelCase(name.split('-').join(' ')) : '-';
  const url = new URL(
    `${BASE_URL_FRONTEND}/dashboard/unlock-companies/company-details/${company}/${cinNo}`
  );

  return {
    metadataBase: url,
    title: `${company} | Unlock Company - FileSure Dashboard`,
    description: `View ${company}'s company details using your credits. Unlock company financial data, public documents, company details, and company information. Get started today!`,
    applicationName: 'FileSure',
    category: 'Business Intelligence Dashboard',
    authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
    creator: 'FileSure',
    publisher: 'FileSure',
    robots: {
      index: false, // Typically, dashboards are not indexed
      follow: false,
    },
  };
}

export default function UnlockedCompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
