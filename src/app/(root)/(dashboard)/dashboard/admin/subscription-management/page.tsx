import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import SubscribedUsers from './_components/SubscribedUsers';

export const metadata: Metadata = {
  metadataBase: new URL(
    `${BASE_URL_FRONTEND}/dashboard/admin/subscription-management`
  ),
  title: 'Subscription Management | Admin Dashboard | FileSure',
  description: 'Manage user subscriptions in the admin dashboard.',
  keywords: ['Subscription Management', 'Admin Dashboard', 'FileSure'],
  applicationName: 'FileSure Dashboard',
  category: 'Subscription Management Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Prevent indexing
    follow: false, // Prevent following links
  },
  alternates: {
    canonical: new URL(
      `${BASE_URL_FRONTEND}/dashboard/admin/subscription-management`
    ),
  },
};

export default function SubscriptionManagementPage() {
  return (
    <div className='pb-16'>
      <SubscribedUsers />
    </div>
  );
}
