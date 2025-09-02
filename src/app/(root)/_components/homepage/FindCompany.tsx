import { Button } from '../../../../components/ui/button';

const FindCompany = () => {
  return (
    <section className='mt-16 bg-primary-foreground md:mt-24'>
      <div className='wrapper pb-6 pt-10 text-center md:pb-10 md:pt-12'>
        <h2 className='section-title mb-4'>
          <span className='text-primary'>Find </span>company and director
          details <span className='text-primary'>easily</span>
        </h2>
        <p className='text-sm font-medium text-muted-foreground md:text-base xl:px-20 2xl:text-lg'>
          We assist in discovering important details about companies and their
          directors. We offer a vast database containing Indian companies from
          various categories. Our website allows you to quickly search for
          information about different types of companies such as LLPs, Pvt Ltds,
          or Limited companies. Here, you also have the opportunity to find
          information about the directors of a company.
        </p>
        <Button
          variant='default'
          className='mt-4 rounded-md px-4 py-2 text-sm text-white transition-all duration-300 md:mt-8 md:text-base'
        >
          Register for Free
        </Button>
      </div>
    </section>
  );
};

export default FindCompany;
