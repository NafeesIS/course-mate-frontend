export interface TCompanyMasterData {
  success: boolean;
  message: string;
  data: {
    _id: string;
    cin: string;
    company: string;
    companyType: string;
    companyOrigin: string;
    category: string;
    registrationNumber: string;
    classOfCompany: string;
    status: string;
    state: string;
    incorporationAge: number;
    rocCode: string;
    dateOfIncorporation: string;
    companySubcategory: string;
    listingStatus: string;
    industry: string;
    authorizedCapital: string;
    paidUpCapital: number;
    totalObligationOfContribution: string;
    email: string;
    website: string;
    formattedAuthorizedCapital: string;
    formattedPaidUpCapital: string;
    about: string;
    chargeData: {
      totalOpenCharges?: number;
      totalSatisfiedCharges?: number;
      totalLenders?: number;
      lastChargeDate?: string;
      lastChargeAmount?: string;
      messageForNoCharge?: string;
    };
    address: {
      registeredAddress: string;
      city?: string;
      pinCode: string;
      addressType: string;
    };
    currentDirectors: any[];
    pastDirectors: any[];
    executiveTeam: any[];
    associatedCompanies: any[];
  };
}

export interface TAnnualFilings {
  success: boolean;
  message: string;
  data: TAnnualFilingsData[];
}

export type TAnnualFilingsData = {
  formCode: string;
  formDescription: string;
  formName: string;
  financialYear: string;
  isLateAgmHeld: boolean;
  agmDate: string;
  periodOfDelay: string;
  dueDate: string;
  filingStatus: string;
  filingDate: string;
  normalFee: number;
  additionalFee: number;
  isAdditionalFeeManuallyAdded?: boolean;
};

export interface TOneTimeCompliance {
  success: boolean;
  message: string;
  data: TOneTimeComplianceData[];
}

export interface TOneTimeComplianceData {
  formCode: string;
  formName: string;
  formDescription: string;
  dueDate: string;
  filingStatus: string;
  filingDate: string;
  normalFee: string;
  additionalFee: string;
  isApplicable: boolean;
}

export interface TCompanyLastUpdatedInfo {
  _id: string;
  cin: string;
  __v: number;
  createdOn: string;
  isCompanyDataUpdated: string;
  isGstUpdated: string;
  isLLPVpdUpdated: string;
  // isSrnDataUpdated: string;
  lastUpdatedOn: string;
}
