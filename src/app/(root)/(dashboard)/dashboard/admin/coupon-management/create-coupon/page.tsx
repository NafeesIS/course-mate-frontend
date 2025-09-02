import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import CreateCoupon from './_components/CreateCoupon';

export const metadata: Metadata = {
  metadataBase: new URL(
    `${BASE_URL_FRONTEND}/dashboard/admin/coupon-management/create-coupon`
  ),
  title: 'Create Coupon | Admin Dashboard | FileSure',
  description: 'Easily create a new coupon in the admin dashboard.',
  keywords: ['Create Coupon', 'Admin Dashboard', 'FileSure'],
  applicationName: 'FileSure Dashboard',
  category: 'Coupon Creation Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Prevent indexing
    follow: false, // Prevent following links
  },
  alternates: {
    canonical: new URL(
      `${BASE_URL_FRONTEND}/dashboard/admin/coupon-management/create-coupon`
    ),
  },
};

const CreateCouponPage = () => {
  return <CreateCoupon />;
};

export default CreateCouponPage;
