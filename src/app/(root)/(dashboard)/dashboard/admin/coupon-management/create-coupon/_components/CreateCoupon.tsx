'use client';
import { motion } from 'framer-motion';
import CouponCreationForm from './CouponCreationForm';

const CreateCoupon = () => {
  return (
    <div>
      {/* Heading Animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-4 text-center text-xl font-semibold lg:text-2xl'
      >
        Coupon Creation Form
      </motion.h1>

      {/* Form Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }} // Delayed to start after the heading animation
      >
        <CouponCreationForm />
      </motion.div>
    </div>
  );
};

export default CreateCoupon;
