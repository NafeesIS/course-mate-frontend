'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '../../../../components/ui/scroll-area';
import SocialButtons from './SocialButtons';
import { Tabs, TabsList, TabsTrigger } from './Tabs';

const CompanyDetailsTabs = ({
  companyData,
  children,
}: {
  companyData: any;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const router = useRouter();
  const defaultTab = searchParams.get('tab') || 'about';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const { company, about } = companyData?.data || {};

  useEffect(() => {
    // if the url has a tab query param, set it as the active tab
    if (searchParams.get('tab') && activeTab !== searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab') as string);
    }
    // if the url doesn't have a tab query param, set the active tab to 'about'
    if (!searchParams.get('tab')) {
      // don't store in history the default tab
      window.history.replaceState(null, '', `${pathname}?tab=about`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `${pathname}?tab=${tab}`);
  };

  return (
    <section className='relative bg-muted'>
      <Tabs
        defaultValue='about'
        className='w-full'
        value={activeTab}
        onValueChange={handleActiveTab}
      >
        <div className='wrapper flex flex-col md:flex-row md:items-center md:gap-8'>
          <div className='flex-center absolute -top-16 right-4 gap-4 md:hidden'>
            <SocialButtons
              pathname={pathname}
              activeTab={activeTab}
              name={company}
              about={about}
              mobile={true}
            />
          </div>

          <ScrollArea>
            <TabsList>
              <TabsTrigger value='about' className='text-sm'>
                About
              </TabsTrigger>
              <TabsTrigger value='directors' className='text-sm'>
                Directors
              </TabsTrigger>
              <TabsTrigger value='public-docs' className='text-sm'>
                Public Documents
              </TabsTrigger>
              <TabsTrigger value='financials' className='text-sm'>
                Financials
              </TabsTrigger>
              <TabsTrigger value='compliance' className='text-sm'>
                Compliance Check
              </TabsTrigger>
              <TabsTrigger value='charges' className='text-sm'>
                Charges
              </TabsTrigger>
              <TabsTrigger value='funding' className='text-sm'>
                Funding Data
              </TabsTrigger>
              {/* <TabsTrigger value='structure'>Structure</TabsTrigger> */}
            </TabsList>
            <ScrollBar
              orientation='horizontal'
              className='h-2 opacity-50 lg:hidden'
            />
          </ScrollArea>

          <div className='ml-auto hidden w-fit gap-4 md:flex'>
            <SocialButtons
              pathname={pathname}
              activeTab={activeTab}
              name={company}
              about={about}
            />
          </div>
        </div>

        <div className='bg-background'>{children}</div>
      </Tabs>
    </section>
  );
};

export default CompanyDetailsTabs;
