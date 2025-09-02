'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import HowItWorks from './_components/HowItWorks';
import PurchaseHistory from './_components/PurchaseHistory';
import SearchBar from './_components/SearchBar';
import YourCredits from './_components/YourCredits';

export default function UnlockCompaniesPage() {
  return (
    <div className='pb-16'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-xl font-bold text-gray-900 md:text-3xl'>
          Unlock Companies
        </h1>
        <p className='mt-2 text-xs text-gray-600 md:text-base'>
          Search and unlock company details using your credits
        </p>
      </motion.div>

      <div className='mt-6 grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-3'>
        <motion.div
          className='space-y-4 sm:space-y-8 lg:col-span-2'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className='p-4 md:p-6 md:pb-4'>
              <CardTitle className='text-sm md:text-base'>
                Search Companies
              </CardTitle>
              <CardDescription className='text-xs md:text-sm'>
                Enter a CIN or Company Name to search
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
              <SearchBar />
            </CardContent>
          </Card>

          <PurchaseHistory />

          {/* <ExpiredUnlocks /> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='flex flex-col gap-4 sm:flex-row sm:items-stretch lg:flex-col'
        >
          <YourCredits />
          <HowItWorks />
        </motion.div>
      </div>
    </div>
  );
}
