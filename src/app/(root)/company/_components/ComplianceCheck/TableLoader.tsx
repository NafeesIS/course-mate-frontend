import { Skeleton } from '@/components/ui/skeleton';

const TableLoader = () => {
  return (
    <div className='my-12 space-y-4'>
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

export default TableLoader;
