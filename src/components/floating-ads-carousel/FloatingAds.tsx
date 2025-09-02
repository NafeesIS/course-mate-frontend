'use client';

import FloatingAdsCarousel from '@/components/floating-ads-carousel/FloatingAdsCarousel';
import useMediaQuery from '@/hooks/useMediaQuery';
import { usePricingStore } from '@/store/pricingStore';
import { LucideContact, LucideFileSpreadsheet } from 'lucide-react';

const FloatingAds = () => {
  const { serviceCatalogFromDB } = usePricingStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (!isDesktop) return null;

  const currency = serviceCatalogFromDB ? serviceCatalogFromDB?.currency : '';
  const directorUnlockCatalog = serviceCatalogFromDB?.serviceCatalog.find(
    (service) => service.serviceType === 'directorUnlock'
  );
  const singleDirectorUnlockPrice = directorUnlockCatalog?.directorUnlockPricing
    ? directorUnlockCatalog?.directorUnlockPricing.singleUnlock.price
    : '';

  const banners = [
    {
      href: '/unlock-contact/bulk-unlock',
      icon: <LucideContact className='text-lg' />,
      title: 'Only Need to Talk to the Decision Makers?',
      subtitle: `Skip the clutter and get straight to what matters - unlock director contact information only at ${
        !serviceCatalogFromDB
          ? '...'
          : `${currency === 'INR' ? '₹' : '$'}${singleDirectorUnlockPrice}`
      }. Instant access. No hidden fees.`,
      buttonText: "Get Directors' Contact Now",
      bgColor: 'bg-gradient-to-tr from-blue-600 to-blue-500',
      textColor: 'text-blue-700',
    },
    {
      href: '/new-company-alert',
      icon: <LucideFileSpreadsheet className='text-lg' />,
      title: 'Get Daily Reports on Newly Registered Companies!',
      subtitle:
        'New Company Alerts provides everything you need to understand your leads - detailed company data plus contact information in one place.',
      buttonText: 'Get New Company Alerts Now',
      bgColor: 'bg-gradient-to-tr from-green-700 to-green-600',
      textColor: 'text-green-800',
    },
  ];

  return (
    <div>
      {/* Your page content */}
      <FloatingAdsCarousel
        banners={banners}
        autoplayDelay={8000}
        initialDelay={3000}
      />
    </div>
  );
};

export default FloatingAds;
