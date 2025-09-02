export type TCouponUser = {
  _id: string;
  email: string;
  name: string;
  mobileNumber: string;
};

export type TService = {
  _id: string;
  name: string;
  description: string;
  serviceType: string;
};

export type TCoupon = {
  code: string;
  type: string;
  value: number;
  minimumOrderValue: number;
  maxRedemptions: number;
  redemptions: number;
  maxRedemptionsPerUser: number;
  isActive: boolean;
  expiryDate: string;
  createdAt: string;
  isFirstTimeUser: boolean;
  createdBy: string;
  validUsers: TCouponUser[];
  usedBy: TCouponUser[];
  validServices: TService[];
};
