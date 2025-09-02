'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  RiCloseLine,
  RiCustomerService2Line,
  RiSendPlaneFill,
  RiWhatsappLine,
} from 'react-icons/ri';

const CustomWhatsappBtn = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hi'); // Predefined message
    window.open(`https://wa.me/918104946419?text=${message}`, '_blank');
  };

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col items-end'>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='mb-4'
          >
            <Card className='w-80 overflow-hidden'>
              <CardHeader className='bg-[#24c960] text-white'>
                <CardTitle className='flex items-center text-lg font-semibold'>
                  <RiCustomerService2Line className='mr-2 size-8' />
                  Chat with Support
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-4'>
                <p className='mb-4 text-sm text-muted-foreground'>
                  How can we assist you today? Our team is ready to help you via
                  WhatsApp.
                </p>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center'>
                    <RiSendPlaneFill className='mr-2 text-[#24c960]' />
                    Quick responses
                  </li>
                  <li className='flex items-center'>
                    <RiCustomerService2Line className='mr-2 text-[#24c960]' />
                    Expert support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={openWhatsApp}
                  className='flex w-full items-center justify-center bg-[#24c960] text-white transition-colors duration-300 hover:bg-[#1ea951]'
                >
                  <RiWhatsappLine className='mr-2 size-5' />
                  Start WhatsApp Chat
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
        transition={{ duration: 0.3 }}
        onClick={toggleChat}
        className='flex items-center justify-center rounded-full bg-[#24c960] p-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#1ea951] focus:outline-none focus:ring-2 focus:ring-[#24c960] focus:ring-offset-2'
        aria-label={isOpen ? 'Close chat widget' : 'Open chat widget'}
      >
        {isOpen ? (
          <RiCloseLine className='text-3xl' />
        ) : (
          <RiWhatsappLine className='text-3xl' />
        )}
      </motion.button>
    </div>
  );
};

export default CustomWhatsappBtn;
