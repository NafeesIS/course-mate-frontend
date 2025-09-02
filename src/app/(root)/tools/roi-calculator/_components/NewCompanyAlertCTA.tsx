'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRightCircle, Check, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

const NewCompanyAlertCTA = () => {
  const benefits = [
    'Daily CSV files of new companies',
    'Mobile numbers & email IDs of companies & directors',
    'Full company address with PIN code',
    'Director names and DIN',
    'Company class & type information',
  ];

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className='rounded-xl border border-green-200 bg-gradient-to-r from-green-200 to-green-200 p-6 sm:p-8'
      >
        <div className='flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='flex items-center space-x-3'>
              <FileSpreadsheet className='h-8 w-8 flex-shrink-0 text-blue-900' />
              <h2 className='text-xl font-bold text-blue-900 sm:text-xl'>
                Get mobile numbers & email IDs of newly registered companies
              </h2>
            </div>

            <ul className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2'>
              {benefits.map((benefit, index) => (
                <li key={index} className='flex items-center space-x-2'>
                  <Check className='h-4 w-4 text-blue-900' />
                  <span className='text-sm font-medium text-blue-900'>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='mt-6 sm:mt-0'
          >
            <Link href='/new-company-alert' prefetch={false}>
              <Button
                size='lg'
                className='w-full bg-primary text-white sm:w-auto'
              >
                View Subscription Plans
                <ArrowRightCircle className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewCompanyAlertCTA;
