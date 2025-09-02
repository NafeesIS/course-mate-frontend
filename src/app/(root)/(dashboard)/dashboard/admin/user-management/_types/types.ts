import { TCoupon } from '../../coupon-management/coupon-list/_types/types';
import { TOrderItem } from '../../order-management/_types/types';
import {
  IFileSentHistory,
  IUserMetaData,
} from '../../subscription-management/_types/types';

export interface IBulkUnlockCredit {
  availableCredits: number;
  expiryDate: Date;
  creditType: 'directorUnlock' | 'companyUnlock';
  createdAt: Date;
}

export interface IUserOrder {
  _id: string;
  orderId: string;
  items: TOrderItem[];
  value: number;
  gst: number;
  gstNumber: string | null;
  status: 'CREATED' | 'PENDING' | 'PAID' | 'FAILED' | 'UNKNOWN';
  paymentId: string | null;
  currency: string;
  coupon: TCoupon | null;
  discount_amount: number;
  createdAt: string;
}

export interface IUserSubscription {
  _id: string;
  orderId: string;
  paymentId: string;
  plan: string;
  options: string[];
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'trial' | 'expired' | 'grace';
  fileSentHistory: IFileSentHistory[];
}

export interface IUserDocument {
  _id: string;
  emails: string[];
  lastLogin: string;
  phoneNumbers: string[];
  profilePicture: string;
  timeJoined: number;
  meta_data: IUserMetaData;
  orders: IUserOrder[];
  subscriptions: IUserSubscription[];
  bulk_unlock_credits: IBulkUnlockCredit[];
}

export interface IDatePickerProps {
  selected?: Date | undefined;
  // eslint-disable-next-line no-unused-vars
  onSelect: (date: Date | undefined) => void;
  placeholderText?: string;
  className?: string;
}

export interface ISingleUserData {
  _id: string;
  emails: string[];
  lastLogin: string;
  orders: IUserOrder[];
  phoneNumbers: string[];
  profilePicture?: string;
  subscriptions: IUserSubscription[];
  timeJoined: number;
  meta_data: IUserMetaData;
  bulk_unlock_credits: IBulkUnlockCredit[];
}
