'use client';

import { motion } from 'framer-motion';

const CouponManagementPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className='text-3xl font-semibold'>Coupon Management</h1>
    </motion.div>
  );
};

export default CouponManagementPage;
