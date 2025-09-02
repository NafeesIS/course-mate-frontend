/* eslint-disable no-unused-vars */
import { DateRange } from 'react-day-picker';

export type TOrderItem = {
  serviceId: string;
  serviceName: string;
  serviceType: string;
  quantity: number;
  price: number;
  currency: string;
  customAttributes?: {
    plan?: 'monthly' | 'quarterly' | 'annually' | 'trial';
    options?: string[];
    includedStates?: string[];
    zone?: string;
    bulkUnlockCredits?: number;
    package?: 'Starter' | 'Standard' | 'Elite';
    registeredState?: string;
    companyUnlockCredits?: number;
    companyId?: string;
  };
};

export interface IOrderDateRangePickerProps {
  className?: string;
  value: DateRange | undefined;
  onChange: (startDate?: string, endDate?: string) => void;
  resetSignal?: boolean;
  datePickerUpdate?: boolean;
}

export interface ISmartSwitchProps {
  checked: string;
  onChange: (value: string) => void;
  leftLabel: string;
  rightLabel: string;
  setResetDatePicker?: (value: boolean) => void;
  setDatePickerUpdate?: (value: (prev: boolean) => boolean) => void;
}

type TCoupon = {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
};

export type TUserMetaData = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
};

export type TUser = {
  _id: string;
  uId: string;
  emails: string[];
  meta_data: TUserMetaData;
};

export type TOrder = {
  _id: string;
  userId: TUser;
  orderId: string;
  items: TOrderItem[];
  value: number;
  gst: number;
  gstNumber: string;
  status: 'CREATED' | 'PENDING' | 'PAID' | 'FAILED' | 'UNKNOWN';
  currency: string;
  coupon: TCoupon | null;
  discount_amount: number;
  createdAt: Date;
  paymentId: string | null;
};

export interface IOrderStatCardProps {
  title: string;
  orderNumber: number;
  inrAmount: string;
  usdAmount: string;
  colorClass: string;
  status: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  isSelected?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
}

export interface UsersDialogProps {
  validUser?: TUser;
  title: string;
}
