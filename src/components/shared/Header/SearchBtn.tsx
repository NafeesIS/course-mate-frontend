'use client';

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import SearchBar from '../SearchBar/SearchBar';

const SearchBtn = () => {
  const pathname = usePathname();
  // const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check if the path is the homepage or includes the search path
  const isHidden = pathname === '/' || pathname.includes('/search');

  if (isHidden) {
    return null; // Return null if the SearchBtn should be hidden
  }

  return (
    <div className=''>
      <Drawer direction='top' open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger
          className={cn(
            'flex-center group w-9 overflow-hidden rounded-full p-1.5 text-xl text-white transition-all duration-300 ease-in hover:w-24 hover:border-2 hover:px-2 hover:opacity-80',
            pathname.includes('/dashboard') ? 'w-24 border px-2 opacity-80' : ''
          )}
        >
          <RiSearch2Line />

          <span
            className={cn(
              'ml-0 w-0 text-base opacity-0 transition-all duration-500 group-hover:ml-0.5 group-hover:w-full group-hover:opacity-100',
              pathname.includes('/dashboard') ? 'ml-0.5 w-full opacity-100' : ''
            )}
          >
            Search
          </span>
        </DrawerTrigger>

        <DrawerContent className='flex-center rounded-none border-0 bg-transparent px-4 pb-0 pt-8 focus-visible:outline-0'>
          <div className='w-full max-w-3xl rounded-[9px] bg-background p-1 shadow-md'>
            <SearchBar
              className='w-full md:w-full xl:w-full'
              autoFocus={isOpen}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SearchBtn;
