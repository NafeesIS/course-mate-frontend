import { formatToUrl } from '@/lib/formatters';
import { TCartItem } from '../_store/cartStore';

export function createSuccessUrl(cartItems: TCartItem[]) {
  const params = new URLSearchParams({ success: 'true' });

  cartItems.forEach((item) => {
    if (item.serviceType === 'directorUnlock') {
      params.append(
        'unlockDirectorCredits',
        item.selectedPricing.credits.toString()
      );
      //   params.append('credits', item.selectedPricing.credits.toString());
    } else if (item.serviceType === 'companyUnlock') {
      params.append(
        'unlockCompanyCredits',
        item.selectedPricing.credits.toString()
      );
      //   params.append('credits', item.selectedPricing.credits.toString());

      // Only append if companyId and companyName exist
      if (item.customAttributes?.companyId) {
        params.append('companyId', item.customAttributes.companyId);
      }
      if (item.customAttributes?.companyName) {
        params.append(
          'companyName',
          formatToUrl(item.customAttributes.companyName)
        );
      }
    } else if (item.serviceType === 'vpdUnlock') {
      params.append(
        'unlockVpdCredits',
        item.selectedPricing.credits.toString()
      );
      // Only append if companyId and companyName exist
      if (item.customAttributes?.companyId) {
        params.append('companyId', item.customAttributes.companyId);
      }
      if (item.customAttributes?.companyName) {
        params.append(
          'companyName',
          formatToUrl(item.customAttributes.companyName)
        );
      }
    }
  });

  return `/dashboard?${params.toString()}`;
}
