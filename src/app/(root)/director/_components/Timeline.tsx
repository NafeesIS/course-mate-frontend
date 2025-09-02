/* eslint-disable indent */
import { formatName, formatToUrl, toCamelCase } from '@/lib/formatters';
import { differenceInMonths, format, isValid, parseISO } from 'date-fns';
import Link from 'next/link';

const processCompanyData = (
  companyData: any,
  mcaSignatoryCessationMasterHistory: any
) => {
  const combinedData = [...companyData, ...mcaSignatoryCessationMasterHistory];

  return combinedData.map((company) => {
    const companyName =
      company.nameOfTheCompany || company.accountName || 'Unknown Company';
    const appointmentTime =
      company.currentDesignationDate || company.appointmentDate || null;
    const cessationTime = company.cessationDate || null;
    const designation = company.designation || 'Unknown Designation';
    const companyType = company.accountType;
    const cin = company.cin || company.cin_LLPIN || null;

    return {
      companyName,
      appointmentTime,
      cessationTime,
      designation,
      companyType,
      cin,
    };
  });
};
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
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[parseInt(monthNumber) - 1];
};

const convertToDate = (dateString: any) => {
  if (!dateString) {
    return null;
  }
  return new Date(dateString);
};

const Timeline = ({
  directorData,
  className,
}: {
  directorData: any;
  className?: string;
}) => {
  const { fullName, companyData, mcaSignatoryCessationMasterHistory } =
    directorData || {};

  const directorName = (fullName && toCamelCase(formatName(fullName))) || '-';

  const associatedCompanies =
    companyData.filter((company: any) => company.accountType === 'Company') ||
    [];
  const associatedLLPs =
    companyData.filter((company: any) => company.accountType === 'LLP') || [];

  // Create a set of unique company names to ensure each company is counted only once
  const uniqueAssociatedCompanyNames = new Set(
    associatedCompanies?.map((company: any) => company.nameOfTheCompany)
  );
  const totalCurrentAssociatedCompanies = uniqueAssociatedCompanyNames.size;

  const uniqueAssociatedLLPNames = new Set(
    associatedLLPs?.map((company: any) => company.nameOfTheCompany)
  );
  const totalCurrentAssociatedLLPs = uniqueAssociatedLLPNames.size;

  // Create a set of unique past company names
  const uniquePastCompanyNames = new Set(
    mcaSignatoryCessationMasterHistory?.map(
      (company: any) => company.accountName
    )
  );
  const totalPastCompanies = uniquePastCompanyNames.size;

  const allCompanies = processCompanyData(
    companyData,
    mcaSignatoryCessationMasterHistory
  );

  // Sort by appointmentTime
  const sortedCompanies = allCompanies.sort((a, b) => {
    const dateA: any = convertToDate(a.appointmentTime);
    const dateB: any = convertToDate(b.appointmentTime);

    if (!dateA) {
      return 1; // If dateA is null, it should come after other dates
    }
    if (!dateB) {
      return -1; // If dateB is null, it should come after other dates
    }

    // Return the difference in time (negative, zero, or positive)
    return dateA - dateB;
  });

  function combineCompaniesByTime(arr: any[]): any[] {
    const combinedCompanies: { [key: string]: any[] } = {};

    arr.forEach((entry: any) => {
      const key =
        entry.designation +
        entry.appointmentTime +
        '-' +
        (entry.cessationTime || 'null');

      if (!combinedCompanies[key]) {
        combinedCompanies[key] = [entry];
      } else {
        combinedCompanies[key].push(entry);
      }
    });

    const combinedArray: any[] = [];

    Object.values(combinedCompanies).forEach((entries: any[]) => {
      const chunkSize = 3;
      for (let i = 0; i < entries.length; i += chunkSize) {
        const chunk = entries.slice(i, i + chunkSize);
        const companyNames = chunk.map((e) => ({
          name: e.companyName,
          cin: e.cin,
        }));
        const designationCheck = chunk.every(
          (e) => e.designation === chunk[0].designation
        );
        combinedArray.push({
          companyName: companyNames,
          appointmentTime: chunk[0].appointmentTime,
          cessationTime: chunk[0].cessationTime,
          designation: chunk[0].designation,
          companyType: chunk[0].companyType,
          designationSame: designationCheck,
        });
      }
    });

    return combinedArray;
  }

  const newSortedArray = combineCompaniesByTime(sortedCompanies);

  const findOldestYearOfAppointment = (companies: any) => {
    if (!companies || companies.length === 0) {
      return null; // Return null if the directors array is empty or undefined
    }

    // Convert appointment dates to Date objects for comparison
    const appointmentDates = companies.map(
      (company: any) => new Date(company.appointmentTime)
    );

    // Find the oldest date among the appointment dates
    const oldestDate = new Date(Math.min(...appointmentDates));
    const oldestDateString = oldestDate.toISOString();

    return oldestDateString;
  };

  const oldestYearOfAppointment: any =
    findOldestYearOfAppointment(sortedCompanies);
  // Start with the oldest date
  const startDate = new Date(oldestYearOfAppointment);
  const fullOldestYear = startDate.getFullYear();

  const startMonthIndex = startDate.getMonth(); // Month index starting from 0
  const startMonthNumber = startMonthIndex + 1; // Add 1 to get the month number

  const startMonthName = getMonthName(startMonthNumber);

  // Start with the oldest date
  const startMobileDate = new Date(oldestYearOfAppointment);
  const currentDate = new Date();
  const stringCurrentDate = currentDate.toISOString();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth(); // Month index starting from 0
  const currentMonth = currentMonthIndex + 1; // Add 1 to get the month number
  const currentMonthName = getMonthName(currentMonth);

  // Initialize timeline array
  const timeline = [];
  const mobileTimeline = [];
  const calculateMonthsDifference = (startDate: any, currentDate: any) => {
    const start = startDate && parseISO(startDate);
    const current = currentDate && parseISO(currentDate);
    return differenceInMonths(current, start);
  };

  const monthsDiffReal = calculateMonthsDifference(
    oldestYearOfAppointment,
    stringCurrentDate
  );
  const monthsDiff = monthsDiffReal > 0 ? monthsDiffReal : monthsDiffReal + 1;
  function calculateProgress(milestoneDate: any) {
    // Calculate the total number of months between current date and destination date
    const totalMonths = monthsDiff;
    const newMilestoneDate = new Date(milestoneDate);

    // Calculate the number of months between current date and milestone date
    const milestoneMonths =
      (newMilestoneDate.getFullYear() - currentDate.getFullYear()) * 12 +
      newMilestoneDate.getMonth() -
      currentDate.getMonth();

    // Calculate the percentage of progress
    const percentage = (milestoneMonths / totalMonths) * 100;

    return percentage.toFixed(2); // Return the percentage rounded to 2 decimal places
  }

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

  const firstAppointment = sortedCompanies[0]; // First element after sorting
  const firstAppointmentYear =
    (firstAppointment?.appointmentTime &&
      convertToDate(firstAppointment.appointmentTime)?.getFullYear()) ||
    null;

  // Get the present year
  const presentYear = new Date().getFullYear();

  // Create an array of years from first appointment to present year
  const yearsArray = [];

  if (firstAppointmentYear && presentYear) {
    for (let year = firstAppointmentYear; year <= presentYear; year++) {
      yearsArray.push(year);
    }
  }

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

  const filteredTimeline = removeDuplicateEntries(timeline);
  const filteredMobileTimeline = removeDuplicateEntries(mobileTimeline);

  const calculatePercentagePastCompanies = (
    testStartDate: any,
    testEndDate: any
  ) => {
    // Calculate the total number of months between totalStartDate and totalEndDate
    const totalMonths = monthsDiff;

    const newTestStartDate = new Date(testStartDate);
    const newTestEndDate = new Date(testEndDate);

    // Calculate the number of months in the specified time range
    const diffMonths =
      (newTestEndDate.getFullYear() - newTestStartDate.getFullYear()) * 12 +
      newTestEndDate.getMonth() -
      newTestStartDate.getMonth() +
      1; // Adding 1 to include both start and end months
    // Calculate the percentage difference
    const percentage = (diffMonths / totalMonths) * 100;
    return percentage.toFixed(2); // Return the percentage rounded to 2 decimal places
  };
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
    <section className={className}>
      <div className='wrapper flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
        <h2 className='w-10/12 text-base font-semibold md:text-lg'>
          Timeline of {directorName}
        </h2>

        <div className='flex flex-col items-start gap-4 whitespace-nowrap text-xs font-medium sm:flex-row sm:items-center md:text-sm'>
          {/* current companies */}
          <div className='flex items-center gap-2'>
            <div className='h-4 w-7 rounded-sm bg-green-300 md:w-9'></div>
            <p>Current Companies ({totalCurrentAssociatedCompanies})</p>
          </div>

          {/* current llps */}
          <div className='flex items-center gap-2'>
            <div className='h-4 w-7 rounded-sm bg-purple-300 md:w-9'></div>
            <p>Current LLPs ({totalCurrentAssociatedLLPs})</p>
          </div>
          {/* past companies */}
          <div className='flex items-center gap-2'>
            <div className='h-4 w-7 rounded-sm bg-red-300 md:w-9'></div>
            <p>Past Companies ({totalPastCompanies})</p>
          </div>

          {/* half yearly */}
          <div className='flex items-center gap-2'>
            <div className='h-4 w-7 rounded-sm bg-slate-200 md:w-9'></div>
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
              {filteredTimeline.map((item: any, index: number) => (
                <div key={index} className='relative text-center'>
                  <div className='font-open_sans text-xs font-semibold leading-tight text-neutral-400 sm:h-12 md:h-14 md:text-sm lg:h-16 lg:text-base'>
                    {item.month === currentMonthName &&
                    item.year === currentYear ? (
                      <span className='flex flex-col lg:-translate-x-1'>
                        <span>{format(currentDate, 'dd MMM')}</span>{' '}
                        <span>{item.year}</span>
                      </span>
                    ) : (
                      <span className='flex flex-col'>
                        <span>{item.month}</span> <span>{item.year}</span>
                      </span>
                    )}
                  </div>
                  <div
                    className={`${(item.month === currentMonthName && item.year === currentYear) || (item.month === startMonthName.toString() && item.year === fullOldestYear) ? 'hidden' : 'block'} absolute  left-1/2 top-12 z-10 h-[30000px] w-0.5 transform bg-[#E2E8F0] md:top-14 lg:top-16`}
                  />
                </div>
              ))}
            </div>
            <div className='flex items-start justify-between gap-0 sm:hidden sm:gap-6 md:gap-8 lg:gap-10 xl:gap-14'>
              {filteredMobileTimeline.map((item: any, index: number) => (
                <div key={index} className='relative text-center'>
                  <div className='h-12 font-open_sans text-xs font-semibold leading-tight text-neutral-400 md:text-base'>
                    {item.month === currentMonthName &&
                    item.year === currentYear ? (
                      <span className='flex flex-col justify-center'>
                        <span>{format(currentDate, 'dd MMM')}</span>{' '}
                        <span>{item.year}</span>
                      </span>
                    ) : (
                      <span className='flex flex-col justify-center'>
                        <span>{item.month}</span> <span>{item.year}</span>
                      </span>
                    )}
                  </div>
                  <div
                    className={`${(item.month === currentMonthName && item.year === currentYear) || (item.month === startMonthName.toString() && item.year === fullOldestYear) ? 'hidden' : 'block'} absolute  left-[60%] top-[47px] z-10 h-[30000px] w-0.5 transform bg-[#E2E8F0]`}
                  />
                </div>
              ))}
            </div>

            <div className='no-scrollbar max-h-screen overflow-scroll pl-4 pr-5 sm:pl-4 sm:pr-5 lg:pr-7'>
              <div className='relative flex flex-col items-end justify-end gap-2 border-l-2 border-r-2 border-[#E2E8F0] pb-12 pt-10'>
                {newSortedArray.map((company, index) => {
                  const date = new Date(company.appointmentTime);
                  const cessationDate =
                    company.cessationTime === null
                      ? null
                      : new Date(company.cessationTime);
                  const progressParcent = calculateProgress(
                    company.appointmentTime
                  );

                  const intPercent = parseInt(progressParcent) + 7;
                  const maximumBarTranslate = -98;
                  const finalBarTranslate =
                    intPercent > maximumBarTranslate
                      ? intPercent
                      : maximumBarTranslate;
                  const minmumTranslate = 0.5;

                  const nameParcentFunction = (input: number): number => {
                    const finalOutput = input + 100;
                    return finalOutput;
                  };

                  const nameParcent: number = nameParcentFunction(
                    finalBarTranslate - 11.5
                  );

                  const finalTranslate =
                    nameParcent > 0.5 ? nameParcent : minmumTranslate;

                  return (
                    <div
                      key={index}
                      className={`h-full w-full max-w-full ${company.companyName.length > 1 ? 'py-[70px] sm:py-20' : 'py-16 sm:py-14'}`}
                    >
                      <div className='inline-flex h-full w-full max-w-full flex-col items-start justify-start'>
                        <div className='relative inline-flex w-full max-w-full items-center justify-start gap-1 self-stretch'>
                          <div className='absolute right-0 flex w-full justify-end gap-4 whitespace-nowrap'>
                            <div
                              className={`flex w-full flex-col items-end justify-end gap-2 overflow-hidden`}
                            >
                              <div
                                className={`flex w-full translate-x-0 items-center justify-start ${company.cessationTime === null ? 'justify-end' : 'justify-start pr-5'}`}
                                style={{
                                  transform:
                                    company.cessationTime === null
                                      ? `translateX(0)`
                                      : `translateX(${finalTranslate + 3 > 98 ? 98 : finalTranslate + 3}%)`, // Apply dynamic translation
                                }}
                              >
                                <span
                                  className={`-z-10 h-[10px] gap-4 ${company.cessationTime === null ? (company?.companyType === 'LLP' ? 'bg-purple-300' : 'bg-green-300') : 'bg-red-300'}`}
                                  style={{
                                    width:
                                      company.cessationTime === null
                                        ? `${latestCalculatePercentage(company.appointmentTime)}%`
                                        : `${calculatePercentagePastCompanies(company.appointmentTime, company.cessationTime)}%`,
                                  }}
                                ></span>
                              </div>
                              <div className='z-20 block w-full p-1 pl-1 sm:hidden'>
                                <p
                                  className={`z-20 flex flex-col justify-center gap-1 pb-5 ${company.cessationTime === null ? 'items-end' : ` max-w-full ${finalTranslate < 20 ? 'items-start' : finalTranslate > 70 ? 'items-end' : 'items-center'} whitespace-pre-wrap`}`}
                                >
                                  <span className='z-20 pr-0.5 font-open_sans text-[11px] font-semibold leading-7 text-foreground sm:text-xs'>
                                    From{' '}
                                    {isValid(date)
                                      ? format(date, 'dd MMM yyyy')
                                      : ' - '}
                                    {cessationDate == null
                                      ? ' '
                                      : ` To ${format(cessationDate, 'dd MMM yyyy')}`}
                                    {':'} {company.designation}
                                  </span>
                                  {company.companyName.map(
                                    (item: any, index: any) => {
                                      const companyUrl = `/company/${formatToUrl(item.name)}/${item.cin}?tab=about`;

                                      // Render the item name in the JSX
                                      return (
                                        <span key={index}>
                                          {item.cin === null ? (
                                            <span
                                              key={index}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-[11px] font-normal leading-relaxed text-foreground lg:text-sm'
                                            >
                                              {item.name}
                                            </span>
                                          ) : (
                                            <Link
                                              href={companyUrl}
                                              prefetch={false}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-[11px] font-normal leading-relaxed text-foreground             hover:text-primary hover:underline lg:text-sm'
                                            >
                                              {item.name}
                                            </Link>
                                          )}
                                        </span>
                                      );
                                    }
                                  )}
                                </p>
                              </div>
                              <div
                                className='z-20 hidden w-full p-1 sm:block md:hidden'
                                style={{
                                  transform:
                                    company.cessationTime === null
                                      ? `translateX(0)`
                                      : `translateX(${finalTranslate > 53.5 ? 53.5 : finalTranslate}%)`,
                                }}
                              >
                                <p
                                  className={`z-20 flex flex-col justify-center gap-1 pb-5 ${company.cessationTime === null ? 'items-end' : ' max-w-[300px] items-start whitespace-pre-wrap'}`}
                                >
                                  <span className='z-20 pr-0.5 font-open_sans text-[11px] font-semibold leading-7 text-foreground sm:text-xs'>
                                    {isValid(date)
                                      ? format(date, 'dd MMM yyyy')
                                      : ' - '}
                                    {cessationDate == null
                                      ? ' '
                                      : ` - ${format(cessationDate, 'dd MMM yyyy')}`}
                                    {':'} {company.designation}
                                  </span>
                                  {company.companyName.map(
                                    (item: any, index: any) => {
                                      const companyUrl = `/company/${formatToUrl(item.name)}/${item.cin}?tab=about`;

                                      // Render the item name in the JSX
                                      return (
                                        <span key={index}>
                                          {item.cin === null ? (
                                            <span
                                              key={index}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-xs font-normal leading-relaxed text-foreground lg:text-sm'
                                            >
                                              {item.name}
                                            </span>
                                          ) : (
                                            <Link
                                              href={companyUrl}
                                              prefetch={false}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-xs font-normal leading-relaxed text-foreground             hover:text-primary hover:underline lg:text-sm'
                                            >
                                              {item.name}
                                            </Link>
                                          )}
                                        </span>
                                      );
                                    }
                                  )}
                                </p>
                              </div>
                              <div
                                className='z-20 hidden w-full p-1 md:block lg:hidden'
                                style={{
                                  transform:
                                    company.cessationTime === null
                                      ? `translateX(0)`
                                      : `translateX(${finalTranslate > 61 ? 61 : finalTranslate}%)`,
                                }}
                              >
                                <p
                                  className={`z-20 flex flex-col justify-center gap-1 pb-5 ${company.cessationTime === null ? 'items-end' : ' max-w-[300px] items-start whitespace-pre-wrap'}`}
                                >
                                  <span className='z-20 pr-0.5 font-open_sans text-[11px] font-semibold leading-7 text-foreground sm:text-xs'>
                                    {isValid(date)
                                      ? format(date, 'dd MMM yyyy')
                                      : ' - '}
                                    {cessationDate == null
                                      ? ' '
                                      : ` - ${format(cessationDate, 'dd MMM yyyy')}`}
                                    {':'} {company.designation}
                                  </span>
                                  {company.companyName.map(
                                    (item: any, index: any) => {
                                      const companyUrl = `/company/${formatToUrl(item.name)}/${item.cin}?tab=about`;

                                      // Render the item name in the JSX
                                      return (
                                        <span key={index}>
                                          {item.cin === null ? (
                                            <span
                                              key={index}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-xs font-normal leading-relaxed text-foreground lg:text-sm'
                                            >
                                              {item.name}
                                            </span>
                                          ) : (
                                            <Link
                                              href={companyUrl}
                                              prefetch={false}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-xs font-normal leading-relaxed text-foreground             hover:text-primary hover:underline lg:text-sm'
                                            >
                                              {item.name}
                                            </Link>
                                          )}
                                        </span>
                                      );
                                    }
                                  )}
                                </p>
                              </div>
                              <div
                                className='z-20 hidden w-full p-1 lg:block xl:hidden'
                                style={{
                                  transform:
                                    company.cessationTime === null
                                      ? `translateX(0)`
                                      : `translateX(${finalTranslate > 66.5 ? 66.5 : finalTranslate}%)`,
                                }}
                              >
                                <p
                                  className={`z-20 flex flex-col justify-center gap-1 pb-5 ${company.cessationTime === null ? 'items-end' : ' max-w-[300px] items-start whitespace-pre-wrap'}`}
                                >
                                  <span className='z-20 pr-0.5 font-open_sans text-[11px] font-semibold leading-7 text-foreground sm:text-xs lg:text-sm'>
                                    {isValid(date)
                                      ? format(date, 'dd MMM yyyy')
                                      : ' - '}
                                    {cessationDate == null
                                      ? ' '
                                      : ` - ${format(cessationDate, 'dd MMM yyyy')}`}
                                    {':'} {company.designation}
                                  </span>
                                  {company.companyName.map(
                                    (item: any, index: any) => {
                                      const companyUrl = `/company/${formatToUrl(item.name)}/${item.cin}?tab=about`;

                                      // Render the item name in the JSX
                                      return (
                                        <span key={index}>
                                          {item.cin === null ? (
                                            <span
                                              key={index}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-xs font-normal leading-relaxed text-foreground lg:text-sm'
                                            >
                                              {item.name}
                                            </span>
                                          ) : (
                                            <Link
                                              href={companyUrl}
                                              prefetch={false}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-xs font-normal leading-relaxed text-foreground             hover:text-primary hover:underline lg:text-sm'
                                            >
                                              {item.name}
                                            </Link>
                                          )}
                                        </span>
                                      );
                                    }
                                  )}
                                </p>
                              </div>
                              <div
                                className='z-20 hidden w-full p-1 xl:block'
                                style={{
                                  transform:
                                    company.cessationTime === null
                                      ? `translateX(0)`
                                      : `translateX(${finalTranslate > 74 ? 74 : finalTranslate}%)`,
                                }}
                              >
                                <p
                                  className={`z-20 flex flex-col justify-center gap-1 pb-5 ${company.cessationTime === null ? 'items-end' : ' max-w-[350px] items-start whitespace-pre-wrap'}`}
                                >
                                  <span className='z-20 pr-0.5 font-open_sans text-xs font-semibold leading-7 text-foreground lg:text-sm'>
                                    {isValid(date)
                                      ? format(date, 'dd MMM yyyy')
                                      : ' - '}
                                    {cessationDate == null
                                      ? ' '
                                      : ` - ${format(cessationDate, 'dd MMM yyyy')}`}
                                    {':'} {company.designation}
                                  </span>
                                  {company.companyName.map(
                                    (item: any, index: any) => {
                                      const companyUrl = `/company/${formatToUrl(item.name)}/${item.cin}?tab=about`;

                                      // Render the item name in the JSX
                                      return (
                                        <span key={index}>
                                          {item.cin === null ? (
                                            <span
                                              key={index}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-xs font-normal leading-relaxed text-foreground lg:text-sm'
                                            >
                                              {item.name}
                                            </span>
                                          ) : (
                                            <Link
                                              href={companyUrl}
                                              prefetch={false}
                                              className='z-20 flex max-w-80 flex-wrap items-center whitespace-pre-wrap font-open_sans text-xs font-normal leading-relaxed text-foreground             hover:text-primary hover:underline lg:text-sm'
                                            >
                                              {item.name}
                                            </Link>
                                          )}
                                        </span>
                                      );
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
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
    </section>
  );
};

export default Timeline;
