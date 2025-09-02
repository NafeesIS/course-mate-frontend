'use client';

import CTAUnlockCompanyData from '@/app/(root)/company/_components/CTA/CTAUnlockCompanyData';
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
import { useUserSignInDetails } from '@/store/userStore';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { AlertCircle, ArrowUpRight, Check, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { IoInformationCircle } from 'react-icons/io5';
import { usePollingQuery } from '../../_hooks/usePollingQuery';
import { getPublicDocsData } from '../../_services/getPublicDocsData';
import type { TCompanyMasterData } from '../../_types/CompanyDetails';
import MCAUpdateBanner from './MCAUpdateBanner';
import ProcessingState from './ProcessingState';

type ErrorResponse = {
  success: boolean;
  message: string;
  errorSources?: Array<{ path: string; message: string }>;
};

// Main tab component for displaying public documents for a company or LLP
const PublicDocsTab = ({
  companyData,
  isUnlocked,
}: {
  companyData: TCompanyMasterData;
  isUnlocked: { isUnlocked: boolean; unlockType: string | null };
}) => {
  // Extract CIN and company type for API calls and logic
  const cin = companyData.data?.cin;
  const companyType = companyData.data.companyType;
  // State for selected document version (V2/V3)
  const [selectedVersion, setSelectedVersion] = useState<'v3' | 'v2'>('v3');

  // Get last updated info from global store
  const { lastUpdatedAt } = useCompanyLastUpdatedInfoStore();

  // Get user sign-in details from global store
  const {
    userSignInDetails,
    userSignInDetailsLoading,
    userSignInDetailsError,
  } = useUserSignInDetails();
  const userId = userSignInDetails?.data?._id;

  // Fetch public docs for companies (with polling for updates)
  const { data, isLoading, error, isPolling } = usePollingQuery(
    userId!,
    companyType,
    cin!,
    selectedVersion,
    isUnlocked.isUnlocked
  );

  // Fetch public docs for LLPs (one-time fetch)
  const {
    data: llpData,
    isLoading: llpLoading,
    error: llpError,
  } = useQuery<IPublicDocumentsResponse, ErrorResponse>({
    queryKey: ['publicDocs', userId, companyType, cin],
    queryFn: () =>
      getPublicDocsData(userId!, companyType, cin, 'v3', isUnlocked.isUnlocked),
    enabled: !!userId && !!companyType && !!cin && companyType === 'LLP',
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 1000 * 60, // 1 minute
    staleTime: 1000 * 60, // 1 minute
  });

  // Show loading spinner while user details are loading
  if (userSignInDetailsLoading) {
    return <LoadingWithSpinner />;
  }

  // Show error alert if user sign-in details failed to load
  if (userSignInDetailsError) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          There was an error with your authentication. Please try signing in
          again.
        </AlertDescription>
      </Alert>
    );
  }

  // Format last updated date for display
  const formattedLastUpdatedAt = (lastUpdated: string) =>
    lastUpdated
      ? format(parseISO(lastUpdated), 'dd-MMM-yyyy HH:mm aa')
      : lastUpdatedAt
        ? format(parseISO(lastUpdatedAt), 'dd-MMM-yyyy HH:mm aa')
        : companyData.data.dateOfIncorporation;

  // Render LLP section if company type is LLP
  if (companyType === 'LLP') {
    return renderLLPSection(
      llpData,
      llpLoading,
      llpError,
      companyData,
      isUnlocked.isUnlocked,
      formattedLastUpdatedAt(llpData?.data.last_updated || '')
    );
  }

  // Render Company section (with V2/V3 tabs) if company type is Company
  return renderCompanySection(
    data,
    isLoading,
    (error as ErrorResponse | null) ?? null,
    companyData,
    isUnlocked.isUnlocked,
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

// Renders the LLP-specific public documents section
const renderLLPSection = (
  llpData: IPublicDocumentsResponse | undefined,
  llpLoading: boolean,
  llpError: ErrorResponse | null,
  companyData: TCompanyMasterData,
  isUnlocked: boolean,
  formattedLastUpdatedAt: string | undefined
) => {
  return (
    <div className='mt-8'>
      {/* Show unlock CTA if not unlocked */}
      {!isUnlocked && (
        <CTAUnlockCompanyData
          companyData={companyData}
          source={`public-docs-tab`}
        />
      )}

      <div className='mt-6 w-full space-y-4 md:mt-8 lg:mt-10'>
        {/* Loading, error, or document content states */}
        {llpLoading ? (
          <LoadingWithSpinner />
        ) : llpError ? (
          renderErrorState(llpError)
        ) : llpData ? (
          <>
            {/* Info about data freshness */}
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

            {renderDocumentContent(llpData.data, companyData, 'v3', isUnlocked)}
          </>
        ) : (
          renderNoDocumentsState()
        )}
      </div>
    </div>
  );
};

// Renders the Company-specific public documents section with V2/V3 tabs
const renderCompanySection = (
  data: IPublicDocumentsResponse | undefined,
  isLoading: boolean,
  error: ErrorResponse | null,
  companyData: TCompanyMasterData,
  isUnlocked: boolean,
  formattedLastUpdatedAt: string | undefined,
  selectedVersion: 'v3' | 'v2',
  // eslint-disable-next-line no-unused-vars
  setSelectedVersion: (version: 'v3' | 'v2') => void,
  isPolling: boolean
) => {
  return (
    <div className='mt-8'>
      {/* Show unlock CTA if not unlocked */}
      {!isUnlocked && (
        <CTAUnlockCompanyData
          companyData={companyData}
          source={`public-docs-tab`}
        />
      )}

      {/* Tabs for V2/V3 document systems */}
      <Tabs
        value={selectedVersion}
        onValueChange={(value) => setSelectedVersion(value as 'v3' | 'v2')}
        className='mt-0 w-full md:mt-8 lg:mt-10'
      >
        <div className='flex flex-col items-center justify-end gap-4 md:flex-row md:gap-8'>
          {/* Info about data freshness */}
          <p className='text-balance text-[10px] text-muted-foreground md:text-xs'>
            * The documents displayed here reflect the information available on
            the Ministry of Corporate Affairs (MCA) portal as of{' '}
            <span className='text-foreground'>{formattedLastUpdatedAt}</span>.
            For the most current documentation, please utilize the{' '}
            <span className='text-foreground'>&quot;Update Now&quot;</span>{' '}
            feature.
          </p>

          {/* Tab triggers for V3 and V2 */}
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

        {/* Tab content for V2 and V3 */}
        <TabsContent value='v2'>
          {renderTabContent(
            data,
            isLoading,
            error,
            companyData,
            isUnlocked,
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
            isUnlocked,
            'v3',
            isPolling
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Renders the content for a given tab (V2 or V3)
const renderTabContent = (
  data: IPublicDocumentsResponse | undefined,
  isLoading: boolean,
  error: ErrorResponse | null,
  companyData: TCompanyMasterData,
  isUnlocked: boolean,
  version: 'v3' | 'v2',
  isPolling: boolean
) => {
  if (isLoading) {
    return <LoadingWithSpinner />;
  }

  // Show error state if error or no data
  if (error || !data?.success || !data.data) {
    return renderErrorState(error || null);
  }

  // Render document content if data is present
  if (data) {
    return renderDocumentContent(
      data.data,
      companyData,
      version,
      isUnlocked,
      isPolling
    );
  }
};

// Renders the document table/content or appropriate empty/processing state
const renderDocumentContent = (
  docData: IPublicDocument,
  companyData: TCompanyMasterData,
  version?: 'v3' | 'v2',
  isUnlocked?: boolean,
  isPolling?: boolean
) => {
  let docs;

  // Select docs array based on company type and version
  if (companyData.data.companyType === 'Company') {
    if (version === 'v3') {
      docs = isUnlocked
        ? docData.v3_paid_documents
        : docData.v3_documents || [];
    } else if (version === 'v2') {
      docs = isUnlocked
        ? docData.v2_paid_documents
        : docData.v2_documents || [];
    } else {
      docs = docData.v3_documents || [];
    }
  } else if (companyData.data.companyType === 'LLP') {
    docs = isUnlocked ? docData.v3_paid_documents : docData.v3_documents || [];
  }

  // If job status indicates no docs found, show special empty state
  if (docData.downloadStatus?.jobStatus === 'no_docs_found') {
    return renderNoV2DocumentsFiledState(version);
  }

  // If docs array is empty after successful download, show no docs state
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
      {/* Show processing state for unlocked companies (not LLP) */}
      {isUnlocked &&
        companyData.data.companyType !== 'LLP' && // only for companies
        docData.downloadStatus?.jobStatus !== 'challan_skipped' &&
        // version !== 'v3' && // only for v2
        renderProcessingState(docData, isPolling)}

      {docData.downloadStatus?.jobStatus === 'challan_skipped' && (
        <MCAUpdateBanner />
      )}

      {/* Render document table if docs exist */}
      {docs && docs.length > 0 && (
        <VPDTable
          data={docs}
          version={version}
          companyData={companyData}
          downloadStatus={docData.downloadStatus}
          tableClassName='drop-shadow'
        />
      )}
    </>
  );
};

// Renders a generic error state card
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

// Renders a no-documents-found state card
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

// Renders a special no-documents-filed-in-V2 state card with educational info
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

// Renders the processing state for document downloads (for unlocked companies)
const renderProcessingState = (
  status: IPublicDocument,
  isPolling: boolean | undefined
) => <ProcessingState status={status} isLoading={isPolling || false} />;

export default PublicDocsTab;
