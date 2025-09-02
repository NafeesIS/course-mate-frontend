import CommonLeadForm from '@/components/shared/LeadForm/CommonLeadForm';
import { TiTick } from 'react-icons/ti';
import {
  ComputerSvg,
  DotsSvg,
  HeadphoneSvg,
  PersonSeatSvg,
  RoundedBorderSvg,
} from '../_data/PLCSvg';

const Hero = () => {
  const serviceType = ['New company incorporation'];
  const sources = ['new private company incorporation landing page'];
  return (
    <div className='relative flex h-[700px] flex-col items-center overflow-hidden bg-[#eaf5fd] sm:h-[850px] lg:h-[600px] lg:flex-row'>
      <RoundedBorderSvg />
      <DotsSvg />
      <div className='flex h-[300px] items-center justify-center lg:h-[600px] lg:w-[50%]'>
        <div className='mx-auto my-auto flex h-full max-w-[340px] flex-col items-start justify-center p-4 pt-6 text-start sm:max-w-[525px] lg:pt-0 2xl:mx-0 2xl:ml-auto 2xl:max-w-[610px] 2xl:items-start'>
          <h1 className='lg-tra mb-4 text-start font-inter text-2xl font-semibold leading-snug tracking-wide text-black sm:text-3xl lg:mb-6 lg:text-left xl:text-4xl xl:leading-snug'>
            Private Limited Company Registration
          </h1>
          <div className='space-y-2.5 text-black lg:space-y-3'>
            <p className='flex items-start justify-start gap-2 lg:gap-3'>
              <TiTick className='size-4 flex-shrink-0 rounded-full border border-black sm:h-auto sm:w-auto' />{' '}
              <span className='text-muted-foreground-darker text-xs sm:text-sm'>
                <span className='font-semibold'>
                  Limited Liability Protection
                </span>{' '}
                - Personal assets are protected from business debts
              </span>
            </p>
            <p className='flex items-start justify-start gap-2 lg:gap-3'>
              <TiTick className='size-4 flex-shrink-0 rounded-full border border-black sm:h-auto sm:w-auto' />{' '}
              <span className='text-muted-foreground-darker text-xs sm:text-sm'>
                <span className='font-semibold'>Separate Legal Entity</span> -
                Company exists independently from its owners
              </span>
            </p>
            <p className='flex items-start justify-start gap-2 lg:gap-3'>
              <TiTick className='size-4 flex-shrink-0 rounded-full border border-black sm:h-auto sm:w-auto' />{' '}
              <span className='text-muted-foreground-darker text-xs sm:text-sm'>
                <span className='font-semibold'>Perpetual Existence</span> -
                Company continues regardless of ownership changes
              </span>
            </p>
            <p className='flex items-start justify-start gap-2 lg:gap-3'>
              <TiTick className='size-4 flex-shrink-0 rounded-full border border-black sm:h-auto sm:w-auto' />{' '}
              <span className='text-muted-foreground-darker text-xs sm:text-sm'>
                <span className='font-semibold'>Enhanced Credibility</span> -
                Greater trust with customers, suppliers, and investors
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className='shadow-left flex min-h-[2000px] w-[1000px] -translate-y-[480px] rotate-90 items-center justify-start rounded-l-full bg-background lg:min-h-[1100px] lg:w-[50%] lg:-translate-y-0 lg:rotate-0 lg:justify-center xl:h-[1300px]'>
        <div className='block 2xl:mr-auto 2xl:flex 2xl:min-w-[600px] 2xl:justify-end'>
          <div className='relative mx-auto block h-full max-h-[480px] min-h-72 min-w-72 translate-x-20 -rotate-90 rounded-full border-0 border-primary p-4 sm:min-h-[480px] sm:min-w-[480px] sm:border-4 sm:p-6 lg:mx-0 lg:translate-x-0 lg:rotate-0'>
            <div className='h-full max-h-[480px] min-h-64 min-w-64 rounded-full border-0 border-primary p-2 sm:min-h-[420px] sm:min-w-[420px] sm:border-2'>
              <div className='hidden h-full sm:flex'>
                <div className='flex flex-col justify-between'>
                  <div className='absolute left-2 top-8 bg-background pb-8 pl-3 pr-0 pt-0'>
                    <HeadphoneSvg />
                  </div>
                  <div className='absolute bottom-14 left-2  bg-background pb-0 pl-3 pr-5 pt-8'>
                    <PersonSeatSvg />
                  </div>
                </div>

                <div className='flex flex-col justify-between'>
                  <div></div>
                  <div className='absolute -right-3 bottom-20 bg-background'>
                    <ComputerSvg />
                  </div>
                </div>
              </div>
              <div className='absolute mx-auto flex h-full max-h-[420px] min-h-[380px] min-w-72 max-w-80 -translate-x-6 -translate-y-16 flex-col items-center justify-center rounded-lg border bg-card px-4 shadow-lg sm:right-[70px] sm:top-8 sm:max-h-[410px] sm:min-h-0 sm:max-w-80 sm:-translate-x-0 sm:-translate-y-0 lg:mx-0 lg:px-5'>
                <p className='mb-1 pt-2 text-start text-base font-semibold sm:text-[17px] lg:pt-0'>
                  Apply for Private Limited Company Registration
                </p>
                <p className='text-start text-xs text-muted-foreground sm:text-sm md:mb-3'>
                  Ready to Launch Your Private Limited Company? Fill the Form
                  and Let Filesure Handle the Rest!
                </p>
                <CommonLeadForm serviceType={serviceType} sources={sources} />
              </div>
            </div>
          </div>
        </div>
        {/* <div className='mx-auto flex h-full max-h-[380px] max-w-[340px] -translate-x-64 -rotate-90 flex-col items-center justify-center rounded-md border bg-card shadow-lg sm:hidden'>
          <p className='mb-1 px-12 pt-4 text-start text-base font-semibold tracking-normal sm:mb-4'>
            Apply for Private Limited Company Registration
          </p>
          <p className='px-12 text-start text-xs text-muted-foreground-darker sm:text-sm'>
            Ready to Launch Your Private Limited Company? Fill the Form and Let
            Filesure Handle the Rest!
          </p>
          <PrivateRegistrationForm />
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
