import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coupon Management | Admin Dashboard | FileSure',
  description: 'Manage coupons in the admin dashboard.',
  robots: {
    index: false,
    follow: false,
  },
};
export default function CouponManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
