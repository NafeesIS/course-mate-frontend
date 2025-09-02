import { IZonalPricing } from '@/types/ServiceCatalogTypes';

interface PriceBreakdown {
  originalPrice: number;
  totalPrice: number;
  gstAmount: number;
  subtotalPrice: number;
}

// Utility function to round a number to 2 decimal points
const roundToTwoDecimals = (num: number): number => {
  return Number(num.toFixed(2));
};

export const calculatePriceBreakdown = (
  selectedDuration: 'monthly' | 'quarterly' | 'annually',
  selectedZones: IZonalPricing[],
  globalDiscountMultiplier: number = 1, // if there's any global discount
  promoCodeDiscountAmount: number = 0 // if there's any promotion discount
): PriceBreakdown => {
  const baseTotalPrice = selectedZones.reduce((acc, curr) => {
    return acc + curr[selectedDuration];
  }, 0);

  // IMP: INCLUDING GST
  // const itemPriceIncGST = 151200;
  const itemPriceIncGST = baseTotalPrice * globalDiscountMultiplier;
  const gstOnItemPrice = (itemPriceIncGST / 118) * 18;
  // IMP: EXCLUDING GST
  const subtotalExcGST = itemPriceIncGST - gstOnItemPrice;

  // IMP: EXCLUDING GST
  const discountedSubtotal = subtotalExcGST - promoCodeDiscountAmount;
  const gstAmount = discountedSubtotal * 0.18;
  const totalPrice = discountedSubtotal + gstAmount;

  return {
    originalPrice: roundToTwoDecimals(subtotalExcGST),
    totalPrice: roundToTwoDecimals(totalPrice),
    gstAmount: roundToTwoDecimals(gstAmount),
    subtotalPrice: roundToTwoDecimals(discountedSubtotal),
  };
};
