'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertCircle,
  Download,
  Eye,
  FileText,
  FileX,
  Loader2,
  Paperclip,
} from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { INcaEmailHistoryItem } from '../_hooks/useNcaEmailHistory';

interface TodaysFilesProps {
  filesData?: INcaEmailHistoryItem[];
  isLoading?: boolean;
  error?: any;
  userEmail?: string;
  hasActiveSubscriptions?: boolean;
}

// Helper to format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// Helper to get data type label
const getDataTypeLabel = (dataType?: string) => {
  if (dataType === 'companies') return 'Company';
  if (dataType === 'llps') return 'LLP';
  return dataType || '';
};

const StatewiseDataModalTable = memo(function StatewiseDataModalTable({
  file,
}: {
  file: INcaEmailHistoryItem;
}) {
  const isCompanies = file.dataType === 'companies';
  return (
    <div className='mt-2 max-h-[70vh] overflow-y-auto md:max-h-[80vh]'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted'>
            <TableHead className='text-xs md:px-4 md:text-sm'>State</TableHead>
            {isCompanies ? (
              <>
                <TableHead className='text-right text-xs md:px-4 md:text-sm'>
                  Companies
                </TableHead>
                <TableHead className='text-right text-xs md:px-4 md:text-sm'>
                  Directors
                </TableHead>
              </>
            ) : (
              <>
                <TableHead className='text-right text-xs md:px-4 md:text-sm'>
                  LLPs
                </TableHead>
                <TableHead className='text-right text-xs md:px-4 md:text-sm'>
                  Partners
                </TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {file.stateWiseData &&
          Array.isArray(file.stateWiseData) &&
          file.stateWiseData.length > 0 ? (
            file.stateWiseData.map((row: any) => (
              <TableRow
                key={row.state}
                className={
                  row.state === 'Total' ? 'bg-muted font-semibold' : ''
                }
              >
                <TableCell className='text-xs md:px-4 md:text-sm'>
                  {row.state}
                </TableCell>
                <TableCell className='text-right text-xs md:px-4 md:text-sm'>
                  {row.entityCount ?? '-'}
                </TableCell>
                <TableCell className='text-right text-xs md:px-4 md:text-sm'>
                  {row.personCount ?? '-'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className='text-center text-xs text-muted-foreground md:p-8 md:text-sm'
              >
                No data found!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
StatewiseDataModalTable.displayName = 'StatewiseDataModalTable';

const FileRow = memo(function FileRow({
  file,
  index,
  onOpenModal,
}: {
  file: INcaEmailHistoryItem;
  index: number;
  onOpenModal: () => void;
}) {
  const fileName = useMemo(
    () => file.fileName || `file-${index + 1}`,
    [file.fileName, index]
  );
  const dataTypeLabel = useMemo(
    () => getDataTypeLabel(file.dataType),
    [file.dataType]
  );
  const formattedSize = useMemo(
    () => formatFileSize(file.fileSize),
    [file.fileSize]
  );
  const formattedDate = useMemo(
    () => format(file.emailSentDate, 'dd-MMM-yyyy HH:mm a'),
    [file.emailSentDate]
  );
  return (
    <div className='flex flex-col gap-2'>
      <div
        key={file.blobUrl}
        className='flex flex-col items-start justify-between gap-2 overflow-hidden rounded-lg border border-border p-2 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center'
      >
        <div className='flex min-w-0 flex-1 items-center gap-2'>
          <div className='rounded p-1.5 text-muted-foreground'>
            <FileText className='size-4' />
          </div>
          <div className='min-w-0 flex-1'>
            <a
              href={file.blobUrl}
              target='_blank'
              rel='noopener noreferrer'
              download
              title={`Download ${fileName}`}
              aria-label={`Download ${fileName}`}
              className={cn(
                'truncate text-xs text-primary hover:underline hover:underline-offset-4 sm:text-sm',
                !file.blobUrl && 'cursor-not-allowed text-muted-foreground'
              )}
            >
              {fileName}
            </a>
            <div className='text-xs text-muted-foreground'>
              {dataTypeLabel} &middot; {formattedSize} &middot; {formattedDate}
            </div>
          </div>
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='h-8 px-2 text-xs'
            onClick={onOpenModal}
            aria-label='Show statewise data'
          >
            <Eye className='mr-1.5 size-3' /> Statewise Data
          </Button>
          <Button
            variant='ghost'
            size='sm'
            disabled={!file.blobUrl}
            asChild
            className='h-8 w-8 border p-0 hover:bg-background hover:ring-2'
          >
            <a
              href={file.blobUrl}
              target='_blank'
              rel='noopener noreferrer'
              download
              title={`Download ${fileName}`}
              aria-label={`Download ${fileName}`}
            >
              <Download className='h-4 w-4' />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
});
FileRow.displayName = 'FileRow';

export default function TodaysFiles({
  filesData,
  isLoading,
  error,
  userEmail,
  hasActiveSubscriptions,
}: TodaysFilesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleOpenModal = useCallback((index: number) => {
    setOpenIndex(index);
  }, []);
  const handleCloseModal = useCallback(() => {
    setOpenIndex(null);
  }, []);

  return (
    <>
      <Card className='rounded-lg border shadow-none'>
        <CardHeader className='flex flex-col items-start justify-between gap-2 p-2 pt-4 xs:flex-row sm:p-4'>
          <div className='flex items-center gap-2'>
            <div className='flex size-7 items-center justify-center rounded-lg bg-purple-100'>
              <Paperclip className='size-4 text-purple-600' />
            </div>
            <CardTitle className='text-sm font-semibold'>
              Files Sent via Email Today
              {userEmail && (
                <p className='text-xs font-medium text-muted-foreground'>
                  at {userEmail}
                </p>
              )}
            </CardTitle>
          </div>
          {filesData && filesData.length > 0 && (
            <p className='text-xs text-muted-foreground'>
              {filesData.filter((file) => file.blobUrl).length} file
              {filesData.filter((file) => file.blobUrl).length !== 1
                ? 's'
                : ''}{' '}
              available
            </p>
          )}
        </CardHeader>
        <CardContent className='p-2 sm:p-4 sm:pt-2'>
          <div className='max-h-72 space-y-2 overflow-y-auto'>
            {isLoading ? (
              <div className='flex h-20 items-center justify-center gap-2 rounded-lg bg-muted'>
                <Loader2 className='size-6 animate-spin' />
                <p className='animate-pulse text-sm'>Loading...</p>
              </div>
            ) : error ? (
              <div className='flex h-20 items-center justify-center gap-2 rounded-lg bg-muted'>
                <AlertCircle className='size-6 text-destructive' />
                <p className='text-sm text-destructive'>
                  {error?.message ?? 'Error loading files'}
                </p>
              </div>
            ) : !filesData || filesData.length === 0 ? (
              <div className='flex h-20 flex-col items-center justify-center gap-2 rounded-lg bg-muted text-center text-xs text-muted-foreground'>
                <FileX className='size-4' />
                {hasActiveSubscriptions ? (
                  <span>
                    You have an active subscription.
                    <br />
                    Your data will appear here as soon as it&apos;s available.
                  </span>
                ) : (
                  <span>No files available</span>
                )}
              </div>
            ) : (
              filesData.map((file, index) => {
                if (!file.blobUrl) return null;
                return (
                  <FileRow
                    file={file}
                    index={index}
                    key={file._id || file.blobUrl || index}
                    onOpenModal={handleOpenModal.bind(null, index)}
                  />
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
      {openIndex !== null && filesData && filesData[openIndex] && (
        <Dialog
          open={openIndex !== null}
          onOpenChange={(open) => (open ? undefined : handleCloseModal())}
        >
          <DialogContent className='max-w-80 gap-2 overflow-x-auto p-2 md:max-w-2xl md:gap-4 md:p-4'>
            <DialogHeader className='flex flex-row items-center justify-between pr-4'>
              <div className='flex flex-1 flex-col gap-1'>
                <DialogTitle className='flex flex-col items-start text-xs font-semibold md:flex-row md:items-center md:gap-2 md:text-sm'>
                  Statewise Breakdown for:{' '}
                  <a
                    href={filesData[openIndex].blobUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    download
                    title={`Download ${filesData[openIndex].fileName}`}
                    aria-label={`Download ${filesData[openIndex].fileName}`}
                    className={cn(
                      buttonVariants({ variant: 'link' }),
                      'px-0 font-mono text-xs md:text-sm'
                    )}
                  >
                    {filesData[openIndex].fileName}
                  </a>
                </DialogTitle>
              </div>
            </DialogHeader>
            <StatewiseDataModalTable file={filesData[openIndex]} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
