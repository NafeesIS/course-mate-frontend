'use client';

import { motion } from 'framer-motion';

const ManageCampaignPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className='text-3xl font-semibold'>Manage Campaign</h1>
    </motion.div>
  );
};

export default ManageCampaignPage;
