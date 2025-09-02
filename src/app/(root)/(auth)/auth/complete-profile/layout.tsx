import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Profile | FileSure',
  description: 'Complete your profile',
  robots: {
    index: false,
    follow: false,
  },
};
export default function CompleteProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
