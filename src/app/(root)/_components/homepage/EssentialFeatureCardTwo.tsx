import { MotionValue } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { RxCheck } from 'react-icons/rx';
import FSConnectImg from '../../../../../public/assets/homepage/filesure-connect.png';
import { MotionDiv } from '../../../../components/shared/Motion';
import { Button } from '../../../../components/ui/button';
interface EssentialFeatureCardOneProps {
  scaleTwo: MotionValue<number>;
}
const EssentialFeatureCardTwo: React.FC<EssentialFeatureCardOneProps> = ({
  scaleTwo,
}) => {
  return (
    <MotionDiv
      style={{ scale: scaleTwo }}
      className='mx-auto flex flex-col  items-center justify-center rounded-lg border bg-[#FFEDD5] shadow hover:shadow-md sm:max-w-[630px] md:min-w-[744px] md:max-w-[768px] lg:max-w-[992px] lg:flex-row lg:items-end lg:justify-between xl:max-w-[1248px]'
    >
      <div>
        <h3 className='p-4 text-start text-xl font-semibold md:pl-10 md:pt-10 md:text-center md:text-3xl lg:text-start'>
          FileSure CONNECT
        </h3>
        <div className='mt-0 pb-4 pl-4 pr-4 pt-0 md:mt-6 md:whitespace-nowrap lg:mt-8 lg:p-0 lg:pb-10 lg:pl-10'>
          <p className='text-sm font-medium  md:text-base 2xl:text-lg'>
            Partner with us for visibility to businesses seeking compliance help
          </p>
          <div className='flex flex-col gap-4 md:my-6 md:flex-row md:items-center md:justify-center md:gap-12 lg:my-0 lg:items-start lg:justify-start lg:gap-8 xl:gap-20'>
            <div className='mt-4 flex max-w-[300px] flex-col gap-4 md:mt-6 md:max-w-[240px] md:gap-6 lg:mt-8 lg:max-w-full lg:items-start lg:gap-8 xl:max-w-none'>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#FDBA74] p-1 '>
                  <RxCheck />
                </div>
                <p>Unlock New Opportunities</p>
              </div>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#FDBA74] p-1 '>
                  <RxCheck />
                </div>
                <p>Potential earnings</p>
              </div>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#FDBA74] p-1 '>
                  <RxCheck />
                </div>
                <p>Ethical Practice</p>
              </div>
            </div>
            <div className='mt-0 flex max-w-[420px] flex-col gap-4 md:mt-6 md:max-w-[240px] md:gap-6 lg:mt-8 lg:max-w-full lg:items-start lg:gap-8 lg:pr-5 xl:max-w-none'>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#FDBA74] p-1 '>
                  <RxCheck />
                </div>
                <p>Community of Professionals</p>
              </div>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#FDBA74] p-1 '>
                  <RxCheck />
                </div>
                <p>Support for new starters</p>
              </div>
              <div className='flex gap-3 text-sm font-medium md:text-base 2xl:text-lg'>
                <div className='flex-col-center h-6 w-6 rounded-full bg-[#FDBA74] p-1 '>
                  <RxCheck />
                </div>
                <p>Simple Subscription model</p>
              </div>
            </div>
          </div>
          <Link
            href='/login'
            prefetch={false}
            target='_blank'
            className='mx-auto md:max-w-[250px] lg:max-w-none'
          >
            <Button
              variant='default'
              className='mt-4 w-full min-w-[200px] cursor-pointer rounded-md bg-[#F97316] px-4 py-2 text-sm text-secondary transition-all duration-300 hover:bg-[#b14b03]  hover:text-white md:mt-8 md:w-auto md:text-base'
            >
              Create your profile
            </Button>
          </Link>
        </div>
      </div>
      <Image
        src={FSConnectImg}
        alt='Image of FileSure Connect'
        width={600}
        height={600}
        quality={100}
        className='max-h-[300px] max-w-[300px] pl-4 pr-4 md:max-h-[450px] md:max-w-[500px] lg:min-h-96 lg:min-w-96 lg:pr-0'
      />
    </MotionDiv>
  );
};

export default EssentialFeatureCardTwo;
