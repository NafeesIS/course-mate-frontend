// Interface for basic pricing plans
export interface IPricingPlan {
  baseMonthly: number;
  baseQuarterly: number;
  baseAnnually: number;
}

// Interface for zonal pricing details
export interface IZonalPricing {
  zone: string;
  monthly: number;
  quarterly: number;
  annually: number;
  approxCompanies: number;
  stateIncludes: string[];
  trial?: number;
}

// Interface for state-specific pricing
export interface IStatePricing {
  state: string;
  multiplier: number;
  approxCompanies: number;
}

// Interface for company alert plans
export interface ICompanyAlertPlan {
  _id: string;
  name: string;
  description: string;
  serviceType: 'subscription';
  pricingPlan?: IPricingPlan; // Optional, as some plans might use zonal pricing
  statePricing?: IStatePricing[]; // Optional, if no specific state pricing exists
  zonalPricing?: IZonalPricing[]; // Optional, if zonal pricing exists
  features: string[];
  excludes: string[];
  // __v: number;
}

export interface ICompanyLLP {
  _id: string;
  cin: string;
  company: string;
  state: string;
  status: string;
  companyType: string;
  dateOfIncorporation: string;
  category: string;
  classOfCompany: string;
}

export interface RecentlyIncorporatedNCAProps {
  recentlyIncorporatedCompanies: ICompanyLLP[];
  recentlyIncorporatedLLPs: ICompanyLLP[];
  plans: ICompanyAlertPlan[];
}

export interface ICompanyAndLLPCountsData {
  companyCount: number;
  llpCount: number;
  directorCount: number;
  previousDayCompanies: number;
  previousDayLLPs: number;
  previousDayDirectorCount: number;
  previousMonthCompanies: number;
  previousMonthLLPs: number;
  previousMonthDirectorCount: number;
}

export interface CountUpProps {
  value: number;
  label: string;
  className?: string;
}
