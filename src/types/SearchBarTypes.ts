export interface TSearchResult {
  success: boolean;
  message: string;
  data: any[];
}

export interface TCompanySuggestion {
  _id: string;
  cin: string;
  company: string;
  category: string;
  classOfCompany: string;
  incorporationAge: number;
  score: number;
  state: string;
  status: string;
}

export interface TDirectorSuggestion {
  _id: string;
  din: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  status: string;
  companies: any[];
  score: number;
}
