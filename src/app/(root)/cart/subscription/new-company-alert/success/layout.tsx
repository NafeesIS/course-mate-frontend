import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success | New Company Alert | FileSure',
  description: 'Order confirmation',
  robots: {
    index: false,
    follow: false,
  },
};
export default function NCASuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
