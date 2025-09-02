import Image from 'next/image';
import annualLLPOverview from '../../../../../../public/assets/business-services/annual-compliance-llp/annual_llp_overview.png';

const AnnualComplianceLLPOverview = () => {
  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto mb-10 max-w-[760px] px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Limited Liability Partnership’s Annual Compliance{' '}
        <span className='italic text-primary'>An Overview</span>
      </h2>
      <div className='flex h-full flex-col items-center justify-between gap-4 lg:flex-row'>
        <div className='flex h-full w-full flex-col justify-between gap-4 text-start lg:gap-6 xl:gap-8'>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            As per Limited Liability Partnership Act, 2008, every LLP has to
            annually file Statement of Account & Solvency and Annual Return with
            the Registrar of Companies.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            Every Partner of an LLP who holds a DIN is required to complete
            their KYC and file the relevant e-form annually to avoid penalties.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            LLPs are exempted from audit unless their contribution exceeds ₹25
            lakhs or turnover exceeds ₹40 lakhs in the preceding financial year.
            The audit ensures that the Financial Statements present a true and
            fair view of the LLP’s financial position.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            In Addition to the compliance under Limited Liability Partnership
            Act, 2008 - LLP’s must file Income Tax Return with the Income Tax
            department for each financial year.
          </p>
        </div>
        <Image
          src={annualLLPOverview}
          alt='annualLLPOverview'
          className='sm:max-w-[573px]'
        />
      </div>
    </div>
  );
};

export default AnnualComplianceLLPOverview;
