export interface TDirectorSearchParams {
  query?: string;
  status?: string;
  page?: number | string;
  limit?: number | string;
}

export interface TDirectorSearchResult {
  success: boolean;
  message: string;
  data: TDirector[];
}

interface TDirector {
  _id: string;
  totalDirectorshipCount: number;
  din: string;
  fullName: string;
  dinAllocationDate: string;
  status: string;
  personType: string;
  companies: string[];
  score?: number;
}

export interface TDirectorSearchFacets {
  success: boolean;
  message: string;
  data: [
    {
      count: {
        lowerBound: number;
      };
      facet: {
        statusFacet: {
          buckets: any[];
        };
      };
    },
  ];
}
