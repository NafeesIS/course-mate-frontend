'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiLockFill } from 'react-icons/ri';
import { TCompanyMasterData } from '../_types/CompanyDetails';

const CompanyDetailsTabs = ({
  companyData,
  isUnlocked,
  children,
}: {
  companyData: TCompanyMasterData;
  isUnlocked: { isUnlocked: boolean; unlockType: string | null };
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'about';
  const [activeTab, setActiveTab] = useState(defaultTab);

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
    <section className='mt-4 bg-muted'>
      <Tabs
        defaultValue='about'
        value={activeTab}
        onValueChange={handleActiveTab}
        className='w-full'
      >
        <div className='container p-0'>
          {/* <Card className='w-fit overflow-hidden'> */}
          <ScrollArea>
            <TabsList className='w-full gap-2 rounded-none border-y'>
              <TabsTrigger value='about'>About</TabsTrigger>

              <Separator orientation='vertical' />

              {/* if company type is Company, then do not show financials tab */}
              {companyData.data.companyType !== 'Company' && (
                <>
                  <TabsTrigger value='financials'>
                    Financials{' '}
                    {!isUnlocked || isUnlocked.unlockType !== 'report' ? (
                      <RiLockFill className='ml-1.5 inline size-3 text-red-500' />
                    ) : null}
                  </TabsTrigger>

                  <Separator orientation='vertical' />
                </>
              )}

              <TabsTrigger value='public-docs'>
                Public Documents{' '}
                {!isUnlocked && (
                  <RiLockFill className='ml-1.5 inline size-3 text-red-500' />
                )}
              </TabsTrigger>
            </TabsList>
            <ScrollBar
              orientation='horizontal'
              className='h-2 opacity-50 lg:hidden'
            />
          </ScrollArea>
          {/* </Card> */}
        </div>

        <div className='mt-4'>{children}</div>
      </Tabs>
    </section>
  );
};

export default CompanyDetailsTabs;
