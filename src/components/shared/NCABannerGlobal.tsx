'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Mails, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function NCABannerGlobal({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  if (
    pathname.includes('/new-company-alert') ||
    pathname.includes('/dashboard')
  )
    return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id='nca-banner-global'
          // initial={{ height: 0, opacity: 0, y: -20 }}
          // animate={{ height: 48, opacity: 1, y: 0 }}
          // exit={{ height: 0, opacity: 0, y: -20 }}
          // transition={{
          //   duration: 0.4,
          //   ease: [0.4, 0.0, 0.2, 1],
          //   height: { duration: 0.3 },
          // }}
          className={cn(
            'relative overflow-hidden border-b-4 border-primary bg-gray-100',
            className
          )}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className='wrapper relative flex h-full flex-col items-center justify-center gap-2 py-2 text-xs md:flex-row md:gap-4 md:text-sm'
          >
            <div className='flex items-center gap-3'>
              {/* Content */}
              <div className='flex items-center space-x-2'>
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3, ease: 'backOut' }}
                  className='inline-flex items-center rounded-full border border-primary p-1 text-[10px] font-semibold text-primary shadow-sm md:text-xs'
                >
                  <Mails className='size-4' />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className='font-medium'
                >
                  Get newly registered company data with emails and phone
                  numbers — straight to your inbox, every day!
                </motion.span>
              </div>
            </div>

            {/* CTA and Close */}
            <div className='flex items-center space-x-2'>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  aria-label='Start receiving daily company leads with contact details'
                  href='/new-company-alert'
                  prefetch={false}
                  className='flex items-center gap-1 rounded-full border border-gray-300 bg-yellow-300 px-4 py-1 text-[10px] font-semibold transition-all hover:scale-105 md:text-xs'
                >
                  Start Receiving Leads Today
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowRight className='size-4' />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.2 }}
            whileHover={{
              scale: 1.1,
              backgroundColor: 'rgb(51 65 85)',
              color: 'white',
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(false)}
            className='absolute right-1 top-1 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white sm:top-2 md:right-4'
            aria-label='Dismiss banner'
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className='h-3 w-3' />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
