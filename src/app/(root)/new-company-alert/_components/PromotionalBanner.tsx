/* eslint-disable camelcase */
'use client';

import { useNCACampaignStatus } from '@/hooks/useNcaCampaign';
import { cn } from '@/lib/utils';
import { sendGTMEvent } from '@next/third-parties/google';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, ChevronRight, Clock, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PromotionalBanner() {
  const { isActive, end, discountEmailMobile } = useNCACampaignStatus();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [activeUsers, setActiveUsers] = useState(27);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    // Check initial scroll position on mount
    handleScroll();
    // Add event listener on scroll
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Simulate fluctuating active users
    const userTimer = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    // Only create campaignEndDate if end is not null
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

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(userTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      const offsetTop =
        pricingSection.getBoundingClientRect().top + window.pageYOffset - 20; // 20px margin
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
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
    }
  };

  // Don't show the banner if campaign is not active
  if (!isActive) return null;

  return (
    <div
      className={cn(
        'sticky top-14 z-20 max-h-[140px] overflow-hidden bg-green-50 text-foreground transition-shadow duration-500 md:top-16 md:max-h-20',
        isScrolled ? 'top-0 z-40 shadow md:top-0' : ''
      )}
    >
      {/* Background sparkles effect */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute h-8 w-8 animate-pulse rounded-full bg-yellow-300 blur-xl'
          style={{ left: '10%', top: '50%' }}
        />
        <div
          className='absolute h-8 w-8 animate-pulse rounded-full bg-yellow-300 blur-xl'
          style={{ left: '60%', top: '20%' }}
        />
        <div
          className='absolute h-8 w-8 animate-pulse rounded-full bg-yellow-300 blur-xl'
          style={{ left: '85%', top: '70%' }}
        />
      </div>

      <div
        onClick={scrollToPricing}
        className='wrapper relative flex flex-col items-center justify-between gap-1 px-4 py-2 md:flex-row'
      >
        <motion.div
          className='flex flex-col gap-1 space-y-1 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0 md:gap-0'
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div className='flex items-center space-x-3'>
            <div className='flex items-center space-x-1'>
              <Building2 className='size-5 text-primary md:size-5' />
              <Zap className='size-5 text-primary md:size-5' />
            </div>
            <div className='flex flex-col gap-1'>
              <div className='space-x-2 leading-tight'>
                <span className='text-sm font-bold text-primary lg:text-base'>
                  Email + Phone of Newly Registered Companies
                </span>
                <span className='whitespace-nowrap  rounded-full border bg-yellow-300 px-2 py-0.5 text-xs font-bold text-yellow-900'>
                  {discountEmailMobile}% OFF
                </span>
              </div>
              <span className='flex items-center text-xs text-gray-600'>
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

        <div className='flex items-center space-x-4'>
          <div className='flex flex-col items-end space-y-1'>
            <div className='flex items-center space-x-2 whitespace-nowrap rounded-lg bg-primary px-3 py-1.5'>
              <Clock className='h-4 w-4 text-gray-100' />
              <span className='text-xs font-medium text-gray-100'>
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
                        <span className='font-mono text-sm font-bold text-white'>
                          {value.toString().padStart(2, '0')}
                        </span>
                        <span className='ml-1 text-[10px] text-gray-100'>
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
            onClick={scrollToPricing}
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
      </div>

      {/* Bottom border with gradient */}
      <div className='absolute bottom-0 h-[2px] w-full bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent' />
    </div>
  );
}
