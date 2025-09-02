import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart | New Company Alert | FileSure',
  description: 'Products in your cart',
  robots: {
    index: false,
    follow: false,
  },
};
export default function NCACartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
