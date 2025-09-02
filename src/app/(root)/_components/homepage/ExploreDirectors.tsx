import { cn } from '@/lib/utils';
import { LucideUserSearch } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { RxCheck } from 'react-icons/rx';
import DirectorsImg from '../../../../../public/assets/homepage/directors.png';
import { buttonVariants } from '../../../../components/ui/button';
const ExploreDirectors = () => {
  // const directorNames = [
  //   'MADHUSUDHAN HEERA NAIK',
  //   'MANGALATH UNNIKRISHNAN',
  //   'AMIT KUMAR SISIR CHATTERJEE',
  //   'SALIL RANA',
  //   'MOHAMMED IMRAN KHAN',
  //   'SUFIYA KHATOON IMRAN KHAN',
  //   'CHANDRA SEKHAR REDDY GARISA',
  //   'JYOTI NARANG',
  // ];
  return (
    <section className='wrapper mt-12 md:mt-16'>
      <h2 className='section-title mb-6 text-center lg:text-center'>
        Explore Indian Directors <span className='text-primary'>Complete</span>{' '}
        Profile
      </h2>
      <div className='flex w-full flex-col items-center justify-center gap-0 lg:max-w-[1280px] lg:flex-row lg:justify-between xl:max-w-[1440px]'>
        <div className='mt-4 md:mt-6 lg:mt-8'>
          <h3 className='max-w-[435px] text-sm font-medium text-muted-foreground md:max-w-[550px] md:text-lg lg:max-w-[500px] 2xl:text-xl'>
            Access personal information of both current and past directorships
            by conducting a directors search
          </h3>
          <div className='mx-auto mt-4 flex max-w-[435px] flex-col gap-4 md:mt-6 md:max-w-[550px] md:gap-6 lg:mt-8 lg:max-w-full lg:items-start lg:pr-5 xl:max-w-none'>
            <div className='flex gap-3 text-sm font-medium text-muted-foreground md:text-base lg:pr-4'>
              <div className='flex-col-center h-6 w-6 rounded-full bg-[#EFD9F9] p-1 text-[#0F172A]'>
                <RxCheck />
              </div>
              <p>Stay informed about disqualified directors</p>
            </div>
            <div className='flex gap-3 text-sm font-medium text-muted-foreground md:text-base lg:pr-4'>
              <div className='flex-col-center h-6 w-6 rounded-full bg-[#EFD9F9] p-1 text-[#0F172A]'>
                <RxCheck />
              </div>
              <p>
                Analyze a directors qualifications using their business history.
              </p>
            </div>
            <div className='flex gap-3 text-sm font-medium text-muted-foreground md:text-base lg:pr-4'>
              <div className='flex-col-center h-6 w-6 rounded-full bg-[#EFD9F9] p-1 text-[#0F172A]'>
                <RxCheck />
              </div>
              <p>Information about the company management and structure</p>
            </div>
          </div>
          <div className='mx-auto md:max-w-[250px] lg:max-w-none'>
            <Link
              href='/search/director'
              prefetch={false}
              className={cn(
                buttonVariants({ variant: 'default' }),
                'mt-4 h-12 w-full gap-2 px-5 text-white  transition-all duration-300 hover:text-white md:mb-2 md:mt-8 md:w-auto md:text-base'
              )}
            >
              <LucideUserSearch /> Search for all directors
            </Link>
          </div>
        </div>

        <div className='relative mt-4 flex md:mt-8 lg:mr-12 xl:mr-20'>
          <Image
            src={DirectorsImg}
            alt='Image of directors in a business office'
            width={400}
            height={400}
            quality={100}
            className='w-[550px] rounded-3xl object-cover p-4 grayscale md:h-[350px] md:w-[550px] md:max-w-[550px] md:rounded md:p-0 lg:h-80 lg:max-h-full lg:w-full lg:max-w-[570px] xl:h-[370px] xl:w-[570px] xl:max-w-[600px]'
          />
          <div className='absolute -bottom-2 -right-2 flex max-h-28 max-w-40 items-center justify-center md:-right-16 md:bottom-12 lg:-right-16 lg:bottom-12 xl:-right-24 xl:bottom-8'>
            <div className='flex-col-center h-[56px] w-[92px] rounded-md bg-[#EFD9F9] md:h-20 md:w-[120px] xl:h-24 xl:w-36 2xl:h-28 2xl:w-40'>
              <p className='text-sm font-bold text-[#9400D3] md:text-3xl 2xl:text-4xl'>
                5+ mn
              </p>
              <p className='text-[10px] text-[#475569] md:text-sm 2xl:text-base'>
                Directors Profile
              </p>
            </div>
          </div>
          <div className='absolute right-20 h-7 max-h-10 w-7 max-w-10 rotate-[20deg] rounded-full bg-[#EFD9F9] opacity-60 md:-top-4 md:right-32 md:h-10 md:w-10 md:rounded-md'></div>
          <div className='absolute bottom-16 h-7 max-h-10 w-7 max-w-10 -rotate-[20deg] rounded-full bg-[#EFD9F9] opacity-60 md:-left-5 md:bottom-24 md:h-10 md:w-10 md:rounded-md'></div>
        </div>
      </div>
      {/* <div className='mx-auto mb-16 mt-16 max-w-full md:mb-0'>
        <h4 className='max-w-full border-b pb-6 text-center text-2xl font-bold text-foreground md:mb-0 md:text-start'>
          Recent searches of <span className='text-primary'>Directors</span>
        </h4>
        <div className='mx-auto mt-8 flex max-w-[450px] flex-wrap justify-center gap-4 md:max-w-full md:justify-start md:gap-6'>
          {directorNames.map((name, index) => (
            <Link
              key={index}
              href={'/'}
              prefetch={false}
              className={`group flex h-14 w-full max-w-64 cursor-pointer items-center justify-start gap-2 rounded-md border bg-accent px-4 py-2 text-xs font-medium text-muted-foreground shadow transition-all duration-200 hover:shadow-md md:w-auto md:max-w-72 md:justify-normal md:text-sm xl:max-w-[296px] xl:p-4 ${
                index === 4
                  ? 'mr-auto md:ml-0 md:mr-0 xl:ml-16'
                  : index % 2 === 0
                    ? 'mr-auto md:mr-0'
                    : 'ml-auto md:ml-0'
              }`}
            >
              {name}{' '}
              <RiArrowRightUpLine className='text-xl text-[#9400D3] opacity-70 transition-all duration-200 group-hover:opacity-100' />
            </Link>
          ))}
        </div>
      </div> */}
    </section>
  );
};

export default ExploreDirectors;
