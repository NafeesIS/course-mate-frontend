import { Toaster } from '@/components/ui/sonner';
import { BASE_URL_FRONTEND } from '@/constants';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
// eslint-disable-next-line camelcase
import { SuperTokensProvider } from '@/app/(root)/(auth)/_components/supertokensProvider';
import CustomWhatsappBtn from '@/components/chat-widgets/CustomWhatsappBtn';
import Providers from '@/components/Providers';
import ThriveStackScript from '@/components/scripts/ThriveStackScript';
import ScrollToTopButton from '@/components/shared/ScrollToTopButton';
import {
  META_DESCRIPTION,
  META_KEYWORDS,
  META_TITLE,
} from './(root)/_utils/meta_data';
import { inter, openSans, playfair } from './ui/fonts';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false, // Prevents scaling to maintain consistent layout
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL_FRONTEND),
  title: META_TITLE,
  description: META_DESCRIPTION,
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: META_KEYWORDS,
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Business Intelligence',
  alternates: {
    canonical: BASE_URL_FRONTEND, // Canonical URL for the home page
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow', // Ensures Googlebot crawls and indexes the site
  },
  openGraph: {
    siteName: 'FileSure',
    type: 'website',
    locale: 'en_US',
    title: `${META_TITLE}`,
    description: `${META_DESCRIPTION}`,
    url: BASE_URL_FRONTEND,
    images: [
      {
        url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'FileSure - Access Indian Company and Director Profiles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FileSure',
    creator: '@FileSure',
    title: `${META_TITLE}`,
    description: `${META_DESCRIPTION}`,
    images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
  },
};

const getTheme = () => {
  const cookieStore = cookies();
  const themeCookie = cookieStore.get('theme');
  const theme = themeCookie ? themeCookie.value : 'light';
  return theme;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = getTheme() as string;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    image: [`${BASE_URL_FRONTEND}/assets/opengraph-image.png`],
    url: BASE_URL_FRONTEND,
    sameAs: [
      'https://www.linkedin.com/company/filesure-in',
      'https://www.facebook.com/filesure',
      'https://www.filesure.in/unlock-contact',
      'https://www.filesure.in/new-company-alert',
    ],
    logo: 'https://www.filesure.in/assets/filesure-icon.png',
    name: `${META_TITLE}`,
    description: `${META_DESCRIPTION}`,
    email: 'hello@marketing.filesure.in',
    telephone: '+918104946419',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        '6th Floor, Rahimtoola House, Homji Street, Near Horniman Circle, Fort',
      addressLocality: 'Mumbai',
      addressCountry: 'IND',
      addressRegion: 'Maharashtra',
      postalCode: '400001',
    },
    contactPoint: {
      contactType: 'Customer Service',
      email: 'helpdesk@filesure.in',
      telephone: '+918104946419',
    },
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'New Company Alerts | Daily Updates on Newly Incorporated Companies | FileSure',
        item: 'https://www.filesure.in/new-company-alert',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Unlock Director Contact Details | FileSure',
        item: 'https://www.filesure.in/unlock-contact',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Company Secretary Directory | FileSure - Partners',
        item: 'https://www.filesure.in/partners',
      },
    ],
  };

  const toasterConfig: Parameters<typeof Toaster>[0] = {
    position: 'top-center',
    duration: 3000,
    closeButton: true,
    visibleToasts: 1,
    toastOptions: {
      className: 'relative text-sm font-semibold rounded-md top-12',
      classNames: {
        title: 'text-sm md:text-base',
        description: 'text-xs md:text-sm',
        actionButton: 'absolute top-2 right-2',
        cancelButton: 'absolute top-2 right-2',
        closeButton:
          'left-auto absolute top-3 right-0 text-base hover:text-muted-foreground',
      },
    },
  };

  const isProduction = process.env.NODE_ENV === 'production';
  const thriveStackApiKey = process.env.NEXT_PUBLIC_THRIVESTACK_API_KEY;

  return (
    <html
      lang='en'
      className={`${openSans.variable} ${playfair.variable} ${inter.variable}`}
      style={{
        colorScheme: theme,
        scrollBehavior: 'smooth',
      }}
    >
      {isProduction && (
        <>
          <GoogleTagManager gtmId='GTM-TWD6W7MP' />
          <GoogleAnalytics gaId='G-G1PN3CW74Z' />
        </>
      )}

      <SuperTokensProvider>
        <body className='font-inter antialiased'>
          <NextTopLoader showSpinner={false} />

          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {isProduction && thriveStackApiKey ? (
            <ThriveStackScript thriveStackApiKey={thriveStackApiKey} />
          ) : null}

          <Providers>{children}</Providers>

          <ScrollToTopButton />
          <CustomWhatsappBtn />

          <Toaster richColors {...toasterConfig} />
        </body>
      </SuperTokensProvider>
    </html>
  );
}
