import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ColumnDef } from '@tanstack/react-table';
import { parse } from 'date-fns';
import { ArrowUpDown, BookOpenText, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { FaFileCsv, FaFileWord, FaPaperclip } from 'react-icons/fa6';
import { TCompanyMasterData } from '../../../_types/CompanyDetails';
import { IDocument } from '../../../_types/PublicDocsTypes';
import { DocumentActions } from './DocumentActions';
import {
  encodeWithKey,
  formatFileName,
  formatFileSize,
  getFileType,
} from './utils';

export const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'pdf':
      return (
        <Image
          src='https://filesurestorage.blob.core.windows.net/filesure-frontend-assets/pdf-icon.png'
          alt='PDF Icon'
          className='size-6 whitespace-nowrap'
          width={32}
          height={20}
        />
      );
    case 'xlsx':
    case 'xls':
      return (
        <Image
          src='https://filesurestorage.blob.core.windows.net/filesure-frontend-assets/xls-icon.png'
          alt='Excel Icon'
          className='size-5 whitespace-nowrap'
          width={32}
          height={20}
        />
      );
    case 'jpg':
    case 'jpeg':
    case 'png':
      return (
        <Image
          src='https://filesurestorage.blob.core.windows.net/filesure-frontend-assets/img-icon.png'
          alt='Image Icon'
          className='size-5 whitespace-nowrap'
          width={32}
          height={20}
        />
      );
    case 'csv':
      return <FaFileCsv className='size-5' />;
    case 'docx':
    case 'doc':
      return <FaFileWord className='size-5' />;
    default:
      return <FaFileAlt className='size-5' />;
  }
};

