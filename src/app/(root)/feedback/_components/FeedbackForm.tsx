'use client';

import { useUserSignInDetails } from '@/store/userStore';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRecaptchaV3 } from '../_hooks/useRecaptchaV3';
import { createFeedback } from '../_services/services';
import { Ratings, RatingsCategory } from '../_types/types';
import EmailModal from './EmailModal';
import StarRating from './StarRating';
import ThankYouModal from './ThankYouModal';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    grecaptcha: any;
  }
}

const FeedbackForm = () => {
  const [ratings, setRatings] = useState<Ratings>({
    overall: 0,
    website: 0,
    recommend: 0,
    support: 0,
  });

  const [feedback, setFeedback] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [skippedEmail, setSkippedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ready: recaptchaReady, execute } = useRecaptchaV3();
  const { userSignInDetails } = useUserSignInDetails();
  const searchParams = useSearchParams();

  // Pre-fill email from store or URL
  useEffect(() => {
    const storeEmail = userSignInDetails?.data?.emails?.[0] ?? null;
    if (storeEmail) {
      setUserEmail(storeEmail);
    } else {
      const urlEmail = searchParams.get('mail');
      if (urlEmail) setUserEmail(urlEmail);
    }
  }, [searchParams, userSignInDetails]);

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setShowEmailModal(false);
    submitFeedback(email);
  };

  const handleEmailSkip = () => {
    setSkippedEmail(true);
    setShowEmailModal(false);
    submitFeedback(null);
  };

  const handleRating = (category: RatingsCategory, rating: number) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
  };

  // React Query mutation at top-level (not inside a function)
  const { mutate: mutateCreateFeedback } = useMutation({
    mutationKey: ['create-feedback'],
    mutationFn: createFeedback,
    onSuccess: () => {
      setShowThankYouModal(true);
      setRatings({ overall: 0, website: 0, recommend: 0, support: 0 });
      setFeedback('');
      localStorage.setItem(
        'feedbackSubmitted',
        JSON.stringify({ submittedAt: Date.now() })
      );
      toast.success('Thanks! Your feedback has been submitted.');
    },
    onError: (err: any) => {
      toast.error(
        err?.message || 'Could not submit feedback. Please try again later.'
      );
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Main submit function
  const submitFeedback = async (email: string | null = null) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!recaptchaReady) {
        toast.error('reCAPTCHA not loaded. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const recaptchaToken = await execute('submit');
      const finalEmail = email || userEmail;

      const payload: {
        overall: number;
        website: number;
        recommend: number;
        support: number;
        feedback: string;
        userType: 'registered' | 'guest';
        userEmail?: string;
        recaptchaToken: string;
      } = {
        overall: ratings.overall,
        website: ratings.website,
        recommend: ratings.recommend,
        support: ratings.support,
        feedback,
        userType: userSignInDetails?.data?.emails?.[0] ? 'registered' : 'guest',
        recaptchaToken,
      };

      if (finalEmail) payload.userEmail = finalEmail;

      // Fire the mutation
      mutateCreateFeedback(payload);
    } catch {
      toast.error('Could not verify reCAPTCHA. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Validate ratings
    const missingRatings: string[] = [];
    if (ratings.overall === 0) missingRatings.push('Overall Experience');
    if (ratings.website === 0) missingRatings.push('Website Usability');
    if (ratings.recommend === 0) missingRatings.push('Recommendation');
    if (ratings.support === 0) missingRatings.push('Support Team');

    if (missingRatings.length > 0) {
      toast.error('Please provide rating for remaining fields');
      return;
    }

    // Prevent repeated submissions within 5 minutes
    const feedbackData = localStorage.getItem('feedbackSubmitted');
    if (feedbackData) {
      try {
        const { submittedAt } = JSON.parse(feedbackData);
        const now = Date.now();
        if (now - submittedAt < 5 * 60 * 1000) {
          toast.info('You have already submitted feedback');
          return;
        } else {
          localStorage.removeItem('feedbackSubmitted');
        }
      } catch {
        localStorage.removeItem('feedbackSubmitted');
      }
    }

    // Ask for email if not provided and not skipped
    if (!userEmail && !skippedEmail) {
      setShowEmailModal(true);
      return;
    }

    await submitFeedback();
  };

  return (
    <>
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onEmailSubmit={handleEmailSubmit}
        onSkip={handleEmailSkip}
      />
      <ThankYouModal
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
      />

      <div className='mx-auto mb-12 mt-6 max-w-lg rounded-lg bg-white p-2 shadow-xl'>
        <div className='relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary via-blue-600 to-blue-800 px-4 py-8 text-center text-white md:px-8 md:py-10'>
          {/* Background decorative elements */}
          <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10'></div>
          <div className='absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5'></div>

          {/* Main content */}
          <div className='relative z-10'>
            <div className='mb-4 md:mb-6'>
              <h1 className='mb-2 text-lg font-semibold leading-relaxed md:mb-3 md:text-2xl'>
                Your feedback is{' '}
                <span className='inline-flex items-center rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 text-sm font-bold text-gray-900 shadow-lg md:text-base'>
                  ✨ GOLD
                </span>
              </h1>
              <p className='text-sm text-blue-100 md:text-base'>
                We would love to hear from you
              </p>
            </div>

            <div className='inline-flex items-center rounded-xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm md:px-6 md:py-3'>
              <span className='flex items-center gap-x-2 text-sm font-medium text-gray-700 md:text-base'>
                Thank you for choosing
                <Image
                  alt='Filesure'
                  className='h-8 w-16 object-contain md:h-10 md:w-20'
                  width={200}
                  height={100}
                  src='https://filesurestorage.blob.core.windows.net/docs-images/f7acca62-ee37-46ff-ade5-73143d3193af.png?sp=rcwd&st=2025-07-07T06:06:41Z&se=2027-07-07T14:06:41Z&spr=https&sv=2024-11-04&sr=c&sig=efzd7UgWsxZA4s35aLVNICl4OKSYw36ubXi1PxReJLQ%3D'
                />
              </span>
            </div>
          </div>
        </div>

        <div className='bg-gray-50 p-4 md:p-6'>
          {(
            ['overall', 'website', 'recommend', 'support'] as RatingsCategory[]
          ).map((category, index) => (
            <div className='mb-6 md:mb-8' key={category}>
              <div className='mb-3 flex flex-col items-start justify-between'>
                <span className='mb-1 text-sm font-medium text-gray-800 md:text-base'>
                  {index + 1}.{' '}
                  {
                    {
                      overall: 'How was your overall experience?',
                      website: 'How easy was it to use our website?',
                      recommend: 'Will you recommend us to others?',
                      support: 'Was our support team helpful?',
                    }[category]
                  }
                </span>
                <StarRating
                  category={category}
                  currentRating={ratings[category]}
                  onChange={handleRating}
                />
              </div>
            </div>
          ))}

          <div className='mb-6'>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder='Write your feedback...'
              className='h-24 w-full resize-none rounded-md border border-gray-300 p-3 text-gray-600 placeholder-gray-400 placeholder:text-sm focus:border-blue-500 focus:outline-none placeholder:md:text-base'
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='w-full rounded-md bg-primary py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-base'
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;
