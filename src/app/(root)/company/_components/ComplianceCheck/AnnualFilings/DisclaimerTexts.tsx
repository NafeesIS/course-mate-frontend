import Link from 'next/link';

const DisclaimerTextsAnnual = ({ companyType }: { companyType: string }) => {
  if (companyType === 'LLP') {
    return (
      <div className='mt-4 space-y-3 p-4 text-[13px] text-muted-foreground'>
        <div>
          <p className='flex flex-wrap gap-1.5 font-semibold'>
            <span className='text-[10px] font-semibold md:text-xs'>&loz;</span>{' '}
            For Form 11 for FY 2019-20:
          </p>
          <ul className='mt-1 list-disc pl-8'>
            <li>
              The original LLP Settlement Scheme was introduced vide General
              Circular No. 6/2020 on 4th March, 2020.
            </li>
            <li>
              This scheme came into force on 16th March, 2020 and remained in
              force up to 13th June, 2020.
            </li>
            <li>
              Defaulting LLPs that filed their pending documents by 13th June
              2020 were not required to pay additional fees (
              <Link
                href='https://www.mca.gov.in/Ministry/pdf/GeneralCircular06_04032020.pdf'
                prefetch={false}
                target='_blank'
                className='text-primary underline'
              >
                circular reference
              </Link>
              ).
            </li>
            <li>
              The scheme was then extended via General Circular No. 13/2020
              dated 30th March 2020, extending the due date to 30th September,
              2020 (
              <Link
                href='https://mca.gov.in/Ministry/pdf/Circular13_30032020.pdf'
                prefetch={false}
                target='_blank'
                className='text-primary underline'
              >
                circular reference
              </Link>
              ).
            </li>
            <li>
              Forms filed up to 31st August, 2020 were covered under this
              extension.
            </li>
            <li>
              Further, as per General Circular No. 31/2020 dated 28th September,
              2020, the scheme dated 30th March, 2020, was extended till 31st
              December, 2020 (
              <Link
                href='https://www.mca.gov.in/Ministry/pdf/GeneralCircularNo.31_28092020.pdf'
                target='_blank'
                prefetch={false}
                className='text-primary underline'
              >
                circular reference
              </Link>
              ).
            </li>
          </ul>
        </div>

        <div className='mt-2'>
          <p className='flex flex-wrap gap-1.5 font-semibold'>
            <span className='text-[8px] font-semibold md:text-[10px]'>
              &Dagger;
            </span>{' '}
            For Form 8 for FY 2020-21:
          </p>
          <ul className='mt-1 list-disc pl-8'>
            <li>
              The Ministry has decided to allow LLPs to file Form 8 (the
              Statement of Account and Solvency) for the Financial Year
              2020-2021 without paying additional fees up to 30th December,
              2021. This extension addresses challenges faced by LLPs due to the
              COVID-19 pandemic and aims to promote ease of compliance for
              Micro, Medium, and Small Enterprises. (
              <Link
                href='https://www.mca.gov.in/bin/dms/getdocument?mds=D6JwDgXJxJkSj9vnkrkNZw%253D%253D&type=open'
                prefetch={false}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary underline'
              >
                circular reference
              </Link>
              )
            </li>
          </ul>
        </div>

        <p className='inline-flex gap-1.5 font-semibold'>
          <span className='text-[9px] font-semibold md:text-xs'>#</span> MCA has
          upgraded from v2 to v3, resulting in the temporary unavailability of
          some public documents. Consequently, fees in these cases have been
          calculated manually as the challans paid during this period are not
          available.
        </p>
      </div>
    );
  }

  if (companyType === 'Company') {
    return (
      <div className='mt-4 space-y-2 text-[13px] text-muted-foreground'>
        <p className='text-sm font-bold underline'>For Form AOC-4 & MGT-7:</p>
        <p>
          <span>*</span> The compliance form codes listed above correspond to
          the current forms under the{' '}
          <span className='font-semibold'>Companies Act, 2013</span>. Under the
          erstwhile <span className='font-semibold'>Companies Act, 1956</span>,
          please note the following old form names:
        </p>
        <ul className='list-disc pl-8'>
          <li>
            <span className='font-semibold'>Form AOC-4</span> was previously
            known as <span className='font-semibold'>Form 23AC</span> (Balance
            Sheet) and <span className='font-semibold'>Form 23ACA</span> (Profit
            and Loss Account).
          </li>
          <li>
            <span className='font-semibold'>Form MGT-7</span> was previously
            known as <span className='font-semibold'>Form 20B</span>.
          </li>
        </ul>
      </div>
    );
  }
};

export default DisclaimerTextsAnnual;
