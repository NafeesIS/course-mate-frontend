'use client';

import { BASE_URL_BACKEND } from '@/constants';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns-tz';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RiErrorWarningLine, RiLoopLeftLine } from 'react-icons/ri';
import { Button } from '../../../../components/ui/button';

// API function using axios
const triggerDirectorUpdate = async (dinNo: string) => {
  const response = await axios.get(
    `${BASE_URL_BACKEND}/api/v1/directors/triggerContactUpdater`,
    {
      params: { din: dinNo },
    }
  );
  return response.data;
};

const UpdateNowButton = ({
  dinNo,
  lastUpdated,
}: {
  dinNo: string;
  lastUpdated: string;
}) => {
  // State for success and error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use TanStack Query mutation
  const { mutate, isPending } = useMutation({
    mutationFn: () => triggerDirectorUpdate(dinNo),
    onSuccess: (data) => {
      // Set success message and clear any error
      setSuccessMessage(
        data.message || 'Update request processed successfully.'
      );
      setErrorMessage(null);
    },
    onError: (error) => {
      // Set error message and clear any success
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Something went wrong. Please try again later.';

      setErrorMessage(message);
      setSuccessMessage(null);

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    },
  });

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      setSuccessMessage(null);
      setErrorMessage(null);
    };
  }, []);

  return (
    <div>
      <div
        className={cn(
          'mt-4 gap-2 sm:flex sm:items-center sm:justify-center',
          successMessage || errorMessage ? 'flex-col gap-1' : ''
        )}
      >
        <p className='text-xs text-gray-300'>
          Last updated at {format(lastUpdated, 'dd MMM yyyy hh:mm a')}
        </p>

        {/* Show success message instead of button when success */}
        {successMessage ? (
          <div className='flex items-center gap-1 text-xs text-green-500 md:text-sm'>
            <CheckCircle2 className='mr-0.5 inline size-4' />
            <span>{successMessage}</span>
          </div>
        ) : errorMessage ? (
          /* Show error message instead of button when error */
          <div className='flex items-center gap-1 text-xs text-red-500 md:text-sm'>
            <RiErrorWarningLine className='h-4 w-4' />
            <span>{errorMessage}</span>
          </div>
        ) : (
          /* Show button when no messages */
          <Button
            variant='link'
            className='h-fit gap-1 p-0 text-xs text-purple-400 md:text-sm'
            onClick={() => mutate()}
            disabled={isPending}
          >
            <RiLoopLeftLine className={isPending ? 'animate-spin' : ''} />
            {isPending ? 'Updating...' : 'Update Now'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UpdateNowButton;
