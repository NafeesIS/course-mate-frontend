import type { TCartItem } from '../_store/cartStore';

// Utility function to round a number to 2 decimal points
const roundToTwoDecimals = (num: number): number => {
  return Number(num.toFixed(2));
};

export function calculateCartTotalsExcGST(
  cartItems: TCartItem[],
  currency: string,
  globalDiscountMultiplier = 1,
  promoCodeDiscountAmount = 0
) {
  // Calculate base price (excluding GST)
  const baseTotal = cartItems.reduce((acc, item) => {
    const baseAmount =
      item.selectedPricing.credits * item.selectedPricing.price;
    let discountAmount = 0;

    if (item.selectedPricing.discount) {
      if (item.selectedPricing.discount.type === 'flat') {
        discountAmount = item.selectedPricing.discount.value;
      } else if (item.selectedPricing.discount.type === 'percentage') {
        discountAmount =
          (baseAmount * item.selectedPricing.discount.value) / 100;
      }
    }

    return acc + (baseAmount - discountAmount);
  }, 0);

  // Apply global discount
  const totalAfterGlobalDiscount = baseTotal * globalDiscountMultiplier;

  // Apply promo code discount
  const totalAfterPromoApplied = Math.max(
    totalAfterGlobalDiscount - promoCodeDiscountAmount,
    0
  );

  // Calculate GST (only for India)
  const gstRate = currency === 'INR' ? 0.18 : 0; // 18% GST for India, 0% for others
  const gstAmount = totalAfterPromoApplied * gstRate;

  // Calculate final total including GST
  const totalIncludingGST = totalAfterPromoApplied + gstAmount;

  return {
    // Base price (excluding GST)
    baseTotal: roundToTwoDecimals(baseTotal),

    // After global discount
    totalAfterGlobalDiscount: roundToTwoDecimals(totalAfterGlobalDiscount),

    // After promo code applied
    totalAfterPromoApplied: roundToTwoDecimals(totalAfterPromoApplied),

    // GST amount
    gstAmount: roundToTwoDecimals(gstAmount),

    // Final total including GST
    totalIncludingGST: roundToTwoDecimals(totalIncludingGST),

    // Discount amounts
    globalDiscountAmount: roundToTwoDecimals(
      baseTotal - totalAfterGlobalDiscount
    ),
    promoCodeDiscountAmount: roundToTwoDecimals(promoCodeDiscountAmount),
    totalDiscountAmount: roundToTwoDecimals(baseTotal - totalAfterPromoApplied),
  };
}
