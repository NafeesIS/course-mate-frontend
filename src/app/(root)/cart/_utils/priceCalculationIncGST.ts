import { TCartItem } from '../_store/cartStore';

// Utility function to round a number to 2 decimal points
const roundToTwoDecimals = (num: number): number => {
  return Number(num.toFixed(2));
};

export function calculateCartTotalsIncGST(
  cartItems: TCartItem[],
  currency: string,
  globalDiscountMultiplier: number = 1,
  promoCodeDiscountAmount: number = 0
) {
  // PRICE FROM DATABASE
  const cartTotalIncGST = cartItems.reduce((acc, item) => {
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

  // GST will be applied only for India
  const gstOnCartTotal = currency !== 'INR' ? 0 : (cartTotalIncGST / 118) * 18; // 18% GST
  const subtotalOnCartTotal =
    currency !== 'INR' ? cartTotalIncGST : cartTotalIncGST - gstOnCartTotal;

  // PRICE AFTER GLOBAL DISCOUNT: IF THERE'S ANY GLOBAL DISCOUNT RUNNING
  const totalAfterGlobalDiscount = cartTotalIncGST * globalDiscountMultiplier;
  // GST will be applied only for India
  const gstAfterGlobalDiscount =
    currency !== 'INR' ? 0 : (totalAfterGlobalDiscount / 118) * 18;
  const subtotalAfterGlobalDiscount =
    currency !== 'INR'
      ? totalAfterGlobalDiscount
      : totalAfterGlobalDiscount - gstAfterGlobalDiscount;

  // PRICE AFTER PROMO CODE APPLIED
  const totalAfterPromoApplied =
    totalAfterGlobalDiscount - promoCodeDiscountAmount;
  // GST will be applied only for India
  const gstAfterPromoApplied =
    currency !== 'INR' ? 0 : (totalAfterPromoApplied / 118) * 18;
  const subtotalAfterPromoApplied =
    currency !== 'INR'
      ? totalAfterPromoApplied
      : totalAfterPromoApplied - gstAfterPromoApplied;

  return {
    // PRICE FROM DATABASE
    cartTotalIncGST: roundToTwoDecimals(cartTotalIncGST),
    gstOnCartTotal: roundToTwoDecimals(gstOnCartTotal),
    subtotalOnCartTotal: roundToTwoDecimals(subtotalOnCartTotal),
    // PRICE AFTER GLOBAL DISCOUNT
    totalAfterGlobalDiscount: roundToTwoDecimals(totalAfterGlobalDiscount),
    gstAfterGlobalDiscount: roundToTwoDecimals(gstAfterGlobalDiscount),
    subtotalAfterGlobalDiscount: roundToTwoDecimals(
      subtotalAfterGlobalDiscount
    ),
    // PRICE AFTER PROMO CODE APPLIED
    totalAfterPromoApplied: roundToTwoDecimals(totalAfterPromoApplied),
    gstAfterPromoApplied: roundToTwoDecimals(gstAfterPromoApplied),
    subtotalAfterPromoApplied: roundToTwoDecimals(subtotalAfterPromoApplied),
  };
}
