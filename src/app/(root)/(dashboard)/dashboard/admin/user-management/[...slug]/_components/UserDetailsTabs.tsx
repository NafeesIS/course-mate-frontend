'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserDetailsTabs = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    // Set the active tab based on query params
    if (searchParams.get('tab') && activeTab !== searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab') as string);
    }
    // If no query param, set default tab and update URL
    if (!searchParams.get('tab')) {
      window.history.replaceState(null, '', `${pathname}?tab=orders`);
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
        defaultValue='orders'
        value={activeTab}
        onValueChange={handleActiveTab}
        className='w-full'
      >
        <div className='container p-0'>
          <ScrollArea>
            <TabsList className='w-full gap-2 rounded-none border-y'>
              <TabsTrigger value='orders'>Orders</TabsTrigger>

              <Separator orientation='vertical' />

              <TabsTrigger value='bulk-unlock-credits'>
                Bulk Unlock Credits{' '}
              </TabsTrigger>

              <Separator orientation='vertical' />

              <TabsTrigger value='subscriptions'>Subscriptions</TabsTrigger>
            </TabsList>
            <ScrollBar
              orientation='horizontal'
              className='h-2 opacity-50 lg:hidden'
            />
          </ScrollArea>
        </div>

        <div className='mt-4'>{children}</div>
      </Tabs>
    </section>
  );
};

export default UserDetailsTabs;
