'use client';

import { IDownloadStatus } from '@/app/(root)/company/_types/PublicDocsTypes';
import UnlockPublicDocsBtn from '@/components/shared/UnlockCompany/UnlockPublicDocsBtn';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatToUrl } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  ArrowDownToLine,
  FolderArchive,
  FolderDown,
  Loader2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TCompanyMasterData } from '../../../_types/CompanyDetails';

interface DownloadButtonsProps {
  downloadStatus?: IDownloadStatus;
  version?: 'v2' | 'v3';
  companyData: TCompanyMasterData;
  isUnlocked: {
    isUnlocked: boolean;
    unlockType: string | null;
  };
}

export function DownloadButtons({
  downloadStatus,
  version,
  companyData,
  isUnlocked,
}: DownloadButtonsProps) {
  const pathname = usePathname();

  if (companyData.data.companyType === 'LLP') return null;

  const isDashboard = pathname.includes('dashboard');

  return (
    <div className='flex w-full gap-2 xs:w-auto'>
      {/* {isUnlocked.isUnlocked && isDashboard ? (
        <Link
          title={
            downloadStatus?.challanDownloadUrl
              ? 'Download MCA Challan'
              : 'MCA Challan not available'
          }
          href={downloadStatus?.challanDownloadUrl || ''}
          target='_blank'
          rel='noopener noreferrer'
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'pointer-events-none w-full cursor-progress gap-1.5 text-muted-foreground opacity-70',
            downloadStatus?.challanDownloadUrl &&
              'pointer-events-auto cursor-pointer text-gray-900 hover:text-gray-900 hover:ring-2'
          )}
        >
          {!downloadStatus || downloadStatus?.challanDownloadUrl ? (
            <FileDown className='size-4' />
          ) : (
            <Loader2Icon className='size-4 animate-spin' />
          )}
          <span>
            <span className='hidden xl:inline'>Download </span> Challan
          </span>
        </Link>
      ) : null} */}

      {isUnlocked.isUnlocked && isDashboard ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              disabled={!downloadStatus?.zipFiles?.length}
              className='w-full gap-1.5 bg-primary text-white shadow-sm transition-all duration-300 hover:bg-primary hover:text-white hover:ring-2'
            >
              {!downloadStatus || downloadStatus.zipFiles?.length ? (
                <FolderDown className='size-4' />
              ) : (
                <Loader2Icon className='size-4 animate-spin' />
              )}
              <span>
                <span className='hidden xl:inline'>Download </span>
                {version === 'v2' ? 'V2' : 'V3'} ZIP
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
            <DialogTitle className='text-lg'>
              ZIP Files{' '}
              <span className='mt-0.5 block text-xs font-normal text-muted-foreground'>
                Total {downloadStatus?.totalZipFiles} files,{' '}
                {downloadStatus?.downloadedDocuments} documents
              </span>
            </DialogTitle>

            <Table className='text-xs'>
              <TableHeader>
                <TableRow className='bg-muted/50'>
                  <TableHead className='text-center'>#</TableHead>
                  <TableHead className='whitespace-nowrap'>File Name</TableHead>
                  <TableHead className='whitespace-nowrap'>File Size</TableHead>
                  <TableHead className='whitespace-nowrap'>
                    Files Count
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloadStatus?.zipFiles?.map((zipFile, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 === 0 ? 'bg-muted' : ''}
                  >
                    <TableCell className='text-center font-medium text-muted-foreground'>
                      {index + 1}
                    </TableCell>
                    <TableCell className='min-w-32 text-sm font-medium text-primary hover:underline'>
                      <div className='flex items-center gap-1.5'>
                        {zipFile.filename}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <span className='font-medium'>
                          {(zipFile.total_size_bytes / (1024 * 1024)).toFixed(
                            2
                          )}
                        </span>
                        <span className='text-muted-foreground'>MB</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <span className='font-medium'>
                          {zipFile.successful_files}
                        </span>
                        <span className='text-muted-foreground'>files</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className='flex items-center justify-center'>
                        <Link
                          href={zipFile.blob_url || ''}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary hover:scale-105'
                        >
                          <ArrowDownToLine className='size-4' />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      ) : isUnlocked.isUnlocked && !isDashboard ? (
        <Link
          href={`/dashboard/unlock-companies/company-details/${formatToUrl(companyData.data.company)}/${companyData.data.cin}?tab=public-docs`}
          prefetch={false}
          className={cn(
            buttonVariants({ variant: 'link', size: 'sm' }),
            'w-full gap-1.5 text-primary'
          )}
        >
          <FolderArchive className='size-4' />
          <span>Get All Documents in ZIP</span>
        </Link>
      ) : (
        <UnlockPublicDocsBtn
          companyData={companyData}
          dialogTrigger={
            <Button
              variant='link'
              size='sm'
              className='w-full gap-1.5 text-primary'
            >
              <FolderArchive className='size-4' />
              <span>Get All Documents in ZIP</span>
            </Button>
          }
        />
      )}
    </div>
  );
}
