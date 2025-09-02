// Types for New Company Alert Dashboard

export interface SubscriptionDetail {
  _id: string;
  userId: string;
  serviceId: string;
  orderId: string;
  paymentId: string;
  plan: string;
  options: string[];
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | string;
  includedStates: string[];
}

export interface SubscriptionDetailsResponse {
  success: boolean;
  message: string;
  data: SubscriptionDetail[];
}

export interface StateWiseDataLLP {
  State: string;
  llpCount: number;
  partnerCount: number;
}

export interface StateWiseDataCompany {
  State: string;
  companyCount: number;
  directorCount: number;
}

export type StateWiseDataRow = StateWiseDataLLP | StateWiseDataCompany;

export interface NCAEmailHistoryItem {
  _id: string;
  subscriptionId: string;
  userId: string;
  orderId: string;
  dataType: string;
  processDate: string;
  emailSentDate: string;
  blobUrl: string;
  fileName: string;
  fileSize: number;
  stateWiseData: StateWiseDataRow[];
  emailStatus: string;
  planType: 'Email_with_Phone' | 'Email Only';
  createdAt: string;
  updatedAt: string;
}

export interface NCAEmailHistoryResponse {
  success: boolean;
  message: string;
  data: NCAEmailHistoryItem[];
}
