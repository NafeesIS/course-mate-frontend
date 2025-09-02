'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, MailCheck, MessageCircle, PhoneCall } from 'lucide-react';
import Link from 'next/link';

const SupportSection = () => {
  return (
    <section
      id='support-section'
      className='overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50 py-16 md:py-24'
    >
      <div className='wrapper relative z-10 mx-auto'>
        <div className='text-center'>
          <h2 className='bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl lg:h-14 lg:text-5xl'>
            Need Help? We&apos;re Here for You
          </h2>
          <p className='mx-auto mt-1 max-w-lg text-center text-sm text-gray-600 lg:text-lg'>
            Have questions about bulk purchases or need assistance? Our support
            team is ready to help you.
          </p>
        </div>
        <div className='mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl'>
            <PhoneCall className='mb-4 h-12 w-12 text-sky-700' />
            <h3 className='mb-2 text-base font-semibold lg:text-xl'>Call Us</h3>
            <p className='mb-4 text-balance text-xs text-gray-600 lg:text-sm'>
              Speak directly with our support team
            </p>
            <Link
              href='tel:+918104946419'
              className={cn(buttonVariants({ variant: 'outline' }), 'mt-auto')}
            >
              +918104946419
            </Link>
          </div>

          <div className='flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl'>
            <MessageCircle className='mb-4 h-12 w-12 text-green-600' />
            <h3 className='mb-2 text-base font-semibold lg:text-xl'>
              WhatsApp Support
            </h3>
            <p className='mb-4 text-balance text-xs text-gray-600 lg:text-sm'>
              Chat with us for quick assistance
            </p>
            <Button
              variant='outline'
              className='mt-auto bg-green-500 text-white hover:bg-green-600 hover:text-white'
              onClick={() =>
                window.open(
                  'https://api.whatsapp.com/send/?phone=918104946419&text=Hi%2C+I+would+like+to+inquire+about+purchasing+contact+details+in+larger+quantities.+Could+you+please+provide+more+details%3F&type=phone_number&app_absent=0',
                  '_blank'
                )
              }
            >
              Chat on WhatsApp
            </Button>
          </div>

          <div className='flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl'>
            <MailCheck className='mb-4 h-12 w-12 text-purple-600' />
            <h3 className='mb-2 text-base font-semibold lg:text-xl'>
              Email Us
            </h3>
            <p className='mb-4 text-balance text-xs text-gray-600 lg:text-sm'>
              Send us an email anytime
            </p>
            <Link
              href='mailto:helpdesk@filesure.in'
              passHref
              className={cn(buttonVariants({ variant: 'default' }), 'mt-auto')}
            >
              helpdesk@filesure.in
            </Link>
          </div>

          <div className='flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl'>
            <Clock className='mb-4 h-12 w-12 text-orange-600' />
            <h3 className='mb-2 text-base font-semibold lg:text-xl'>
              Support Hours
            </h3>
            <p className='mb-4 text-balance text-xs text-gray-600 lg:text-sm'>
              We&apos;re available to assist you
            </p>
            <p
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'mt-auto'
              )}
            >
              Mon-Fri: 10AM - 6PM IST
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
