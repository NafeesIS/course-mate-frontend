'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { parseISO } from 'date-fns';
import { format } from 'date-fns-tz';
import { Check, FileX2 } from 'lucide-react';
import { useState } from 'react';
import { getPublicDocsData } from '../../_services/getPublicDocsData';
import { useCompanyLastUpdatedInfoStore } from '../../_store/useCompanyLastUpdatedInfoStore';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import { IPublicDocumentsResponse } from '../../_types/PublicDocsTypes';
import CTAUnlockCompanyData from '../CTA/CTAUnlockCompanyData';
import { VPDTable } from './VPDTable/VPDTable';

type ErrorResponse = {
  success: boolean;
  message: string;
  errorSources?: Array<{ path: string; message: string }>;
};

const PublicDocsTab = ({
  companyData,
}: {
  companyData: TCompanyMasterData;
}) => {
  const cin = companyData.data?.cin;
  const companyType = companyData.data.companyType;
  const [selectedVersion, setSelectedVersion] = useState<'v3' | 'v2'>('v3');

  const { lastUpdatedAt } = useCompanyLastUpdatedInfoStore();

  const { data, isLoading, error } = useQuery<
    IPublicDocumentsResponse,
    ErrorResponse
  >({
    queryKey: ['publicDocs', companyType, cin, selectedVersion],
    queryFn: () => getPublicDocsData(companyType, cin, selectedVersion),
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
    gcTime: 60000, // 1 minute
    enabled: companyType !== 'LLP',
  });

  const {
    data: llpData,
    isLoading: llpLoading,
    error: llpError,
  } = useQuery<IPublicDocumentsResponse, ErrorResponse>({
    queryKey: ['publicDocs', companyType, cin],
    queryFn: () => getPublicDocsData(companyType, cin),
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
    gcTime: 60000, // 1 minute
    enabled: companyType === 'LLP',
  });

  const formattedLastUpdatedAt = (lastUpdated: string) =>
    lastUpdated
      ? format(parseISO(lastUpdated), 'dd-MMM-yyyy HH:mm aa')
      : lastUpdatedAt
        ? format(parseISO(lastUpdatedAt), 'dd-MMM-yyyy HH:mm aa')
        : companyData.data.dateOfIncorporation || '-';

  // IF COMPANY TYPE = LLP RENDER LLP SECTION
  if (companyType === 'LLP') {
    const docsData = llpData?.data.v3_documents || [];

    return (
      <div className='mt-6 w-full md:mt-8 lg:mt-10'>
        <CTAUnlockCompanyData
          companyData={companyData}
          source='public-docs-tab'
        />

        <div className='mt-10 space-y-4'>
          <p className='text-balance text-[10px] text-muted-foreground md:text-xs'>
            * The documents displayed here reflect the information available on
            the Ministry of Corporate Affairs (MCA) portal as of{' '}
            <span className='text-foreground'>
              {formattedLastUpdatedAt(llpData?.data.last_updated || '')}
            </span>
            . For the most current documentation, please utilize the{' '}
            <span className='text-foreground'>&quot;Update Now&quot;</span>{' '}
            feature.
          </p>

          {llpError ? (
            renderNoDocumentsState()
          ) : llpLoading ? (
            <LoadingWithSpinner />
          ) : docsData.length > 0 ? (
            <VPDTable version='v3' data={docsData} companyData={companyData} />
          ) : (
            renderNoDocumentsState()
          )}
        </div>
      </div>
    );
  }

  // IF COMPANY TYPE = COMPANY RENDER COMPANY SECTION
  const companyDocsData = data?.data;

  return (
    <div className='mt-6 w-full md:mt-8 lg:mt-10'>
      <CTAUnlockCompanyData
        companyData={companyData}
        source='public-docs-tab'
      />

      <Tabs
        value={selectedVersion}
        onValueChange={(value) => setSelectedVersion(value as 'v3' | 'v2')}
        className='mt-10'
      >
        <div className='flex items-center justify-end gap-8'>
          <p className='text-balance text-[10px] text-muted-foreground md:text-xs'>
            * The documents displayed here reflect the information available on
            the Ministry of Corporate Affairs (MCA) portal as of{' '}
            <span className='text-foreground'>
              {formattedLastUpdatedAt(
                selectedVersion === 'v3'
                  ? companyDocsData?.last_updated || ''
                  : companyDocsData?.lastUpdated || ''
              )}
            </span>
            . For the most current documentation, please utilize the{' '}
            <span className='text-foreground'>&quot;Update Now&quot;</span>{' '}
            feature.
          </p>

          <TabsList className='ml-auto shadow-inner'>
            <TabsTrigger value='v3'>
              {selectedVersion === 'v3' && (
                <span className='flex-center mr-1.5 size-4 rounded-full bg-green-500 text-white shadow-sm'>
                  <Check className='size-3' />
                </span>
              )}
              <span>V3 Docs</span>{' '}
            </TabsTrigger>
            <TabsTrigger value='v2'>
              {selectedVersion === 'v2' && (
                <span className='flex-center mr-1.5 size-4 rounded-full bg-green-500 text-white shadow-sm'>
                  <Check className='size-3' />
                </span>
              )}
              <span>V2 Docs</span>{' '}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='v3'>
          {error ? (
            renderNoDocumentsState('V3')
          ) : isLoading ? (
            <LoadingWithSpinner />
          ) : companyDocsData?.v3_documents &&
            companyDocsData?.v3_documents.length > 0 ? (
            <VPDTable
              version='v3'
              companyData={companyData}
              data={companyDocsData.v3_documents}
            />
          ) : (
            renderNoDocumentsState('V3')
          )}
        </TabsContent>
        <TabsContent value='v2'>
          {error ? (
            renderNoDocumentsState('V2')
          ) : isLoading ? (
            <LoadingWithSpinner />
          ) : companyDocsData?.v2_documents &&
            companyDocsData?.v2_documents.length > 0 ? (
            <VPDTable
              version='v2'
              companyData={companyData}
              data={companyDocsData.v2_documents}
            />
          ) : (
            renderNoDocumentsState('V2')
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const renderNoDocumentsState = (version?: string) => (
  <Card className='mx-auto mt-6 rounded-md border bg-muted shadow'>
    <CardHeader className='flex-row items-center gap-3 space-y-0 pb-3'>
      <div className='flex size-7 items-center justify-center rounded-full bg-muted-foreground'>
        <FileX2 className='size-4 text-muted' />
      </div>
      <h3 className='text-base font-semibold sm:text-lg'>
        No Documents Found
        {version ? ` for ${version}` : ''}
      </h3>
    </CardHeader>
    <CardContent>
      <p className='text-xs text-muted-foreground sm:text-sm'>
        We couldn&apos;t fetch the public documents at this moment.
      </p>

      <div className='mt-2 w-full rounded-lg border bg-white p-4 text-foreground/90 md:mt-3'>
        <p className='text-xs font-medium sm:text-sm'>This could be because:</p>
        <ul className='mt-1 text-xs sm:text-sm md:mt-1.5'>
          <li>- The company has not filed any documents yet</li>
          <li>- The company was recently incorporated</li>
          <li>
            - We could not fetch the documents from the MCA portal due to
            unavailability of their services
          </li>
          <li>
            - We are showing this based on our last update. After purchase, you
            will be able to update and fetch the latest data to access any
            documents filed by the company
          </li>
        </ul>
      </div>
      <p className='mt-2 text-xs text-muted-foreground sm:text-sm md:mt-3'>
        Please try{' '}
        <span className='text-foreground/90'>&quot;Update Now&quot;</span> to
        fetch the latest documents. If the issue persists, contact our{' '}
        <a
          href='mailto:helpdesk@filesure.in'
          className='text-primary hover:underline'
        >
          support team
        </a>{' '}
        for assistance.
      </p>
    </CardContent>
  </Card>
);

export default PublicDocsTab;
