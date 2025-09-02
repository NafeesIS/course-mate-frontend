'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiSearchLine } from 'react-icons/ri';

const SearchButton = ({
  tab,
  inputText,
  isPending,
}: {
  tab: string;
  inputText: string;
  isPending: boolean;
}) => {
  const pathname = usePathname();
  const searchPath = pathname.includes('search')
    ? `?query=${inputText}`
    : `/search/${tab}?query=${inputText}`;

  return (
    <Button
      title='Search'
      variant='outline'
      size='icon'
      className='group absolute right-2 top-1/2 -translate-y-1/2 overflow-hidden rounded-full border-0 text-center transition-all duration-500 hover:right-2 hover:w-24 hover:border-2 hover:px-2 md:right-4'
      asChild
    >
      <Link
        href={searchPath}
        prefetch={false}
        className={cn(
          'text-foreground',
          inputText.length <= 0 || isPending ? 'pointer-events-none' : ''
        )}
      >
        <RiSearchLine
          className={cn(
            'h-5 w-6 transition-all duration-500',
            isPending ? 'animate-pulse duration-1000' : ''
          )}
        />
        <span className='ml-0 w-0 text-base opacity-0 transition-all duration-500 group-hover:ml-1 group-hover:w-full group-hover:opacity-100'>
          {isPending ? (
            <span className='animate-pulse text-xs duration-1000'>
              Loading...
            </span>
          ) : (
            'Search'
          )}
        </span>

        {isPending && (
          <div className='absolute h-full w-full animate-spin rounded-full border-2 border-gray-300 border-t-primary group-hover:animate-none group-hover:border-0' />
        )}
      </Link>
    </Button>
  );
};

export default SearchButton;
