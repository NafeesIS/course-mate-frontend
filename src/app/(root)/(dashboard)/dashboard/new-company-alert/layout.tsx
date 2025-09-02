import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/dashboard/new-company-alert`),
  title: 'Dashboard | New Company Alert',
  description:
    'Monitor newly registered companies and their directors in real-time. Access comprehensive analytics, state-wise breakdowns, and download daily company registration data for business intelligence and lead generation.',
  keywords: [
    'company alerts dashboard',
    'new company registrations',
    'company registration analytics',
    'director information tracking',
    'business intelligence dashboard',
    'company data monitoring',
    'real-time company alerts',
    'state-wise company data',
    'company registration trends',
    'business lead generation',
    'company filing alerts',
    'corporate intelligence',
  ],
  applicationName: 'FileSure',
  category: 'Business Intelligence Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Dashboard pages typically shouldn't be indexed
    follow: false,
  },
  openGraph: {
    title: 'Dashboard | New Company Alert',
    description:
      'Monitor newly registered companies and directors with real-time analytics and comprehensive data insights.',
    url: `${BASE_URL_FRONTEND}/dashboard/new-company-alert`,
    siteName: 'FileSure',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard/new-company-alert`),
  },
};

export default function NCADashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
