export interface CustomAttributes {
  bulkUnlockCredits?: number | null;
  companyUnlockCredits?: number | null;
  companyId?: string | null;
  companyName?: string | null;
  [key: string]: any; // Allow for additional custom attributes
}

export interface OrderItem {
  serviceId: string;
  serviceName: string;
  serviceType: string;
  quantity: number;
  price: number;
  currency: string;
  customAttributes?: CustomAttributes;
}

export interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address?: string;
  city?: string;
  zipCode: string;
  country: string;
  state: string;
  isDefault: boolean;
  billingType: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
}

export interface OrderDetails {
  _id: string;
  userId: string;
  orderId: string;
  items: OrderItem[];
  value: number;
  gst: number;
  gstNumber: string | null;
  status: string;
  paymentId: string | null;
  currency: string;
  coupon: Coupon | null;
  discount_amount: number;
  isProcessed: boolean;
  billingDetails: BillingDetails;
  createdAt: string;
  updatedAt: string;
}
