import Image from 'next/image';
import Link from 'next/link';
import { RxCheck } from 'react-icons/rx';
import FSAcademyImg from '../../../../../public/assets/homepage/filesure-academy.png';
import { MotionDiv } from '../../../../components/shared/Motion';
import { Button } from '../../../../components/ui/button';

const EssentialFeatureCardFour = () => {
  return (
    <MotionDiv className='mx-auto flex flex-col items-center justify-center rounded-lg border bg-[#CCFBF1] shadow hover:shadow-md sm:max-w-[630px] md:min-w-[744px] md:max-w-[768px] lg:max-w-[992px] lg:flex-row lg:items-end lg:justify-between xl:max-w-[1248px]'>
      <div>
        <h3 className='p-4 text-start text-xl font-semibold md:pl-10 md:pt-10 md:text-center md:text-3xl lg:text-start'>
          FileSure ACADEMY
        </h3>
        <div className='mt-0 pb-4 pl-4 pr-4 pt-0 md:mt-6 md:whitespace-nowrap lg:mt-8 lg:p-0 lg:pb-10 lg:pl-10'>
          <p className='text-sm font-medium md:text-base 2xl:text-lg'>
            An academy designed to equip you with the skills for a successful
            career.
          </p>
          <div className='flex flex-col gap-4 md:my-4 md:mr-9 md:flex-row md:items-center md:justify-center md:gap-12 lg:my-0 lg:mr-0 lg:items-start lg:justify-start lg:gap-8 xl:gap-20'>
            <div className='mt-4 flex max-w-[300px] flex-col gap-4 md:mt-6 md:max-w-[220px] md:gap-6 lg:mt-8 lg:max-w-full lg:items-start lg:gap-8 xl:max-w-none'>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#5EEAD4] p-1 '>
                  <RxCheck />
                </div>
                <p>Most affordable courses</p>
              </div>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#5EEAD4] p-1 '>
                  <RxCheck />
                </div>
                <p>Practical learning</p>
              </div>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#5EEAD4] p-1 '>
                  <RxCheck />
                </div>
                <p>Bilingual instruction</p>
              </div>
            </div>
            <div className='mt-0 flex max-w-[420px] flex-col gap-4 md:mt-6 md:max-w-[220px] md:gap-6 lg:mt-8 lg:max-w-full lg:items-start lg:gap-8 lg:pr-5 xl:max-w-none'>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#5EEAD4] p-1 '>
                  <RxCheck />
                </div>
                <p>Life-time access</p>
              </div>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#5EEAD4] p-1 '>
                  <RxCheck />
                </div>
                <p>Project-based scenarios</p>
              </div>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#5EEAD4] p-1 '>
                  <RxCheck />
                </div>
                <p>Quick entry into the workforce</p>
              </div>
            </div>
          </div>
          <Link
            href={'https://filesure.graphy.com/s/store'}
            prefetch={false}
            target='_blank'
            className='mx-auto md:max-w-[250px] lg:max-w-none'
          >
            <Button
              variant='default'
              className='mb-2 mt-4 w-full min-w-[200px] rounded-md bg-[#14B8A6] px-4 py-2 text-sm text-secondary transition-all duration-300 hover:bg-[#0b8576] hover:text-white md:mt-8 md:w-auto md:text-base lg:mb-0'
            >
              Explore Courses
            </Button>
          </Link>
        </div>
      </div>
      <Image
        src={FSAcademyImg}
        alt='Image of FileSure Academy'
        width={600}
        height={600}
        quality={100}
        className='max-h-[300px] max-w-[300px] pl-4 pr-4 md:max-h-[450px] md:max-w-[500px] lg:max-h-[550px] lg:min-h-[450px] lg:min-w-96 lg:pr-0'
      />
    </MotionDiv>
  );
};

export default EssentialFeatureCardFour;
