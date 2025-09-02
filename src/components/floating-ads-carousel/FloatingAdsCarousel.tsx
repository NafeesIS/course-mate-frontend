'use client';

import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { buttonVariants } from '../ui/button';

interface BannerProps {
  href: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  buttonText: string;
  bgColor: string;
  textColor: string;
}

interface FloatingAdBannerProps {
  banners: BannerProps[];
  autoplayDelay?: number;
  initialDelay?: number;
}

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

const FloatingAdsCarousel: React.FC<FloatingAdBannerProps> = ({
  banners,
  autoplayDelay = 10000,
  initialDelay = 3000,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { emblaRef, emblaApi } = useVerticalAutoplay(autoplayDelay, true);
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
      transition={{
        duration: 1,
        ease: 'easeInOut',
        delay: initialDelay / 1000,
      }}
      className='fixed bottom-4 left-4 z-50 rounded-lg shadow-lg'
    >
      <motion.div
        animate={{
          width: isCollapsed ? 240 : 384,
          height: isCollapsed ? 56 : 224,
        }}
        transition={{ duration: 0.3 }}
        className='relative rounded-lg bg-gray-100'
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
                {banners.map((banner, index) => (
                  <CollapsedBanner key={index} {...banner} />
                ))}
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
                {banners.map((banner, index) => (
                  <ExpandedBanner key={index} {...banner} />
                ))}
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

const CollapsedBanner: React.FC<BannerProps> = ({
  href,
  icon,
  buttonText,
  bgColor,
  textColor,
}) => (
  <div className={`h-20 w-full ${bgColor} p-2`}>
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: 'secondary' }),
        `h-full w-full gap-1.5 whitespace-nowrap px-2 text-xs font-bold ${textColor}`
      )}
    >
      {icon}
      {buttonText}
    </Link>
  </div>
);

const ExpandedBanner: React.FC<BannerProps> = ({
  href,
  icon,
  title,
  subtitle,
  buttonText,
  bgColor,
  textColor,
}) => (
  <div className={`h-56 w-96 ${bgColor} p-4 text-white`}>
    <h2 className='mb-4 w-[90%] text-xl font-semibold'>{title}</h2>
    <p className='mb-6 text-xs font-light'>{subtitle}</p>
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: 'secondary' }),
        `h-12 w-full gap-2 px-5 text-sm font-bold ${textColor}`
      )}
    >
      {icon}
      {buttonText}
    </Link>
  </div>
);

export default FloatingAdsCarousel;
