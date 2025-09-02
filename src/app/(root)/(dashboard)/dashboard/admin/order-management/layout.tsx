import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(
    `${BASE_URL_FRONTEND}/dashboard/admin/order-management`
  ),
  title: 'Order Management | Admin Dashboard | FileSure',
  description: 'Manage orders in the admin dashboard.',
  keywords: ['Order Management', 'Admin Dashboard', 'FileSure'],
  applicationName: 'FileSure Dashboard',
  category: 'Order Management Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Typically, dashboards are not indexed
    follow: false,
  },

  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard/admin/order-management`),
  },
};

export default function OrderManagementDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
