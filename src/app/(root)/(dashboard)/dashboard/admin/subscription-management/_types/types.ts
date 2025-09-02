/* eslint-disable no-unused-vars */

import { LucideIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

export interface IDateRangePickerProps {
  className?: string;
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  resetSignal?: boolean;
  onApplySort?: (field: string, order: 'asc' | 'desc') => void;
}

export interface ISubscriptionStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  onClick?: () => void;
  isSelected?: boolean;
}
export interface IUserMetaData {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  avatarUrl?: string;
  bio?: string;
  social?: {
    linkedin?: string;
    facebook?: string;
    github?: string;
  };
}

export interface TSubscriptionUser {
  _id: string;
  emails: string[];
  meta_data: IUserMetaData;
}

export interface TService {
  name: string;
  description: string;
}

export interface IFileSentHistory {
  BlobLink: string;
  s3Link: string;
  emailSentDate: string;
}

export interface IUserServiceSubscription {
  userId: TSubscriptionUser;
  serviceId: TService;
  orderId: string;
  paymentId: string;
  plan: string;
  options: string[];
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'trial' | 'expired' | 'grace';
  includedStates: string[];
  fileSentHistory: IFileSentHistory[];
}

export interface ISubscriberTableProps {
  subscribers: IUserServiceSubscription[];
  filters: {
    plan: string;
    product: string;
    options: string;
    status: string;
    startDate: string;
    endDate: string;
    expirationDays: string;
    startRange: string;
    endRange: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      plan: string;
      product: string;
      options: string;
      status: string;
      startDate: string;
      endDate: string;
      expirationDays: string;
      startRange: string;
      endRange: string;
    }>
  >;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
}
