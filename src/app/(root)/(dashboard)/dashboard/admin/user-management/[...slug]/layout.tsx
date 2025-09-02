import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/dashboard/admin/user-management`),
  title: 'User Details | Admin Dashboard | FileSure',
  description:
    'Manage users and access to single user details in the admin dashboard.',
  keywords: ['User Management', 'User Details', 'Admin Dashboard', 'FileSure'],
  applicationName: 'FileSure Dashboard',
  category: 'Single User Details Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Typically, dashboards are not indexed
    follow: false,
  },

  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard/admin/user-management`),
  },
};

export default function SingleUserDetailsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
