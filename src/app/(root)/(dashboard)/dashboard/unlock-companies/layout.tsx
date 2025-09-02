import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/dashboard/director-contacts`),
  title: 'Dashboard | Unlock Company',
  description: 'Search and unlock company details using your credits.',
  keywords: [
    'company financial data',
    'public documents',
    'company details',
    'company information',
  ],
  applicationName: 'FileSure',
  category: 'Business Intelligence Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Typically, dashboards are not indexed
    follow: false,
  },

  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard/director-contacts`),
  },
};

export default function UnlockCompanyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
