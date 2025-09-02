/**
 * A loading file can create instant loading states built on Suspense.
 * By default, this file is a Server Component - but can also be used as a Client Component through the "use client" directive.
 */

import HeroWrapper from '@/components/shared/HeroWrapper';
import { SearchResultsSkeleton } from './(root)/search/loading';

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className='min-h-screen w-full'>
      <HeroWrapper className='pb-8 pt-24 md:pb-12 md:pt-28 lg:pt-32 xl:pt-36'>
        <div className='flex h-[20vh] w-full items-center justify-center space-x-1 text-sm text-gray-100'>
          <svg
            fill='none'
            className='h-6 w-6 animate-spin'
            viewBox='0 0 32 32'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              clipRule='evenodd'
              d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
              fill='currentColor'
              fillRule='evenodd'
            />
          </svg>

          <div>Loading ...</div>
        </div>
      </HeroWrapper>

      <section className='wrapper mb-8 mt-8 gap-8 md:mt-12 md:flex'>
        <SearchResultsSkeleton />
      </section>
    </div>
  );
}
