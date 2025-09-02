'use client';

import PromotionalBanner from '@/app/(root)/new-company-alert/_components/PromotionalBanner';
import OfferBannerAtTop from '@/components/shared/Header/OfferBannerAtTop';
import { useNCACampaignStatus } from '@/hooks/useNcaCampaign';
import NCABannerGlobal from './NCABannerGlobal';

const bannerMap = {
  OfferBannerAtTop: OfferBannerAtTop,
  PromotionalBanner: PromotionalBanner,
};

const PromoBannerWrapper = ({ banner }: { banner: keyof typeof bannerMap }) => {
  const { isActive } = useNCACampaignStatus();
  if (!isActive) return <NCABannerGlobal />;
  const BannerComponent = bannerMap[banner];
  return BannerComponent ? <BannerComponent /> : null;
};

export default PromoBannerWrapper;
