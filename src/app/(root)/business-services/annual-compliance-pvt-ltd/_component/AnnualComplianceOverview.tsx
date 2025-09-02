import Image from 'next/image';
import annualPLCOverview from '../../../../../../public/assets/business-services/annual-compliance-plc/annual_plc_overview.jpg';

const AnnualComplianceOverview = () => {
  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto mb-8 max-w-[720px] px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Private Limited Company’s Annual Compliance{' '}
        <span className='italic text-primary'>An Overview</span>
      </h2>
      <div className='flex h-full flex-col items-center justify-between gap-4 lg:flex-row'>
        <div className='flex h-full w-full flex-col justify-between gap-4 text-start lg:gap-6 xl:gap-8'>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            As per The Companies Act, 2013, every Private Limited Company has to
            annually convene an Annual General Meeting, file Return of Deposit,
            its Audited Financial Statements and Annual Return with the
            Registrar of Companies.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            Every director of the company is required to complete their KYC and
            file the e-form annually to avoid penalties.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            Private Limited company have to mandatorily get its annual accounts
            examined by an independent auditor called the Statutory Auditors. It
            is done to ensure that the annual accounts show a true and fair view
            of the company’s financial position.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            In Addition to the compliance under The Companies Act, 2013 -
            Private companies must file Income Tax Return with the Income Tax
            department for each financial year.
          </p>
        </div>
        <Image
          src={annualPLCOverview}
          alt='annualPLCOverview'
          className='sm:max-w-[573px]'
        />
      </div>
    </div>
  );
};

export default AnnualComplianceOverview;
