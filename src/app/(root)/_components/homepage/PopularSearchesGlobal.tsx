import { formatToUrl } from '@/lib/formatters';
import { cn, getStatusBadgeColor } from '@/lib/utils';
import { getPopularSearchedData } from '@/services/insights/getPopularSearchData';
import { DotFilledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { RiArrowRightUpFill } from 'react-icons/ri';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent } from '../../../../components/ui/card';

export default async function PopularSearchesGlobal() {
  const data = await getPopularSearchedData();

  if (!data || !data.data || !data.success) {
    return null; // Don't render the section if there's no data or if the response is not successful
  }

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
            <p className='bg-muted p-2 text-sm font-bold text-muted-foreground md:px-4'>
              Popular Companies
            </p>
            <div className='flex flex-col divide-y md:p-2'>
              {data?.data?.popularCompanies?.map((data: any, index: number) => (
                <Link
                  href={`/company/${formatToUrl(data.name)}/${data.idNo}?tab=about`}
                  prefetch={false}
                  key={index}
                  className='group block items-start justify-between space-y-2 p-2 text-sm transition-all hover:bg-muted sm:flex'
                >
                  <div className='space-y-1'>
                    <div className='flex gap-2 text-sm font-medium text-primary transition-all'>
                      <h4>{data.name}</h4>
                      <RiArrowRightUpFill className='-ml-4 scale-0 text-lg text-primary transition-all group-hover:ml-0 group-hover:scale-100' />
                    </div>

                    <div className='flex flex-wrap items-center gap-1 text-xs text-muted-foreground'>
                      {data.idNo && (
                        <p className='flex items-center gap-1 whitespace-nowrap'>
                          {data.idNo}
                        </p>
                      )}
                      <p className='flex items-center gap-1 whitespace-nowrap'>
                        <DotFilledIcon />
                        {data.state}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant='outline'
                    className={cn(
                      'max-w-[20%]',
                      getStatusBadgeColor(data.status)
                    )}
                  >
                    <span className='truncate'>{data.status}</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Directors Card */}
        <Card className='overflow-hidden rounded-md'>
          <CardContent className='p-0'>
            <p className='bg-muted p-2 text-sm font-bold text-muted-foreground md:px-4'>
              Popular Directors
            </p>
            <div className='flex flex-col divide-y md:p-2'>
              {data?.data?.popularDirectors?.map((data: any, index: number) => (
                <Link
                  href={`/director/${formatToUrl(data.name)}/${data.idNo}`}
                  prefetch={false}
                  key={index}
                  className='group block items-start justify-between space-y-2 p-2 text-sm transition-all hover:bg-muted sm:flex'
                >
                  <div className='space-y-1'>
                    <div className='flex gap-2 text-sm font-medium text-primary transition-all'>
                      <h4>{data.name}</h4>
                      <RiArrowRightUpFill className='-ml-4 scale-0 text-lg text-primary transition-all group-hover:ml-0 group-hover:scale-100' />
                    </div>

                    <div className='flex flex-wrap items-center gap-1 text-xs text-muted-foreground'>
                      {data.idNo && (
                        <p className='flex items-center gap-1 whitespace-nowrap'>
                          {data.idNo}
                        </p>
                      )}
                      {data.personType && (
                        <p className='flex items-center gap-1 whitespace-nowrap'>
                          <DotFilledIcon />
                          {data.personType}
                        </p>
                      )}
                      {data.nationality && (
                        <p className='flex items-center gap-1 whitespace-nowrap'>
                          <DotFilledIcon />
                          {data.nationality}
                        </p>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant='outline'
                    className={cn(
                      'max-w-[20%]',
                      getStatusBadgeColor(data.status)
                    )}
                  >
                    <span className='truncate'>{data.status}</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
