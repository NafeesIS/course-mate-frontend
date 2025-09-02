'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThankYouModal = ({ isOpen, onClose }: ThankYouModalProps) => {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3); // Reset when modal closes
      return;
    }

    if (countdown <= 0) {
      onClose();
      router.push('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, countdown, onClose, router]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-full max-w-lg border-0 bg-transparent p-0 shadow-none [&>[data-radix-dialog-close]]:hidden'>
        <div className='animate-scaleIn relative w-full transform'>
          {/* Decorative background elements */}
          <div className='absolute inset-0 scale-110 rounded-3xl bg-gradient-to-br from-green-400/20 via-blue-500/20 to-purple-600/20 blur-xl'></div>
          <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-500/30 blur-2xl'></div>
          <div className='absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-tr from-green-400/30 to-blue-500/30 blur-2xl'></div>

          <div className='relative overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-lg'>
            {/* Success Animation Background */}
            <div className='absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'></div>

            {/* Content */}
            <div className='relative p-5 text-center md:p-8'>
              {/* Success Icon with Animation */}
              <div className='relative mb-6'>
                <div className='inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl'>
                  <svg
                    className='h-10 w-10 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={3}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              </div>

              {/* Thank You Message */}
              <div className='mb-8'>
                <DialogTitle className='mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-2xl font-bold text-gray-800 text-transparent md:text-3xl'>
                  Thank You!
                </DialogTitle>
                <div className='mx-auto max-w-md'>
                  <DialogDescription className='mb-4 text-sm leading-relaxed text-gray-600 md:text-base'>
                    Your feedback has been successfully submitted
                  </DialogDescription>
                  <div className='flex items-center justify-center gap-2 text-sm font-semibold text-green-600'>
                    <svg
                      className='h-5 w-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                      />
                    </svg>
                    We appreciate you taking the time!
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col justify-center gap-3 sm:flex-row'>
                <Link
                  href='/'
                  onClick={onClose}
                  className='transform rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3 text-center font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300/50'
                >
                  Explore Filesure
                </Link>
              </div>

              {/* Countdown Display */}
              <div className='mt-4 text-sm text-gray-500'>
                Redirecting to home page in{' '}
                <span className='font-semibold text-green-600'>
                  {countdown}
                </span>{' '}
                seconds...
              </div>

              {/* Bottom decoration */}
              <div className='mt-6 flex justify-center'>
                <div className='flex gap-1'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-green-400'></div>
                  <div
                    className='h-2 w-2 animate-pulse rounded-full bg-blue-400'
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className='h-2 w-2 animate-pulse rounded-full bg-purple-400'
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThankYouModal;
