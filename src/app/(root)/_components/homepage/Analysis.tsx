'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Analysis: React.FC = () => {
  // const [animated, setAnimated] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      // setAnimated(true);
      startCountUp(1, 1, 0.1);
      startCountUp(8, 2, 0.2);
      startCountUp(25.5, 3, 0.4);
    }
  }, [inView]);

  const startCountUp = (end: number, countNumber: number, delay: number) => {
    setTimeout(() => {
      let startTime: number;
      const duration = 2000; // 2 seconds

      const startAnimation = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp;
        }

        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        const currentValue = percentage * end;
        const formattedValue = parseFloat(currentValue.toFixed(1)); // Parse string to number with one decimal place

        if (countNumber === 1) {
          setCount1(formattedValue);
        } else if (countNumber === 2) {
          setCount2(formattedValue);
        } else if (countNumber === 3) {
          setCount3(formattedValue);
        }

        if (progress < duration) {
          requestAnimationFrame(startAnimation);
        }
      };

      requestAnimationFrame(startAnimation);
    }, delay * 1000);
  };

  return (
    <section
      ref={ref}
      className='bg-gradient-to-br from-midnight-blue to-navy-blue py-12 lg:py-14 xl:py-16'
    >
      <div className='wrapper'>
        <h6 className='text-center text-base text-ocean-mist md:text-lg lg:text-xl'>
          It is about delivering insightful analysis, not just numerical data..
        </h6>
        <div className='mt-8 flex flex-col justify-center gap-6 text-center md:flex-row md:gap-8 lg:gap-16'>
          <div className='flex flex-col justify-center gap-6 divide-y divide-[#334155] md:flex-row md:gap-8 md:divide-x lg:gap-16'>
            <div className='flex flex-col gap-2 md:gap-4'>
              <p className='flex-center mx-auto max-w-56 gap-0 text-3xl font-bold text-primary lg:text-4xl xl:text-5xl'>
                <span className='w-[60px] md:w-16 lg:w-20 xl:w-40'>
                  {count1}+
                </span>{' '}
                <span> crore</span>
              </p>
              <p className='text-sm text-ocean-mist md:text-base lg:text-lg'>
                Records
              </p>
            </div>
            <div></div>
          </div>
          <div className='flex flex-col justify-center gap-6 divide-y divide-[#334155] md:flex-row md:gap-8 md:divide-x lg:gap-16'>
            <div className='flex flex-col gap-2 md:gap-4'>
              <p className='flex-center mx-auto max-w-56 gap-0 text-3xl font-bold text-primary lg:text-4xl xl:text-5xl'>
                <span className='w-[60px] md:w-16 lg:w-20 xl:w-40'>
                  {count2}+
                </span>{' '}
                <span> lakhs</span>
              </p>
              <p className='text-sm text-ocean-mist md:text-base lg:text-lg'>
                Companies Financial Summary
              </p>
            </div>
            <div></div>
          </div>
          <div className='flex flex-col gap-2 md:gap-4'>
            <p className='flex-center mx-auto max-w-[280px] gap-2 text-3xl font-bold text-primary lg:text-4xl xl:text-5xl'>
              <span className='w-20 md:w-[88px] lg:w-[104px] xl:w-[164px]'>
                {count3}+
              </span>{' '}
              <span> lakhs</span>
            </p>
            <p className='text-sm text-ocean-mist md:text-base lg:text-lg'>
              Companies Incorporation Data
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analysis;
