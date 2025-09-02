import Image from 'next/image';
import formEleven from '../../../../../../public/assets/business-services/annual-compliance-llp/form11.png';
import formEight from '../../../../../../public/assets/business-services/annual-compliance-llp/form8.png';
import { RoundArrowAnnualLLPSvg } from '../_data/data';

const AnnualComplianceLLP = () => {
  return (
    <div className='wrapper mb-20 text-center'>
      <h2 className='mx-auto mb-8 px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Annual compliance for{' '}
        <span className='italic text-primary'>FY 23-24</span>
      </h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6'>
        <div className='rounded-md border p-4 text-start duration-200 hover:shadow-lg'>
          <p className='text-sm font-medium lg:text-base'>LLP incorporated</p>
          <p className='mb-2 text-sm font-semibold lg:text-base'>
            on or before 30th September 2023
          </p>
          <p className='text-muted-foreground-darker text-xs font-normal lg:text-sm'>
            They are required to file their Statement of Account & Solvency
            (Form-8) and Annual Return (Form-11) before the due dates mentioned
            below.
          </p>
        </div>
        <div className='rounded-md border p-4 text-start duration-200 hover:shadow-lg'>
          <p className='text-sm font-medium lg:text-base'>LLP incorporated</p>
          <p className='mb-2 text-sm font-semibold lg:text-base'>
            on or after 01st October 2023
          </p>
          <p className='text-muted-foreground-darker text-xs font-normal lg:text-sm'>
            They can prepare their financial statements for 18 months and file
            their Statement of Account & Solvency (Form-8) and Annual Return
            (Form-11) next year.
          </p>
        </div>
      </div>
      <div className='mt-4 flex flex-col items-center justify-between gap-8 rounded-md border bg-muted p-6 md:flex-row lg:gap-12 xl:mt-6 xl:gap-16'>
        <div>
          <h4 className='flex flex-row items-start gap-1.5 whitespace-nowrap text-start text-xl font-medium leading-snug sm:mb-3 sm:items-center md:items-start md:justify-start md:text-2xl md:leading-snug'>
            <span className='md:-mb-2'>Information about</span>{' '}
            <span className=' flex flex-col items-center font-bold sm:flex-row sm:gap-1'>
              <span>Form-11</span>
              <RoundArrowAnnualLLPSvg />
            </span>
          </h4>
          <Image src={formEleven} alt='formEleven' quality={100} />
        </div>
        <ul className='ml-3 mr-auto max-w-xl list-disc space-y-2 text-start text-sm sm:ml-5  lg:space-y-4 lg:text-base'>
          <li>
            Every Limited Liability Partnership (LLP) registered under the Act,
            shall file its Annual Return in Form-11.
          </li>
          <li>
            Every LLP would be required to file an Annual Return in Form 11 with
            ROC within 60 days of the end of the financial year. The annual
            return will be available for public inspection on payment of
            prescribed fees to the Registrar.
          </li>
          <li>
            It contains the details like number of the Partners, Designated
            Partners or Body Corporate, their contribution, change in the
            Partner during a year, details of penalty, and other statutory
            details.
          </li>
          <li>
            Form shall be signed by Designated Partners and if the turnover or
            contribution exceeds the prescribed limit then shall be certified by
            the Professional.
          </li>
        </ul>
      </div>
      <div className='mt-4 flex flex-col items-center justify-between gap-8 rounded-md border bg-muted p-6 md:flex-row-reverse xl:mt-6'>
        <div>
          <h4 className='flex flex-row items-start gap-1.5 whitespace-nowrap text-start text-xl font-medium leading-snug sm:mb-3 sm:items-center md:flex-col md:items-start md:justify-start md:text-2xl md:leading-snug'>
            <span className='md:-mb-2'>Information about</span>{' '}
            <span className=' flex flex-col items-center font-bold sm:flex-row sm:gap-1'>
              <span>Form-8</span>
              <RoundArrowAnnualLLPSvg />
            </span>
          </h4>
          <Image src={formEight} alt='formEight' quality={100} />
        </div>
        <ul className='ml-3 max-w-xl list-disc space-y-2 text-start text-sm sm:ml-5 lg:space-y-4 lg:text-base'>
          <li>
            Every Limited Liability Partnership (LLP) registered under the Act,
            shall file its Statement of Accounts and Solvency in Form-8.
          </li>
          <li>
            Every LLP would be required to file an Statement of Accounts and
            Solvency in Form-8 with ROC within 30 days from the end of 6 months
            of the financial year.
          </li>
          <li>
            Form-8 contents declaration of Solvency and Statement of Accounts
            and financial position of the LLP.
          </li>
          <li>
            If the contribution exceeds Rs. 25 lakhs or turnover exceeds Rs. 40
            lakhs the form must be certified by the Practicing Chartered
            Accountant, Cost Accountant, or Company Secretary.
          </li>
          <li>The form shall be signed by two Designated Partners of LLP.</li>
          <li>
            Duly signed Audited Financial Statements shall be attached to the
            Form-8.
          </li>
        </ul>
      </div>
      <div className='mt-4 lg:mt-6'>
        <p className='mb-2 text-start text-base font-semibold lg:text-lg'>
          Due date for companies Incorporated on or after{' '}
          <span className='font-bold italic'>
            1st January, 2023 to 31st December, 2023
          </span>
        </p>
        <div className='no-scrollbar w-full overflow-scroll'>
          <div className='mx-auto flex w-full min-w-[550px] items-center justify-between text-start'>
            <div className='w-[35%] border sm:w-[41%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
                Compliance
              </p>
              <p className='h-12 w-full border-b p-2 text-xs sm:h-auto lg:text-sm'>
                Form for filing Annual Return
              </p>
              <p className='h-12 w-full p-2 text-xs md:h-auto lg:text-sm'>
                Form for filing Statement of Account & Solvency
              </p>
            </div>
            <div className='w-[25%] border sm:w-[24%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
                Form
              </p>
              <p className='h-12 w-full border-b p-2 text-xs sm:h-auto lg:text-sm'>
                Form-11
              </p>
              <p className='h-12 w-full p-2 text-xs md:h-auto lg:text-sm'>
                Form-8
              </p>
            </div>
            <div className='w-[40%] border sm:w-[35%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
                Due Date of Form Filing
              </p>
              <p className='h-12 w-full border-b p-2 text-xs sm:h-auto lg:text-sm'>
                30th May, 2024{' '}
              </p>
              <p className='h-12 w-full px-2 py-[7.5px] text-xs md:h-auto lg:text-sm'>
                30th September, 2025{' '}
                <span className='ml-1 h-4 rounded-full border border-[#FD216A] px-2 py-0.5 text-[8px] text-[#FD216A] lg:text-[10px]'>
                  Latest
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualComplianceLLP;
