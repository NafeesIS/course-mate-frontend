import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ChargesChartWrapper from './ChargesChartWrapper';
import ChargesTableWrapper from './ChargesTableWrapper';
import OpenChargeTooltip from './OpenChargeTooltip';
import SatisfiedChargeTooltip from './SatisfiedChargeTooltip';

const Charges = ({ chargeDetails }: any) => {
  const {
    totalCharges,
    totalSatisfiedCharges,
    totalChargeHolders,
    satisfiedChargeHolders,
    totalOpenChargeAmount,
    totalSatisfiedChargeAmount,
    chargesDetails,
    chargeOverview,
  } = chargeDetails.data[0];

  const formatAmount = (amount: any) => {
    // Check if the input is a number
    if (typeof amount !== 'number') {
      throw new Error('Input must be a number');
    }

    // Check if the input is a valid number (not NaN or Infinity)
    if (!isFinite(amount)) {
      throw new Error('Input must be a finite number');
    }

    let formattedAmount = '';
    if (amount >= 10000000) {
      // Convert amount to crores
      const crores = amount / 10000000;
      formattedAmount = `${crores.toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      // Convert amount to lakhs
      const lakhs = amount / 100000;
      formattedAmount = `${lakhs.toFixed(2)} Lakh`;
    } else {
      // Use the amount as is
      formattedAmount = `${amount.toFixed(2)}`;
    }

    return formattedAmount;
  };

  const formattedOpenChargeAmount = formatAmount(totalOpenChargeAmount);
  const formattedSatisfiedChargeAmount = formatAmount(
    totalSatisfiedChargeAmount
  );

  const data = [
    { name: 'Open Charges', value: totalOpenChargeAmount },
    { name: 'Satisfied Charges', value: totalSatisfiedChargeAmount },
  ];

  return (
    <section className='mt-8'>
      <div>
        <h1 className='text-lg font-semibold'>Charges Overview</h1>
        <p className='mt-3 text-sm leading-relaxed'>{chargeOverview}</p>
      </div>
      <div className='mt-10 flex w-full flex-col justify-between gap-8 md:flex-row md:items-center'>
        <div className='flex w-full flex-row justify-center gap-5 sm:gap-9 md:w-[75%] md:flex-col lg:w-[78%] xl:w-[75%]'>
          <div className='flex w-[44%] flex-col items-center gap-2 md:w-full md:flex-row'>
            <Card className='w-full max-w-full rounded-md px-1 py-3 text-center sm:px-3 sm:py-7 md:min-w-[25%] md:max-w-[30%] md:text-start lg:min-w-0 lg:max-w-[31%] lg:px-6 lg:py-8 xl:py-7'>
              <p className='mx-auto max-w-20 text-sm font-normal sm:max-w-full lg:text-base'>
                Total Charges
              </p>
              <p className='pt-3 text-3xl font-extrabold text-primary md:text-4xl xl:pt-5'>
                {totalCharges}
              </p>
            </Card>
            <p className='text-5xl font-semibold'>-</p>
            <Card className='w-full max-w-full rounded-md px-1 py-3 text-center sm:px-3 sm:py-7 md:min-w-[25%] md:max-w-[30%] md:text-start lg:min-w-0 lg:max-w-[31%] lg:px-6 lg:py-8 xl:py-7'>
              <div className='mx-auto flex max-w-20 flex-wrap items-center justify-center text-sm font-normal sm:max-w-full md:flex-nowrap md:justify-start md:whitespace-nowrap md:px-0 lg:text-base'>
                <span>Satisfied </span>{' '}
                <span className='flex items-center gap-1 pl-[3px]'>
                  Charges
                  <SatisfiedChargeTooltip />
                </span>
              </div>
              <p className='pt-3 text-3xl font-extrabold text-red-500 md:text-4xl xl:pt-5'>
                {totalSatisfiedCharges}
              </p>
            </Card>
            <p className='text-3xl font-semibold'>=</p>
            <Card className='w-full max-w-full rounded-md px-1 py-3 text-center sm:px-3 sm:py-7 md:min-w-[25%] md:max-w-[30%] md:text-start lg:min-w-0 lg:max-w-[31%] lg:px-6 lg:py-8 xl:py-7'>
              <div className='mx-auto flex max-w-20 flex-wrap items-center justify-center gap-1 text-sm font-normal sm:max-w-full md:justify-start md:px-0 lg:text-base'>
                <span>Open</span>{' '}
                <span className='flex items-center gap-1'>
                  Charges
                  <OpenChargeTooltip />
                </span>
              </div>
              <p className='pt-3 text-3xl font-extrabold text-[#22C55E] md:text-4xl xl:pt-5'>
                {totalCharges - totalSatisfiedCharges}
              </p>
            </Card>
          </div>

          <div className='flex w-[44%] flex-col items-center gap-2 md:w-full md:flex-row'>
            <Card className='w-full max-w-full rounded-md px-1 py-3 pr-0 text-center sm:px-3 sm:py-7 md:min-w-[25%] md:max-w-[30%] md:pr-[36.9px] md:text-start lg:min-w-0 lg:max-w-[31%] lg:px-6 lg:py-8 lg:pr-0 xl:py-7'>
              <p className='mx-auto max-w-28 text-sm font-normal sm:max-w-full lg:text-base'>
                Total Charge Holders
              </p>
              <p className='pt-3 text-3xl font-extrabold text-primary md:text-4xl xl:pt-5'>
                {totalChargeHolders}
              </p>
            </Card>
            <p className='text-5xl font-semibold'>-</p>
            <Card className='w-full max-w-full rounded-md px-1 py-3 text-center sm:px-3 sm:py-7 md:min-w-[25%] md:max-w-[30%] md:px-3 md:text-start lg:min-w-0 lg:max-w-[31%]  lg:px-6 lg:py-8 xl:py-7'>
              <p className='mx-auto max-w-28 text-sm font-normal sm:max-w-full lg:whitespace-nowrap lg:text-base'>
                Satisfied Charge Holders
              </p>
              <p className='pt-3 text-3xl font-extrabold text-red-500 md:text-4xl xl:pt-5'>
                {satisfiedChargeHolders}
              </p>
            </Card>
            <p className='text-3xl font-semibold'>=</p>
            <Card className='w-full max-w-full rounded-md px-1 py-3 pr-0 text-center sm:px-3 sm:py-7 md:min-w-[25%] md:max-w-[30%] md:pr-[34.4px] md:text-start lg:min-w-0 lg:max-w-[31%] lg:px-6 lg:py-8 lg:pr-0 xl:py-7'>
              <p className='mx-auto max-w-28 text-sm font-normal sm:max-w-full lg:whitespace-nowrap lg:text-base'>
                Open Charge Holders
              </p>
              <p className='pt-[14px] text-3xl font-extrabold text-[#22C55E] sm:pt-3 md:text-4xl xl:pt-5'>
                {totalChargeHolders - satisfiedChargeHolders}
              </p>
            </Card>
          </div>
        </div>

        <div className='mx-auto flex w-full max-w-80 flex-col justify-center rounded-md border bg-card px-4 py-4 text-card-foreground shadow md:w-[23%] md:max-w-[23%] lg:w-[21%] xl:w-[23%]'>
          <p className='text-center'>
            <span className='text-sm font-bold lg:text-base xl:text-lg'>
              Amount
            </span>{' '}
            (in ₹)
          </p>
          <div className='flex justify-center'>
            <ChargesChartWrapper data={data} />
          </div>
          <div className='flex flex-col items-center justify-start gap-1.5 md:items-start lg:items-center'>
            <div className='flex -translate-x-1 items-start justify-center gap-1.5 text-sm md:-translate-x-0 md:justify-start lg:-translate-x-[5px] lg:justify-center'>
              <p className='mt-1 size-4 rounded-full bg-[#38bdf8]'></p>
              <div className='flex flex-col gap-1'>
                <p className='font-semibold'>Open Charges</p>
                <p>₹{formattedOpenChargeAmount}</p>
              </div>
            </div>
            <div className='mt-2 flex translate-x-1.5 items-start justify-center gap-1.5 text-sm md:translate-x-0 md:justify-start lg:translate-x-[5px] lg:justify-center xl:translate-x-[6.3px]'>
              <p className='mt-1 size-4 rounded-full bg-[#86efac]'></p>
              <div className='flex flex-col gap-1'>
                <p className='font-semibold'>Satisfied Charges</p>
                <p>₹{formattedSatisfiedChargeAmount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className='mb-8 mt-10 md:mb-10 md:mt-12' />

      {/* <GoogleAdUnit>
        <AdsBanner />
      </GoogleAdUnit> */}

      <div>
        <h1 className='mb-3 text-lg font-semibold'>Overall Charges details</h1>
        <p className='mb-2 text-sm leading-relaxed md:mb-0'>
          A comprehensive overview detailing all charges associated with the
          entity, including the date when the charge was created or registered,
          the current status of the charge, the amount associated with it, and
          the entity holding the charge.
        </p>
        <ChargesTableWrapper data={chargesDetails} />
      </div>

      {/* <GoogleAdUnit>
        <AdsBanner />
      </GoogleAdUnit> */}
    </section>
  );
};

export default Charges;
