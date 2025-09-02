/* eslint-disable indent */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import {
  FaBan,
  FaCheckCircle,
  FaClipboard,
  FaCopy,
  FaEnvelope,
  FaExclamationTriangle,
  FaInfo,
  FaMoneyBillWave,
  FaRedo,
  FaSearch,
} from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import { RiUserFollowLine } from 'react-icons/ri';
import { toast } from 'sonner';
import {
  checkContactStatus,
  getDirectorContactData,
  getDirectorDetailsData,
} from '../_services/getContactData';
import HowToUnlock from './HowToUnlock';
import PayToUnlock from './PayToUnlock';
import SearchByName from './SearchByName';

interface IDirectorInfo {
  din: string;
  fullName: string;
}

interface IContactDetails {
  emailAddress: string;
  mobileNumber: string;
  maxRedemptions?: number;
  remainingRedemptions?: number;
}

const DirectorContactInfo = ({
  din,
  paymentDetails,
  setPaymentDetails,
  setIsDataAvailable,
  dataFetchError,
  setDataFetchError,
  isDataAvailable,
}: {
  din?: string;
  paymentDetails: any;
  setPaymentDetails: any;
  setIsDataAvailable: any;
  dataFetchError: any;
  setDataFetchError: any;
  isDataAvailable: any;
}) => {
  const [dinNumber, setDinNumber] = useState<string>(din || '');
  const [directorInfo, setDirectorInfo] = useState<IDirectorInfo | null>(null); // to store director information: full name
  const [contactDetails, setContactDetails] = useState<IContactDetails | null>(
    null
  ); // to store contact information before and after payment
  const [isLoading, setIsLoading] = useState(false);

  const directorConnectRef = useRef<HTMLDivElement>(null);

  // before payment
  const fetchDirectorContactStatus = async (din: string) => {
    setIsLoading(true);
    try {
      const [directorData, contactData] = await Promise.all([
        getDirectorDetailsData(din), // to get director name
        checkContactStatus(din), // to check if contact exists
      ]);

      if (directorData.success && contactData.success) {
        setDirectorInfo(directorData.data);
        setContactDetails(contactData.data);
        setDataFetchError(null);

        if (
          contactData?.data?.emailAddress ||
          contactData?.data?.mobileNumber
        ) {
          setIsDataAvailable(true);
        } else {
          setIsDataAvailable(false);
        }
      } else {
        setIsDataAvailable(false);
        setDataFetchError(
          contactData.message || 'Failed to fetch director contact details.'
        );
      }
    } catch (error) {
      setIsDataAvailable(false);
      setDataFetchError('An error occurred while fetching data!');
    } finally {
      setIsLoading(false);
    }
  };

  // after successful payment
  const fetchContactInfoAfterPayment = async (
    paymentDetails: any,
    din: string
  ) => {
    setIsLoading(true);
    try {
      const [directorData, contactData] = await Promise.all([
        getDirectorDetailsData(din), // to get director name
        getDirectorContactData(paymentDetails, din), // to get contact details after payment
      ]);

      if (directorData.success && contactData.success) {
        setDirectorInfo(directorData.data);
        setContactDetails(contactData.data); // contact details after payment
        setDataFetchError(null);
        toast.success('Contact details fetched successfully');
      } else {
        setDataFetchError(
          contactData.message || 'Failed to fetch director or contact details.'
        );
      }
    } catch (error) {
      setDataFetchError('An error occurred while fetching data!');
    } finally {
      setIsLoading(false);
    }
  };

  // after page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if ((!din || !dinNumber) && paymentDetails) {
      setDataFetchError('DIN number cannot be empty');
      return;
    }

    if (paymentDetails && din) {
      fetchContactInfoAfterPayment(paymentDetails, din);
    } else if (!paymentDetails && din) {
      fetchDirectorContactStatus(din);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [din, paymentDetails]);

  const handleSearchClick = async () => {
    if (!dinNumber.trim()) {
      setDataFetchError('DIN number cannot be empty');
      return;
    }

    window.history.pushState(null, '', `?din=${dinNumber}`);
  };

  const handleResetClick = () => {
    window.history.pushState(null, '', '/unlock-contact');
    setDinNumber('');
    setDirectorInfo(null);
    setContactDetails(null);
    setPaymentDetails(null);
    setIsDataAvailable(false);
    setDataFetchError(null);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Copied to clipboard');
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.log('Failed to copy: ', err);
        toast.error('Failed to copy to clipboard');
      }
    );
  };

  return (
    <Card
      id='directorConnect'
      ref={directorConnectRef}
      className='w-full rounded-lg p-2 shadow md:p-4'
    >
      <CardHeader className='mb-2 items-center justify-between gap-1 bg-muted p-2 text-base font-bold text-primary md:flex-row md:gap-3 md:p-4 md:text-xl'>
        <span className='flex items-center gap-3'>
          <RiUserFollowLine className='text-xl md:text-3xl' />
          DIRECTOR CONNECT
        </span>

        {/* when promo code is applied */}
        {contactDetails?.remainingRedemptions &&
        contactDetails?.maxRedemptions ? (
          <div className='flex items-center gap-2 rounded-full border bg-background px-2.5 py-0.5 text-center text-[10px] text-foreground md:px-4 md:py-2 md:text-xs'>
            Redeemed:{' '}
            {contactDetails?.maxRedemptions -
              contactDetails?.remainingRedemptions}
            /{contactDetails?.maxRedemptions}
          </div>
        ) : (
          <HowToUnlock />
        )}
      </CardHeader>
      <CardContent className='mx-auto flex flex-col-reverse items-center gap-8 p-0 md:p-4 lg:flex-row lg:gap-12'>
        <ul className='list-none space-y-3 rounded-lg border bg-muted p-4 text-xs text-foreground md:p-6 xl:flex-shrink-0'>
          <li className='flex items-center gap-2.5'>
            <FaCheckCircle className='flex-shrink-0 text-green-500' />
            <span className='font-medium'>
              Information will be shown instantly on this screen only after the
              payment
            </span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaBell className='flex-shrink-0 text-yellow-500' />
            <span className='font-medium'>
              Purchase details will be sent to your email and phone if provided
              during checkout
            </span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaExclamationTriangle className='flex-shrink-0 text-red-500' />
            <span>
              Please do not refresh or press back button after successful
              payment
            </span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaCopy className='flex-shrink-0 text-blue-500' />
            <span>
              Copy the information before closing the window or refreshing the
              page
            </span>
          </li>

          <li className='flex items-center gap-2.5'>
            <FaBan className='flex-shrink-0 text-red-500' />
            <span>Circulation of these details is prohibited</span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaEnvelope className='flex-shrink-0 text-green-500' />
            <span>Details are not to be used for spamming</span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaInfo className='flex-shrink-0 text-yellow-500' />
            <span>The information is the best to our knowledge</span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaMoneyBillWave className='flex-shrink-0 text-purple-500' />
            <span>
              Amount once paid will not be refunded under any circumstances
            </span>
          </li>
        </ul>

        <div className='w-full'>
          <table className='min-w-full border-collapse text-sm'>
            <tbody>
              <tr className='border-b'>
                <th className='place-content-start p-2 text-left font-semibold text-foreground md:p-4 md:pt-6'>
                  DIN
                </th>
                <td className='p-2 md:p-4'>
                  <div className='flex items-center gap-2'>
                    <Input
                      id='search-by-din'
                      type='text'
                      value={dinNumber}
                      onChange={(e) => setDinNumber(e.target.value)}
                      className={cn(
                        'w-32 md:w-40',
                        !din && dataFetchError && 'border-destructive'
                      )}
                      placeholder='Enter DIN number'
                    />

                    {directorInfo ? (
                      <Button
                        onClick={handleResetClick}
                        size='sm'
                        variant='secondary'
                        className='flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-xs text-destructive-foreground transition hover:bg-destructive hover:opacity-95 md:text-sm'
                      >
                        <FaRedo />
                        <span className='hidden md:block'>Reset</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSearchClick}
                        size='sm'
                        className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs text-primary-foreground transition hover:bg-primary hover:opacity-95 md:text-sm'
                      >
                        <FaSearch />
                        <span className='hidden md:block'>Search</span>
                      </Button>
                    )}
                  </div>

                  {!din && dataFetchError && (
                    <div className='mt-2 flex items-center gap-1.5 text-xs text-destructive md:text-sm'>
                      {dataFetchError}
                    </div>
                  )}

                  {/* if user is not sure about DIN number then they can search by name */}
                  <SearchByName
                    setDinNumber={setDinNumber}
                    fetchDirectorContactStatus={fetchDirectorContactStatus}
                  />
                </td>
              </tr>

              <tr className='border-b'>
                <th className='p-2 text-left font-semibold text-foreground md:p-4'>
                  Director Name
                </th>
                <td className='p-4'>
                  {directorInfo?.fullName || (
                    <span className='w-fit rounded border bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground md:text-xs'>
                      {/* Not Available, Please Search by DIN */}
                      {/* Search by DIN to continue */}
                      Please enter DIN to continue
                    </span>
                  )}
                </td>
              </tr>

              {isLoading ? (
                <>
                  <tr className='border-b'>
                    <th className='p-2 md:p-4'>
                      <Skeleton className='h-8 w-full' />
                    </th>
                    <td className='p-2 md:p-4'>
                      <Skeleton className='h-8 w-full' />
                    </td>
                  </tr>
                  <tr className='border-b'>
                    <th className='p-2 md:p-4'>
                      <Skeleton className='h-8 w-full' />
                    </th>
                    <td className='p-2 md:p-4'>
                      <Skeleton className='h-8 w-full' />
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className='border-b'>
                    <th className='p-2 text-left font-semibold text-foreground md:p-4'>
                      Contact Number
                    </th>
                    <td className='p-4 text-green-800 dark:text-green-500'>
                      <div className='flex flex-col justify-between gap-2 sm:flex-row sm:items-center'>
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                          {/* when din is not available */}
                          {!din && (
                            <span className='w-fit rounded border bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground md:text-xs'>
                              Please enter DIN to continue
                            </span>
                          )}

                          {/* when din and mobileNumber is available */}
                          {din && contactDetails?.mobileNumber && (
                            <span>
                              {contactDetails?.mobileNumber || 'Not Available'}
                            </span>
                          )}

                          {/* when mobileNumber is not available */}
                          {din &&
                            !contactDetails?.mobileNumber &&
                            !paymentDetails && (
                              <span className='w-fit rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground'>
                                Not Available
                              </span>
                            )}

                          {/* when mobile is available */}
                          {din &&
                            contactDetails?.mobileNumber &&
                            !paymentDetails && (
                              <span className='flex items-center gap-1.5'>
                                <span className='w-fit rounded bg-green-600  px-2 py-1 text-xs text-white dark:bg-green-500'>
                                  Available
                                </span>
                              </span>
                            )}
                        </div>

                        {paymentDetails && contactDetails?.mobileNumber && (
                          <Button
                            title='Click to copy'
                            onClick={() =>
                              handleCopyToClipboard(contactDetails.mobileNumber)
                            }
                            size='sm'
                            variant='outline'
                            className='ml-auto size-8 p-0 text-muted-foreground'
                          >
                            <FaClipboard className='text-lg' />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className='border-b'>
                    <th className='p-2 text-left font-semibold text-foreground md:p-4'>
                      Email Address
                    </th>
                    <td className='flex flex-col justify-between gap-2 p-4 text-green-800 dark:text-green-500 sm:flex-row sm:items-center'>
                      <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                        {/* when din is not available */}
                        {!din && (
                          <span className='w-fit rounded border bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground md:text-xs'>
                            Please enter DIN to continue
                          </span>
                        )}

                        {/* when din and email is available */}
                        {din && contactDetails?.emailAddress && (
                          <span>
                            {contactDetails?.emailAddress || 'Not Available'}
                          </span>
                        )}

                        {/* when email is not available */}
                        {din &&
                          !contactDetails?.emailAddress &&
                          !paymentDetails && (
                            <span className='w-fit rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground'>
                              Not Available
                            </span>
                          )}

                        {/* when email is available */}
                        {din &&
                          contactDetails?.emailAddress &&
                          !paymentDetails && (
                            <span className='flex items-center gap-1.5'>
                              <span className='w-fit rounded bg-green-600  px-2 py-1 text-xs text-white dark:bg-green-500'>
                                Available
                              </span>
                            </span>
                          )}
                      </div>

                      {paymentDetails && contactDetails?.emailAddress && (
                        <Button
                          title='Click to copy'
                          onClick={() =>
                            handleCopyToClipboard(contactDetails.emailAddress)
                          }
                          size='sm'
                          variant='outline'
                          className='ml-auto size-8 p-0 text-muted-foreground'
                        >
                          <FaClipboard className='text-lg' />
                        </Button>
                      )}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          <div className='mt-6 md:mt-8'>
            <PayToUnlock
              din={din}
              setPaymentDetails={setPaymentDetails}
              isDataAvailable={isDataAvailable}
              dataFetchError={dataFetchError}
              setDataFetchError={setDataFetchError}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectorContactInfo;
