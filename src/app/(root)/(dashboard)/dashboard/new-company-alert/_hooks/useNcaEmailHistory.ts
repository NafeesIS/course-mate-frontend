/*
Frontend Integration Guidelines for /api/v1/subscribe/nca-email-history
-----------------------------------------------------------------------

Endpoint:
  GET /api/v1/subscribe/nca-email-history

Required Parameter:
- userId (string): The MongoDB ObjectId of the user whose email history you want to fetch.

Optional Query Parameters:
- page (number): For pagination. Default is 1.
- limit (number): Number of records per page. Default is 10.
- sortBy (string): Field to sort by. Default is processDate.
- sortOrder (asc | desc): Sort order. Default is desc.
- processDate (string, ISO 8601): Filter for a specific process date or start of a range.
- processEndDate (string, ISO 8601): End of process date range.
- emailSentDate (string, ISO 8601): Filter for a specific email sent date or start of a range.
- emailSentEndDate (string, ISO 8601): End of email sent date range.

How to Build the Request:
- Use URLSearchParams to append only the parameters the user has set.
- Always include userId.
- Only include date filters if the user has selected them.

Sample Request:
GET /api/v1/subscribe/nca-email-history?userId=64a1b2c3d4e5f6a7b8c9d0e1&page=1&limit=10&sortBy=processDate&sortOrder=asc&processDate=2025-07-01T00:00:00.000Z&processEndDate=2025-07-05T00:00:00.000Z&emailSentDate=2025-07-01T00:00:00.000Z&emailSentEndDate=2025-07-05T00:00:00.000Z

Sample Response:
{
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 },
  "data": [
    {
      "_id": "...",
      "subscriptionId": "...",
      "userId": "...",
      "orderId": "...",
      "dataType": "companies",
      "processDate": "...",
      "emailSentDate": "...",
      "blobUrl": "...",
      "fileName": "...",
      "fileSize": 12345,
      "stateWiseData": [ ... ],
      "emailStatus": "...",
      "planType": "monthly"
    }
    // ...
  ]
}
*/

import { BASE_URL_BACKEND } from '@/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface INcaEmailHistoryQueryOptions {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  processDate?: string;
  processEndDate?: string;
  emailSentDate?: string;
  emailSentEndDate?: string;
}

export interface IStateWiseData {
  state: string;
  entityCount: number;
  personCount: number;
}

export interface INcaEmailHistoryItem {
  _id: string;
  subscriptionId: string;
  userId: string;
  orderId: string;
  dataType: string; // 'companies' | 'llps' | ...
  processDate: string;
  emailSentDate: string;
  blobUrl: string;
  fileName: string;
  fileSize: number;
  stateWiseData: IStateWiseData[];
  emailStatus: string;
  planType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface INcaEmailHistoryResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    data: INcaEmailHistoryItem[];
  };
}

const fetchNcaEmailHistory = async (
  options: INcaEmailHistoryQueryOptions
): Promise<INcaEmailHistoryResponse> => {
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/subscribe/nca-email-history?${params.toString()}`
  );
  if (!res.ok) throw new Error('Failed to fetch NCA email history');
  return res.json();
};

export default function useNcaEmailHistory(
  options: INcaEmailHistoryQueryOptions
): UseQueryResult<INcaEmailHistoryResponse, Error> {
  return useQuery<INcaEmailHistoryResponse, Error>({
    queryKey: ['ncaEmailHistory', options],
    queryFn: () => fetchNcaEmailHistory(options),
    enabled: typeof options.userId === 'string' && !!options.userId,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
