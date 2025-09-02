'use client';

import { motion } from 'framer-motion';
import PurchaseHistory from './_components/PurchaseHistory';

export default function UnlockedCompaniesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <PurchaseHistory />
    </motion.div>
  );
}
