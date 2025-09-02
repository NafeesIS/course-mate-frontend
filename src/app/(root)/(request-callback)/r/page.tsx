'use client';

import HeroWrapper from '@/components/shared/HeroWrapper';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { BASE_URL_BACKEND } from '@/constants';
import { formatCurrencyINR, formatToUrl } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  AlertTriangleIcon,
  Building,
  Calendar,
  Clock,
  FileText,
  FileWarningIcon,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-phone-input-2/lib/style.css';
import ScheduleCallBackForm from './_components/ScheduleCallBackForm';
import StickyScrollButton from './_components/StickyScheduleButton';

interface LeadData {
  name: string;
  email: string;
  mobile: string;
  cin: string;
  company: string;
  incorpDate: string;
  filingDueDate: string;
  inc20aStatus: string;
  lateFee: string;
  filingStatus: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const [mobile, setMobile] = useState<string | null>(null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setValue } = useForm();

  useEffect(() => {
    const fetchLeadData = async () => {
      const mobileFromUrl = '91' + searchParams.get('q');
      setMobile(mobileFromUrl);

      if (mobile) {
        try {
          const response = await fetch(
            `${BASE_URL_BACKEND}/api/v1/crm/get-zoho-lead?mobile=${mobile}`
          );
          const data = await response.json();
          if (data.success) {
            setLeadData(data.data);
            // Prefill form fields
            setValue('name', data.data.name);
            setValue('email', data.data.email);
            setValue('phoneNumber', data.data.mobile);
          } else {
            setError('Failed to fetch lead data');
          }
        } catch (err) {
          setError('An error occurred while fetching lead data');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchLeadData();
  }, [mobile, searchParams, setValue]);

  return (
    <div>
      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>

      {isLoading && (
        <section className='flex-center min-h-[80vh]'>
          <div className='flex items-center justify-center space-x-2'>
            <div className='size-4 animate-pulse rounded-full bg-violet-600'></div>
            <div className='size-4 animate-pulse rounded-full bg-violet-600'></div>
            <div className='size-4 animate-pulse rounded-full bg-violet-600'></div>
          </div>
        </section>
      )}

      {!isLoading && (!mobile || error) && (
        <section className='flex min-h-[80vh] items-center justify-center p-4'>
          <div className='max-w-lg rounded-lg bg-white p-8 shadow-lg'>
            <div className='flex items-center space-x-3'>
              <AlertTriangle className='h-10 w-10 text-red-500' />
              <div className='text-base font-semibold text-gray-900 md:text-xl'>
                Oops! Something went wrong.
              </div>
            </div>
            <p className='mt-4 text-sm text-gray-600 md:text-base'>
              It seems like this isn&apos;t the page you&apos;re looking for.
              You might have followed a broken link or entered the wrong URL.
            </p>
            <Link
              href='/'
              className={cn(
                buttonVariants({ variant: 'default' }),
                'mt-6 w-full'
              )}
            >
              Go Back to Home
            </Link>
          </div>
        </section>
      )}

      {!isLoading && mobile && !error && leadData && (
        <div className='min-h-[90vh] bg-sky-50 md:pb-20 md:pt-16'>
          <section className='wrapper flex flex-col items-center  justify-center gap-8 border bg-background py-4 pb-16 pl-0 md:w-11/12 md:flex-row  md:rounded-xl md:pb-4 md:pr-8 md:shadow-lg'>
            {error && (
              <Alert variant='destructive' className='mb-4'>
                <AlertTriangleIcon className='size-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* alert details */}
            {leadData && (
              <Card className='flex w-full flex-col justify-between border-none shadow-none'>
                <CardHeader>
                  <Alert variant='destructive' className='flex md:mb-4'>
                    <AlertTriangleIcon className='size-4' />
                    <div>
                      <AlertTitle className='text-base font-semibold md:text-lg'>
                        Compliance Alert!
                      </AlertTitle>
                      <AlertDescription className='text-xs font-semibold md:text-sm'>
                        Form INC-20A Filing Submission Overdue
                      </AlertDescription>
                    </div>
                  </Alert>
                </CardHeader>

                <CardContent>
                  <p className='mb-6 text-sm text-foreground md:text-base'>
                    Dear {leadData.name}, <br />
                    <br />
                    According to the Ministry of Corporate Affairs (MCA)
                    records, your company, <strong>{leadData.company}</strong>,
                    has yet to file the mandatory Form{' '}
                    <strong>INC-20A (Commencement of Business)</strong>. This
                    filing is required within six months of your company&apos;s
                    incorporation.
                    <br />
                    <br />
                    To remain compliant and avoid penalties, we strongly
                    recommend you take immediate action. Our team is here to
                    assist you in completing this process smoothly and
                    efficiently.
                  </p>

                  <Table className='text-xs md:text-base'>
                    <TableBody>
                      <TableRow>
                        <TableCell className='flex items-center font-medium'>
                          <Building className='mr-2 size-4 flex-shrink-0' />
                          Company Name
                        </TableCell>
                        <TableCell>{leadData.company}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='flex items-center font-medium'>
                          <FileText className='mr-2 size-4 flex-shrink-0' />
                          CIN
                        </TableCell>
                        <TableCell>{leadData.cin}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='flex items-center font-medium'>
                          <Calendar className='mr-2 size-4 flex-shrink-0' />
                          Incorporation date
                        </TableCell>
                        <TableCell>{leadData.incorpDate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='flex items-center font-medium'>
                          <Clock className='mr-2 size-4 flex-shrink-0' />
                          Due Date for Filing
                        </TableCell>
                        <TableCell>{leadData.filingDueDate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='flex items-center font-medium'>
                          <XCircle className='mr-2 size-4 flex-shrink-0' />
                          Filing Status
                        </TableCell>
                        <TableCell>
                          <Badge variant='destructive'>Not Filed</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='flex items-center font-medium'>
                          <FileWarningIcon className='mr-2 size-4 flex-shrink-0' />{' '}
                          {/* Add the warning icon */}
                          Late Fee
                        </TableCell>
                        <TableCell className='font-semibold text-red-600'>
                          {' '}
                          {/* Style the late fee for emphasis */}
                          {formatCurrencyINR(leadData.lateFee)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/company/${formatToUrl(leadData.company)}/${leadData.cin}?tab=compliance`}
                    target='_blank'
                    className={cn(
                      buttonVariants({ variant: 'secondary' }),
                      'w-full'
                    )}
                  >
                    View Compliance Details
                  </Link>
                </CardFooter>
              </Card>
            )}

            {/* schedule a callback */}
            <div id='schedule-callback-form' className='w-full max-w-sm'>
              <ScheduleCallBackForm leadData={leadData} />
            </div>
          </section>

          <StickyScrollButton targetSectionId='schedule-callback-form' />
        </div>
      )}
    </div>
  );
};

export default Page;
