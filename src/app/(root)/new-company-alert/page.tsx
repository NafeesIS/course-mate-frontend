import HeroWrapper from '@/components/shared/HeroWrapper';
import PromoBannerWrapper from '@/components/shared/PromoBannerWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import { getRecentlyIncorporatedData } from '@/services/insights/getRecentlyIncorporatedData';
import { Metadata, Viewport } from 'next';
import DecisionMakers from './_components/DecisionMakers';
import Hero from './_components/Hero';
import NewlyRegistered from './_components/NewlyRegistered';
import PricingSection from './_components/PricingSection/NewPricingSection';
import RecentlyIncorporated from './_components/RecentlyIncorporated';
import RoiCalculatorWrapper from './_components/RoiCalculatorWrapper';
import SatisfiedClient from './_components/SatisfiedClient';
import WhoBenefits from './_components/WhoBenefits';
import { fetchCompanyAlertPlanData } from './_services/service';
import { ICompanyAlertPlan } from './_utils/types';

// Add this line to opt out of caching for all data requests in this route segment
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/new-company-alert`),
  title:
    'New Company Alerts | Get Daily Updates on Newly Incorporated Companies | FileSure',
  description: `Get daily alerts on newly incorporated companies with complete contact details. Stay updated and reach out to potential clients as soon as they appear.`,
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'new company alerts',
    'data of newly registered companies',
    'company emails',
    'director emails',
    'director contact details',
    'daily company information',
    'newly incorporated companies',
    'company contact details',
    'business leads India',
    'Indian startup data',
    'lead generation',
    'business intelligence',
    'company registration data',
  ],
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    siteName: 'FileSure',
    type: 'website',
    locale: 'en_IN',
    title:
      'New Company Alerts | Daily Updates on Newly Incorporated Companies | FileSure',
    description:
      "Access daily alerts on newly incorporated companies in India. Get complete contact details, director emails, and business leads. Stay updated with FileSure's New Company Alerts.",
    url: `${BASE_URL_FRONTEND}/new-company-alert`,
    images: [
      {
        url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'FileSure New Company Alerts Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FileSure',
    creator: '@FileSure',
    title: 'New Company Alerts | Daily Business Intelligence | FileSure',
    description:
      'Stay ahead of the competition with daily alerts on newly incorporated companies in India. Get director emails, company details, and more with FileSure.',
    images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
  },
  category: 'Business Intelligence',
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/new-company-alert`,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const page = async () => {
  const fetchPlanData = await fetchCompanyAlertPlanData();
  const fetchRecentCompaniesLLPData = await getRecentlyIncorporatedData();

  const recentlyIncorporatedCompanies =
    fetchRecentCompaniesLLPData?.data?.companies || [];

  const recentlyIncorporatedLLPs =
    fetchRecentCompaniesLLPData?.data?.llps || [];

  const plans: ICompanyAlertPlan[] = await fetchPlanData?.data;
  const lowPrice = plans[0].pricingPlan?.baseMonthly || 0;
  const highPrice =
    plans[plans.length - 1].zonalPricing?.find((z) => z.zone === 'All')
      ?.annually || 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'New Company Alerts | Daily Updates on Newly Incorporated Companies | FileSure',
    description:
      'Get daily alerts on newly incorporated companies with complete contact details. Stay updated and reach out to potential clients as soon as they appear.',
    image: '${BASE_URL_FRONTEND}/assets/opengraph-image.png',
    brand: {
      '@type': 'Brand',
      name: 'FileSure',
    },
    offers: {
      '@type': 'AggregateOffer',
      offerCount: '${plans?.length || 0}',
      lowPrice: `${lowPrice}`,
      highPrice: `${highPrice}`,
      priceCurrency: 'INR',
    },
    keywords:
      'new company alerts, data of newly registered companies, company emails, director emails, director contact details, daily company information, newly incorporated companies, company contact details, business leads India, Indian startup data',
    category: 'Business Intelligence',
    applicationCategory: 'Business Software',
    audience: {
      '@type': 'Audience',
      audienceType: 'Business Professionals, Marketers, Sales Teams',
    },
    potentialAction: {
      '@type': 'ViewAction',
      target: '${BASE_URL_FRONTEND}/new-company-alert',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  };

  return (
    <div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>

      <div className='relative'>
        <PromoBannerWrapper banner='PromotionalBanner' />

        <div className='space-y-16 lg:space-y-36'>
          <Hero plans={plans} />
          <RecentlyIncorporated
            plans={plans}
            recentlyIncorporatedCompanies={recentlyIncorporatedCompanies}
            recentlyIncorporatedLLPs={recentlyIncorporatedLLPs}
          />
          <NewlyRegistered />
          <PricingSection plans={plans} />
          <RoiCalculatorWrapper />
          <WhoBenefits />
          <DecisionMakers />
          <SatisfiedClient />
        </div>
      </div>

      {/* <DiscountPopup /> */}
    </div>
  );
};

export default page;
