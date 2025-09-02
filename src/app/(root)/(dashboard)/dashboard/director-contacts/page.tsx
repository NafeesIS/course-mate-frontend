'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { DirectorSearch } from './_components/DirectorSearch';
import HowItWorks from './_components/HowItWorks';
import PurchaseHistory from './_components/PurchaseHistory';
import YourCredits from './_components/YourCredits';

const UnlockContactPage = () => {
  return (
    <div className='pb-16'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-xl font-bold text-gray-900 md:text-3xl'>
          Unlock Director Contact Details
        </h1>
        <p className='mt-2 text-xs text-gray-600 md:text-base'>
          Search and unlock director contact details using your credits
        </p>
      </motion.div>

      <div className='mt-6 grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-3'>
        {/* left column */}
        <motion.div
          className='lg:col-span-2'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className='mb-6 md:mb-10'>
            <CardHeader className='p-4 md:p-6 md:pb-4'>
              <CardTitle className='text-sm md:text-base'>
                Search Directors
              </CardTitle>
              <CardDescription className='text-xs md:text-sm'>
                Enter a DIN, Director Name or Company Name to search
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
              {/* DirectorSearch Main Component */}
              <DirectorSearch />
            </CardContent>
          </Card>

          <PurchaseHistory />
        </motion.div>

        {/* right column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='flex flex-col gap-4 sm:flex-row sm:items-stretch md:order-2 lg:sticky lg:top-4 lg:flex-col lg:self-start'
        >
          <YourCredits />
          <HowItWorks />
        </motion.div>
      </div>
    </div>
  );
};

export default UnlockContactPage;
