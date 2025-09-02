'use client';

import MCAUpdateBanner from '@/app/(root)/(dashboard)/dashboard/unlock-companies/company-details/[...slug]/_components/PublicDocsTab/MCAUpdateBanner';
import { usePollingQuery } from '@/app/(root)/(dashboard)/dashboard/unlock-companies/company-details/[...slug]/_hooks/usePollingQuery';
import { getPublicDocsData } from '@/app/(root)/(dashboard)/dashboard/unlock-companies/company-details/[...slug]/_services/getPublicDocsData';
import { VPDTable } from '@/app/(root)/company/_components/PublicDocsTab/VPDTable/VPDTable';
import { useCompanyLastUpdatedInfoStore } from '@/app/(root)/company/_store/useCompanyLastUpdatedInfoStore';
import {
  IPublicDocument,
  IPublicDocumentsResponse,
} from '@/app/(root)/company/_types/PublicDocsTypes';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { AlertCircle, ArrowUpRight, Check, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { IoInformationCircle } from 'react-icons/io5';
import ProcessingState from '../../../../../../unlock-companies/company-details/[...slug]/_components/PublicDocsTab/ProcessingState';
import type { TCompanyMasterData } from '../../_types/CompanyDetails';

type ErrorResponse = {
  success: boolean;
  message: string;
  errorSources?: Array<{ path: string; message: string }>;
};

const PublicDocsTab = ({
  companyData,
  userId,
}: {
  companyData: TCompanyMasterData;
  userId: string;
}) => {
  const cin = companyData.data?.cin;
  const companyType = companyData.data.companyType;
  const [selectedVersion, setSelectedVersion] = useState<'v3' | 'v2'>('v3');

  const { lastUpdatedAt } = useCompanyLastUpdatedInfoStore();

  // GET PUBLIC DOCS DATA FOR COMPANIES
  // Use the updated polling hook for companies
  const { data, isLoading, error, isPolling } = usePollingQuery(
    userId!,
    companyType,
    cin!,
    selectedVersion,
    true,
    true
  );

  // GET PUBLIC DOCS DATA FOR LLP'S
  const {
    data: llpData,
    isLoading: llpLoading,
    error: llpError,
  } = useQuery<IPublicDocumentsResponse, ErrorResponse>({
    queryKey: ['publicDocs', userId, companyType, cin],
    queryFn: () =>
      getPublicDocsData(userId!, companyType, cin, 'v3', true, true),
    enabled: !!userId && !!companyType && !!cin && companyType === 'LLP',
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 1000 * 60, // 1 minute
    staleTime: 1000 * 60, // 1 minute
  });

  const formattedLastUpdatedAt = (lastUpdated: string) =>
    lastUpdated
      ? format(parseISO(lastUpdated), 'dd-MMM-yyyy HH:mm aa')
      : lastUpdatedAt
        ? format(parseISO(lastUpdatedAt), 'dd-MMM-yyyy HH:mm aa')
        : companyData.data.dateOfIncorporation;

  // IF COMPANY TYPE = LLP RENDER LLP SECTION
  if (companyType === 'LLP') {
    return renderLLPSection(
      llpData,
      llpLoading,
      llpError,
      companyData,
      formattedLastUpdatedAt(llpData?.data.last_updated || '')
    );
  }

  // IF COMPANY TYPE = COMPANY RENDER COMPANY SECTION
  return renderCompanySection(
    data,
    isLoading,
    (error as ErrorResponse | null) ?? null,
    companyData,
    formattedLastUpdatedAt(
      selectedVersion === 'v3'
        ? data?.data.last_updated || ''
        : data?.data.lastUpdated || ''
    ),
    selectedVersion,
    setSelectedVersion,
    isPolling
  );
};

const renderLLPSection = (
  llpData: IPublicDocumentsResponse | undefined,
  llpLoading: boolean,
  llpError: ErrorResponse | null,
  companyData: TCompanyMasterData,
  formattedLastUpdatedAt: string | undefined
) => {
  return (
    <div className='mt-8'>
      <div className='mt-6 w-full space-y-4 md:mt-8 lg:mt-10'>
        {llpLoading ? (
          <LoadingWithSpinner />
        ) : llpError ? (
          renderErrorState(llpError)
        ) : llpData && llpData.data.v3_paid_documents?.length ? (
          <>
            <p className='text-balance text-[10px] text-muted-foreground md:text-xs'>
              * The documents displayed here reflect the information available
              on the Ministry of Corporate Affairs (MCA) portal as of{' '}
              <span className='text-foreground'>
                {formattedLastUpdatedAt || 'N/A'}
              </span>
              . For the most current documentation, please utilize the{' '}
              <span className='text-foreground'>&quot;Update Now&quot;</span>{' '}
              feature.
            </p>

            {renderDocumentContent(llpData.data, companyData)}
          </>
        ) : (
          renderNoDocumentsState()
        )}
      </div>
    </div>
  );
};

const renderCompanySection = (
  data: IPublicDocumentsResponse | undefined,
  isLoading: boolean,
  error: ErrorResponse | null,
  companyData: TCompanyMasterData,
  formattedLastUpdatedAt: string | undefined,
  selectedVersion: 'v3' | 'v2',
  // eslint-disable-next-line no-unused-vars
  setSelectedVersion: (version: 'v3' | 'v2') => void,
  isPolling: boolean
) => {
  return (
    <div className='mt-8'>
      <Tabs
        value={selectedVersion}
        onValueChange={(value) => setSelectedVersion(value as 'v3' | 'v2')}
        className='mt-0 w-full md:mt-8 lg:mt-10'
      >
        <div className='flex flex-col items-center justify-end gap-4 md:flex-row md:gap-8'>
          <p className='text-balance text-[10px] text-muted-foreground md:text-xs'>
            * The documents displayed here reflect the information available on
            the Ministry of Corporate Affairs (MCA) portal as of{' '}
            <span className='text-foreground'>{formattedLastUpdatedAt}</span>.
            For the most current documentation, please utilize the{' '}
            <span className='text-foreground'>&quot;Update Now&quot;</span>{' '}
            feature.
          </p>

          <TabsList className='ml-auto border shadow-inner'>
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

        <TabsContent value='v2'>
          {renderTabContent(
            data,
            isLoading,
            error,
            companyData,
            'v2',
            isPolling
          )}
        </TabsContent>

        <TabsContent value='v3'>
          {renderTabContent(
            data,
            isLoading,
            error,
            companyData,
            'v3',
            isPolling
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const renderTabContent = (
  data: IPublicDocumentsResponse | undefined,
  isLoading: boolean,
  error: ErrorResponse | null,
  companyData: TCompanyMasterData,
  version: 'v3' | 'v2',
  isPolling: boolean
) => {
  if (isLoading) {
    return <LoadingWithSpinner />;
  }

  if (error || !data?.success || !data.data) {
    return renderErrorState(error || null);
  }

  if (data) {
    return renderDocumentContent(data.data, companyData, version, isPolling);
  }
};

const renderDocumentContent = (
  docData: IPublicDocument,
  companyData: TCompanyMasterData,
  version?: 'v3' | 'v2',
  isPolling?: boolean
) => {
  let docs;
  if (version === 'v3') {
    docs = docData.v3_paid_documents || [];
  } else if (version === 'v2') {
    docs = docData.v2_paid_documents || [];
  } else {
    docs = docData.v3_paid_documents || [];
  }

  // TODO: for v2 -> if challan skipped, then show the banner

  if (docData.downloadStatus?.jobStatus === 'no_docs_found') {
    return renderNoV2DocumentsFiledState(version);
  }

  // - If documents have been downloaded successfully (either jobStatus is 'documents_downloaded' or documentDownloadStatus is 'success'), but the docs array is empty,
  // - OR if the version is 'v3' and the docs array is empty,
  // => then show the 'No Documents' state.
  if (
    ((docData.downloadStatus?.jobStatus === 'documents_downloaded' ||
      docData.downloadStatus?.documentDownloadStatus === 'success') &&
      docs &&
      !docs?.length) ||
    (version === 'v3' && docs && !docs.length)
  ) {
    return renderNoDocumentsState();
  }

  return (
    <>
      {companyData.data.companyType !== 'LLP' &&
        docData.downloadStatus?.jobStatus !== 'challan_skipped' && // only for companies
        // version !== 'v3' && // only for v2
        renderProcessingState(docData, isPolling)}

      {docData.downloadStatus?.jobStatus === 'challan_skipped' && (
        <MCAUpdateBanner />
      )}

      {docs && docs.length > 0 && (
        <VPDTable
          version={version}
          data={docs}
          downloadStatus={docData.downloadStatus}
          companyData={companyData}
          tableClassName='rounded-lg drop-shadow'
        />
      )}
    </>
  );
};

const renderErrorState = (error: ErrorResponse | null) => (
  <Card className='mx-auto mt-8 w-full max-w-3xl md:mt-16'>
    <CardContent className='flex flex-col items-center justify-center p-6 text-center'>
      <AlertCircle className='mb-4 h-12 w-12 text-destructive' />
      <h3 className='mb-2 text-lg font-semibold'>Error</h3>
      <p className='text-sm text-muted-foreground'>
        {error
          ? error.message
          : 'An error occurred while fetching public documents.'}
      </p>
      <p className='mt-4 text-sm text-muted-foreground'>
        Please try again later. If the problem persists, contact our support
        team for assistance.
      </p>
    </CardContent>
    <CardFooter className='flex justify-center'>
      <Button variant='outline' size='sm' className='w-full sm:w-auto' asChild>
        <a href='mailto:helpdesk@filesure.in'>
          <Mail className='mr-2 h-4 w-4' /> Contact Support
        </a>
      </Button>
    </CardFooter>
  </Card>
);

const renderNoDocumentsState = (version?: string) => (
  <Card className='mx-auto mt-8 w-full max-w-3xl md:mt-16'>
    <CardHeader>
      <CardTitle>
        No Public Documents Found{version ? ` for ${version}` : ''}
      </CardTitle>
      <CardDescription>
        We couldn&apos;t find any public documents for this company
        {version ? ` in ${version} format` : ''} at the moment.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Alert>
        <AlertTitle>Possible reasons:</AlertTitle>
        <AlertDescription>
          <ul className='mt-2 list-inside list-disc'>
            <li>
              This could be due to recent incorporation or pending filings.
            </li>
            <li>The company hasn&apos;t filed its public documents yet.</li>
            <li>Our database might need an update.</li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className='mt-4 rounded-md bg-blue-50 p-4'>
        <p className='flex items-start text-xs text-blue-700'>
          <ArrowUpRight className='mr-2 h-4 w-4 flex-shrink-0' />
          You can try updating the data by clicking the &quot;Update Now&quot;
          button in the top right corner of the page.
        </p>
      </div>
    </CardContent>
    <CardFooter className='flex justify-center'>
      <Button variant='outline' size='sm' className='w-full sm:w-auto' asChild>
        <a href='mailto:helpdesk@filesure.in'>
          <Mail className='mr-2 h-4 w-4' /> Contact Support
        </a>
      </Button>
    </CardFooter>
  </Card>
);

const renderNoV2DocumentsFiledState = (version?: string) => {
  return (
    <Card className='mx-auto mt-8 w-full max-w-3xl md:mt-16'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-gray-900'>
          No Public Documents Filed in MCA {version?.toUpperCase()} System
        </CardTitle>
        {/* <CardDescription className='text-sm text-gray-600'>
          This company hasn't filed any {version?.toUpperCase()} public
          documents yet.
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <Alert className='mb-4 p-4'>
          <AlertTitle>Why might this happen?</AlertTitle>
          <AlertDescription>
            <ul className='ml-8 mt-4 list-outside list-disc space-y-1.5 text-sm'>
              <li>
                MCA shifted from V2 to V3 system in March, 2023. All fillings
                except AOC-4, MGT-7 and ADT-1 are happening in new MCA V3
                system.
              </li>
              <li>
                If company is incorporated{' '}
                <span className='font-semibold'>post March 2023</span>, all
                documents except the above 3 will only be available in the V3
                system. That means, if company is newly incorporated, it will
                not have any filings in MCA V2 system. As these filings may not
                be due yet.
              </li>
              <li>
                For companies incorporated{' '}
                <span className='font-semibold'>prior to March 2023</span>,
                forms filed, if any, will be available here in MCA V2 system.
              </li>
            </ul>
          </AlertDescription>
        </Alert>
        <div className='rounded-md bg-blue-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <IoInformationCircle
                className='h-5 w-5 text-blue-400'
                aria-hidden='true'
              />
            </div>
            <div className='ml-3 flex-1'>
              <p className='text-sm text-blue-700'>
                Companies are required to file certain documents periodically.
                Each form has different applicability and due date. The absence
                of documents doesn&apos;t necessarily indicate any issues with
                the company.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end'>
        <Button
          variant='outline'
          size='sm'
          className='w-full sm:w-auto'
          asChild
        >
          <Link
            href='/business-services/annual-compliance-pvt-ltd'
            target='_blank'
            rel='noopener noreferrer'
            prefetch={false}
          >
            <QuestionMarkCircledIcon className='mr-2 h-4 w-4' /> Learn About
            Filing Requirements
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const renderProcessingState = (
  status: IPublicDocument,
  isPolling: boolean | undefined
) => <ProcessingState status={status} isLoading={isPolling || false} />;

export default PublicDocsTab;
