/* eslint-disable indent */
import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatName, formatToUrl } from '@/lib/formatters';
import { differenceInMonths, format, isValid, parseISO } from 'date-fns';
import Link from 'next/link';
import { RiArrowRightUpLine } from 'react-icons/ri';
import CurrentLeadership from './CurrentLeadership';
import PastDirectors from './PastDirectors';

interface ExecutiveTeamMember {
  din: string;
  fullName: string;
  dateOfAppointment: string;
  designation: string;
  totalDirectorship: number;
  isPromoter: boolean;
}

type Props = {
  companyData: TCompanyMasterData;
};

const Directors = ({ companyData }: Props) => {
  const { currentDirectors, executiveTeam, pastDirectors } = companyData.data;

  const { individualPromoters, executiveTeamWithoutPromoters } =
    executiveTeam?.reduce(
      (acc, item: ExecutiveTeamMember) => {
        if (
          item.designation === 'Individual Promoter' ||
          item.designation === 'Individual Subscriber'
        ) {
          acc.individualPromoters.push(item);
        } else {
          acc.executiveTeamWithoutPromoters.push(item);
        }
        return acc;
      },
      {
        individualPromoters: [] as ExecutiveTeamMember[],
        executiveTeamWithoutPromoters: [] as ExecutiveTeamMember[],
      }
    ) || { individualPromoters: [], executiveTeamWithoutPromoters: [] };

  const currentLeaders = [
    ...currentDirectors,
    ...executiveTeamWithoutPromoters,
  ];
  const getUniqueDirectors = (directors: any) => {
    const uniqueDirectors = directors?.filter(
      (director: any, index: any, self: any) =>
        index === self?.findIndex((d: any) => d?.din === director?.din)
    );
    return uniqueDirectors;
  };

  // Get unique directors
  const uniqueDirectors = getUniqueDirectors(pastDirectors);
  const getMonthName = (monthNumber: any) => {
    // Convert month number to month name
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[parseInt(monthNumber) - 1];
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth(); // Month index starting from 0
  const currentMonth = currentMonthIndex + 1; // Add 1 to get the month number
  const currentMonthName = getMonthName(currentMonth);

  // Sort currentDirectors based on dateOfAppointment in ascending order (oldest date first)
  const sortedDirectors = [...currentLeaders]?.sort((a, b) => {
    const dateA: any = new Date(a?.dateOfAppointment);
    const dateB: any = new Date(b?.dateOfAppointment);
    return dateA - dateB;
  });

  const findOldestYearOfAppointment = (directors: any) => {
    if (!directors || directors.length === 0) {
      return null; // Return null if the directors array is empty or undefined
    }

    // Convert appointment dates to Date objects for comparison
    const appointmentDates = directors.map(
      (director: any) => new Date(director.dateOfAppointment)
    );

    // Find the oldest date among the appointment dates
    const oldestDate = new Date(Math.min(...appointmentDates));
    const oldestDateString = oldestDate.toISOString();

    return oldestDateString;
  };

  const testOldestDate: any = findOldestYearOfAppointment(currentDirectors);

  // Initialize timeline array
  const timeline = [];
  const mobileTimeline = [];

  // Start with the oldest date
  const startDate = new Date(testOldestDate);
  const fullOldestYear = startDate.getFullYear();
  // Start with the oldest date
  const startMobileDate = new Date(testOldestDate);

  const stringStartDate = startDate.toISOString();
  const stringCurrentDate = currentDate.toISOString();
  const startMonthIndex = startDate.getMonth(); // Month index starting from 0
  const startMonthNumber = startMonthIndex + 1; // Add 1 to get the month number

  const calculateMonthsDifference = (startDate: any, currentDate: any) => {
    const start = parseISO(startDate);
    const current = parseISO(currentDate);
    return differenceInMonths(current, start);
  };

  const monthsDiffReal = calculateMonthsDifference(
    stringStartDate,
    stringCurrentDate
  );
  const monthsDiff = monthsDiffReal > 0 ? monthsDiffReal : monthsDiffReal + 1;
  const latestCalculatePercentage = (dateString: string): number => {
    const appointmentDate = new Date(dateString);
    const appointmentYear = appointmentDate.getFullYear();
    const appointmentMonth = appointmentDate.getMonth();

    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const monthsElapsed =
      (currentYear - appointmentYear) * 12 + (currentMonth - appointmentMonth);
    const totalElapsedTimePercentage = (monthsElapsed / monthsDiff) * 100;

    return totalElapsedTimePercentage + 0.3;
  };
  const desiredOutput = 10;
  const desiredMobileOutput = 5;
  const calculateDivisor = (monthsDifference: any, desiredOutput: any) => {
    return Math.ceil(monthsDifference / desiredOutput);
  };
  const divisor = calculateDivisor(monthsDiff, desiredOutput);
  const divisorMobile = calculateDivisor(monthsDiff, desiredMobileOutput);

  // Loop to generate parts
  while (startDate < currentDate) {
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const startYear = startDate.getFullYear();

    // Push the timeline part
    timeline.push({ month: startMonth, year: startYear });

    // Move to the next month
    startDate.setMonth(startDate.getMonth() + divisor);
  }

  // Add the current date as the end of the last part
  timeline.push({
    month: currentDate.toLocaleString('default', { month: 'short' }),
    year: currentDate.getFullYear(),
  });

  while (startMobileDate < currentDate) {
    const startMonth = startMobileDate.toLocaleString('default', {
      month: 'short',
    });
    const startYear = startMobileDate.getFullYear();

    // Push the timeline part
    mobileTimeline.push({ month: startMonth, year: startYear });

    // Move to the next month
    startMobileDate.setMonth(startMobileDate.getMonth() + divisorMobile);
  }

  mobileTimeline.push({
    month: currentDate.toLocaleString('default', { month: 'short' }),
    year: currentDate.getFullYear(),
  });

  const startMonthName = getMonthName(startMonthNumber);

  const removeDuplicateEntries = (timeline: any) => {
    const uniqueTimeline: any = [];
    timeline.forEach((item: any) => {
      const exists = uniqueTimeline.some((uniqueItem: any) => {
        return uniqueItem.month === item.month && uniqueItem.year === item.year;
      });
      if (!exists) {
        uniqueTimeline.push(item);
      }
    });
    return uniqueTimeline;
  };

  const filteredTimeline = removeDuplicateEntries(timeline);
  const filteredMobileTimeline = removeDuplicateEntries(mobileTimeline);
  const calculateYearsMonths = (num: any) => {
    if (num >= 12) {
      const years = Math.floor(num / 12);
      const months = num % 12;
      if (months === 0) {
        return `${years} Year${years !== 1 ? 's' : ''}`;
      } else {
        return `${years}y ${months}m`;
      }
    } else {
      return `${num} Month${num !== 1 ? 's' : ''}`;
    }
  };

  return (
    <section className='mt-8'>
      <div className='wrapper'>
        <h4 className='text-base font-semibold md:text-lg'>Overview</h4>
        <div className='mt-6 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4'>
          <Card className='max-w-96 space-y-1 rounded-md p-4 sm:p-6'>
            <p className='text-sm font-normal sm:text-base'>Board Members</p>
            <p className='text-xl font-extrabold text-[#7879FC] md:text-4xl lg:text-3xl'>
              {currentDirectors ? currentDirectors.length : '-'}
            </p>
          </Card>
          <Card className='max-w-96 space-y-1 rounded-md p-4 sm:p-6'>
            <p className='text-sm font-normal sm:text-base'>Executive Team</p>
            <p className='text-xl font-extrabold text-[#A9DC29] md:text-4xl lg:text-3xl'>
              {executiveTeamWithoutPromoters
                ? executiveTeamWithoutPromoters.length
                : '-'}
            </p>
          </Card>
          <Card className='max-w-96 space-y-1 rounded-md p-4 sm:p-6'>
            <p className='text-sm font-normal sm:text-base'>Past Directors</p>
            <p className='text-xl font-extrabold text-[#FC9858] md:text-4xl lg:text-3xl'>
              {pastDirectors ? uniqueDirectors.length : '-'}
            </p>
          </Card>
          <Card className='max-w-96 space-y-1 rounded-md p-4 sm:p-6'>
            <p className='text-sm font-normal sm:text-base'>
              Current Leadership
            </p>
            <p className='text-xl font-extrabold text-[#2CDE9A] md:text-4xl lg:text-3xl'>
              {currentDirectors
                ? currentDirectors.length + executiveTeamWithoutPromoters.length
                : '-'}
            </p>
          </Card>
        </div>
      </div>

      <CurrentLeadership
        boardMember={currentDirectors}
        executiveTeam={executiveTeamWithoutPromoters}
        individualPromoters={individualPromoters}
        className='mt-8 md:mt-10'
      />

      <PastDirectors pastDirectors={pastDirectors} className='mt-8 md:mt-10' />

      <div className='wrapper mb-6 mt-8 md:mb-8 md:mt-10 lg:mb-10 lg:mt-12'>
        <Separator />
      </div>

      <div>
        <div className='wrapper mt-8 flex flex-col items-start justify-between gap-4 md:mt-10 lg:flex-row lg:items-center'>
          <h2 className='w-10/12 text-base font-semibold md:text-lg'>
            Timeline of Current Leadership
          </h2>

          <div className='flex flex-col items-start gap-4 whitespace-nowrap text-xs font-medium sm:flex-row sm:items-center md:text-sm'>
            {/* Executive Team */}
            <div className='flex items-center gap-2'>
              <div className='h-4 w-10 rounded-sm bg-[#A9DC29]'></div>
              <p>
                Executive Team (
                {executiveTeamWithoutPromoters
                  ? executiveTeamWithoutPromoters.length
                  : '-'}
                )
              </p>
            </div>

            {/* Board Members */}
            <div className='flex items-center gap-2'>
              <div className='h-4 w-10 rounded-sm bg-[#7879FC]'></div>
              <p>
                Board Members (
                {currentDirectors ? currentDirectors.length : '-'})
              </p>
            </div>

            {/* half yearly */}
            <div className='flex items-center gap-2'>
              <div className='h-4 w-10 rounded-sm bg-slate-200'></div>
              <p className='flex items-center'>
                <span className='block pr-1 sm:hidden'>
                  {calculateYearsMonths(divisorMobile)}
                </span>{' '}
                <span className='hidden pr-1 sm:block'>
                  {calculateYearsMonths(divisor)}{' '}
                </span>{' '}
                Interval
              </p>
            </div>
          </div>
        </div>
        <div className='wrapper mt-10 flex flex-col'>
          <div className='relative h-full w-full overflow-hidden'>
            <div className='relative'>
              <div className='hidden w-full max-w-[1280px] items-start justify-between gap-4 sm:flex sm:gap-1 md:gap-6 lg:gap-10 xl:gap-16'>
                {filteredTimeline.map((test: any, index: number) => (
                  <div key={index} className='relative text-center'>
                    <div className='font-open_sans text-xs font-semibold leading-tight text-neutral-400 sm:h-12 md:h-14 md:text-sm lg:h-16 lg:text-base'>
                      {test.month === currentMonthName &&
                      test.year === currentYear ? (
                        <span className='flex flex-col lg:-translate-x-1'>
                          <span>{format(currentDate, 'dd MMM')}</span>{' '}
                          <span>{test.year}</span>
                        </span>
                      ) : (
                        <span className='flex flex-col'>
                          <span>{test.month}</span> <span>{test.year}</span>
                        </span>
                      )}
                    </div>
                    <div
                      className={`${(test.month === currentMonthName && test.year === currentYear) || (test.month === startMonthName && test.year === fullOldestYear) ? 'hidden' : 'block'} absolute  left-1/2 top-12 z-10 h-[5000px] w-0.5 transform bg-[#E2E8F0] md:top-14 lg:top-16`}
                    />
                  </div>
                ))}
              </div>
              <div className='flex items-start justify-between gap-0 sm:hidden sm:gap-6 md:gap-8 lg:gap-10 xl:gap-14'>
                {filteredMobileTimeline.map((test: any, index: number) => (
                  <div key={index} className='relative text-center'>
                    <div className='h-12 font-open_sans text-xs font-semibold leading-tight text-neutral-400 md:text-base'>
                      {test.month === currentMonthName &&
                      test.year === currentYear ? (
                        <span className='flex flex-col justify-center'>
                          <span>{format(currentDate, 'dd MMM')}</span>{' '}
                          <span>{test.year}</span>
                        </span>
                      ) : (
                        <span className='flex flex-col justify-center'>
                          <span>{test.month}</span> <span>{test.year}</span>
                        </span>
                      )}
                    </div>
                    <div
                      className={`${(test.month === currentMonthName && test.year === currentYear) || (test.month === startMonthName && test.year === fullOldestYear) ? 'hidden' : 'block'} absolute  left-[60%] top-[47px] z-10 h-[5000px] w-0.5 transform bg-[#E2E8F0]`}
                    />
                  </div>
                ))}
              </div>

              <div className='no-scrollbar max-h-screen overflow-scroll pl-4 pr-5 sm:pl-4 sm:pr-5 lg:pr-7'>
                <div className='relative flex flex-col items-end justify-end border-l-2 border-r-2 border-[#E2E8F0] pb-12 pt-10'>
                  {sortedDirectors.map((director, index) => {
                    const isExecutive = executiveTeamWithoutPromoters.some(
                      (executive: ExecutiveTeamMember) =>
                        executive.fullName === director.fullName
                    );
                    const directorUrl = `/director/${formatToUrl(director.fullName)}/${director.din}`;
                    const date = new Date(director.dateOfAppointment);
                    return (
                      <div
                        key={index}
                        className={`h-11 w-full max-w-full py-14 sm:py-10`}
                      >
                        <div className='inline-flex h-full w-full max-w-full flex-col items-start justify-start'>
                          <div className='relative inline-flex w-full max-w-full items-center justify-start gap-1 self-stretch'>
                            <div className='absolute right-0 flex w-full justify-end gap-1 whitespace-nowrap'>
                              <p className='flex w-full flex-col items-end justify-end gap-2'>
                                <span className='flex w-full translate-x-0 items-center justify-end'>
                                  <span
                                    className={`-z-10 h-[10px]  ${isExecutive ? 'bg-[#A9DC29]' : 'bg-[#7879FC]'}`}
                                    style={{
                                      width: `${latestCalculatePercentage(director.dateOfAppointment)}%`,
                                    }}
                                  ></span>
                                </span>
                                {director.din ? (
                                  <Link
                                    href={directorUrl}
                                    prefetch={false}
                                    className='z-20 flex flex-col items-end justify-end gap-1 whitespace-nowrap text-foreground hover:text-primary hover:underline sm:flex-row sm:items-center'
                                  >
                                    <span className='pr-0.5 font-open_sans text-xs font-semibold leading-7 sm:text-sm md:text-base'>
                                      {director.fullName.length > 0
                                        ? formatName(director.fullName)
                                        : '-'}
                                      ,
                                    </span>
                                    <span className='flex items-center justify-center gap-1 whitespace-nowrap'>
                                      <span className='whitespace-nowrap font-open_sans text-xs font-normal sm:text-sm  md:text-base'>
                                        {director.designation}
                                      </span>
                                      <span className='whitespace-nowrap font-open_sans text-xs font-normal sm:text-sm md:text-base'>
                                        {' '}
                                        (
                                        {isValid(date)
                                          ? format(date, 'dd-MMM-yyyy')
                                          : '-'}
                                        )
                                      </span>
                                      <RiArrowRightUpLine className='size-5 text-lg text-primary md:size-6' />
                                    </span>
                                  </Link>
                                ) : (
                                  <span className='z-20 flex flex-col items-end justify-end gap-1 whitespace-nowrap sm:flex-row sm:items-center'>
                                    <span className='pr-0.5 font-open_sans text-xs font-semibold leading-7 text-foreground sm:text-sm md:text-base'>
                                      {director.fullName.length > 0
                                        ? formatName(director.fullName)
                                        : '-'}
                                      ,
                                    </span>
                                    <span className='flex items-center justify-center gap-1 whitespace-nowrap'>
                                      <span className='whitespace-nowrap font-open_sans text-xs font-normal text-foreground sm:text-sm  md:text-base'>
                                        {director.designation}
                                      </span>
                                      <span className='whitespace-nowrap font-open_sans text-xs font-normal text-foreground sm:text-sm md:text-base'>
                                        {' '}
                                        (
                                        {isValid(date)
                                          ? format(date, 'dd-MMM-yyyy')
                                          : '-'}
                                        )
                                      </span>
                                      <RiArrowRightUpLine className='size-5 text-lg text-primary md:size-6' />
                                    </span>
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <GoogleAdUnit>
        <AdsBanner />
      </GoogleAdUnit> */}
    </section>
  );
};

export default Directors;