export const createColumns = (
  companyData: TCompanyMasterData,
  isUnlocked: { isUnlocked: boolean; unlockType: string | null },
  isUnlockedListLoading: boolean,
  version?: 'v2' | 'v3'
): ColumnDef<IDocument>[] => {
  const columns: ColumnDef<IDocument>[] = [
    {
      id: 'serialNo',
      header: () => <div className='pl-2'>#</div>,
      cell: ({ row, table }) => {
        const originalIndex = table
          .getSortedRowModel()
          .rows.findIndex((r) => r.id === row.id);
        return <div className='pl-2'>{originalIndex + 1}.</div>;
      },
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: 'fileName',
      header: () => <div>File Name</div>,
      cell: ({ row }) => {
        const downloadUrl = row.original?.downloadUrl;
        const fileName = row.original?.fileName;
        const fileNameSlug = (fileName ? fileName : 'PDF Document').replace(
          /\//g,
          '-'
        );
        const fileType = row.original?.fileType;
        const docFileType = getFileType(downloadUrl, fileType, fileName);
        let encodedUrl;
        let viewerUrl;
        if (downloadUrl) {
          encodedUrl = encodeWithKey(downloadUrl);
          viewerUrl =
            docFileType === 'pdf'
              ? `/api/doc-viewer/${fileNameSlug}?key=${encodedUrl}`
              : downloadUrl;
        }

        return (
          <div className='flex min-w-40 max-w-xl items-center gap-2 font-medium text-primary sm:min-w-52 md:min-w-60 lg:min-w-72'>
            <span className='flex-shrink-0 text-muted-foreground'>
              {getFileIcon(
                getFileType(
                  row.original.downloadUrl,
                  row.original.fileType,
                  row.original.fileName
                )
              )}
            </span>
            {viewerUrl ? (
              <Link
                title={`Download ${row.getValue('fileName')}`}
                href={viewerUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:underline'
              >
                {formatFileName(
                  row.getValue('fileName') as string,
                  row.original.formId,
                  row.original.filingDate,
                  row.original.downloadUrl,
                  row.original.fileType,
                  row.original.documentCategory
                )}
              </Link>
            ) : (
              formatFileName(
                row.getValue('fileName') as string,
                row.original.formId,
                row.original.filingDate,
                row.original.downloadUrl,
                row.original.fileType,
                row.original.documentCategory
              )
            )}
          </div>
        );
      },
      enableHiding: false,
      size: 500,
    },
  ];

  // Add formId column only for v3
  if (version === 'v3') {
    columns.push({
      accessorKey: 'formId',
      id: 'formId',
      header: () => <div>Form ID</div>,
      cell: ({ row }) => {
        return (
          <div className='w-fit whitespace-nowrap rounded-full border bg-muted px-2 text-[10px] font-medium'>
            {row.getValue('formId')}
          </div>
        );
      },
      size: 150,
    });
  }

  // Add remaining columns
  columns.push(
    {
      accessorKey: 'documentCategory',
      header: () => <div>Category</div>,
      cell: ({ row }) => {
        return (
          <div className='w-fit whitespace-nowrap rounded-full border bg-muted px-2 text-[10px] font-medium'>
            {row.getValue('documentCategory')}
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: 'filingDate',
      header: ({ column }) => {
        return (
          <button
            title='Sort by Filing Date'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='flex h-8 items-center whitespace-nowrap hover:text-gray-800'
          >
            Filing Date
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className='whitespace-nowrap'>{row.getValue('filingDate')}</div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = parse(
          rowA.getValue('filingDate'),
          'dd-MMM-yyyy',
          new Date()
        );
        const dateB = parse(
          rowB.getValue('filingDate'),
          'dd-MMM-yyyy',
          new Date()
        );
        return dateA.getTime() - dateB.getTime();
      },
      size: 150,
    },
    {
      accessorKey: 'sizeKB',
      header: () => <div className=''>Size</div>,
      cell: ({ row }) => {
        const sizeKB = row.getValue('sizeKB') as number;
        return (
          <div className='w-fit whitespace-nowrap rounded-full border bg-muted px-2 text-[10px]'>
            {formatFileSize(sizeKB)}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'numberOfPages',
      header: () => <div className=''>Pages</div>,
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground'>
            <BookOpenText className='h-3 w-3' />
            {row.getValue('numberOfPages')}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'attachments',
      header: 'Attachments',
      cell: ({ row }) => {
        const document = row.original;
        const fileType = row.original.fileType;
        const attachmentsCount = document.attachments?.length || 0;

        if (attachmentsCount === 0) {
          return (
            <div className='whitespace-nowrap text-xs text-muted-foreground'>
              No attachments
            </div>
          );
        }
        const PreviewButton = memo(function PreviewButton({
          fileUrl,
          name,
          fileType,
        }: {
          fileUrl: string;
          name: string;
          fileType?: string;
        }) {
          const encodedUrl = encodeWithKey(fileUrl);
          const docFileType = getFileType(fileUrl, fileType, name);
          const fileNameSlug = (name ? name : 'PDF Document').replace(
            /\//g,
            '-'
          );
          const viewerUrl =
            docFileType === 'pdf'
              ? `/api/doc-viewer/${fileNameSlug}?key=${encodedUrl}`
              : fileUrl;

          return (
            <Link
              title='Preview Document'
              href={viewerUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {name}
            </Link>
          );
        });

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                title={`View ${attachmentsCount} ${
                  attachmentsCount === 1 ? 'attachment' : 'attachments'
                }`}
                variant='link'
                size='sm'
                className='h-6 px-0 text-xs font-medium text-primary'
              >
                <FaPaperclip className='mr-1 h-3 w-3' />
                {attachmentsCount}{' '}
                {attachmentsCount === 1 ? 'attachment' : 'attachments'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='z-30 w-fit min-w-40 p-4' align='end'>
              <p className='text-xs font-medium text-muted-foreground'>
                Attachments
              </p>
              <Separator className='my-2' />
              <div className='max-h-40 overflow-y-auto'>
                {document.attachments?.map((attachment, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-1.5 py-1.5 text-xs'
                  >
                    <FileText className='h-3 w-3 text-muted-foreground' />
                    {attachment.downloadUrl ? (
                      <PreviewButton
                        fileUrl={attachment.downloadUrl}
                        name={attachment.name}
                        fileType={fileType}
                      />
                    ) : (
                      <span className='text-muted-foreground'>
                        {attachment.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      size: 150,
    },
    {
      id: 'actions',
      header: () => <div className='min-w-12'></div>,
      cell: ({ row }) => {
        return (
          <div className='flex justify-end pr-2'>
            <DocumentActions
              document={row.original}
              companyData={companyData}
              isUnlocked={isUnlocked}
              isUnlockedListLoading={isUnlockedListLoading}
            />
          </div>
        );
      },
      enableHiding: false,
      size: 100,
    }
  );

  return columns;
};
