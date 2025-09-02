import { IZonalPricing } from '@/types/ServiceCatalogTypes';

interface PriceBreakdown {
  itemPrice: number;
  gstOnItemPrice: number;
  subtotalExcGST: number;
  totalPriceAfterDiscount: number;
  gstAfterDiscount: number;
  subtotalAfterDiscount: number;
}

// Utility function to round a number to 2 decimal points
const roundToTwoDecimals = (num: number): number => {
  return Number(num.toFixed(2));
};

export const calculatePriceBreakdown = (
  selectedDuration: 'monthly' | 'quarterly' | 'annually' | 'trial',
  selectedZones: IZonalPricing[],
  globalDiscountMultiplier: number = 1, // if there's any global discount
  promoCodeDiscountAmount: number = 0 // if there's any promotion discount
): PriceBreakdown => {
  // PRICE FROM DATABASE
  const baseTotalPrice = selectedZones.reduce((acc, curr) => {
    const price = curr[selectedDuration];
    return acc + (price !== undefined ? price : 0);
  }, 0);

  // PRICE AFTER GLOBAL DISCOUNT: IF THERE'S ANY GLOBAL DISCOUNT RUNNING
  // gst exclusive:
  const subtotalExcGST = baseTotalPrice * globalDiscountMultiplier;
  const itemPriceExclGST = subtotalExcGST;
  const gstOnItemPrice = (subtotalExcGST / 100) * 18;
  // gst inclusive:
  // const itemPriceIncGST = baseTotalPrice * globalDiscountMultiplier;
  // const gstOnItemPrice = (itemPriceIncGST / 118) * 18;
  // const subtotalExcGST = itemPriceIncGST - gstOnItemPrice;

  // PRICE AFTER PROMO CODE APPLIED
  // gst exclusive:
  const subtotalPrice = itemPriceExclGST - promoCodeDiscountAmount;
  const gstAmount = (subtotalPrice / 100) * 18;
  const totalPriceAfterPromoApplied = subtotalPrice + gstAmount;
  // gst inclusive:
  // const totalPriceAfterPromoApplied = itemPriceIncGST - promoCodeDiscountAmount;
  // const gstAmount = (totalPriceAfterPromoApplied / 118) * 18;
  // const subtotalPrice = totalPriceAfterPromoApplied - gstAmount;

  return {
    itemPrice: roundToTwoDecimals(itemPriceExclGST),
    gstOnItemPrice: roundToTwoDecimals(gstOnItemPrice),
    subtotalExcGST: roundToTwoDecimals(subtotalExcGST),
    totalPriceAfterDiscount: roundToTwoDecimals(totalPriceAfterPromoApplied),
    gstAfterDiscount: roundToTwoDecimals(gstAmount),
    subtotalAfterDiscount: roundToTwoDecimals(subtotalPrice),
  };
};
