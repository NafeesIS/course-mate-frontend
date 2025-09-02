import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import CouponList from './_components/CouponList';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/dashboard/admin/coupon-list`),
  title: 'Coupon List | Admin Dashboard | FileSure',
  description: 'View and manage all active coupons in the admin dashboard.',
  keywords: ['Coupon List', 'Admin Dashboard', 'FileSure', 'Coupons'],
  applicationName: 'FileSure Dashboard',
  category: 'Coupon Management',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Prevent indexing
    follow: false, // Prevent following links
  },
  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard/admin/coupon-list`),
  },
};

const CouponListPage = () => {
  return <CouponList />;
};

export default CouponListPage;
