import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/dashboard/admin`),
  title: 'Admin Dashboard | FileSure',
  description: 'Admin Dashboard',
  keywords: 'Admin Dashboard',
  applicationName: 'FileSure Dashboard',
  category: 'Business Intelligence Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Typically, dashboards are not indexed
    follow: false,
  },

  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard/admin`),
  },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
