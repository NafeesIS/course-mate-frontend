'use client';
import { MotionValue, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import EssentialFeatureCardFour from './EssentialFeatureCardFour';
import EssentialFeatureCardOne from './EssentialFeatureCardOne';
import EssentialFeatureCardThree from './EssentialFeatureCardThree';
import EssentialFeatureCardTwo from './EssentialFeatureCardTwo';
import './essentialFeatures.css';

interface ScrollProps {
  scrollYProgress: MotionValue<number>;
}
const EssentialFeatures = () => {
  const [animated, setAnimated] = useState(false);
  const { scrollYProgress }: ScrollProps = useScroll();
  const scale: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 2.3],
    [1, 0.7]
  );
  const scaleTwo = useTransform(scrollYProgress, [0, 2.2], [1, 0.8]);
  const scaleThree = useTransform(scrollYProgress, [0, 2.1], [1, 0.9]);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      setAnimated(true);
    }
  }, [inView]);
  return (
    <section
      ref={ref}
      className='mx-auto mb-6 mt-16 px-0 md:mb-0 md:mt-24 lg:max-w-[1024px] lg:px-0 xl:max-w-[1280px]'
    >
      <h2 className='section-title mb-4 px-4 text-center md:mb-8'>
        <span className='text-primary'>Get Started</span> With All The Essential{' '}
        <span className='text-primary'>Features </span>
      </h2>
      {animated && (
        <div className='flex flex-col items-center justify-center px-4 text-black'>
          <ul id='essential-cards'>
            <li className='essential-card' id='card1'>
              <EssentialFeatureCardOne scale={scale} />
            </li>
            <li className='essential-card' id='card2'>
              <EssentialFeatureCardTwo scaleTwo={scaleTwo} />
            </li>
            <li className='essential-card' id='card3'>
              <EssentialFeatureCardThree scaleThree={scaleThree} />
            </li>
            <li className='essential-card' id='card4'>
              <EssentialFeatureCardFour />
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default EssentialFeatures;
