import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserSignInDetails } from '@/store/userStore';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Copy, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchUnmaskedContact } from '../_services/services';
import { useUnlockBulkPurchaseStore } from '../_store/unlockContactStore';
import { IDirector, IUnlockContact } from '../_types/types';
import UnlockContactBtn from './UnlockContactBtn';

interface DirectorContactInfoProps {
  maskedContactStatus: any; // Replace 'any' with the correct type
  isLoadingMaskedContact: boolean;
  isErrorMaskedContact: boolean;
  director: IDirector;
}

export function DirectorContactInfo({
  maskedContactStatus,
  isLoadingMaskedContact,
  isErrorMaskedContact,
  director,
}: DirectorContactInfoProps) {
  const [contactLoadingMessage, setContactLoadingMessage] = useState(
    'Fetching contact information...'
  );
  const { userSignInDetails, refetchUserSignInDetails } =
    useUserSignInDetails();
  const availableDirectorUnlockCredits = useUnlockBulkPurchaseStore(
    (state) => state.availableDirectorUnlockCredits
  );
  const setAvailableDirectorUnlockCredits = useUnlockBulkPurchaseStore(
    (state) => state.setAvailableDirectorUnlockCredits
  );
  const contactDetails = useUnlockBulkPurchaseStore(
    (state) => state.contactDetails
  );
  const setContactDetails = useUnlockBulkPurchaseStore(
    (state) => state.setContactDetails
  );
  const isContactUnlocked = useUnlockBulkPurchaseStore(
    (state) => state.isContactUnlocked
  );
  const addUnlockedDin = useUnlockBulkPurchaseStore(
    (state) => state.addUnlockedDin
  );

  const userId = userSignInDetails?.data._id || '';

  const unlockContactMutation = useMutation<IUnlockContact, Error, void>({
    mutationFn: () =>
      fetchUnmaskedContact(userId, director.din, 'directorUnlock'),
    onSuccess: (data) => {
      setContactDetails({
        emailAddress: data.emailAddress,
        mobileNumber: data.mobileNumber,
      });
      setAvailableDirectorUnlockCredits(data.remainingRedemptions);
      addUnlockedDin(director.din);
      toast.success(data.message);
      refetchUserSignInDetails?.();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to unlock contact details. Please try again.');
    },
  });

  const handleUnlock = () => {
    if (availableDirectorUnlockCredits < 1) {
      toast.error('Insufficient Credits', {
        description: 'Please purchase more credits to unlock contact details.',
      });
      return;
    }

    unlockContactMutation.mutate();
  };

  const isUnlocked = isContactUnlocked(director.din);

  useEffect(() => {
    let timer: number | undefined;
    if (isLoadingMaskedContact) {
      timer = window.setTimeout(() => {
        setContactLoadingMessage(
          'Fetching contact information is taking longer than expected. Please wait...'
        );
      }, 10000);
    }
    return () => window.clearTimeout(timer);
  }, [isLoadingMaskedContact]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className='mt-6 rounded-lg border bg-purple-50 p-4'>
      <div className='flex flex-col items-center justify-between gap-2 md:flex-row'>
        <h3 className='text-sm font-semibold md:text-base'>
          Contact Information
        </h3>
      </div>

      <Separator className='mb-4 mt-2' />

      <div className='md:py-2'>
        {isLoadingMaskedContact ? (
          <div className='flex h-20 items-center justify-center'>
            <div className='flex items-center gap-3'>
              {/* Spinner */}
              <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent'></div>
              {/* Loading Message */}
              <p className='animate-pulse text-center text-sm text-gray-500'>
                {contactLoadingMessage}
              </p>
            </div>
          </div>
        ) : isErrorMaskedContact ? (
          <div className='flex h-20 items-center justify-center'>
            <p className='text-center text-sm text-red-500'>
              Failed to load contact information. Please try again later.
            </p>
          </div>
        ) : isUnlocked ? (
          unlockContactMutation.isPending ? (
            <div className='grid items-center gap-4 md:grid-cols-2'>
              <Skeleton className='h-6 w-full' />
              <Skeleton className='h-6 w-full' />
            </div>
          ) : (
            contactDetails && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='grid items-center gap-4'
              >
                <div className='flex items-center gap-2.5 text-xs md:text-sm'>
                  <Phone className='size-4 text-primary md:size-5' />
                  <span className='flex flex-col gap-1 sm:flex-row sm:gap-2'>
                    <strong>Phone:</strong>{' '}
                    <span>
                      {contactDetails.mobileNumber || 'Not Available'}
                    </span>
                  </span>
                  <button
                    className='ml-auto p-1 text-xs text-primary hover:underline'
                    onClick={() => handleCopy(contactDetails.mobileNumber)}
                  >
                    <Copy className='size-4' />
                  </button>
                </div>
                <div className='flex items-center gap-2.5 text-xs md:text-sm'>
                  <Mail className='size-4 text-primary md:size-5' />
                  <span className='flex flex-col gap-1 sm:flex-row sm:gap-2'>
                    <strong>Email:</strong>
                    <span>
                      {contactDetails.emailAddress || 'Not Available'}
                    </span>
                  </span>
                  <button
                    className='ml-auto p-1 text-xs text-primary hover:underline'
                    onClick={() => handleCopy(contactDetails.emailAddress)}
                  >
                    <Copy className='size-4' />
                  </button>
                </div>
              </motion.div>
            )
          )
        ) : (
          <div className='flex flex-col flex-wrap justify-between gap-4 sm:flex-row'>
            <div className='grid items-center gap-4'>
              <p className='flex items-center gap-2.5 text-xs md:text-sm'>
                <Phone className='size-4 text-primary md:size-5' />
                <span>
                  <strong>Phone:</strong>{' '}
                  {maskedContactStatus?.mobileNumber || 'Not Available'}
                </span>
              </p>
              <p className='flex items-center gap-2.5 text-xs md:text-sm'>
                <Mail className='size-4 text-primary md:size-5' />
                <span>
                  <strong>Email:</strong>{' '}
                  {maskedContactStatus?.emailAddress || 'Not Available'}
                </span>
              </p>
            </div>
            <div className='text-center'>
              <UnlockContactBtn
                maskedContactStatus={maskedContactStatus}
                credits={availableDirectorUnlockCredits}
                handleUnlock={handleUnlock}
                isUnlocking={unlockContactMutation.isPending}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
