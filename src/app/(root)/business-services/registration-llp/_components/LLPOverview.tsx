import Image from 'next/image';
import llpOverview from '../../../../../../public/assets/business-services/llp-registration/llp_overview.png';

const LLPOverview = () => {
  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto mb-10 max-w-[550px] px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Limited Liability Partnership (LLP){' '}
        <span className='italic text-primary'>An Overview</span>
      </h2>
      <div className='flex h-full flex-col items-center justify-between gap-4 lg:flex-row'>
        <div className='flex h-full w-full flex-col justify-between gap-4 text-start lg:gap-6 xl:gap-8'>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            A Limited Liability Partnership (LLP) is a type of business
            structure that is a combination of two elements that is of both
            partnerships and corporations.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            It provides limited liability protection to partners, a separate
            legal entity of partners and rights, obligations, duties and
            responsibilities of partners and the rules for running a business is
            set out in an agreement called LLP agreement.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            An LLP is restricted from engaging in financial services like
            banking, insurance, investment advisory, etc. and from operating
            charitable or non-profit activities.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            LLP is governed by and registered under Limited Liability
            Partnership Act, 2008.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            LLP’s are exempted from the provisions of Indian Partnership Act,
            1932.
          </p>
        </div>
        <Image src={llpOverview} alt='LLP' className='sm:max-w-[573px]' />
      </div>
    </div>
  );
};

export default LLPOverview;
