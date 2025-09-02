/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
'use client';

import useCompanyUpdateRequest from '@/app/(root)/company/_services/useCompanyUpdateRequest';
import useCompanyUpdateStatus from '@/app/(root)/company/_services/useCompanyUpdateStatus';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiLoopLeftLine } from 'react-icons/ri';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../../components/ui/alert-dialog';
import { Button } from '../../../../components/ui/button';
import { Skeleton } from '../../../../components/ui/skeleton';
import { useCompanyLastUpdatedInfoStore } from '../_store/useCompanyLastUpdatedInfoStore';
import { getUpdateStatus } from '../_utils/checkUpdateStatus';

const UpdateNowButton = ({
  // eslint-disable-next-line no-unused-vars
  companyName,
  cinNo,
  companyType,
  dateOfIncorporation,
  className,
}: {
  companyName: string;
  cinNo: string;
  companyType: string;
  dateOfIncorporation: string;
  className?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openReqDialog, setOpenReqDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [isStatusRefetchStarted, setIsStatusRefetchStarted] = useState(false);
  const [isCheckedStatus, setIsCheckedStatus] = useState(false);

  const { setLastUpdatedAt } = useCompanyLastUpdatedInfoStore();

  // make update request
  const {
    data: reqData,
    refetch: reqRefetch,
    isLoading: reqIsLoading,
    isError: reqIsError,
  } = useCompanyUpdateRequest(cinNo, companyType, dateOfIncorporation);

  // check update status: initiated, completed, failed
  const {
    data: statusData,
    refetch: statusRefetch,
    isLoading: statusLoading,
    isError: statusIsError,
  } = useCompanyUpdateStatus(cinNo, reqData);

  const { dataUpdateInitiated, dataUpdateCompleted, dataUpdateFailed } =
    getUpdateStatus(statusData?.data, companyType);

  // check update status when pathname changes
  useEffect(() => {
    if (pathname.includes('company')) {
      statusRefetch();
    }
  }, [pathname]);

  // check update status on page load: to check if update request is already initiated
  useEffect(() => {
    if (
      !isCheckedStatus &&
      !openReqDialog &&
      !isStatusRefetchStarted &&
      statusData?.data
    ) {
      if (dataUpdateInitiated) {
        // statusRefetch();
        setIsStatusRefetchStarted(true);
        setIsCheckedStatus(true);
      } else if (dataUpdateCompleted || dataUpdateFailed) {
        setIsCheckedStatus(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusData?.data, isCheckedStatus]);

  // Update the store when status data changes
  useEffect(() => {
    if (
      statusData?.data?.lastUpdatedOn &&
      (dataUpdateCompleted || dataUpdateFailed) &&
      !dataUpdateInitiated
    ) {
      setLastUpdatedAt(statusData.data.lastUpdatedOn);
    }
  }, [statusData, setLastUpdatedAt]);

  // check updated status after manually initiating update
  useEffect(() => {
    if (
      !openStatusDialog &&
      isStatusRefetchStarted &&
      statusData?.data &&
      (dataUpdateCompleted || dataUpdateFailed)
    ) {
      setOpenReqDialog(false);
      setOpenStatusDialog(true);
      setIsStatusRefetchStarted(false);
    }
  }, [isStatusRefetchStarted, statusData?.data, openStatusDialog]);

  // initiate update now
  const handleUpdateNow = () => {
    reqRefetch();
    setOpenReqDialog(true);
  };

  // close update request dialog and start checking updated status
  const handleCloseReqDialog = () => {
    if (
      !reqData?.data ||
      !reqData?.data?.message ||
      reqData?.data?.message.toLowerCase().includes('already updated')
    ) {
      setOpenReqDialog(false);
      router.refresh(); // reload page
      return;
    }
    setOpenReqDialog(false);
    statusRefetch();
    setIsStatusRefetchStarted(true);
  };

  // close updated status dialog and reload page
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setOpenReqDialog(false);
    setIsStatusRefetchStarted(false);
    router.refresh(); // reload page
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'initiated':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderStatusItem = (label: string, status: string | undefined) => {
    if (!status) return null;
    return (
      <li className='mb-1 flex items-center gap-1'>
        <p className='text-xs text-gray-600'>
          {label}:{' '}
          <span className={`font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </p>
        {status === 'initiated' && (
          <RiLoopLeftLine className='h-3 w-3 animate-spin text-blue-600' />
        )}
      </li>
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd-MMM-yyyy hh:mm a');
  };

  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center gap-2'>
        {/* DATA UPDATE INITIATED */}
        {(isStatusRefetchStarted && statusLoading) ||
        (isStatusRefetchStarted && dataUpdateInitiated) ? (
          <Button
            variant='link'
            className={cn(
              'h-fit animate-pulse gap-1 p-0 text-xs text-purple-400 md:text-sm',
              className
            )}
            disabled
          >
            <RiLoopLeftLine className='animate-spin' />
            <span>Update in Progress..</span>
          </Button>
        ) : (
          // DATA UPDATE NOT INITIATED: show update now button
          <AlertDialog open={openReqDialog} onOpenChange={setOpenReqDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant='link'
                className={cn(
                  'h-fit gap-1 p-0 text-xs text-purple-400 md:text-sm',
                  className
                )}
                onClick={handleUpdateNow}
              >
                <RiLoopLeftLine />
                Update Now
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='md:max-w-xl'>
              {/* loading */}
              {reqIsLoading ? (
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <Skeleton className='h-6 w-32' />
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <Skeleton className='h-6 w-full' />
                  </AlertDialogDescription>
                </AlertDialogHeader>
              ) : reqIsError && !reqData ? (
                // IF UPDATE FAILED
                <AlertDialogHeader>
                  <AlertDialogTitle>Update failed</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please try again later. If the issue persists, please try
                    again after several minutes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              ) : // IF DATA ALREADY UPDATED
              !reqIsError &&
                reqData?.data?.message
                  .toLowerCase()
                  .includes('already updated') ? (
                <AlertDialogHeader>
                  <AlertDialogTitle>Data already updated</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please retry after 24 hours for the latest information.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              ) : (
                // IF UPDATE INITIATED SUCCESSFULLY
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Update initiated successfully
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    It may take some time. Please explore existing data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              )}

              <AlertDialogFooter>
                <Button variant='outline' onClick={handleCloseReqDialog}>
                  Close
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <AlertDialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
          <AlertDialogContent className='md:max-w-xl'>
            <AlertDialogHeader className='flex-row items-center gap-4 space-y-0'>
              {/* IF NO ERROR AND UPDATE COMPLETED THEN SHOW UPDATE SUCCESSFUL */}
              {!statusIsError && dataUpdateCompleted ? (
                <AlertDialogHeader>
                  <AlertDialogTitle>Data update successful!</AlertDialogTitle>
                  <AlertDialogDescription>
                    Thank you for your patience. Feel free to explore the latest
                    information.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              ) : (
                <AlertDialogHeader>
                  {/* IF ERROR / FAILED */}
                  <AlertDialogTitle>
                    We apologize, but the update process failed
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Please try again later. If the issue persists, feel free to
                    reach out to our support team for assistance.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant='outline' onClick={handleCloseStatusDialog}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {statusData?.data && (
        <div className='group relative'>
          <button className='flex-center rounded-full'>
            <Info className='h-4 w-4 text-blue-400 hover:text-blue-600' />
          </button>

          <ul className='absolute right-0 top-[calc(100%+10px)] z-10 hidden w-64 rounded-lg border bg-white p-3 shadow-md group-hover:block'>
            <>
              <li className='mb-2'>
                <p className='text-left text-xs font-medium text-gray-900'>
                  Update Status Details:
                </p>
              </li>
              {renderStatusItem(
                'Company Data',
                statusData.data.isCompanyDataUpdated
              )}
              {renderStatusItem('GST Data', statusData.data.isGstUpdated)}
              {renderStatusItem(
                'LLP VPD Data',
                statusData.data.isLLPVpdUpdated
              )}
              {/* {renderStatusItem('SRN Data', statusData.data.isSrnDataUpdated)} */}
              {renderStatusItem('VPD V3 Data', statusData.data.isVpdV3Updated)}
              {statusData.data.lastUpdatedOn && (
                <li className='mt-2 border-t pt-2'>
                  <p className='text-left text-xs text-gray-500'>
                    Last Updated: {formatDate(statusData.data.lastUpdatedOn)}
                  </p>
                </li>
              )}
            </>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UpdateNowButton;
