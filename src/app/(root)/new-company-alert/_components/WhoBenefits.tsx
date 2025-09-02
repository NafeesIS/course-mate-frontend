import Image from 'next/image';
import advisors from '../../../../../public/assets/new-company-alert/advisors.png';
import b2bSales from '../../../../../public/assets/new-company-alert/b2b_sales.png';
import blueTriangle from '../../../../../public/assets/new-company-alert/blue_triangle.svg';
import legal from '../../../../../public/assets/new-company-alert/legal.png';
import marketingAgency from '../../../../../public/assets/new-company-alert/marketing_agency.png';
import softIt from '../../../../../public/assets/new-company-alert/soft_it.png';
import suppliers from '../../../../../public/assets/new-company-alert/suppliers.png';

const WhoBenefits = () => {
  return (
    <div className='wrapper'>
      <div className='relative mx-auto max-w-4xl'>
        <h5 className='z-10 pt-8 text-center text-2xl font-semibold md:text-3xl lg:text-4xl xl:leading-snug'>
          Who Benefits from <br className='lg:hidden' />
          <span className='z-20 text-center text-nca-primary-blue'>
            our Data?{' '}
          </span>
        </h5>
        <Image
          src={blueTriangle}
          alt='triangle'
          width={80}
          height={80}
          className='absolute right-40 top-4 -z-10 hidden h-auto w-auto lg:block'
        />
      </div>
      <div className='mt-16 grid grid-cols-1 gap-8 md:grid-cols-9'>
        <div className='col-span-1 flex flex-col justify-between overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] pb-0 md:col-span-5'>
          <div className='mb-4 max-w-[400px] px-6 pt-6 md:mb-0 lg:px-10 lg:pt-10 xl:px-12 xl:pt-12'>
            <p className='mb-1 text-base font-semibold md:text-lg'>
              B2B Sales Teams
            </p>
            <p className='mb-4 text-xs font-light text-nca-paragraph-text md:text-sm'>
              Access to fresh leads of newly incorporated companies to run
              targeted email campaigns and pitch their products or services to
              businesses right from the start.
            </p>
          </div>
          <Image
            src={b2bSales}
            alt='B2B Sales'
            width={512}
            height={300}
            quality={100}
            className='ml-auto h-auto w-auto object-cover px-6 shadow-sm lg:px-10 xl:max-w-xl xl:px-12'
          />
        </div>
        <div className='col-span-1 flex flex-col-reverse justify-between overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] md:col-span-4 md:flex-col'>
          <div className='flex flex-col-reverse gap-4 px-6 pt-6 md:flex-none lg:px-10 lg:pt-10 xl:px-12 xl:pt-12'>
            <Image
              src={marketingAgency}
              alt='Marketing Agency'
              width={699}
              height={373}
              quality={100}
              className='h-auto w-auto object-cover xl:max-w-80 xl:translate-x-14'
            />
            <div>
              <p className='mb-1 text-base font-semibold md:text-lg'>
                Marketing Agencies
              </p>
              <p className='mb-4 text-xs font-light text-nca-paragraph-text md:text-sm'>
                Identify new businesses that may need marketing services to
                establish their brand and grow their customer base, enabling
                precise and timely outreach
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='my-8 grid grid-cols-1 gap-8 md:grid-cols-9'>
        <div className='col-span-1 flex flex-col justify-between overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] pb-0 md:col-span-4'>
          <div className='mb-4 px-6 pt-6 md:mb-0 lg:px-10 lg:pt-10 xl:px-12 xl:pt-12'>
            <p className='mb-1 text-base font-semibold md:text-lg'>
              Software & IT Service Providers
            </p>
            <p className='mb-4 text-xs font-light text-nca-paragraph-text md:text-sm'>
              Promote software solutions and IT services tailored to the needs
              of new businesses, ensuring they have the tools necessary for
              efficient operations
            </p>
          </div>
          <Image
            src={softIt}
            alt='Soft It'
            width={512}
            height={300}
            quality={100}
            className='ml-auto h-auto w-auto object-cover px-6 shadow-sm lg:px-10 xl:max-w-xl'
          />
        </div>
        <div className='col-span-1 flex flex-col justify-between overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] pb-0 md:col-span-5'>
          <div className='mb-4 px-6 pt-6 md:mb-0 lg:px-10 lg:pt-10 xl:px-12 xl:pt-12'>
            <p className='mb-1 text-base font-semibold md:text-lg'>
              Legal & Compliance Consultants
            </p>
            <p className='mb-4 text-xs font-light text-nca-paragraph-text md:text-sm'>
              Offer legal advisory and compliance services to newly formed
              companies to ensure they meet regulatory requirements and avoid
              legal pitfalls.
            </p>
          </div>
          <Image
            src={legal}
            alt='legal'
            width={512}
            height={300}
            quality={100}
            className='ml-auto h-auto w-auto object-cover px-6 shadow-sm lg:px-10 xl:max-w-xl'
          />
        </div>
      </div>
      <div className='my-8 grid grid-cols-1 gap-8 md:grid-cols-9'>
        <div className='col-span-1 flex flex-col justify-between overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] pb-0 md:col-span-5'>
          <div className='mb-4 px-6 pt-6 md:mb-0 lg:px-10 lg:pt-10 xl:px-12 xl:pt-12'>
            <p className='mb-1 text-base font-semibold md:text-lg'>
              Financial Advisors & Accountants
            </p>
            <p className='mb-4 text-xs font-light text-nca-paragraph-text md:text-sm'>
              Access to fresh leads of newly incorporated companies to run
              targeted email campaigns and pitch their products or services to
              businesses right from the start.
            </p>
          </div>
          <Image
            src={advisors}
            alt='advisors'
            width={402}
            height={362}
            quality={100}
            className='ml-auto h-auto w-auto object-cover px-6 shadow-sm lg:px-10 xl:max-w-md xl:px-12'
          />
        </div>
        <div className='col-span-1 flex flex-col justify-between overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] md:col-span-4'>
          <div className='flex flex-col-reverse gap-4 px-6 pt-6 md:flex-col lg:px-10 lg:pt-10 xl:px-12 xl:pt-12'>
            <Image
              src={suppliers}
              alt='suppliers'
              width={484}
              height={278}
              quality={100}
              className='mb-4 h-auto w-auto object-cover lg:mb-8 xl:max-w-96'
            />
            <div className='lg:pb-8'>
              <p className='mb-1 text-base font-semibold md:text-lg'>
                Office Suppliers & Equipment Vendors
              </p>
              <p className='mb-4 text-xs font-light text-nca-paragraph-text md:text-sm'>
                Provide essential office supplies, furniture, and equipment to
                new companies as they set up their operations, positioning your
                business as a key supplier
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoBenefits;
