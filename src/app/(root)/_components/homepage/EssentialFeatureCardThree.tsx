import { MotionValue } from 'framer-motion';
import Image from 'next/image';
import FSResearchImg from '../../../../../public/assets/homepage/exploding-head.png';
import { MotionDiv } from '../../../../components/shared/Motion';

interface EssentialFeatureCardOneProps {
  scaleThree: MotionValue<number>;
}
const EssentialFeatureCardThree: React.FC<EssentialFeatureCardOneProps> = ({
  scaleThree,
}) => {
  return (
    <MotionDiv
      style={{ scale: scaleThree }}
      className='mx-auto flex min-h-[584px] flex-col items-center justify-center rounded-lg border bg-[#E0E7FF] shadow hover:shadow-md sm:max-w-[630px] md:min-h-[775px] md:min-w-[744px] md:max-w-[768px] lg:min-h-0 lg:max-w-[992px] xl:max-w-[1248px]'
    >
      <h3 className='min-w-full p-4 text-center text-xl font-semibold md:pl-10 md:pt-10 md:text-3xl'>
        FileSure RESEARCH
      </h3>
      <Image
        src={FSResearchImg}
        alt='Icon of a FileSure Researcher'
        width={600}
        height={600}
        quality={100}
        className='mx-auto my-4 h-full max-h-[119px] w-full max-w-[106px] lg:my-6'
      />
      <h5 className='my-4 px-4 text-center font-playfair text-2xl md:text-3xl lg:text-4xl  xl:text-5xl'>
        We are creating awesome stuff for you.
      </h5>
      <p className='px-2 pb-12 pt-4 text-center text-base font-normal md:text-xl lg:text-2xl'>
        We are going to launch research soon.
      </p>
    </MotionDiv>
  );
};

export default EssentialFeatureCardThree;
