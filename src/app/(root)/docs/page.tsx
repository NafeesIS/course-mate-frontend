import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import type { Metadata, Viewport } from 'next';
import DocsHero from './_components/DocsHero';
import FeaturedDocs from './_components/FeaturedDocs';
import HelpDocs from './_components/HelpDocs';
import ProductDocs from './_components/ProductDocs';
import RecentDocs from './_components/RecentDocs';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/docs`),
  title: 'Filesure Docs | Guides, How-tos & Product Knowledge',
  description:
    'Explore Filesure documentation: product guides, troubleshooting tips, API references, and best practices to get the most out of Filesure.',
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Filesure docs',
    'product documentation',
    'help center',
    'knowledge base',
    'API docs',
    'integration guides',
    'how to Filesure',
    'troubleshooting',
    'best practices',
  ],
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    siteName: 'FileSure',
    type: 'website',
    locale: 'en_IN',
    title: 'Filesure Docs | Guides, How-tos & Product Knowledge',
    description:
      'Find product guides, implementation tips, and step-by-step tutorials for Filesure.',
    url: `${BASE_URL_FRONTEND}/docs`,
    images: [
      {
        url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'Filesure Docs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FileSure',
    creator: '@FileSure',
    title: 'Filesure Docs | Guides, How-tos & Product Knowledge',
    description:
      'Official documentation for Filesure: guides, how-tos, API references, and best practices.',
    images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
  },
  category: 'Documentation',
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/docs`,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const DocsHomePage = () => {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'FileSure',
      url: BASE_URL_FRONTEND,
      logo: `${BASE_URL_FRONTEND}/logo.png`,
      sameAs: [
        'https://www.linkedin.com/company/filesure',
        'https://x.com/FileSure',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: BASE_URL_FRONTEND,
      name: 'FileSure',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL_FRONTEND}/docs/tags`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: `${BASE_URL_FRONTEND}/docs`,
      name: 'Filesure Docs | Guides, How-tos & Product Knowledge',
      description:
        'Explore Filesure documentation: product guides, how-tos, troubleshooting tips, API references, and best practices.',
      isPartOf: {
        '@type': 'WebSite',
        url: BASE_URL_FRONTEND,
        name: 'FileSure',
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL_FRONTEND,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Docs',
            item: `${BASE_URL_FRONTEND}/docs`,
          },
        ],
      },
    },
  ];

  return (
    <div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>
      <DocsHero />
      <div className='wrapper'>
        <FeaturedDocs />
        <HelpDocs />
        <ProductDocs />
        <RecentDocs />
      </div>
    </div>
  );
};

export default DocsHomePage;
