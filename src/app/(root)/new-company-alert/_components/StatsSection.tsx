'use client';
import { format, subDays, subMonths } from 'date-fns';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import dottedBg from '../../../../../public/assets/new-company-alert/dotted_bg.svg';
import rounded from '../../../../../public/assets/new-company-alert/rounded_vector.svg';
import tushar from '../../../../../public/assets/new-company-alert/tushar.png';
import { CountUpProps, ICompanyAndLLPCountsData } from '../_utils/types';

const CountUp: React.FC<CountUpProps> = ({ value, label, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Create motion value for animation
  const count = useMotionValue(0);

  // Use spring for smoother animation
  const smoothCount = useSpring(count, {
    damping: 15,
    stiffness: 100,
  });

  // Transform the motion value to a formatted string
  const displayCount = useTransform(smoothCount, (latest) =>
    Math.floor(latest).toLocaleString('en-IN')
  );

  // Animate when in view
  useEffect(() => {
    if (isInView && value) {
      count.set(value);
    }
  }, [isInView, value, count]);

  return (
    <div ref={ref} className={className}>
      <div className='text-sm text-white'>{label}</div>
      <motion.div className='mb-4 text-3xl font-bold'>
        {isInView ? (
          displayCount
        ) : (
          <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
        )}
      </motion.div>
    </div>
  );
};

const StatsSection = ({
  companyAndLLPCountsData,
}: {
  companyAndLLPCountsData: ICompanyAndLLPCountsData;
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeCard, setActiveCard] = useState(0);
  const today = new Date();
  // Previous day
  const previousDay = subDays(today, 1);
  const previousDayString =
    ' Registered Companies : ' + format(previousDay, 'dd MMMM yyyy');

  // Previous month
  const previousMonth = subMonths(today, 1);
  const previousMonthString =
    ' Registered Companies : ' + format(previousMonth, 'MMMM yyyy');
  const scrollToCard = (index: number) => {
    const container = scrollRef.current;
    if (container && container.children.length > index) {
      const card = container.children.item(index) as HTMLElement;
      if (card) {
        container.scrollTo({
          left: card.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  // Update activeCard on scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const firstChild = container.children[0] as HTMLElement;
      const cardWidth = firstChild?.offsetWidth || 1;
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveCard(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  // Auto-play functionality to change cards every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveCard((prevState) => {
        const nextCard = (prevState + 1) % 4; // Loop through 4 cards
        scrollToCard(nextCard); // Scroll to the next card
        return nextCard;
      });
    }, 3000); // Change card every 3 seconds

    // Cleanup the interval when component is unmounted
    return () => clearInterval(intervalId);
  }, []);
  return (
    <section
      style={{
        backgroundImage: `url(${dottedBg.src})`,
      }}
    >
      <div className='wrapper flex flex-col items-center justify-between gap-8 lg:flex-row'>
        {/* Left Content */}
        <div className='mx-auto max-w-md text-center lg:mx-0 lg:mr-auto lg:max-w-72 lg:text-start xl:max-w-[370px]'>
          <h6 className='mb-2 text-3xl font-semibold xl:text-4xl xl:leading-snug'>
            Connecting you directly{' '}
            <span className='text-nca-primary-blue'>
              with key decision-makers!
            </span>
          </h6>
          <div className='relative'>
            <p className='mb-6 text-xs text-nca-sub-heading-text md:text-sm'>
              Filesure provides you potential B2B customer leads which brings
              you extraordinary business growth
            </p>
            <Image
              src={rounded}
              alt='circle'
              width={120}
              height={120}
              className='absolute bottom-0 right-0 hidden md:-bottom-16 lg:block'
            />
          </div>
        </div>

        {/* Right Cards */}
        <div
          ref={scrollRef}
          className='flex w-full max-w-2xl snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth sm:gap-8 md:grid md:snap-none md:grid-cols-2 md:overflow-visible xl:justify-end xl:gap-10'
        >
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className='w-full shrink-0 snap-start pr-2 md:w-auto md:pr-0'
            >
              {index === 0 && (
                <motion.div className='min-h-72 min-w-[90vw] rounded-[21px] bg-[#081123] p-6 text-white md:min-h-0 md:min-w-0 md:translate-x-4 lg:w-80 lg:translate-x-0 xl:p-6'>
                  {companyAndLLPCountsData ? (
                    <>
                      <CountUp
                        value={companyAndLLPCountsData.companyCount}
                        label='No of companies'
                      />
                      <CountUp
                        value={companyAndLLPCountsData.llpCount}
                        label='No of LLPs'
                      />
                      <CountUp
                        value={companyAndLLPCountsData.directorCount}
                        label='No of Directors'
                      />
                    </>
                  ) : (
                    <>
                      <div className='text-sm text-white'>No of companies</div>
                      <div className='mb-4 text-3xl font-bold'>
                        <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
                      </div>
                      <div className='text-sm text-white'>No of LLPs</div>
                      <div className='mb-4 text-3xl font-bold'>
                        <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
                      </div>
                      <div className='text-sm text-white'>No of Directors</div>
                      <div className='text-3xl font-bold'>
                        <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
                      </div>
                    </>
                  )}
                </motion.div>
              )}
              {index === 1 && (
                <motion.div className='min-h-72 min-w-[90vw] rounded-[21px] bg-[#081123] p-6 text-white md:min-h-0 md:min-w-0 md:translate-x-4 md:translate-y-6 lg:w-80 lg:translate-x-0 lg:p-5 xl:translate-y-8 xl:p-6'>
                  <p className='mb-4 text-[15px] font-medium xs:whitespace-nowrap'>
                    {previousDayString}
                  </p>
                  {companyAndLLPCountsData ? (
                    <>
                      <CountUp
                        value={companyAndLLPCountsData.previousDayCompanies}
                        label='No of companies'
                      />
                      <CountUp
                        value={companyAndLLPCountsData.previousDayLLPs}
                        label='No of LLPs'
                      />
                      <CountUp
                        value={companyAndLLPCountsData.previousDayDirectorCount}
                        label='No of Directors'
                      />
                    </>
                  ) : (
                    <>
                      <div className='text-sm text-white'>No of companies</div>
                      <div className='mb-4 text-3xl font-bold'>
                        <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
                      </div>
                      <div className='text-sm text-white'>No of LLPs</div>
                      <div className='mb-4 text-3xl font-bold'>
                        <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
                      </div>
                      <div className='text-sm text-white'>No of Directors</div>
                      <div className='text-3xl font-bold'>
                        <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
                      </div>
                    </>
                  )}
                </motion.div>
              )}
              {index === 2 && (
                <motion.div
                  className={`relative min-h-72 min-w-[90vw] rounded-[21px] bg-nca-primary-blue p-5 text-white md:min-h-0 md:min-w-0 md:-translate-x-4 md:-translate-y-9 lg:w-80 lg:-translate-x-8 xl:-translate-x-14 xl:-translate-y-8`}
                >
                  <div className='flex items-center justify-start gap-4'>
                    <Image
                      src={tushar}
                      alt='Tushar Gulabrao'
                      width={60}
                      height={60}
                      quality={100}
                      className='h-auto w-auto rounded-full'
                    />
                    <div className='flex flex-col items-start justify-center'>
                      <div className='mb-1 text-sm'>DIN: 09167242</div>
                      <div className='font-semibold'>Tushar Gulabrao</div>
                    </div>
                  </div>
                  <div className='mt-4 rounded-lg bg-nca-secondary-blue p-4'>
                    <div className='space-y-2 text-xs md:text-sm'>
                      <div>Email: tushar@filesure.in</div>
                      <div>Mobile: +91 81049 46419</div>
                      <div>
                        Company Name: Filesure India <br /> Private Limited
                      </div>
                      <div>Nature of Business: Computer Programming</div>
                      <div>Date of Incorporation: 05-Oct-2023</div>
                    </div>
                  </div>
                </motion.div>
              )}
              {index === 3 && (
                <motion.div className='min-h-72 min-w-[90vw] rounded-[21px] bg-[#081123] p-6 text-white md:min-h-0 md:min-w-0 md:-translate-x-4 md:translate-y-6 lg:w-80 lg:-translate-x-8 xl:-translate-x-14 xl:translate-y-10 xl:p-6'>
                  <p className='mb-4 text-[15px] font-medium xs:whitespace-nowrap'>
                    {previousMonthString}
                  </p>
                  {companyAndLLPCountsData ? (
                    <>
                      <CountUp
                        value={companyAndLLPCountsData.previousMonthCompanies}
                        label='No of companies'
                      />
                      <CountUp
                        value={companyAndLLPCountsData.previousMonthLLPs}
                        label='No of LLPs'
                      />
                      <CountUp
                        value={
                          companyAndLLPCountsData.previousMonthDirectorCount
                        }
                        label='No of Directors'
                      />
                    </>
                  ) : (
                    <>
                      <div className='text-sm text-white'>No of companies</div>
                      <div className='mb-4 text-3xl font-bold'>
                        <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
                      </div>
                      <div className='text-sm text-white'>No of LLPs</div>
                      <div className='mb-4 text-3xl font-bold'>
                        <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
                      </div>
                      <div className='text-sm text-white'>No of Directors</div>
                      <div className='text-3xl font-bold'>
                        <RefreshCw className='mt-2 h-4 w-4 animate-spin' />
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className='mt-4 flex justify-center space-x-2 md:hidden'>
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`h-2 w-2 rounded-full ${
                activeCard === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
