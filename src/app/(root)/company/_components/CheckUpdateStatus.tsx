/* eslint-disable indent */
'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BASE_URL_BACKEND } from '@/constants';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import {
  RiInformationLine,
  RiLoader4Line,
  RiRefreshLine,
} from 'react-icons/ri';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Skeleton } from '../../../../components/ui/skeleton';

const fetchStatusData = async (cinNo: string) => {
  try {
    const res = await fetch(
      `${BASE_URL_BACKEND}/api/v1/companies/getCompanyUpdateStatus?cin=${cinNo}`
    );
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching status data:', error);
    return { success: false, message: 'Failed to fetch data.' };
  }
};

const CheckUpdateStatus = ({
  cin,
  companyType,
  className,
}: {
  cin: string;
  companyType: string;
  className?: string;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAndUpdateStatus = () => {
    setLoading(true);
    fetchStatusData(cin)
      .then((data) => {
        if (data.success) {
          setStatusData(data.data);
          setErrorMessage(null);
        } else {
          setStatusData(null);
          setErrorMessage(data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchAndUpdateStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen, cin]);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'failed':
        return 'destructive';
      case 'completed':
        return 'default';
      case 'initiated':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        title='Check Update Status'
        className={cn('text-lg text-gray-300', className)}
      >
        <RiInformationLine />
      </DialogTrigger>
      <DialogContent className='w-fit min-w-72 md:min-w-96'>
        <div className='flex items-center gap-2'>
          <DialogTitle className='text-sm md:text-base'>
            Update Status
          </DialogTitle>
          <Button
            variant='link'
            size='icon'
            onClick={fetchAndUpdateStatus}
            className={cn(
              'size-7 text-lg hover:bg-muted',
              loading && 'animate-spin'
            )}
            title='Refresh Status Data'
          >
            <RiRefreshLine className={cn(loading && 'animate-spin')} />
          </Button>
        </div>

        <div>
          {errorMessage ? (
            <p>{errorMessage}</p>
          ) : statusData ? (
            <div className='space-y-2 text-xs md:text-sm'>
              {/* COMPANY DATA UPDATED */}
              <div className='flex items-center gap-1.5 whitespace-nowrap'>
                Company Basic Data:{' '}
                {loading ? (
                  <Skeleton className='h-4 w-full' />
                ) : (
                  <Badge
                    variant={getBadgeVariant(statusData.isCompanyDataUpdated)}
                    className='pointer-events-none'
                  >
                    {statusData.isCompanyDataUpdated}
                    {statusData.isCompanyDataUpdated === 'initiated' && (
                      <RiLoader4Line className='ml-1.5 animate-spin rounded-full' />
                    )}
                  </Badge>
                )}
              </div>

              {companyType === 'Company' && (
                <>
                  {/* // SRN DATA UPDATED */}
                  {/* <div className='flex items-center gap-1.5 whitespace-nowrap'>
                    MCA Compliance (v2):{' '}
                    {loading ? (
                      <Skeleton className='h-4 w-full' />
                    ) : (
                      <Badge
                        variant={getBadgeVariant(statusData.isSrnDataUpdated)}
                        className='pointer-events-none'
                      >
                        {statusData.isSrnDataUpdated}
                        {statusData.isSrnDataUpdated === 'initiated' && (
                          <RiLoader4Line className='ml-1.5 animate-spin rounded-full' />
                        )}
                      </Badge>
                    )}
                  </div> */}
                  {/* // VPD DATA UPDATED */}
                  <div className='flex items-center gap-1.5 whitespace-nowrap'>
                    MCA Compliance (v3):{' '}
                    {loading ? (
                      <Skeleton className='h-4 w-full' />
                    ) : (
                      <Badge
                        variant={getBadgeVariant(statusData.isVpdV3Updated)}
                        className='pointer-events-none'
                      >
                        {statusData.isVpdV3Updated}
                        {statusData.isVpdV3Updated === 'initiated' && (
                          <RiLoader4Line className='ml-1.5 animate-spin rounded-full' />
                        )}
                      </Badge>
                    )}
                  </div>
                </>
              )}

              {companyType === 'LLP' && (
                <>
                  {/* // VPD DATA UPDATED */}
                  <div className='flex items-center gap-1.5 whitespace-nowrap'>
                    MCA Compliance (v3):{' '}
                    {loading ? (
                      <Skeleton className='h-4 w-full' />
                    ) : (
                      <Badge
                        variant={getBadgeVariant(statusData.isLLPVpdUpdated)}
                        className='pointer-events-none'
                      >
                        {statusData.isLLPVpdUpdated}
                        {statusData.isLLPVpdUpdated === 'initiated' && (
                          <RiLoader4Line className='ml-1.5 animate-spin rounded-full' />
                        )}
                      </Badge>
                    )}
                  </div>
                </>
              )}

              {/* GST DATA UPDATED */}
              <div className='flex items-center gap-1.5 whitespace-nowrap'>
                GST Compliance:{' '}
                {loading ? (
                  <Skeleton className='h-4 w-full' />
                ) : (
                  <Badge
                    variant={getBadgeVariant(statusData.isGstUpdated)}
                    className='pointer-events-none'
                  >
                    {statusData.isGstUpdated}
                    {statusData.isGstUpdated === 'initiated' && (
                      <RiLoader4Line className='ml-1.5 animate-spin rounded-full' />
                    )}
                  </Badge>
                )}
              </div>

              {/* LAST UPDATED */}
              <div className='flex items-center gap-1.5 whitespace-nowrap'>
                Last Updated On:{' '}
                {loading ? (
                  <Skeleton className='h-4 w-full' />
                ) : (
                  <Badge variant='secondary' className='pointer-events-none'>
                    {new Date(statusData.lastUpdatedOn).toLocaleString()}
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <p>No status data available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckUpdateStatus;
