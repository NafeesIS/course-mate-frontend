export interface IPackage {
  packageName: string;
  description: string;
  currency: string;
  price: number;
  features: string[];
}
export interface IPaymentDetailsProps {
  currentPackage: IPackage;
  serviceName: string;
  serviceId: string;
  state: string;
  serviceType: string;
}
export type TServiceCatalog = {
  name: string;
  packages: IPackage[];
};
export interface IOrderSummaryProps {
  currentPackage: IPackage;
  service: TServiceCatalog;
  yourState: string;
  statePricing: string;
  selectedMyPlanName: string;
  handlePackageChange: any;
  handleStateChange: any;
}

export interface IStatePriceBreakdown {
  stateName: string;
  dscPrice: number;
  panTan: number;
  stateFilingFee: number;
  totalAmount: number;
}

export interface INewCommonLead {
  name: string;
  email: string;
  contactNo: string;
  serviceType: string[];
  sources: string[];
  pathname: string;
}
