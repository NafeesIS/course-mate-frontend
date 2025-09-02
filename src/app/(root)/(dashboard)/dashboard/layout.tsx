import { SessionAuthForNextJS } from '@/app/(root)/(auth)/_components/sessionAuthForNextJS';
import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import RBACProvider from './_components/RBAC/RBACProvider';
import CollapsibleSidebar from './_components/Sidebar/CollapsibleSidebar';
import {
  DASHBOARD_META_DESCRIPTION,
  DASHBOARD_META_KEYWORDS,
  DASHBOARD_META_TITLE,
} from './_utils/metadata';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/dashboard`),
  title: DASHBOARD_META_TITLE,
  description: DASHBOARD_META_DESCRIPTION,
  keywords: DASHBOARD_META_KEYWORDS,
  applicationName: 'FileSure Dashboard',
  category: 'Business Intelligence Dashboard',
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  robots: {
    index: false, // Typically, dashboards are not indexed
    follow: false,
  },

  alternates: {
    canonical: new URL(`${BASE_URL_FRONTEND}/dashboard`),
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionAuthForNextJS doRedirection>
      <RBACProvider>
        <div className='h-14 overflow-hidden bg-gray-100 md:h-14'>
          <div></div>
        </div>
        <div className='flex bg-gray-100'>
          <div className='hidden lg:block'>
            <CollapsibleSidebar />
          </div>
          <main className='min-h-screen flex-1 overflow-y-auto overflow-x-hidden bg-gray-100'>
            <div className='mx-auto max-w-[1920px] px-4 pb-16 pt-6 md:px-6 md:pb-40 md:pt-8'>
              {children}
            </div>
          </main>
        </div>
      </RBACProvider>
    </SessionAuthForNextJS>
  );
}
