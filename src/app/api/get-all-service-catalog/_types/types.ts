export interface IPricingPlan {
  baseMonthly: number;
  baseQuarterly: number;
  baseAnnually: number;
}

export interface IBulkPricing {
  quantity: number;
  price: number;
}
export interface IStatePricing {
  state: string;
  multiplier: number;
  approxCompanies: number;
}

export interface IZonalPricing {
  zone: string;
  monthly: number;
  quarterly: number;
  annually: number;
  approxCompanies: number;
  stateIncludes: string[];
  trial?: number;
  globalDiscount?: number;
  globalDiscountStartDate?: string;
  globalDiscountEndDate?: string;
}

export interface IUnlockPricingOption {
  credits: number;
  price: number;
  _id?: string;
}

export interface IUnlockPricing {
  country: string;
  currency: string;
  singleUnlock: {
    price: number;
    credits: number;
  };
  bulkUnlock?: IUnlockPricingOption[];
}

export type TServiceCatalog = {
  _id?: string;
  name: string;
  description: string;
  serviceType:
    | 'subscription'
    | 'oneTime'
    | 'directorUnlock'
    | 'companyUnlock'
    | 'vpdUnlock';
  pricingPlan?: IPricingPlan; // For subscription services
  statePricing?: IStatePricing[]; // Array of state-specific pricing plans
  zonalPricing?: IZonalPricing[]; //Array of zonal pricing model
  oneTimePricing?: {
    singlePrice?: number;
    bulkPricing?: IBulkPricing[]; // For one-time purchase services
  };
  directorUnlockPricing?: IUnlockPricing | [];
  companyUnlockPricing?: IUnlockPricing | [];
  vpdUnlockPricing?: IUnlockPricing | [];
  features?: string[]; // Optional: for services like Company Data, where features are part of the service
  excludes?: string[]; // Optional: for services like Company Data, where excludes are part of the service
  packages?: any[];
  __v?: number;
};
