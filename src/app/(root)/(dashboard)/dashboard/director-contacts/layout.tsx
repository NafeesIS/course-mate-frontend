import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/dashboard/director-contacts`),
  title: 'Dashboard | Unlock Contact',
  description:
    'Access verified director data in for lead generation, marketing campaigns, and business development using your credits. Unlock valuable insights for your business growth.',
  keywords: [
    'unlock directors contacts',
    'unlock director contacts using credits',
    'bulk unlock director contact details',
    'unlock director email',
    'unlock director mobile number',
  ],
  applicationName: 'FileSure',
  category: 'Business Intelligence Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Typically, dashboards are not indexed
    follow: false,
  },

  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard/director-contacts`),
  },
};

export default function UnlockContactLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
