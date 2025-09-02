'use client';

import UnlockCompanyBtn from '@/components/shared/UnlockCompany/UnlockCompanyBtn';
import UnlockPublicDocsBtn from '@/components/shared/UnlockCompany/UnlockPublicDocsBtn';
import { Button, buttonVariants } from '@/components/ui/button';
import { formatToUrl } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Download, ExternalLink, Eye, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';
import { TCompanyMasterData } from '../../../_types/CompanyDetails';
import { IDocument } from '../../../_types/PublicDocsTypes';
import { encodeWithKey, getFileType } from './utils';

interface DocumentActionsProps {
  document: IDocument;
  companyData: TCompanyMasterData;
  isUnlocked: { isUnlocked: boolean; unlockType: string | null };
  isUnlockedListLoading: boolean;
}

const LoadingButton = memo(function LoadingButton() {
  return (
    <Button variant='outline' size='sm' className='w-full' disabled>
      <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
      Loading..
    </Button>
  );
});

const DownloadButton = memo(function DownloadButton({
  downloadUrl,
}: {
  downloadUrl: string;
}) {
  return (
    <Link
      title='Download Document'
      href={downloadUrl}
      target='_blank'
      rel='noopener noreferrer'
      download={true}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        'text-primary hover:text-primary hover:ring-2'
      )}
    >
      <Download className='h-4 w-4' />
    </Link>
  );
});

const PreviewButton = memo(function PreviewButton({
  fileUrl,
  fileName,
  fileType,
}: {
  fileUrl: string;
  fileName: string;
  fileType?: string;
}) {
  const encodedUrl = encodeWithKey(fileUrl);
  const fileNameSlug = (fileName ? fileName : 'PDF Document').replace(
    /\//g,
    '-'
  );
  const viewerUrl = `/api/doc-viewer/${fileNameSlug}?key=${encodedUrl}`;
  const docFileType = getFileType(fileUrl, fileType, fileName);
  const isDisabled = docFileType.toLowerCase() !== 'pdf';

  return (
    <Link
      title='Preview Document'
      href={viewerUrl}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        'text-primary hover:text-primary hover:ring-2',
        isDisabled && 'pointer-events-none cursor-not-allowed opacity-50'
      )}
    >
      <Eye className='h-4 w-4' />
    </Link>
  );
});

const PendingButton = memo(function PendingButton() {
  return (
    <Button variant='default' size='sm' className='w-full' disabled>
      <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
      Pending..
    </Button>
  );
});

const ExternalLinkButton = memo(function ExternalLinkButton({
  companyName,
  cin,
}: {
  companyName: string;
  cin: string;
}) {
  const router = useRouter();
  const handleClick = useCallback(() => {
    router.push(
      `/dashboard/unlock-companies/company-details/${formatToUrl(companyName)}/${cin}?tab=public-docs`
    );
  }, [router, companyName, cin]);

  return (
    <Button variant='link' size='icon' onClick={handleClick}>
      <ExternalLink className='size-4' />
    </Button>
  );
});

export const DocumentActions = memo(function DocumentActions({
  document,
  companyData,
  isUnlocked,
  isUnlockedListLoading,
}: DocumentActionsProps) {
  const pathname = usePathname();
  const isDashboard = useMemo(() => pathname.includes('dashboard'), [pathname]);
  const isAdmin = useMemo(
    () => pathname.includes('dashboard/admin'),
    [pathname]
  );

  const renderContent = useMemo(() => {
    if (!isUnlocked.isUnlocked && isUnlockedListLoading) {
      return <LoadingButton />;
    }

    if (document.downloadUrl) {
      return (
        <div className='flex items-center justify-center gap-2'>
          <PreviewButton
            fileUrl={document.downloadUrl}
            fileName={document.fileName}
            fileType={document.fileType}
          />
          <DownloadButton downloadUrl={document.downloadUrl} />
        </div>
      );
    }

    if ((isUnlocked.isUnlocked && isDashboard) || isAdmin) {
      return <PendingButton />;
    }

    if (isUnlocked.isUnlocked) {
      return (
        <ExternalLinkButton
          companyName={companyData.data.company}
          cin={companyData.data.cin}
        />
      );
    }

    return companyData.data.companyType === 'LLP' ? (
      <UnlockCompanyBtn
        btnText='Unlock'
        companyData={companyData}
        isSamePage={true}
        source={`${companyData.data.companyType} public-docs-tab vpd-table`}
        className='mx-auto bg-primary text-background hover:bg-primary hover:text-background'
      />
    ) : (
      <UnlockPublicDocsBtn
        btnText='Download'
        companyData={companyData}
        source={`${companyData.data.companyType} public-docs-tab vpd-table`}
        className='mx-auto h-8 bg-primary text-background hover:bg-primary hover:text-background'
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isUnlockedListLoading,
    document.downloadUrl,
    isUnlocked.isUnlocked,
    isDashboard,
    companyData,
  ]);

  return <div className='max-w-60'>{renderContent}</div>;
});
