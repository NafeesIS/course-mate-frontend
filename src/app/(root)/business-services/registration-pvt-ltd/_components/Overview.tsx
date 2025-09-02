import Image from 'next/image';
import privateCompanies from '../../../../../../public/assets/business-services/plc-registration/private_companies.png';

const Overview = () => {
  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto mb-10 max-w-md px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Private Limited Companies:{' '}
        <span className='italic text-primary'>An Overview</span>
      </h2>
      <div className='flex h-full flex-col items-center justify-between gap-4 lg:flex-row'>
        <div className='flex h-full w-full flex-col justify-between gap-4 text-start lg:gap-6 xl:gap-8'>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            It is a type of business entity governed by The Companies Act, 2013,
            it is a privately held company and does not offer its shares to the
            general public.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            This type of business entity has various benefits like limited
            liability protection, a separate legal entity, perpetual existence
            and greater control and privacy compared to public companies.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            Private Companies are registered under The Companies Act, 2013 and
            have to comply with legal frameworks.
          </p>
          <p className='text-muted-foreground-darker px-2 text-sm font-normal group-hover:text-muted lg:text-base'>
            Business Entities or Families looking to manage their business in a
            formal structure and grow their business while maintaining control
            and protecting personal assets can incorporate a private company.
          </p>
        </div>
        <Image
          src={privateCompanies}
          alt='Private Companies'
          className='sm:max-w-[573px]'
        />
      </div>
    </div>
  );
};

export default Overview;
