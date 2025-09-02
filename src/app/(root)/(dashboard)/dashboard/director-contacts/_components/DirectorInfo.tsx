/* eslint-disable indent */
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchContactStatus, fetchDirectorInfo } from '../_services/services';

import { IDirector } from '../_types/types';
import { DirectorCompanies, DirectorPastCompanies } from './DirectorCompanies';
import { DirectorContactInfo } from './DirectorContactInfo';
import { DirectorHeader } from './DirectorHeader';
import { DirectorPersonalInfo } from './DirectorPersonalInfo';
import { ErrorCard } from './ErrorCard';
import { LoadingCard } from './LoadingCard';

interface DirectorInfoProps {
  director: IDirector;
}

export function DirectorInfo({ director }: DirectorInfoProps) {
  const {
    data: directorInfo,
    isLoading: isLoadingInfo,
    isError: isErrorInfo,
  } = useQuery({
    queryKey: ['directorInfo', director.din],
    queryFn: () => fetchDirectorInfo(director.din),
    refetchOnWindowFocus: false,
  });

  const {
    data: maskedContactStatus,
    isLoading: isLoadingMaskedContact,
    isError: isErrorMaskedContact,
  } = useQuery({
    queryKey: ['maskedContactStatus', director.din],
    queryFn: () => fetchContactStatus(director.din),
    refetchOnWindowFocus: false,
  });

  if (isLoadingInfo) {
    return <LoadingCard />;
  }

  if (isErrorInfo) {
    return (
      <ErrorCard message='An error occurred while fetching director information. Please try again later.' />
    );
  }

  return (
    <Card className='mt-6 overflow-hidden'>
      <CardHeader className='bg-purple-50 p-4 md:p-6'>
        <DirectorHeader director={director} />
      </CardHeader>
      <CardContent className='p-4 md:p-6'>
        {directorInfo && (
          <>
            <DirectorPersonalInfo directorInfo={directorInfo} />

            <DirectorContactInfo
              maskedContactStatus={maskedContactStatus}
              isLoadingMaskedContact={isLoadingMaskedContact}
              isErrorMaskedContact={isErrorMaskedContact}
              director={director}
            />

            {directorInfo.companyData &&
              directorInfo.companyData.length > 0 && (
                <DirectorCompanies companies={directorInfo.companyData} />
              )}

            {directorInfo.mcaSignatoryCessationMasterHistory &&
              directorInfo.mcaSignatoryCessationMasterHistory.length > 0 && (
                <DirectorPastCompanies
                  pastCompanies={
                    directorInfo.mcaSignatoryCessationMasterHistory
                  }
                />
              )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
