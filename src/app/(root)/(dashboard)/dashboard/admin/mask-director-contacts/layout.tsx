import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(
    `${BASE_URL_FRONTEND}/dashboard/admin/mask-director-contacts`
  ),
  title: 'Mask Director Contacts | Admin Dashboard | FileSure',
  description:
    'Manage director contact information visibility in the admin dashboard.',
  keywords: [
    'Director Contacts',
    'Contact Management',
    'Admin Dashboard',
    'FileSure',
  ],
  applicationName: 'FileSure Dashboard',
  category: 'Contact Management Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Typically, dashboards are not indexed
    follow: false,
  },

  alternates: {
    canonical: new URL(
      `${BASE_URL_FRONTEND}/dashboard/admin/mask-director-contacts`
    ),
  },
};

export default function MaskDirectorContactsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
