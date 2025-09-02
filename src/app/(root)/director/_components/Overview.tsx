import { formatName, formatToUrl } from '@/lib/formatters';
import { cn, getInitials, getStatusBadgeColor } from '@/lib/utils';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent } from '../../../../components/ui/card';
import SocialButtons from '../../company/_components/SocialButtons';
import DirectorSummary from './DirectorSummary';

const Overview = ({
  directorData,
  className,
}: {
  directorData: any;
  className?: string;
}) => {
  const { fullName, din, status, gender, nationality, companyData } =
    directorData || {};

  return (
    <section className={cn('wrapper mt-4 md:mt-6', className)}>
      <div className='flex flex-col-reverse justify-between gap-4 md:flex-row md:items-center'>
        <h2 className='text-base font-semibold md:text-lg'>Overview</h2>
        <div className='flex items-center justify-center gap-4 md:justify-end'>
          <SocialButtons
            pathname={`/director/${formatToUrl(fullName)}/${din}`}
            name={fullName}
            about=''
            activeTab=''
          />
        </div>
      </div>

      <div className='mt-3 flex flex-col gap-6 md:mt-4 lg:flex-row'>
        <div className='gap-6 md:flex '>
          <Card className='min-w-56 rounded-md'>
            <CardContent className='flex-col-center h-full p-6 text-center text-sm'>
              {/* Director Photo */}
              <div className='flex-center h-16 w-16 rounded-full bg-muted text-xl font-semibold text-muted-foreground md:h-20 md:w-20 md:text-2xl'>
                {fullName.length > 0 ? getInitials(formatName(fullName)) : ''}
              </div>

              {/* Director Details */}
              <h4 className='mt-4 text-base font-semibold text-foreground'>
                {fullName.length > 0 ? formatName(fullName) : '-'}
              </h4>
              <p className='mt-1 font-semibold text-muted-foreground'>
                Director
              </p>
              <p className='mt-1 font-semibold text-muted-foreground'>
                DIN: {din}
              </p>
              <Badge
                variant='outline'
                className={cn(
                  'mt-2.5 whitespace-nowrap rounded-full px-4 text-xs',
                  getStatusBadgeColor(status)
                )}
              >
                {status}
              </Badge>
            </CardContent>
          </Card>

          <div className='hidden md:block lg:hidden'>
            <DirectorSummary directorData={directorData} />
          </div>
        </div>

        <div className='flex w-full flex-col justify-between gap-6'>
          <div className='md:hidden lg:block'>
            <DirectorSummary directorData={directorData} />
          </div>

          <Card className='mt-0 min-w-60 rounded-md'>
            <CardContent className='flex flex-col justify-between divide-y px-5 py-0 text-center text-sm md:flex-row md:items-start md:divide-x md:divide-y-0 md:px-0 md:py-4 xl:py-5'>
              <div className='w-full space-y-1.5 py-4 text-center md:px-4 md:py-0 lg:px-6'>
                <h4 className='font-semibold text-muted-foreground lg:whitespace-nowrap'>
                  Total Appointment
                </h4>
                <p>{companyData ? companyData.length : '-'}</p>
              </div>
              <div className='w-full space-y-1.5 py-4 text-center md:px-4 md:py-0 lg:whitespace-nowrap lg:px-6'>
                <h4 className='font-semibold text-muted-foreground'>Gender</h4>
                <p>{gender}</p>
              </div>
              {/* <div className='w-full space-y-1.5 py-4 text-center md:px-4 md:py-0 lg:whitespace-nowrap lg:px-6'>
                <h4 className='font-semibold text-muted-foreground'>D.O.B</h4>
                <p>{format(dob, 'dd-MMM-yyyy')}</p>
              </div> */}
              <div className='w-full space-y-1.5 py-4 text-center md:px-4 md:py-0 lg:whitespace-nowrap lg:px-6'>
                <h4 className='font-semibold text-muted-foreground'>
                  Nationality
                </h4>
                <p>{nationality}</p>
              </div>
              <div className='w-full space-y-1.5 py-4 text-center md:px-4 md:py-0 lg:px-6 xl:whitespace-nowrap'>
                <h4 className='font-semibold text-muted-foreground'>Address</h4>
                <address className='not-italic'>-</address>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Overview;
