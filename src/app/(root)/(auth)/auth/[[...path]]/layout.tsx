import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | FileSure',
  description: 'Login to your account',
  robots: {
    index: false,
    follow: false,
  },
};
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
