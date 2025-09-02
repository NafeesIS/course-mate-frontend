import { Card, CardContent } from '../../../../components/ui/card';
import { Skeleton } from '../../../../components/ui/skeleton';

const RecentlyIncorporatedLoader = () => {
  return (
    <section className='wrapper space-y-6 py-8 md:space-y-6'>
      <div className='space-y-3 text-center md:pt-6'>
        <h2 className='section-title'>
          Discover the Latest <br className='sm:hidden' />
          <span className='text-primary'>Incorporations</span>
        </h2>
        <p className='text-muted-foreground md:text-lg'>
          Stay updated with the most recent companies making headlines
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Private Companies Card */}
        <Card className='overflow-hidden rounded-md'>
          <CardContent className='p-0'>
            <h3 className='bg-muted px-4 py-2 text-sm font-bold text-muted-foreground'>
              Recently Incorporated Companies
            </h3>
            <div className='md:p-2'>
              <div className='flex flex-col space-y-6 p-2 md:p-4'>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className='flex justify-between space-x-4'>
                    <div className='flex flex-col space-y-2'>
                      <Skeleton className='h-4 w-60' />
                      <Skeleton className='h-3 w-32' />
                      {/* <Skeleton className='h-3 w-24' /> */}
                    </div>
                    <Skeleton className='h-5 w-16 rounded-full md:h-6' />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Companies Card */}
        <Card className='overflow-hidden rounded-md'>
          <CardContent className='p-0'>
            <h3 className='bg-muted px-4 py-2 text-sm font-bold text-muted-foreground'>
              Recently Incorporated LLP&apos;s
            </h3>
            <div className='md:p-2'>
              <div className='flex flex-col space-y-6 p-2 md:p-4'>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className='flex justify-between space-x-4'>
                    <div className='flex flex-col space-y-2'>
                      <Skeleton className='h-4 w-60' />
                      <Skeleton className='h-3 w-32' />
                      {/* <Skeleton className='h-3 w-24' /> */}
                    </div>
                    <Skeleton className='h-5 w-16 rounded-full md:h-6' />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RecentlyIncorporatedLoader;

export const PopularSearchesGlobalLoader = () => {
  return (
    <section className='wrapper space-y-6 pb-10 md:pb-16 md:pt-6'>
      <div className='space-y-3 text-center'>
        <h2 className='section-title'>
          Explore What&apos;s <span className='text-primary'>Trending</span>
        </h2>
        <p className='text-muted-foreground md:text-lg'>
          Discover the most searched companies and directors on our platform
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Popular Companies Card */}
        <Card className='overflow-hidden rounded-md'>
          <CardContent className='p-0'>
            <p className='bg-muted p-2 text-sm font-bold text-muted-foreground md:px-4 md:text-base'>
              Popular Companies
            </p>
            <div className='flex flex-col divide-y md:p-2'>
              <div className='flex flex-col space-y-6 p-2 md:p-4'>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className='flex justify-between space-x-4'>
                    <div className='flex flex-col space-y-2'>
                      <Skeleton className='h-4 w-60' />
                      <Skeleton className='h-3 w-32' />
                      {/* <Skeleton className='h-3 w-24' /> */}
                    </div>
                    <Skeleton className='h-5 w-16 rounded-full md:h-6' />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Directors Card */}
        <Card className='overflow-hidden rounded-md'>
          <CardContent className='p-0'>
            <p className='bg-muted p-2 text-sm font-bold text-muted-foreground md:px-4 md:text-base'>
              Popular Directors
            </p>
            <div className='flex flex-col divide-y md:p-2'>
              <div className='flex flex-col space-y-6 p-2 md:p-4'>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className='flex justify-between space-x-4'>
                    <div className='flex flex-col space-y-2'>
                      <Skeleton className='h-4 w-60' />
                      <Skeleton className='h-3 w-32' />
                      {/* <Skeleton className='h-3 w-24' /> */}
                    </div>
                    <Skeleton className='h-5 w-16 rounded-full md:h-6' />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
