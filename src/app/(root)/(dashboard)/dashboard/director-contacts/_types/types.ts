export interface IDirectorSuggestion {
  _id: string;
  totalDirectorshipCount: number;
  din: string;
  fullName: string;
  dinAllocationDate: string;
  status: string;
  personType: string;
  companies: string[];
}
export interface ICompanySuggestion {
  _id: string;
  cin: string;
  company: string;
  companyType: string;
  companyOrigin: string;
  score: number;
  currentDirectors: IDirectorSuggestion[];
  pastDirectors: IDirectorSuggestion[];
}

export interface IDirector {
  _id: string;
  din: string;
  fullName: string;
}

export interface IPastCompanies {
  cessationDate: string;
  designation: string;
  appointmentDate: string;
  din: string;
  accountName: string;
  cin: string;
}

export interface IDirectorDetails {
  din: string;
  fullName: string;
  dob: string;
  gender: string;
  nationality: string;
  personType: string;
  status: string;
  companyData: any[];
  mcaSignatoryCessationMasterHistory: IPastCompanies[];
}

export interface IContactStatus {
  emailAddress: string;
  mobileNumber: string;
}

export interface IUnlockContact {
  message: string;
  alreadyUnlocked: boolean;
  emailAddress: string;
  mobileNumber: string;
  fullName: string;
  remainingRedemptions: number;
  expiryDate: string; // or Date if you want to convert it later
}

export interface IUnlockContactResponse {
  success: boolean;
  message: string;
  data: IUnlockContact;
}

export interface IUnlockedContact {
  directorId: string;
  unlockedAt: string;
  mobileNumber: string;
  emailAddress: string;
  fullName: string;
}

export interface IPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface IUnlockedContactsApiResponse {
  success: boolean;
  message: string;
  data: {
    unlockedContacts: IUnlockedContact[];
    pagination: IPaginationInfo;
  };
}
