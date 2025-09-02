import { formatToUrl } from '@/lib/formatters';
import { cn, getStatusBadgeColor } from '@/lib/utils';
import { getRecentlyIncorporatedData } from '@/services/insights/getRecentlyIncorporatedData';
import { DotFilledIcon } from '@radix-ui/react-icons';
import { formatDistanceToNowStrict, parse } from 'date-fns';
import Link from 'next/link';
import { RiArrowRightUpFill } from 'react-icons/ri';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent } from '../../../../components/ui/card';

export default async function RecentlyIncorporated() {
  const data = await getRecentlyIncorporatedData();

  if (!data || !data.data || !data.success) {
    return null; // Don't render the section if there's no data or if the response is not successful
  }

  const { companies, llps } = data.data;

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
              <div className='flex flex-col divide-y'>
                {companies.map((data: any, index: number) => (
                  <Link
                    href={`/company/${formatToUrl(data.company)}/${data.cin}?tab=about`}
                    prefetch={false}
                    key={index}
                    className='group block items-start justify-between space-y-2 p-2 text-sm transition-all hover:bg-muted sm:flex'
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center justify-between gap-2 md:justify-start'>
                        <h4 className='text-sm font-medium text-primary'>
                          {data.company}
                        </h4>{' '}
                        <div className='flex items-center gap-2 transition-all'>
                          <span className='whitespace-nowrap text-xs text-muted-foreground'>
                            {formatDistanceToNowStrict(
                              parse(
                                data.dateOfIncorporation,
                                'MM/dd/yyyy',
                                new Date()
                              )
                            )}{' '}
                            ago
                          </span>
                          <RiArrowRightUpFill className='-ml-4 scale-0 text-lg text-primary transition-all group-hover:ml-0 group-hover:scale-100' />
                        </div>
                      </div>

                      <div className='flex flex-wrap items-center gap-1 text-xs text-muted-foreground'>
                        {/* CIN */}
                        {data.cin && (
                          <p className='flex items-center gap-1 whitespace-nowrap'>
                            {data.cin}
                          </p>
                        )}
                        {/* CATEGORY */}
                        {/* {data.category && (
                          <p className='flex items-center gap-1 whitespace-nowrap'>
                            <DotFilledIcon />
                            {data.category.includes('Company')
                              ? data.category.replace('Company', '').trim()
                              : data.category}
                          </p>
                        )} */}
                        {/* CLASS OF COMPANY */}
                        {/* {data.classOfCompany && (
                          <p className='flex items-center gap-1 whitespace-nowrap'>
                            <DotFilledIcon />
                            {data.classOfCompany}
                          </p>
                        )} */}
                        {/* STATE */}
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
              <div className='flex flex-col divide-y'>
                {llps.map((data: any, index: number) => (
                  <Link
                    href={`/company/${formatToUrl(data.company)}/${data.cin}?tab=about`}
                    prefetch={false}
                    key={index}
                    className='group block items-start justify-between space-y-2 p-2 text-sm transition-all hover:bg-muted sm:flex'
                  >
                    <div className='space-y-1'>
                      <div className='flex justify-between gap-2 md:justify-start'>
                        <h4 className='text-sm font-medium text-primary'>
                          {data.company}
                        </h4>{' '}
                        <div className='flex gap-2 pt-1 transition-all'>
                          <span className='whitespace-nowrap text-xs text-muted-foreground'>
                            {formatDistanceToNowStrict(
                              parse(
                                data.dateOfIncorporation,
                                'MM/dd/yyyy',
                                new Date()
                              )
                            )}{' '}
                            ago
                          </span>
                          <span className='w-8'>
                            <RiArrowRightUpFill className='-ml-4 scale-0 text-lg text-primary transition-all group-hover:ml-0 group-hover:scale-100' />
                          </span>
                        </div>
                      </div>

                      <div className='flex flex-wrap items-center gap-1 text-xs text-muted-foreground'>
                        {/* CIN */}
                        {data.cin && (
                          <p className='flex items-center gap-1 whitespace-nowrap'>
                            {data.cin}
                          </p>
                        )}
                        {/* CATEGORY */}
                        {/* {data.category && (
                          <p className='flex items-center gap-1 whitespace-nowrap'>
                            <DotFilledIcon />
                            {data.category.includes('Company')
                              ? data.category.replace('Company', '').trim()
                              : data.category}
                          </p>
                        )} */}
                        {/* CLASS OF COMPANY */}
                        {/* {data.classOfCompany && (
                          <p className='flex items-center gap-1 whitespace-nowrap'>
                            <DotFilledIcon />
                            {data.classOfCompany}
                          </p>
                        )} */}
                        {/* STATE */}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
