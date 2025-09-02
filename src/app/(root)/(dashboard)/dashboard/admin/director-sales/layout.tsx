import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/dashboard/admin/director-sales`),
  title: 'Director Sales | Admin Dashboard | FileSure',
  description: 'Manage orders in the admin dashboard.',
  keywords: ['Director Sales', 'Admin Dashboard', 'FileSure'],
  applicationName: 'FileSure Dashboard',
  category: 'Director Sales Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Typically, dashboards are not indexed
    follow: false,
  },

  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard/admin/director-sales`),
  },
};

export default function DirectorSalesDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
