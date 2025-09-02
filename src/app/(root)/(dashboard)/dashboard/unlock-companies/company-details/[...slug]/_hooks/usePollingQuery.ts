'use client';

import { IPublicDocumentsResponse } from '@/app/(root)/company/_types/PublicDocsTypes';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from 'aws-cdk-lib/aws-cloudfront';
import { useEffect, useState } from 'react';
import { getPublicDocsData } from '../_services/getPublicDocsData';

export const usePollingQuery = (
  userId: string,
  companyType: string,
  cin: string,
  selectedVersion: 'v3' | 'v2',
  isUnlocked: boolean,
  isAdmin?: boolean
) => {
  const [shouldPoll, setShouldPoll] = useState(false);

  const query = useQuery<IPublicDocumentsResponse, ErrorResponse | null>({
    queryKey: [
      'publicDocs',
      userId,
      companyType,
      cin,
      selectedVersion,
      isUnlocked,
    ],
    queryFn: () =>
      getPublicDocsData(
        userId,
        companyType,
        cin,
        selectedVersion,
        isUnlocked,
        isAdmin
      ),
    refetchInterval: (query) => {
      const data = query.state.data as IPublicDocumentsResponse | undefined;
      if (!data) return false;
      const jobStatus = data.data?.downloadStatus?.jobStatus;
      const documentDownloadStatus =
        data.data?.downloadStatus?.documentDownloadStatus;
      if (
        !shouldPoll ||
        !isUnlocked ||
        jobStatus === 'challan_skipped' ||
        jobStatus === 'no_docs_found'
      )
        return false;
      if (
        jobStatus === 'downloading_docs' ||
        documentDownloadStatus === 'in_progress'
      ) {
        return 5000; // 5 seconds
      }
      return 10000; // 10 seconds
    }, // Updated refetch interval logic
    enabled: !!userId && !!companyType && !!cin && companyType !== 'LLP',
    retry: 3, // Disable automatic retries on error
  });

  useEffect(() => {
    if (query.data) {
      if (!query.data.data.downloadStatus?.zipCompletedAt) {
        setShouldPoll(true);
      } else {
        setShouldPoll(false);
      }
    }

    // Stop polling on error or if the backend has stopped
    if (query.error || query.isError) {
      setShouldPoll(false);
    }
  }, [query.data, query.error, query.isError]);

  return { ...query, isPolling: shouldPoll };
};
