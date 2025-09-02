export interface TCompanySearchParams {
  query?: string;
  llpStatus?: string;
  companyType?: string;
  mainDivisionDescription?: string;
  whetherListedOrNot?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  paidUpCapital?: string;
  page?: number | string;
  limit?: number | string;
}

// export interface TCompanySearchResult {
//   success: boolean;
//   message: string;
//   data: {
//     totalResults: number;
//     currentPage: number;
//     limit: number;
//     totalPages: number;
//     companies: TCompany[];
//   };
// }
export interface TCompanySearchResult {
  success: boolean;
  message: string;
  data: TCompany[];
}

interface TCompany {
  _id: string;
  cin: string;
  company: string;
  category: string;
  classOfCompany: string;
  status: string;
  state: string;
  incorporationAge: number;
  score: number;
}

export interface TCompanySearchFacets {
  success: boolean;
  message: string;
  data: [
    {
      count: {
        lowerBound: number;
      };
      facet: {
        companyTypeFacet?: {
          buckets: any[];
        };
        llpStatusFacet?: {
          buckets: any[];
        };
        mainDivisionDescriptionFacet?: {
          buckets: any[];
        };
        whetherListedOrNotFacet?: {
          buckets: any[];
        };
        stateFacet?: {
          buckets: any[];
        };
        cityFacet?: {
          buckets: any[];
        };
        postalCodeFacet?: {
          buckets: any[];
        };
        paidUpCapitalFacet?: {
          buckets: any[];
        };
      };
    },
  ];
}
