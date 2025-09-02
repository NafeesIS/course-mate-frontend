// components/modals/EmailModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowRight, Mail, Send } from 'lucide-react';
import { useState } from 'react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onEmailSubmit: (email: string) => void;
  onSkip: () => void;
}

const EmailModal = ({
  isOpen,
  onClose,
  onEmailSubmit,
  onSkip,
}: EmailModalProps) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidateEmail = validateEmail(email);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await onEmailSubmit(email);
      setEmail('');
      setEmailError('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    setEmail('');
    setEmailError('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setEmail('');
      setEmailError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='mx-auto w-full max-w-md overflow-hidden border-0 p-0 shadow-2xl [&>[data-radix-dialog-close]]:hidden'>
        {/* Header with gradient background */}
        <div className='bg-gradient-to-r from-primary to-blue-700 px-6 py-6 text-white md:py-8'>
          <DialogHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-white/20 p-2'>
                  <Mail className='h-5 w-5' />
                </div>
                <DialogTitle className='text-lg font-semibold md:text-xl'>
                  Stay Connected
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className='space-y-6 px-6 py-4'>
          <div className='text-center'>
            <DialogDescription className='text-sm leading-relaxed text-gray-600 md:text-base'>
              We would love to follow up on your feedback and keep you updated
              on improvements we make based on your suggestions.
            </DialogDescription>
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='text-sm font-medium text-gray-700'
            >
              Email Address
            </label>
            <div className='relative'>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder='Enter your valid email address'
                className={`w-full rounded-lg border-2 bg-gray-50 px-2 py-2 pl-10 text-gray-700 transition-all duration-200 placeholder:text-xs focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:px-8 md:py-3 placeholder:md:text-sm ${
                  emailError
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200'
                }`}
                disabled={isSubmitting}
              />
              <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            </div>
            {emailError && (
              <div className='flex items-center gap-2 text-sm text-red-600'>
                <div className='h-1 w-1 rounded-full bg-red-600'></div>
                {emailError}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className='flex gap-3'>
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className='flex-1 rounded-lg border-2 border-gray-200 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 md:py-3 md:text-base'
            >
              Maybe Later
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !email.trim() || !isValidateEmail}
              className='group flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-blue-600 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-primary hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:py-3 md:text-base'
            >
              {isSubmitting ? (
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
              ) : (
                <>
                  <Send className='h-4 w-4' />
                  Continue
                  <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                </>
              )}
            </button>
          </div>

          {/* Privacy note */}
          <p className='text-center text-xs text-gray-500'>
            We respect your privacy. Your email will only be used for feedback
            follow-ups.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
