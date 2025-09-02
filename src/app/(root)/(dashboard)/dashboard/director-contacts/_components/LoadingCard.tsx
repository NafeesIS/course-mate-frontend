import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingCard() {
  return (
    <Card className='mt-6 overflow-hidden'>
      <CardHeader className='bg-purple-50 p-4 md:p-6'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-full md:h-12 md:w-12' />
          <div>
            <Skeleton className='h-5 w-40' />
            <Skeleton className='mt-2 h-4 w-24' />
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-4 md:p-6'>
        <div className='flex h-40 items-center justify-center'>
          <p className='text-center text-sm text-gray-500'>
            Fetching director information...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
