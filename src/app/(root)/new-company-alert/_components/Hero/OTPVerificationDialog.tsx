'use client';

/* eslint-disable no-console */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Slot } from '@/components/ui/otp-input';
import { OTPInput } from 'input-otp';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface OTPVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  handleFormSubmit: () => void;
  contactNo: string;
}

const OTPVerificationDialog = ({
  isOpen,
  onClose,
  handleFormSubmit,
  contactNo,
}: OTPVerificationDialogProps) => {
  const [otp, setOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef<number | null>(null);

  const [hasTriedWhatsApp, setHasTriedWhatsApp] = useState(false);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleVerifyOTP = useCallback(() => {
    if (otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError(null);

    if (typeof window !== 'undefined' && window.verifyOtp) {
      window.verifyOtp(
        otp,
        () => {
          setIsVerifying(false);
          setError(null);
          handleFormSubmit();
          handleDialogClose();
        },
        () => {
          setIsVerifying(false);
          setError('Invalid OTP. Please try again.');
        }
      );
    } else {
      setIsVerifying(false);
      setError('OTP verification service is not available');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, handleFormSubmit]);

  const handleRetryOTP = useCallback(() => {
    if (typeof window !== 'undefined' && window.retryOtp) {
      window.retryOtp(
        '11',
        () => {
          toast.success('OTP sent successfully.');
          setIsResendEnabled(false);
          setTimer(60);
          setError(null);
        },
        () => {
          toast.error('Failed to resend OTP. Please try again.');
        }
      );
    } else {
      toast.error('OTP service is not available');
    }
  }, []);

  const handleDialogClose = useCallback(() => {
    setOTP('');
    setTimer(60);
    setIsResendEnabled(false);
    setError(null);
    setIsVerifying(false);
    setHasTriedWhatsApp(false);
    clearTimerInterval();
    onClose();
  }, [onClose, clearTimerInterval]);

  const handleOTPChange = useCallback(
    (value: string) => {
      const numericValue = value.replace(/\D/g, '');
      setOTP(numericValue);

      if (error) {
        setError(null);
      }
    },
    [error]
  );

  useEffect(() => {
    if (isOpen && !isResendEnabled) {
      intervalRef.current = window.setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearTimerInterval();
            setIsResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number;
    }

    return clearTimerInterval;
  }, [isOpen, isResendEnabled, clearTimerInterval]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' && otp.length === 4 && !isVerifying) {
        handleVerifyOTP();
      }
    },
    [otp, isVerifying, handleVerifyOTP]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keypress', handleKeyPress);
      return () => document.removeEventListener('keypress', handleKeyPress);
    }
  }, [isOpen, handleKeyPress]);

  const formatContactNumber = (number: string) => {
    if (number.length > 10) {
      return `+${number.slice(0, -10)} ${number.slice(-10)}`;
    }
    return number;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className='sm:max-w-sm' aria-describedby='otp-description'>
        <DialogHeader>
          <DialogTitle>Verify Your OTP</DialogTitle>
          <DialogDescription id='otp-description' className='text-xs'>
            {!hasTriedWhatsApp ? (
              <>
                We&apos;ve sent a 4-digit code to your{' '}
                <span className='font-semibold'>WhatsApp</span> on{' '}
                {formatContactNumber(contactNo)}. If you don&apos;t receive it,
                click resend to get it via{' '}
                <span className='font-semibold'>SMS</span>
              </>
            ) : (
              <>
                We&apos;ve sent a 4-digit code to your{' '}
                <span className='font-semibold'>Phone</span> on{' '}
                {formatContactNumber(contactNo)}.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center space-y-4'>
          <div className='w-full'>
            <OTPInput
              autoFocus
              value={otp}
              onChange={handleOTPChange}
              maxLength={4}
              pattern='[0-9]*'
              containerClassName='group flex items-center justify-center has-[:disabled]:opacity-30'
              render={({ slots }) => (
                <div className='flex gap-2'>
                  {slots.slice(0, 4).map((slot, idx) => (
                    <div key={idx}>
                      <Slot {...slot} />
                    </div>
                  ))}
                </div>
              )}
            />
          </div>

          {error && (
            <div className='text-center text-sm text-red-500' role='alert'>
              {error}
            </div>
          )}

          <Button
            disabled={isVerifying || otp.length !== 4}
            onClick={handleVerifyOTP}
            className='w-full'
            aria-describedby={error ? 'otp-error' : undefined}
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className='text-center'>
            <Button
              variant='link'
              onClick={handleRetryOTP}
              disabled={!isResendEnabled || isVerifying}
              className='text-sm'
            >
              {/* ✅ NEW: Simple resend button text */}
              {isResendEnabled
                ? hasTriedWhatsApp
                  ? 'Resend OTP'
                  : 'Resend via SMS'
                : `Resend in ${timer} second${timer !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerificationDialog;
