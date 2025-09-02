import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(
    `${BASE_URL_FRONTEND}/dashboard/admin/unlock-companies`
  ),
  title: 'Unlocked Companies | Admin Dashboard | FileSure',
  description:
    'View and manage unlocked company records in the admin dashboard.',
  keywords: [
    'Unlocked Companies',
    'Company Records',
    'Admin Dashboard',
    'FileSure',
  ],
  applicationName: 'FileSure Dashboard',
  category: 'Company Records Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Typically, dashboards are not indexed
    follow: false,
  },

  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard/admin/unlock-companies`),
  },
};

export default function UnlockedCompaniesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
