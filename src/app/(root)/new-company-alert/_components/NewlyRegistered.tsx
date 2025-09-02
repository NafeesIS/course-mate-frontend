import Image from 'next/image';
import handShake from '../../../../../public/assets/new-company-alert/hand_shake_icon.png';
import manStar from '../../../../../public/assets/new-company-alert/man_star_icon.png';
import imageMan from '../../../../../public/assets/new-company-alert/newly_registerd_image_one.png';
import imageList from '../../../../../public/assets/new-company-alert/newly_registerd_image_two.png';

const NewlyRegistered = () => {
  return (
    <div className='wrapper'>
      <div className='h-1 lg:hidden'></div>
      <div className='mx-auto mb-6 max-w-xl lg:mb-12'>
        <h2 className='mt-10 text-center text-2xl font-semibold md:text-3xl lg:mt-0 lg:text-4xl xl:leading-snug'>
          Why You <span className='text-nca-primary-blue'>Need Data </span> of{' '}
          <br /> Newly Registered Companies?
        </h2>
        <p className='mt-2 text-center text-xs text-nca-sub-heading-text md:px-10 md:text-sm'>
          New Company Leads Everyday, Empowering You to Connect with Potential
          Clients Early, Boost Conversions, and Drive Sustainable Growth.
        </p>
      </div>
      <div className='my-8 grid grid-cols-1 gap-8 md:grid-cols-9'>
        <div className='col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] pb-0 md:col-span-4'>
          <div className='max-w-md px-6 pt-6 lg:px-10 lg:pt-10 xl:px-12 xl:pt-12'>
            <p className='mb-1 text-base font-semibold md:text-lg'>
              Stay Ahead of the Competition
            </p>
            <p className='text-xs font-light text-nca-paragraph-text md:text-sm'>
              Get early alerts on new companies and be the first to connect with
              potential clients, gaining a competitive edge over your
              competitors.
            </p>
          </div>
          <Image
            src={imageMan}
            alt='Image Man'
            width={512}
            height={300}
            quality={100}
            className='mt-4 h-auto w-auto object-cover shadow-sm xl:h-[300px] xl:w-[512px]'
          />
        </div>
        <div className='col-span-1 flex flex-col justify-between rounded-3xl bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] md:col-span-5'>
          <div className='max-w-lg px-6 pt-6 lg:px-10 lg:pt-10 xl:px-12 xl:pt-12'>
            <p className='mb-1 text-base font-semibold md:text-lg'>
              Targeted Outreach for Higher ROI
            </p>
            <p className='text-xs font-light text-nca-paragraph-text md:text-sm'>
              Company alerts help you target businesses likely to need your
              services, boosting the effectiveness of your emails and maximizing
              ROI.
            </p>
          </div>
          <Image
            src={imageList}
            alt='Image List'
            width={1000}
            height={400}
            quality={100}
            className='mt-4 h-auto w-auto object-contain xl:translate-x-14'
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div className='flex flex-col justify-between rounded-3xl bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] p-6 lg:p-10 xl:p-12'>
          <Image
            src={handShake}
            alt='Hand Shake'
            width={400}
            height={400}
            quality={100}
            className='mb-4 h-14 w-14 lg:mb-6'
          />
          <div className=''>
            <p className='mb-1 text-base font-semibold md:text-lg'>
              Build Long-Term Business Relationships
            </p>
            <p className='text-xs font-light text-nca-paragraph-text md:text-sm'>
              Engaging with new companies early builds rapport and positions you
              as a trusted partner, leading to long-term, mutually beneficial
              relationships.
            </p>
          </div>
        </div>
        <div className='flex flex-col justify-between rounded-3xl bg-[linear-gradient(180deg,_rgba(59,_110,_229,_0.10)_0%,_rgba(41,_108,_224,_0.07)_71.92%)] p-6 lg:p-10 xl:p-12'>
          <Image
            src={manStar}
            alt='Star User'
            width={400}
            height={400}
            quality={100}
            className='mb-4 h-14 w-14 lg:mb-6'
          />
          <div className=''>
            <p className='mb-1 text-base font-semibold md:text-lg'>
              Efficient Lead Generation
            </p>
            <p className='text-xs font-light text-nca-paragraph-text md:text-sm'>
              Save time with automatic, high-quality leads tailored to your
              focus, streamlining your process and helping you convert prospects
              into clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewlyRegistered;
