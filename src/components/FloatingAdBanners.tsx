'use client';

import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  LucideContact,
  LucideFileSpreadsheet,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buttonVariants } from './ui/button';

const useVerticalAutoplay = (delay: number, enabled: boolean) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: 'y',
      loop: true,
    },
    [
      Autoplay({
        delay,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        playOnInit: enabled,
      }),
    ]
  );

  useEffect(() => {
    if (emblaApi) {
      const autoplay = emblaApi.plugins().autoplay;
      if (enabled) {
        autoplay.play();
      } else {
        autoplay.stop();
      }
    }
  }, [emblaApi, enabled]);

  return { emblaRef, emblaApi };
};

const FloatingAdBanner = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { emblaRef, emblaApi } = useVerticalAutoplay(8000, true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      };

      const onReInit = () => {
        setTotalSlides(emblaApi.scrollSnapList().length);
        setCurrentIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on('select', onSelect);
      emblaApi.on('reInit', onReInit);

      // Initialize values on mount
      onReInit();

      return () => {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onReInit);
      };
    }
  }, [emblaApi]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut', delay: 3 }}
      className='fixed bottom-4 left-4 z-50 rounded-lg shadow-lg'
    >
      <motion.div
        animate={{
          width: isCollapsed ? 220 : 384,
          height: isCollapsed ? 56 : 224,
        }}
        transition={{ duration: 0.3 }}
        className='relative bg-gray-100'
      >
        <button
          title={isCollapsed ? 'Expand' : 'Collapse'}
          onClick={toggleCollapse}
          className={cn(
            'absolute z-10 rounded-full border bg-gray-100 p-1 text-gray-800 shadow-xl hover:bg-gray-200',
            isCollapsed ? '-right-2 -top-2' : 'right-2 top-2'
          )}
        >
          {isCollapsed ? (
            <Maximize2 className='h-3 w-3' />
          ) : (
            <Minimize2 className='h-3 w-3' />
          )}
        </button>

        <AnimatePresence mode='wait'>
          {isCollapsed ? (
            <motion.div
              key='collapsed'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              ref={emblaRef}
              className='h-full overflow-hidden rounded-lg'
            >
              <div className='flex h-full flex-col'>
                <CollapsedBanner
                  href='/unlock-contact/bulk-unlock'
                  icon={<LucideContact className='text-lg' />}
                  text="Get Directors' Contact"
                  bgColor='bg-gradient-to-tr from-blue-600/80 to-blue-400/80'
                  textColor='text-blue-700'
                />
                <CollapsedBanner
                  href='/new-company-alert'
                  icon={<LucideFileSpreadsheet className='text-lg' />}
                  text='Get New Company Alerts'
                  bgColor='bg-gradient-to-tr from-green-700/80 to-green-400/80'
                  textColor='text-green-800'
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key='expanded'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              ref={emblaRef}
              className='h-full overflow-hidden rounded-lg'
            >
              <div className='flex h-full flex-col'>
                <BannerUnlockDirectorsContact />
                <BannerNewCompanyAlert />
              </div>

              <div className='flex-col-center absolute right-2 top-1/2 -translate-y-1/2 gap-1 rounded-lg bg-gray-500/20 py-0.5 text-gray-100 transition-all duration-300 hover:bg-gray-700/100'>
                <button onClick={scrollPrev} className=''>
                  <ChevronUp className='size-4' />
                </button>
                <div className='flex flex-col items-center gap-1'>
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        'h-1 w-1 rounded-full',
                        currentIndex === index ? 'bg-gray-50' : 'bg-gray-400'
                      )}
                    />
                  ))}
                </div>
                <button onClick={scrollNext} className=''>
                  <ChevronDown className='size-4' />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const CollapsedBanner = ({
  href,
  icon,
  text,
  bgColor,
  textColor,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  bgColor: string;
  textColor: string;
}) => (
  <div className={`h-20 w-full ${bgColor} p-2`}>
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: 'secondary' }),
        `h-full w-full gap-2 px-3 text-xs font-bold ${textColor}`
      )}
    >
      {icon}
      {text}
    </Link>
  </div>
);

const BannerUnlockDirectorsContact = () => (
  <div className='h-56 w-96 bg-gradient-to-tr from-blue-600 to-blue-500 p-4 text-white'>
    <h2 className='mb-4 w-[90%] text-xl font-semibold'>
      Only Need to Talk to <br className='hidden sm:inline xl:hidden' />
      the Decision Makers?
    </h2>
    <p className='mb-6 text-xs font-light'>
      Skip the clutter and get straight to what matters - directors&apos;
      contact info from newly registered companies. Quick, direct, and perfect
      for focused outreach.
    </p>
    <Link
      href='/unlock-contact'
      className={cn(
        buttonVariants({ variant: 'secondary' }),
        'h-12 w-full gap-2 px-5 text-sm font-bold text-blue-700'
      )}
    >
      <LucideContact className='text-lg' />
      Get Directors&apos; Contact Now
    </Link>
  </div>
);

const BannerNewCompanyAlert = () => (
  <div className='h-56 w-96 bg-gradient-to-tr from-green-700 to-green-600 p-4 text-white'>
    <h2 className='mb-4 w-[95%] text-xl font-semibold'>
      Get Full Reports on Newly Registered Companies!
    </h2>
    <p className='mb-6 text-xs font-light'>
      New Company Alerts provides everything you need to understand your
      leads-detailed company data plus directors&apos; contact information in
      one place.
    </p>
    <Link
      href='/new-company-alert'
      className={cn(
        buttonVariants({ variant: 'secondary' }),
        'h-12 w-full gap-2 px-5 text-sm font-bold text-green-800'
      )}
    >
      <LucideFileSpreadsheet className='text-lg' />
      Get Your Daily Reports Now
    </Link>
  </div>
);

export default FloatingAdBanner;
