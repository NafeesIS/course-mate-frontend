/* eslint-disable indent */
export interface State {
  stateName: string;
  statePrice: number;
  approxCompanyCount: number;
}

export interface DurationOption {
  discountPercent: number;
}

/**
 * Calculates the total base price based on the selected states.
 * @param selectedStates - An array of selected state names.
 * @param states - An array of all available states with their prices.
 * @returns The total base price.
 */
export const calculateTotalPrice = (
  selectedStates: string[],
  states: State[],
  durationOptions: 'monthly' | 'quarterly' | 'annually'
): number => {
  const monthlyTotal = selectedStates.reduce((total, stateName) => {
    const state = states.find((s) => s.stateName === stateName);
    return total + (state ? state.statePrice : 0);
  }, 0);

  switch (durationOptions) {
    case 'annually':
      return monthlyTotal * 12;
    case 'quarterly':
      return monthlyTotal * 3;
    default: // 'monthly'
      return monthlyTotal;
  }
};

/**
 * Calculates the discount amount based on the total price and discount percentage.
 * @param totalPrice - The total base price.
 * @param discountPercent - The discount percentage.
 * @returns The discount amount.
 */
export const calculateDiscountAmount = (
  totalPrice: number,
  discountPercent: number
): number => {
  return (totalPrice * discountPercent) / 100;
};

/**
 * Calculates the final price after applying the discount.
 * @param totalPrice - The total base price.
 * @param discountAmount - The discount amount.
 * @returns The final price after discount.
 */
export const calculatePriceAfterDiscount = (
  totalPrice: number,
  discountAmount: number
): number => {
  return totalPrice - discountAmount;
};

/**
 * Calculates the total approximate company count based on the selected states.
 * @param selectedStates - An array of selected state names.
 * @param states - An array of all available states with their prices and company count.
 * @returns The total approximate company count.
 */
export const calculateTotalCompanyCount = (
  selectedStates: string[],
  states: State[]
): number => {
  return selectedStates.reduce((total, stateName) => {
    const state = states.find((s) => s.stateName === stateName);
    return total + (state ? state.approxCompanyCount : 0);
  }, 0);
};
