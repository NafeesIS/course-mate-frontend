import Image from 'next/image';
import aocForm from '../../../../../../public/assets/business-services/annual-compliance-plc/aoc_form.png';
import mgtForm from '../../../../../../public/assets/business-services/annual-compliance-plc/mgt_form.png';
import { RoundArrowAnnualLLPSvg } from '../../annual-compliance-llp/_data/data';
import { RoundArrowAnnualPLCSvgOne } from '../_data/data';

const AnnualCompliance = () => {
  return (
    <div className='wrapper mb-20 text-center'>
      <h2 className='mx-auto mb-10 px-4 pt-14 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Annual compliance for{' '}
        <span className='italic text-primary'>FY 23-24</span>
      </h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6'>
        <div className='rounded-md border p-4 text-start duration-200 hover:shadow-lg'>
          <p className='text-sm font-medium lg:text-base'>
            Companies incorporated
          </p>
          <p className='mb-2 text-sm font-semibold lg:text-base'>
            on or before 31st December 2023
          </p>
          <p className='text-muted-foreground-darker text-xs font-normal lg:text-sm'>
            They need to prepare their Financial Statements, Annual Return for
            the 2023-2024 financial year. They must file their Financial
            Statements in e-Form AOC-4 and their Annual Returns in e-Form MGT-7
            or MGT-7A on the due dates mentioned below.
          </p>
        </div>
        <div className='rounded-md border p-4 text-start duration-200 hover:shadow-lg'>
          <p className='text-sm font-medium lg:text-base'>
            Companies incorporated
          </p>
          <p className='mb-2 text-sm font-semibold lg:text-base'>
            on or after 1st January 2024
          </p>
          <p className='text-muted-foreground-darker text-xs font-normal lg:text-sm'>
            They can prepare their Financial Statements for up to 15 months.
            Their financial year will start from the date of incorporation and
            end on March 31, 2025. These companies must file their Financial
            Statements in e-Form AOC-4 and file their Annual Returns in e-Form
            MGT-7 or MGT-7A in the following year.
          </p>
        </div>
      </div>
      <div className='mt-4 flex flex-col items-center justify-between gap-8 rounded-md border bg-muted p-6 md:flex-row lg:gap-12 xl:mt-6 xl:gap-16'>
        <div>
          <h4 className='flex flex-row items-start gap-1.5 whitespace-nowrap text-start text-xl font-medium leading-snug sm:mb-3 sm:items-center md:flex-col md:items-start md:justify-start md:text-2xl md:leading-snug'>
            <span className='md:-mb-2'>Information about</span>{' '}
            <span className=' flex flex-col items-center font-bold sm:flex-row sm:gap-1'>
              <span>AOC-4 form</span>
              <RoundArrowAnnualLLPSvg />
            </span>
          </h4>
          <Image src={aocForm} alt='aocForm' quality={100} />
        </div>
        <ul className='ml-3 mr-auto max-w-xl list-disc space-y-2 text-start text-sm sm:ml-5  lg:space-y-4 lg:text-base'>
          <li>
            AOC-4 is a form that must be filed by every company to submit its
            Financial Statements to the Registrar of Companies (ROC).
          </li>
          <li>
            Every company must file this form within 30 days from the conclusion
            of the Annual General Meeting (AGM).
          </li>
          <li>
            The form should be signed by the Director and the Chief Financial
            Officer (CFO), if applicable, or by the Company Secretary.
          </li>
          <li>
            Required attachments include the Financial Statements, Board Report,
            Auditors Report, Statement of Subsidiaries/Associate Companies, and
            if applicable, CSR Report.
          </li>
        </ul>
      </div>
      <div className='mt-4 flex flex-col items-center justify-between gap-8 rounded-md border bg-muted p-6 md:flex-row-reverse xl:mt-6'>
        <div>
          <h4 className='mb-1.5 flex flex-col items-start whitespace-nowrap text-start text-xl font-medium leading-snug sm:mb-3 sm:flex-row sm:items-center sm:gap-1.5 md:flex-col md:items-start md:justify-start md:text-2xl md:leading-snug'>
            <span className='md:-mb-2'>Information about</span>{' '}
            <span className='-mt-1 flex flex-row items-center gap-1 font-bold sm:-mt-0'>
              <span>MGT-7 or 7A form</span>
              <RoundArrowAnnualPLCSvgOne />
            </span>
          </h4>
          <Image src={mgtForm} alt='mgtForm' quality={100} />
        </div>
        <ul className='ml-3 max-w-xl list-disc space-y-2 text-start text-sm sm:ml-5 lg:space-y-4 lg:text-base'>
          <li>
            MGT-7 or 7A is the form through which companies shall file their
            Annual Return with the Registrar of Companies (ROC).
          </li>
          <li>
            This form contains details about the company’s shareholders,
            directors, key managerial personnel, indebtedness, corporate
            governance disclosures, and other statutory information.
          </li>
          <li>
            It must be filed within 60 days from the date of the Annual General
            Meeting (AGM) or from the due date if the AGM is not held.
          </li>
          <li>
            MGT-7A is a simplified version of MGT-7, applicable for One Person
            Companies (OPCs) and Small Companies, to make the filing process
            easier for them.
          </li>
          <li>
            The form must be digitally signed by a Director and the Company
            Secretary, or if no Company Secretary is present and by a Director.
          </li>
          <li>
            Required attachments include list of shareholders, list of debenture
            holders, list of directors and if applicable MGT-8.
          </li>
        </ul>
      </div>
      <div className='mt-4 lg:mt-6'>
        <p className='mb-2 text-start text-base font-semibold lg:text-lg'>
          Due date for companies Incorporated on or before{' '}
          <span className='font-bold italic'>31st December, 2022</span>
        </p>
        <div className='no-scrollbar w-full overflow-scroll'>
          <div className='mx-auto flex w-full min-w-[730px] items-center justify-between text-start'>
            <div className='w-[33%] border xl:w-[45%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base xl:h-10'>
                Compliance
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:h-[52px]  lg:text-sm xl:h-10'>
                Form for filing Financial Statement and other documents with the
                Registrar
              </p>
              <p className='h-12 w-full p-2 text-xs  lg:text-sm xl:h-10'>
                Form for filing Annual Return by a company
              </p>
            </div>
            <div className='w-[19%] border xl:w-[15%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base xl:h-10'>
                Form
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:h-[52px]  lg:text-sm xl:h-10'>
                ACO-4
              </p>
              <p className='h-12 w-full p-2 text-xs  lg:text-sm xl:h-10'>
                MGT-7-7A
              </p>
            </div>
            <div className='w-[20%] border xl:w-[17%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base xl:h-10'>
                Timeline
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:h-[52px]  lg:text-sm xl:h-10'>
                30 Days from AGM
              </p>
              <p className='h-12 w-full p-2 text-xs  lg:text-sm xl:h-10'>
                60 Days from AGM
              </p>
            </div>
            <div className='w-[28%] border xl:w-[23%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base xl:h-10'>
                Due Date of Form Filing
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:h-[52px]  lg:text-sm xl:h-10'>
                30th October, 2024{' '}
                <span className='ml-1 h-4 rounded-full border border-[#FD216A] px-2 py-0.5 text-[8px] text-[#FD216A] lg:text-[10px]'>
                  Latest
                </span>
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:text-sm xl:h-10'>
                29th November, 2024
                <span className='ml-1 h-4 rounded-full border border-[#FD216A] px-2 py-0.5 text-[8px] text-[#FD216A] lg:text-[10px]'>
                  Latest
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4 lg:mt-6'>
        <p className='mb-2 text-start text-base font-semibold lg:text-lg'>
          Due date for companies Incorporated on or after{' '}
          <span className='font-bold italic'>
            1st January, 2023 to 31st December, 2023
          </span>
        </p>
        <div className='no-scrollbar w-full overflow-scroll'>
          <div className='mx-auto flex w-full min-w-[730px] items-center justify-between text-start'>
            <div className='w-[33%] border xl:w-[45%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base xl:h-10'>
                Compliance
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:h-[52px]  lg:text-sm xl:h-10'>
                Form for filing Financial Statement and other documents with the
                Registrar
              </p>
              <p className='h-12 w-full p-2 text-xs  lg:text-sm xl:h-10'>
                Form for filing Annual Return by a company
              </p>
            </div>
            <div className='w-[19%] border xl:w-[15%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base xl:h-10'>
                Form
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:h-[52px]  lg:text-sm xl:h-10'>
                ACO-4
              </p>
              <p className='h-12 w-full p-2 text-xs  lg:text-sm xl:h-10'>
                MGT-7-7A
              </p>
            </div>
            <div className='w-[20%] border xl:w-[17%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base xl:h-10'>
                Timeline
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:h-[52px]  lg:text-sm xl:h-10'>
                30 Days from AGM
              </p>
              <p className='h-12 w-full p-2 text-xs  lg:text-sm xl:h-10'>
                60 Days from AGM
              </p>
            </div>
            <div className='w-[28%] border xl:w-[23%]'>
              <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base xl:h-10'>
                Due Date of Form Filing
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:h-[52px]  lg:text-sm xl:h-10'>
                29th January, 2025{' '}
                {/* <span className='ml-1 h-4 rounded-full border border-[#FD216A] px-2 py-0.5 text-[8px] text-[#FD216A] lg:text-[10px]'>
                  Latest
                </span> */}
              </p>
              <p className='h-12 w-full border-b p-2 text-xs lg:text-sm xl:h-10'>
                01st March, 2025
                {/* <span className='ml-1 h-4 rounded-full border border-[#FD216A] px-2 py-0.5 text-[8px] text-[#FD216A] lg:text-[10px]'>
                  Latest
                </span> */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualCompliance;
