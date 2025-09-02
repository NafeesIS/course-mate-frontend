export type TServiceType =
  | 'subscription'
  | 'oneTime'
  | 'directorUnlock'
  | 'complianceService'
  | 'companyUnlock';

export type TCartItem = {
  serviceId: string;
  serviceName: string;
  serviceType: TServiceType;
  quantity: number;
  price: number;
  currency: string;
  customAttributes?: {
    // Subscription-specific attributes
    plan?: 'monthly' | 'quarterly' | 'annually' | 'trial'; // For subscription services
    options?: string[]; // Array for additional options selected (optional)
    includedStates?: string[]; // For state-specific subscription services
    zone?: string; // Selected zone for zonal pricing services

    // Director Unlock-specific attributes
    bulkUnlockCredits?: number; // Number of credits for bulk director unlock

    // Business services type attributes
    package?: 'Starter' | 'Standard' | 'Elite';
    registeredState?: string;

    companyUnlockCredits?: number; // Number of credits for company unlock
    companyId?: string; // Company ID for single company unlock

    // [key: string]: any; // Allow additional attributes for future flexibility
  };
};
