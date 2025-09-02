import { Skeleton } from '@/components/ui/skeleton';

export const FilterSideBarSkeleton = () => {
  return (
    <div className='hidden w-1/4 space-y-8 md:block'>
      <div className='space-y-4'>
        <Skeleton className='h-5 w-full' />
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
      <div className='space-y-4'>
        <Skeleton className='h-5 w-full' />
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
      <div className='space-y-4'>
        <Skeleton className='h-5 w-full' />
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-8' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
    </div>
  );
};

export const SearchResultsSkeleton = () => {
  return (
    <div className='flex w-full flex-col gap-8 md:gap-12'>
      <div className='space-y-4'>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-28' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
      {/* <Separator /> */}
      <div className='space-y-4'>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-28' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
      {/* <Separator /> */}
      <div className='space-y-4'>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-28' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
      {/* <Separator /> */}
      <div className='space-y-4'>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-28' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
      {/* <Separator /> */}
      <div className='space-y-4'>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-28' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
      {/* <Separator /> */}
      <div className='space-y-4'>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-28' />
        </div>
        <div className='flex gap-4'>
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-60' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
    </div>
  );
};

export default function Loading() {
  return (
    <section className='wrapper my-8 gap-8 md:flex'>
      {/* LEFT */}
      {/* <FilterSideBarSkeleton /> */}

      {/* RIGHT */}
      <SearchResultsSkeleton />
    </section>
  );
}
