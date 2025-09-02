import Image from 'next/image';
import light from '../../../../../../public/assets/business-services/plc-registration/light.png';
const LLPPartnersKYC = () => {
  return (
    <div className='wrapper mb-16 mt-32 text-center'>
      <h2 className='mx-auto mb-6 px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Due date for{' '}
        <span className='italic text-primary'>Partners KYC for FY 23-24</span>
      </h2>
      <div className='mb-4 pl-4 lg:mb-6'>
        <ul className='text-muted-foreground-darker list-disc space-y-2 text-start text-xs lg:text-sm'>
          <li>
            Every Partner or Designated Partner holding a DIN must complete the
            KYC (Know Your Customer) process annually by filing Form DIR-3 KYC
            or Web KYC.
          </li>
          <li>
            This ensures that the Partner’s or Designated Partner’s details,
            such as address, email, and contact information, are updated with
            the Ministry of Corporate Affairs (MCA).
          </li>
        </ul>
      </div>
      {/* <div className='no-scrollbar w-full overflow-scroll'>
        <div className='mx-auto flex w-full min-w-[450px] max-w-5xl items-center justify-between text-start'>
          <div className='w-[30%] border'>
            <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
              Compliance
            </p>
            <p className='w-full p-2 text-xs duration-200 hover:bg-[#D6E9FF] lg:text-sm'>
              DIN allotted before 31st March, 2024
            </p>
            <p className='w-full border-t p-2 text-xs duration-200 hover:bg-[#D6E9FF] lg:text-sm'>
              DIN allotted on or after 1st April, 2024
            </p>
          </div>
          <div className='w-[25%] border'>
            <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
              Form
            </p>
            <p className='w-full p-2 text-xs duration-200 hover:bg-[#D6E9FF] lg:text-sm'>
              DIR-3KYC or Web KYC
            </p>
            <p className='w-full border-t p-2 text-xs duration-200 hover:bg-[#D6E9FF] lg:text-sm'>
              DIR-3KYC
            </p>
          </div>
          <div className='w-[45%] border'>
            <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
              Due Date of Form Filing
            </p>
            <p className='w-full p-2 text-xs duration-200 hover:bg-[#D6E9FF] lg:text-sm'>
              30th September, 2024
            </p>
            <p className='w-full border-t p-2 text-xs duration-200 hover:bg-[#D6E9FF] lg:text-sm'>
              30th September, 2025
            </p>
          </div>
        </div>
      </div> */}
      <div className='no-scrollbar w-full overflow-scroll'>
        <div className='mx-auto flex w-full min-w-[550px] max-w-5xl items-center justify-between text-start'>
          <div className='w-[35%] border sm:w-[40%]'>
            <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
              Compliance
            </p>
            <p className='h-12 w-full border-b p-2 text-xs sm:h-auto lg:text-sm'>
              DIN allotted before 31st March, 2024
            </p>
            <p className='h-12 w-full p-2 text-xs sm:h-auto lg:text-sm'>
              DIN allotted on or after 1st April, 2024
            </p>
          </div>
          <div className='w-[25%] border'>
            <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
              Form
            </p>
            <p className='h-12 w-full border-b p-2 text-xs sm:h-auto lg:text-sm'>
              DIR-3KYC or Web KYC
            </p>
            <p className='h-12 w-full p-2 text-xs sm:h-auto lg:text-sm'>
              DIR-3KYC
            </p>
          </div>
          <div className='w-[40%] border sm:w-[35%]'>
            <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
              Due Date of Form Filing
            </p>
            <p className='h-12 w-full border-b px-2 py-[7.5px] text-xs sm:h-auto lg:text-sm'>
              <span>30th September, 2024</span>{' '}
              <span className='ml-1 h-4 rounded-full border border-[#FD216A] px-2 py-0.5 text-[8px] text-[#FD216A] lg:text-[10px]'>
                Latest
              </span>
            </p>
            <p className='h-12 w-full p-2 text-xs sm:h-auto lg:text-sm'>
              30th September, 2025
            </p>
          </div>
        </div>
      </div>
      <div className='-pl-5 text-muted-foreground-darker mt-4 flex items-start justify-start gap-1 text-start text-xs lg:mt-6 lg:text-sm'>
        <Image className='size-6' src={light} alt='light' />
        <span>
          If the Partner or Designated Partner fails to file Form DIR-3KYC or
          Web KYC before the due date, he will be liable for a penalty of{' '}
          <span className='font-semibold'>Rs.4,999/-</span>.
        </span>
      </div>
    </div>
  );
};

export default LLPPartnersKYC;
