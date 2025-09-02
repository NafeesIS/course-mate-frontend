import HeroWrapper from '@/components/shared/HeroWrapper';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { faqPageData } from '@/constants/faqData';

import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';

export const revalidate = 600; // cache for 1 hour

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/faq`),
  title: 'Frequently Asked Questions (FAQ) | FileSure',
  description:
    'Find answers to common questions about using the FileSure platform, including information on company searches, director details, compliance, payment methods, and more.',
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'FAQ',
    'FileSure',
    'Frequently Asked Questions',
    'company search',
    'director details',
    'compliance tracking',
    'payment methods',
    'refunds',
    'shipping',
    'support',
  ],
  // Open Graph metadata for social media
  openGraph: {
    siteName: 'FileSure',
    type: 'website', // Since this represents the site, use 'website'
    locale: 'en_US',
    title: 'Frequently Asked Questions (FAQ) | FileSure',
    description:
      'Discover answers to common questions about the FileSure platform, including company searches, director details, compliance tracking, payment methods, and more.',
    url: `${BASE_URL_FRONTEND}/faq`,
  },

  alternates: {
    canonical: `${BASE_URL_FRONTEND}/faq`, // Canonical URL for the home page
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

export default function FaqPage() {
  return (
    <div className='mb-16'>
      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>

      <div className='wrapper mb-16 mt-10'>
        <div className='mb-8 border-l-[6px] border-primary bg-muted p-6'>
          <h1 className='text-2xl font-bold'>Frequently Asked Questions</h1>
        </div>

        <div className='grid gap-4'>
          {faqPageData.map((faq, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger className='flex w-full items-center justify-between rounded-md border border-gray-200 bg-white p-4 text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300 md:text-base'>
                {faq.question}
                <ChevronDownIcon className='h-5 w-5 transition-transform [&[data-state=open]]:rotate-180' />
              </CollapsibleTrigger>
              <CollapsibleContent className='rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950'>
                <p className='text-sm text-gray-500 dark:text-gray-400 md:text-base'>
                  {faq.answer}
                </p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m6 9 6 6 6-6' />
    </svg>
  );
}
