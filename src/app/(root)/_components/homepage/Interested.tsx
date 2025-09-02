import CompanyOverviewCard from './CompanyOverviewCard';
const Interested = () => {
  const jsonData = [
    {
      company: 'GE Renewable Energy Technologies Private Limited',
      cin: 'U31905DL2018PTC339014',
      location: 'New Delhi',
      status: 'Active',
    },
    {
      company: 'Gta Solutions Private Limited',
      cin: 'U74999MH2022PTC376355',
      location: 'Mumbai',
      status: 'Converted to LLP',
    },
    {
      company: 'Ageless Clinic Private Limited',
      cin: 'U74999MH2019PTC324247',
      location: 'Mumbai',
      status: 'Dissolved under section 59(8)',
    },
    {
      company: 'Being Mental Healthcare',
      cin: 'U85110MH2021PTC368974',
      location: 'Maharashtra',
      status: 'Under CIRP',
    },
    {
      company: 'Full Spectrum Service',
      cin: 'AAS-3393',
      location: 'New Delhi',
      status: 'Strike Off',
    },
    {
      company: 'Jumpingminds Ai Lab Private Limited',
      cin: 'U85300DL2021PTC380263',
      location: 'Delhi',
      status: 'Inactive for e-filing',
    },
    {
      company: 'Samast Builders Pvt Ltd',
      cin: 'U45203CT1982PTC002073',
      location: 'Chattisgarh',
      status: 'Active',
    },
  ];

  return (
    // <section className='mt-10 bg-primary-foreground md:mt-12 lg:mt-16'>
    <section className='bg-primary-foreground'>
      <div className='wrapper pb-12 pt-8 md:pb-14 md:pt-12 lg:pb-16 lg:pt-16'>
        <div className='space-y-4 text-center'>
          <h2 className='section-title'>
            You may be <br className='sm:hidden' />{' '}
            <span className='text-primary'>Interested </span> in..
          </h2>
          <h3 className='text-sm font-medium tracking-wide text-muted-foreground md:text-base lg:text-lg xl:px-20'>
            These suggestions are curated considering your recent searches and
            other activities
          </h3>
        </div>
        <div className='flex flex-wrap items-center justify-center gap-3 pt-6 md:gap-4 md:pt-12'>
          {jsonData.map((companyInfo, index) => {
            return (
              <CompanyOverviewCard key={index} companyInfo={companyInfo} />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Interested;
