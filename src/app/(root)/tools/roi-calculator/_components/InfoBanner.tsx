import { motion } from 'framer-motion';
import { ArrowRightCircle, LightbulbIcon } from 'lucide-react';

const InfoBanner = () => {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className='relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-0.5 shadow-sm'
      >
        <div className='flex flex-col items-center justify-between gap-4 rounded-lg bg-white/70 p-4 backdrop-blur-sm sm:flex-row sm:p-5'>
          <div className='flex items-center gap-3 text-center sm:text-left'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
              <LightbulbIcon className='h-5 w-5 text-blue-600' />
            </div>
            <p className='text-sm text-gray-700'>
              Want to see how you can maximize your profit with our New Company
              Alert subscription? Use this calculator to estimate your potential
              returns.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700'
          >
            Learn More
            <ArrowRightCircle className='h-4 w-4' />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoBanner;
