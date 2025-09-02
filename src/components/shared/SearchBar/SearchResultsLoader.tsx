import { Skeleton } from '@/components/ui/skeleton';

const SearchResultsLoader = () => {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-5 w-full' />
      <div className='flex gap-4'>
        <Skeleton className='h-5 w-3/12' />
        <Skeleton className='h-5 w-3/12' />
        <Skeleton className='h-5 w-2/12' />
        <Skeleton className='h-5 w-4/12' />
      </div>
    </div>
  );
};

export default SearchResultsLoader;
