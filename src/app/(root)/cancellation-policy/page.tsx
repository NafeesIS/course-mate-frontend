import HeroWrapper from '@/components/shared/HeroWrapper';

import { BASE_URL_FRONTEND, FILESURE_SUPPORT_EMAIL } from '@/constants';
import { Metadata } from 'next';

export const revalidate = 600; // cache for 1 hour

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/cancellation-policy`),
  title: 'Cancellation Policy | FileSure',
  description:
    'Understand the conditions under which you can cancel a service, the process for making a cancellation, and the timeframes involved at FileSure.',
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'cancellation policy',
    'FileSure',
    'service cancellation',
    'cancellation process',
    'cancellation conditions',
  ],

  // Open Graph metadata for social media
  openGraph: {
    siteName: 'FileSure',
    type: 'website', // Since this represents the site, use 'website'
    locale: 'en_US',
    title: 'Cancellation Policy | FileSure',
    description:
      'Understand the conditions under which you can cancel a service, the process for making a cancellation, and the timeframes involved at FileSure.',
    url: `${BASE_URL_FRONTEND}/cancellation-policy`,
  },

  alternates: {
    canonical: `${BASE_URL_FRONTEND}/cancellation-policy`,
  },

  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow', // Ensures Googlebot crawls and indexes the site
  },
};

const page = () => {
  return (
    <div>
      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>

      <div className='wrapper mb-16 mt-10'>
        <h1 className='mb-8 text-2xl font-bold'>Cancellation Policy</h1>

        <section className='rounded-lg border-l-[6px] border-primary bg-gray-100 bg-muted p-6 dark:bg-gray-800'>
          <h2 className='mb-4 text-sm font-bold md:text-lg'>
            Table of Contents
          </h2>
          <ul className='space-y-2 text-sm md:text-base'>
            <li>
              <a className='text-blue-500 hover:underline' href='#introduction'>
                Introduction
              </a>
            </li>
            <li>
              <a
                className='text-blue-500 hover:underline'
                href='#cancellation-conditions'
              >
                Cancellation Conditions
              </a>
            </li>
            <li>
              <a
                className='text-blue-500 hover:underline'
                href='#non-cancellable-services'
              >
                Non-Cancellable Services
              </a>
            </li>
            <li>
              <a
                className='text-blue-500 hover:underline'
                href='#process-for-cancellation'
              >
                Process for Cancellation
              </a>
            </li>
            <li>
              <a
                className='text-blue-500 hover:underline'
                href='#refund-for-cancellations'
              >
                Refund for Cancellations
              </a>
            </li>
            <li>
              <a
                className='text-blue-500 hover:underline'
                href='#changes-to-cancellation-policy'
              >
                Changes to Cancellation Policy
              </a>
            </li>
            <li>
              <a className='text-blue-500 hover:underline' href='#contact-us'>
                Contact Us
              </a>
            </li>
          </ul>
        </section>

        <div className='mt-4'>
          <section id='introduction' className='mb-4'>
            <h2 className='mb-4 pt-6 text-xl font-bold'>Introduction</h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              At FileSure India Private Limited, we strive to provide
              exceptional services to our customers. We understand that
              circumstances may arise where you need to cancel a service. This
              Cancellation Policy outlines the terms and conditions under which
              cancellations can be made and the process for doing so.
            </p>
          </section>

          <section id='cancellation-conditions' className='mb-4'>
            <h2 className='mb-4 pt-6 text-xl font-bold'>
              Cancellation Conditions
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              Cancellations are permitted under the following conditions:
            </p>
            <ul className='ml-6 list-disc text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              <li>
                Before Service Initiation: You may cancel your service request
                before it has been initiated by our chartered accountants or
                company secretaries. If the service has already begun,
                cancellation may not be possible.
              </li>
              <li>
                Within 24 Hours of Payment: If you wish to cancel your service
                request within 24 hours of making the payment, you may be
                eligible for a full refund, provided the service has not yet
                commenced.
              </li>
            </ul>
          </section>

          <section id='non-cancellable-services' className='mb-4'>
            <h2 className='mb-4 pt-6 text-xl font-bold'>
              Non-Cancellable Services
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              Certain services may not be eligible for cancellation, including
              but not limited to:
            </p>
            <ul className='ml-6 list-disc text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              <li>Services that have already been initiated or completed.</li>
              <li>
                Customized services that are tailored specifically to your
                requirements.
              </li>
              <li>
                Situations where the cancellation is requested beyond the
                allowable timeframe.
              </li>
            </ul>
          </section>

          <section id='process-for-cancellation' className='mb-4'>
            <h2 className='mb-4 pt-6 text-xl font-bold'>
              Process for Cancellation
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              To request a cancellation:
            </p>
            <ul className='ml-6 list-disc text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              <li>
                Contact our support team at{' '}
                <a
                  className='text-blue-500 hover:underline'
                  href={`mailto:${FILESURE_SUPPORT_EMAIL}`}
                >
                  {FILESURE_SUPPORT_EMAIL}
                </a>{' '}
                with your cancellation request, including your order details and
                reason for cancellation.
              </li>
              <li>
                Our team will review your request and respond within 3 business
                days to confirm the cancellation status and any applicable
                refunds.
              </li>
            </ul>
          </section>

          <section id='refund-for-cancellations' className='mb-4'>
            <h2 className='mb-4 pt-6 text-xl font-bold'>
              Refunds for Cancellations
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              If your cancellation request is approved:
            </p>
            <ul className='ml-6 list-disc text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              <li>
                Full Refund: A full refund will be issued if the service has not
                yet commenced.
              </li>
              <li>
                Partial Refund: If the service has partially commenced, a
                prorated refund may be issued based on the work completed.
              </li>
            </ul>
            <p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              Refunds will be processed through the original payment method,
              including payment gateways like Razorpay or SBI Net Banking.
              Please allow up to 5 business days for the refund to reflect in
              your account.
            </p>
          </section>

          <section id='changes-to-cancellation-policy' className='mb-4'>
            <h2 className='mb-4 pt-6 text-xl font-bold'>
              Changes to Cancellation Policy
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              FileSure India Private Limited reserves the right to modify this
              Cancellation Policy at any time. Any changes will be effective
              immediately upon posting, and we will notify users of significant
              changes.
            </p>
          </section>

          <section id='contact-us' className='mb-4'>
            <h2 className='mb-4 pt-6 text-xl font-bold'>Contact Us</h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>
              If you have any questions about this Cancellation Policy, please
              contact us at{' '}
              <a
                className='text-blue-500 hover:underline'
                href={`mailto:${FILESURE_SUPPORT_EMAIL}`}
              >
                {FILESURE_SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default page;
