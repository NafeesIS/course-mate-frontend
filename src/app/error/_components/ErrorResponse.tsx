'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback, useEffect, useState } from 'react';

interface ErrorResponseProps {
  message: string;
  status?: number;
}

interface ProductCardProps {
  name: string;
  description: string;
  features: readonly string[];
  serviceType: string;
}

// Memoize ProductCard to prevent unnecessary re-renders
const ProductCard = memo(function ProductCard({
  name,
  description,
  features,
  serviceType,
}: ProductCardProps) {
  return (
    <div className='flex h-full flex-col rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg'>
      <h3 className='text-sm font-medium text-slate-800 md:text-lg'>{name}</h3>
      <p className='mt-2 text-xs text-slate-500 md:text-sm'>{description}</p>
      <div className='mt-3 flex-grow'>
        <ul className='space-y-1'>
          {features.slice(0, 2).map((feature, index) => (
            <li
              key={index}
              className='flex items-start text-[10px] text-slate-600 md:text-xs'
            >
              <svg
                className='mr-1.5 mt-0.5 h-3 w-3 flex-shrink-0 text-blue-500'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              {feature.length > 70 ? `${feature.substring(0, 70)}...` : feature}
            </li>
          ))}
        </ul>
      </div>
      <div className='mt-4'>
        <Link
          href={serviceType === 'subscription' ? '/new-company-alert' : '/'}
          className='inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1'
        >
          Visit Site
          <svg
            className='ml-1.5 h-3 w-3'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 5l7 7-7 7'
            />
          </svg>
        </Link>
      </div>
    </div>
  );
});

// Move products data outside component to prevent recreation on each render
const PRODUCTS = [
  {
    name: 'Unlock Company Data',
    description:
      'Gain access to detailed company information and financial data.',
    features: [
      "Access comprehensive financial statements, including the 'Statement of Assets and Liabilities'.",
      'Instantly download Public Documents such as incorporation certificates, annual returns, charge documents etc.',
    ],
    serviceType: 'companyUnlock',
  },
  {
    name: 'Public Documents Download',
    description:
      'Download MCA public documents, including company incorporation certificates.',
    features: [
      'Includes documents filed on both V2 & V3 MCA portal',
      'Access PNL statements, balance sheets, and annual reports',
    ],
    serviceType: 'vpdUnlock',
  },
  {
    name: 'New Company Alert',
    description:
      'Daily alerts for new company registrations with contact details.',
    features: [
      'Daily Email + Phone Contacts',
      'Mobile Number of ALL Directors',
    ],
    serviceType: 'subscription',
  },
] as const;

// Animation variants for better performance
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

export default function ErrorResponse({ message, status }: ErrorResponseProps) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Memoize handlers
  const handleProductChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    console.error(`Error ${status}: ${message}`);
    setMounted(true);

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % PRODUCTS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [message, status]);

  if (!mounted) return null;

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className='w-full max-w-lg overflow-hidden rounded-2xl bg-white p-8 shadow-xl'
      >
        <motion.div
          variants={iconVariants}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='flex justify-center'
        >
          <div className='relative h-20 w-20'>
            <div className='absolute inset-0 animate-pulse rounded-full bg-blue-100'></div>
            <svg
              className='relative z-10 h-full w-full text-primary'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
              />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='mt-6 text-center'
        >
          <h1 className='text-2xl font-medium text-slate-800 md:text-3xl'>
            {status ? `Error ${status}` : 'Something went wrong'}
          </h1>
          <p className='mt-4 text-red-500'>{message}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className='mt-8 space-y-3'
        >
          <Link
            href='/'
            prefetch={false}
            className='group relative block w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center text-sm font-medium text-white shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 md:text-base'
          >
            <span className='absolute inset-0 h-full w-0 bg-white bg-opacity-10 transition-all duration-300 ease-out group-hover:w-full'></span>
            <span className='relative flex items-center justify-center gap-2'>
              <svg
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                />
              </svg>
              Return Home
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className='mt-8'
        >
          <div className='mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-5'>
            <h2 className='mb-3 text-center text-xs font-medium text-slate-700 md:text-sm'>
              While you&apos;re here, explore our services
            </h2>

            <div className='relative overflow-hidden'>
              <div
                className='flex transition-transform duration-500 ease-in-out'
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {PRODUCTS.map((product, index) => (
                  <div key={index} className='w-full flex-shrink-0 px-1'>
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>

              <div className='mt-4 flex justify-center space-x-2'>
                {PRODUCTS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleProductChange(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      activeIndex === index ? 'bg-blue-500' : 'bg-blue-200'
                    }`}
                    aria-label={`View product ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className='flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-slate-500'>
            If the problem persists, please{' '}
            <a
              href='mailto:helpdesk@filesure.in'
              className='inline-flex items-center text-blue-600 hover:text-blue-700 hover:underline'
            >
              <Mail className='mr-1 h-3 w-3' /> Contact Support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
