'use client';

import { FILESURE_SUPPORT_EMAIL } from '@/constants';
import {
  AlertTriangle,
  Home,
  Mail,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface ErrorUIProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  message?: string;
}

const ErrorUI = ({
  error,
  reset,
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Our team has been notified and is working to fix this issue.',
}: ErrorUIProps) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 p-4'>
      <div className='w-full max-w-md'>
        {/* Main Error Card */}
        <div className='overflow-hidden rounded-2xl border-2 border-gray-300 bg-white shadow-xl'>
          {/* Header with gradient */}
          <div className='bg-gradient-to-r from-sky-50 to-purple-100 px-6 py-8 text-center'>
            <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-600'>
              <AlertTriangle className='size-9 text-white' />
            </div>
            <h1 className='mb-2 text-2xl font-bold'>{title}</h1>
            <p className='text-sm leading-relaxed text-gray-700'>{message}</p>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3 p-6'>
            {reset && (
              <button
                onClick={() => reset()}
                className='flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-blue-800 active:scale-[0.98]'
              >
                <RefreshCw className='h-4 w-4' />
                Try Again
              </button>
            )}

            <Link
              href='/'
              className='flex w-full transform items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-all duration-200 hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98]'
            >
              <Home className='h-4 w-4' />
              Back to Home
            </Link>
          </div>

          {/* Support Section */}
          <div className='border-t border-gray-100 bg-gray-50/50 px-6 py-5'>
            <h3 className='mb-3 text-center text-sm font-semibold text-gray-800'>
              Need assistance?
            </h3>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <a
                href={`mailto:${FILESURE_SUPPORT_EMAIL}`}
                target='_blank'
                className='flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-white hover:text-blue-600'
              >
                <Mail className='h-4 w-4' />
                Email Support
              </a>
              <a
                href={`https://wa.me/918104946419?text=${encodeURIComponent(
                  'Hi'
                )}`}
                target='_blank'
                className='flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-white hover:text-green-600'
              >
                <MessageCircle className='h-4 w-4' />
                Live Chat
              </a>
            </div>
          </div>
        </div>

        {/* Error Details (Collapsible) */}
        {error && (
          <details className='group mt-4'>
            <summary className='cursor-pointer list-none text-sm text-gray-500 transition-colors hover:text-gray-700'>
              <div className='flex items-center justify-center gap-2 py-2'>
                <span>Technical Details</span>
                <svg
                  className='h-4 w-4 transition-transform group-open:rotate-180'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>
            </summary>
            <div className='mt-2 rounded-xl bg-gray-900 p-4 font-mono text-xs'>
              <div className='mb-2 text-gray-400'>Error Message:</div>
              <div className='mb-3 break-all text-red-400'>{error.message}</div>
              {error.digest && (
                <>
                  <div className='mb-2 text-gray-400'>Error ID:</div>
                  <div className='break-all text-yellow-400'>
                    {error.digest}
                  </div>
                </>
              )}
            </div>
          </details>
        )}

        {/* Footer */}
        <div className='mt-6 text-center'>
          <p className='text-xs text-gray-400'>
            Error occurred at {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorUI;
