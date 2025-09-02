import { usePricingStore } from '@/store/pricingStore';
import { IZonalPricing, TServiceCatalog } from '@/types/ServiceCatalogTypes';
import { useMemo } from 'react';

// Custom hook to determine the status and details of the NCA (New Company Alert) campaign
export function useNCACampaignStatus() {
  // Subscribe to the relevant part of the pricing store (service catalog data from DB)
  const serviceCatalogFromDB = usePricingStore(
    (state) => state.serviceCatalogFromDB
  );

  // Memoize the computation for performance and to avoid unnecessary recalculations
  const campaignStatus = useMemo(() => {
    // If service catalog data is not available, return default inactive status
    if (!serviceCatalogFromDB) {
      return {
        isActive: false,
        start: undefined,
        end: undefined,
        durationDays: undefined,
        discount: 0,
        discountEmailMobile: 0,
      };
    }

    const now = new Date();
    // Find the Email Only and Email + Mobile NCA plans from the service catalog
    const emailOnly = serviceCatalogFromDB.serviceCatalog.find(
      (s: TServiceCatalog) => s.name === 'New Company Alert - Email Only'
    );
    const emailMobile = serviceCatalogFromDB.serviceCatalog.find(
      (s: TServiceCatalog) => s.name === 'New Company Alert - Email and Phone'
    );

    // Helper to get the 'All' zone pricing for a given plan
    const getAllZone = (plan?: TServiceCatalog) =>
      plan?.zonalPricing?.find((z: IZonalPricing) => z.zone === 'All');

    // Get 'All' zone pricing for both plans
    const allZoneEmail = getAllZone(emailOnly);
    const allZoneEmailMobile = getAllZone(emailMobile);

    // Determine campaign start and end dates, preferring Email+Mobile plan if available
    const start = allZoneEmailMobile?.globalDiscountStartDate
      ? new Date(allZoneEmailMobile.globalDiscountStartDate)
      : allZoneEmail?.globalDiscountStartDate
        ? new Date(allZoneEmail.globalDiscountStartDate)
        : undefined;
    const end = allZoneEmailMobile?.globalDiscountEndDate
      ? new Date(allZoneEmailMobile.globalDiscountEndDate)
      : allZoneEmail?.globalDiscountEndDate
        ? new Date(allZoneEmail.globalDiscountEndDate)
        : undefined;

    // Adjust end date to be at 23:59:59.999 (end of the day)
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    // Get discount values for both plans
    const discount = allZoneEmail?.globalDiscount || 0;
    const discountEmailMobile = allZoneEmailMobile?.globalDiscount || 0;

    // Calculate campaign duration in days, if both dates are available
    let durationDays = undefined;
    if (start && end) {
      const durationMs = end.getTime() - start.getTime();
      durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    }

    // Determine if the campaign is currently active
    // (current date is between start and end)
    const isActive = start && end ? now >= start && now <= end : false;

    // Return all relevant campaign status details
    return {
      isActive,
      start,
      end,
      durationDays,
      discount,
      discountEmailMobile,
    };
  }, [serviceCatalogFromDB]);

  // Return the computed campaign status object
  return campaignStatus;
}
