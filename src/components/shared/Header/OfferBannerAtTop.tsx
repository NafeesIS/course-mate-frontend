/* eslint-disable camelcase */
'use client';

import useMediaQuery from '@/hooks/useMediaQuery';
import { useNCACampaignStatus } from '@/hooks/useNcaCampaign';
import { cn } from '@/lib/utils';
import { sendGTMEvent } from '@next/third-parties/google';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Clock, Users, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiBuilding2Fill, RiFlashlightFill } from 'react-icons/ri';
import cityBG from '../../../../public/assets/banners/city.png';

export default function PromotionalBanner() {
  const { isActive, end, discountEmailMobile } = useNCACampaignStatus();
  const pathname = usePathname();
  const router = useRouter();
  const isProductPage = pathname.includes('new-company-alert');
  const isDashboard = pathname.includes('dashboard');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [activeUsers, setActiveUsers] = useState(27);

  useEffect(() => {
    // to avoid running timer unnecessarily
    if (isDesktop && !isProductPage) {
      // Simulate fluctuating active users
      const userTimer = setInterval(() => {
        setActiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1);
      }, 5000);

      // Use campaign end date from util
      const campaignEndDate = end ? new Date(end) : null;

      const updateTimer = () => {
        const now = new Date();
        if (!campaignEndDate) return;
        const difference = campaignEndDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          clearInterval(timer);
        }
      };

      const timer = setInterval(updateTimer, 1000);
      updateTimer();

      return () => {
        clearInterval(timer);
        clearInterval(userTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, isProductPage]);

  const redirectToPage = () => {
    sendGTMEvent({
      event: 'promotional_banner_click',
      ecommerce: {
        items: [
          {
            item_name: 'New Company Alert Offer',
            item_category: 'Promotional Banner',
          },
        ],
      },
      eventData: {
        action: 'Click',
        label: 'New Company Alert Offer Banner',
        value: 1,
      },
    });
    router.push('/new-company-alert', { scroll: false });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the banner click
    setIsVisible(false);
  };

  // don't show the banner in the product page or if it's been closed or campaign is not active
  if (isProductPage || isDashboard || !isVisible || !isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        id='OfferBannerAtTop'
        initial={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'relative z-20 max-h-[140px] overflow-hidden bg-green-50 text-foreground transition-shadow duration-500 md:max-h-20'
        )}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className='absolute right-2 top-2 z-50 rounded-full p-0.5 text-gray-500 hover:bg-black/5 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
          aria-label='Close banner'
        >
          <X className='h-4 w-4' />
        </button>

        <div
          onClick={redirectToPage}
          className='wrapper relative flex flex-col items-center justify-between gap-1 px-4 py-1 md:flex-row'
        >
          <Image
            src={cityBG}
            alt='cityBG'
            width={1200}
            height={700}
            priority
            className='absolute -right-10 top-0 h-full w-40 object-cover object-bottom opacity-5 md:w-60'
          />
          <Image
            src={cityBG}
            alt='cityBG'
            width={1200}
            height={700}
            priority
            className='absolute -left-10 top-0 h-full w-40 object-cover object-center opacity-5 md:w-60'
          />
          <motion.div
            className='flex flex-col gap-1 space-y-1 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0 md:gap-0'
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <div className='flex items-center justify-center space-x-3'>
              <div className='flex items-center space-x-1'>
                <RiBuilding2Fill className='size-5 text-sky-500 md:size-5' />
                <RiFlashlightFill className='hidden size-5 text-red-500 md:inline-block md:size-5' />
              </div>
              <div className='flex flex-col gap-1'>
                <div className='space-x-2 leading-snug md:leading-tight'>
                  <span className='text-balance text-sm font-bold text-primary lg:text-base'>
                    Email + Phone of Newly Registered Companies
                  </span>
                  <span className='hidden whitespace-nowrap rounded-full border bg-yellow-300 px-2 py-0.5 text-xs font-bold text-yellow-900 md:inline-block'>
                    {discountEmailMobile}% OFF
                  </span>

                  <motion.button
                    onClick={redirectToPage}
                    className='group relative inline-flex items-center gap-1 overflow-hidden whitespace-nowrap rounded-full border bg-gradient-to-r from-yellow-300 to-yellow-400 px-2 py-0.5 text-xs font-bold text-foreground transition-all md:hidden'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className='relative z-10'>
                      Claim {discountEmailMobile}% Discount
                    </span>
                    <ChevronRight className='relative z-10 size-3 transition-transform group-hover:translate-x-1' />
                    <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-transform group-hover:translate-x-0' />
                  </motion.button>
                </div>
                <span className='flex items-center text-[10px] text-gray-600 md:text-xs'>
                  Exclusive Offer - Valid until{' '}
                  {end ? format(end, 'do MMMM yyyy') : ''}
                  <motion.span
                    className='ml-2 hidden items-center space-x-2 rounded-full bg-gray-600 px-3 py-0.5 text-[10px] text-white xl:flex'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Users className='size-3 text-yellow-300' />
                    <span className='animate-pulse'>
                      {activeUsers} people viewing this offer
                    </span>
                  </motion.span>
                </span>
              </div>
            </div>
          </motion.div>

          {isDesktop && (
            <div className='hidden items-center space-x-4 md:flex'>
              <div className='flex flex-col items-end space-y-1'>
                <div className='flex items-center space-x-2 whitespace-nowrap rounded-lg'>
                  <Clock className='h-4 w-4 text-gray-500' />
                  <span className='text-xs font-medium text-gray-600'>
                    Ends in:
                  </span>
                  <div className='flex space-x-2'>
                    <AnimatePresence mode='popLayout'>
                      {Object.entries(timeLeft).map(([key, value]) =>
                        value > 0 ? (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className='flex items-center'
                          >
                            <span className='font-mono text-sm font-bold text-blue-800'>
                              {value.toString().padStart(2, '0')}
                            </span>
                            <span className='ml-1 text-[10px] text-sky-800'>
                              {key.charAt(0).toUpperCase()}
                            </span>
                          </motion.div>
                        ) : null
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <span className='hidden text-[10px] text-gray-600 lg:block'>
                  Last chance to get this offer!
                </span>
              </div>

              <motion.button
                onClick={redirectToPage}
                className='group relative hidden items-center gap-1 overflow-hidden whitespace-nowrap rounded-full border bg-gradient-to-r from-yellow-300 to-yellow-400 px-4 py-2 text-xs font-bold text-foreground transition-all md:flex lg:text-sm'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className='relative z-10'>
                  Claim {discountEmailMobile}% Discount
                </span>
                <ChevronRight className='relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1' />
                <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-transform group-hover:translate-x-0' />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
