'use client';

import { useUnlockedCompaniesList } from '@/app/(root)/(dashboard)/dashboard/unlock-companies/company-details/[...slug]/_hooks/useUnlockedCompaniesList';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import UnlockPublicDocsBtn from '@/components/shared/UnlockCompany/UnlockPublicDocsBtn';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  Download,
  File,
  FileBadge,
  FileCheck,
  FileJson,
  FileQuestion,
  FileSpreadsheet,
  FileSymlink,
  FileText,
  FolderOpen,
  Paperclip,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import UnlockCompanyBtn from '../../../../../components/shared/UnlockCompany/UnlockCompanyBtn';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import { IDocument } from '../../_types/PublicDocsTypes';
import { formatFileSize } from '../../_utils/formatter';
import { highlightText } from './HighlightText';
import { getFormInfo } from './utils';

const tableVariants = {
  enter: {
    x: 20,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -20,
    opacity: 0,
  },
};

const categoryVariants = {
  enter: {
    x: -20,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: 20,
    opacity: 0,
  },
};

const categoryIcons: Record<string, React.ReactNode> = {
  Certificates: <FileBadge className='size-4' />,
  'Change in Directors/Designated Partner': <Users className='size-4' />,
  'Incorporation Documents': <FileSymlink className='size-4' />,
  'Charge Documents': <FileCheck className='size-4' />,
  'Annual Returns and Balance Sheet eForms': (
    <FileSpreadsheet className='size-4' />
  ),
  'LLP Forms (Conversion of company to LLP)': <FileJson className='size-4' />,
  'Other eForm Documents': <FolderOpen className='size-4' />,
  'Other Attachments': <File className='size-4' />,
};

// Props:
// - companyData: Company information
// - data: Array of document data
// - className: Optional CSS class
// - isLoading: Boolean to indicate if data is being loaded
const DocsSection = ({
  version = 'v3',
  companyData,
  data,
  className,
  isLoading = false,
}: {
  version?: 'v2' | 'v3';
  companyData: TCompanyMasterData;
  data: IDocument[];
  className?: string;
  isLoading?: boolean;
}) => {
  const router = useRouter();
  // to check if company is already unlocked or not
  const { isCompanyUnlocked, isLoading: isUnlockedListLoading } =
    useUnlockedCompaniesList({ enableCaching: true });
  const isUnlocked = isCompanyUnlocked(companyData.data.cin as string);

  // Group documents by category and form ID for sidebar navigation
  const groupedData = useMemo(() => {
    const categories = [
      'Incorporation Documents',
      'Certificates',
      'Annual Returns and Balance Sheet eForms',
      'Charge Documents',
      'Change in Directors/Designated Partner',
      'LLP Forms (Conversion of company to LLP)',
      'Other eForm Documents',
      'Other Attachments',
    ];

    const initialGroups = categories.reduce(
      (acc, category) => {
        acc[category] = {};
        return acc;
      },
      {} as Record<string, Record<string, IDocument[]>>
    );

    return data.reduce((acc, doc) => {
      // Ensure doc is valid
      if (!doc) return acc;

      const otherAttachmentsKeywords = [
        'opt',
        'optional',
        'attach',
        'attachment',
      ];

      // Determine category with fallback
      let category: string = 'Other Attachments';

      if (
        doc.attachmentLabel &&
        otherAttachmentsKeywords.some(
          (keyword) =>
            doc.attachmentLabel &&
            doc.attachmentLabel.toLowerCase().includes(keyword)
        )
      ) {
        category = 'Other Attachments';
      } else if (doc.documentCategory.includes('Change in Directors')) {
        category = 'Change in Directors/Designated Partner';
      } else {
        // If not in Other Attachments, use documentCategory
        category = doc.documentCategory;
      }

      // Ensure the category exists in the accumulator
      if (!acc[category]) {
        acc[category] = {};
      }

      // Use a fallback for formId
      const formId = doc.formId || 'Unspecified Form';

      // Ensure the formId exists in the category
      if (!acc[category][formId]) {
        acc[category][formId] = [];
      }

      // Add the document
      acc[category][formId].push(doc);
      return acc;
    }, initialGroups);
  }, [data]);

  // Extract unique categories from grouped data
  const categories = useMemo(() => Object.keys(groupedData), [groupedData]);
  const [activeCategory, setActiveCategory] = useState('');
  const [activeFormId, setActiveFormId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Set initial active category and form ID when component mounts or data changes
  useEffect(() => {
    // Set the default active category to the first one with formIds
    const firstCategoryWithData = categories.find(
      (category) => Object.keys(groupedData[category]).length > 0
    );
    if (firstCategoryWithData) {
      setActiveCategory(firstCategoryWithData);

      // Set the default active formId to the first one in the active category
      const firstFormId = Object.keys(groupedData[firstCategoryWithData])[0];
      if (firstFormId) {
        setActiveFormId(firstFormId);
      }
    }
  }, [categories, groupedData]);

  // Sort documents based on financial year and current sort order
  const sortedData = useMemo(() => {
    if (!activeCategory || !activeFormId) return [];
    return [...(groupedData[activeCategory][activeFormId] || [])].sort(
      (a, b) => {
        return sortOrder === 'asc'
          ? a.financialYear.localeCompare(b.financialYear)
          : b.financialYear.localeCompare(a.financialYear);
      }
    );
  }, [groupedData, activeCategory, activeFormId, sortOrder]);

  // Filter documents based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    return sortedData.filter((doc) => {
      const searchableFields = [
        doc.fileName,
        // doc.financialYear,
        doc.filingDate,
        ...(doc.attachments?.map((attachment) => attachment.name) || []),
      ];
      return searchableFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sortedData, searchTerm]);

  // Pagination settings
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle sort order between ascending and descending
  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Update search term and reset to first page when searching
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Render loading state or no documents message if applicable
  if (isLoading) {
    return <LoadingWithSpinner />;
  }

  if (data.length === 0) {
    return (
      <Card className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground'>No documents found.</p>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden rounded-lg shadow-md', className)}>
      <div className='flex flex-col lg:flex-row'>
        {/* CATEGORIES SIDEBAR */}
        <div className='w-full bg-muted p-2 lg:w-80 lg:border-r'>
          {/* Render sidebar with document categories */}
          {categories.map((category) => (
            <div key={category} className='mb-4'>
              <motion.button
                onClick={() => {
                  setActiveCategory(category);
                  setActiveFormId(Object.keys(groupedData[category])[0]);
                  setCurrentPage(1);
                  // Scroll to the target element with an offset
                  const targetElement =
                    document.getElementById('public-docs-table');
                  if (targetElement) {
                    const elementPosition =
                      targetElement.getBoundingClientRect().top; // Get element's position relative to the viewport
                    const offsetPosition =
                      elementPosition + window.scrollY - 140; // Adjust with the offset of 40px

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={cn(
                  'w-full rounded-md p-2 text-left transition-colors',
                  activeCategory === category
                    ? 'bg-muted-foreground text-muted'
                    : 'hover:bg-muted-foreground/10'
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className='flex gap-2'>
                  <span className='mt-0.5 flex-shrink-0'>
                    {categoryIcons[category]}
                  </span>
                  <span className='flex flex-1 items-start justify-between'>
                    <span className='text-balance text-sm font-medium'>
                      {category}
                    </span>
                    <span
                      className={cn(
                        'flex-center ml-2 rounded-md px-2 py-1 text-xs font-semibold',
                        activeCategory === category
                          ? 'bg-background text-foreground'
                          : 'bg-muted-foreground/10'
                      )}
                    >
                      {Object.keys(groupedData[category]).reduce(
                        (acc, formId) =>
                          acc + groupedData[category][formId].length,
                        0
                      )}
                    </span>
                  </span>
                </div>
              </motion.button>

              {/* Render form IDs for the active category */}
              {activeCategory === category && (
                <div className='ml-3 mt-2 space-y-1'>
                  {Object.keys(groupedData[category]).length > 0
                    ? Object.keys(groupedData[category]).map((formId) => (
                        <div key={formId} className='flex items-center gap-2'>
                          <CornerDownRight className='size-4' />
                          <motion.button
                            key={formId}
                            onClick={() => {
                              setActiveFormId(formId);
                              setCurrentPage(1);
                              // Scroll to the target element with an offset
                              const targetElement =
                                document.getElementById('public-docs-table');
                              if (targetElement) {
                                const elementPosition =
                                  targetElement.getBoundingClientRect().top; // Get element's position relative to the viewport
                                const offsetPosition =
                                  elementPosition + window.scrollY - 140; // Adjust with the offset of 40px

                                window.scrollTo({
                                  top: offsetPosition,
                                  behavior: 'smooth',
                                });
                              }
                            }}
                            className={cn(
                              'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors',
                              activeFormId === formId
                                ? 'bg-primary text-muted'
                                : 'hover:bg-muted-foreground/5'
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            variants={categoryVariants}
                            initial='enter'
                            animate='center'
                            exit='exit'
                          >
                            <span className='text-balance text-sm'>
                              {formId}
                            </span>
                          </motion.button>
                        </div>
                      ))
                    : null}
                </div>
              )}
            </div>
          ))}
        </div>

        <div id='public-docs-table' className='relative flex-1 pb-20'>
          {/* Render main content area with document table */}
          <CardContent className='p-4'>
            {activeFormId ? (
              <AnimatePresence mode='wait'>
                <motion.div
                  key={`${activeCategory}-${activeFormId}-${currentPage}`}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  variants={tableVariants}
                  transition={{ duration: 0.1 }}
                >
                  <div className='mb-4 flex justify-between gap-8'>
                    {/* FORM TYPE AND DESC */}
                    <div className='text-sm'>
                      {(() => {
                        const { name, description } = getFormInfo(
                          activeFormId,
                          activeCategory
                        );
                        return (
                          <>
                            <h4>
                              <strong>{activeFormId} :</strong> {name}
                            </h4>
                            <p className='mt-1.5 text-balance text-xs text-muted-foreground'>
                              {description}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                    {/* SEARCH */}
                    <Input
                      type='text'
                      placeholder='Search documents...'
                      value={searchTerm}
                      onChange={handleSearch}
                      className='ml-auto mr-2 max-w-56'
                    />
                  </div>

                  <Table>
                    {/* Render table header with sorting functionality */}
                    <TableHeader className='bg-muted/40'>
                      <TableRow className='divide-x'>
                        <TableHead
                          className='group cursor-pointer whitespace-nowrap p-4 font-semibold'
                          onClick={handleSort}
                        >
                          Filing Information
                          <ArrowUpDown className='ml-2 inline-block h-4 w-4 group-hover:text-foreground' />
                        </TableHead>

                        {/* IF category is Other Attachments or version is v2, THEN DO NOT SHOW ATTACHMENTS COLUMN */}
                        {activeCategory !== 'Other Attachments' &&
                        version !== 'v2' ? (
                          <TableHead className='min-w-44 p-4 font-semibold'>
                            Attachments
                          </TableHead>
                        ) : null}

                        <TableHead className='font-semibold'></TableHead>
                      </TableRow>
                    </TableHeader>

                    {/* Render table body with documents or no results message */}
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className='h-24 text-center'>
                          <div className='flex flex-col items-center justify-center'>
                            <FileQuestion className='mb-2 h-8 w-8 text-muted-foreground' />
                            <p className='text-muted-foreground'>
                              No documents found matching your search criteria.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableBody>
                        {paginatedData.map((doc, index) => (
                          <TableRow key={index}>
                            <TableCell className='space-y-1 p-4 align-top'>
                              <div className='flex items-center gap-2'>
                                <FaFileAlt className='mr-1 inline size-6 flex-shrink-0 text-muted-foreground' />
                                <div>
                                  <p className='font-medium'>
                                    {highlightText(doc.fileName, searchTerm)}
                                  </p>
                                  {activeCategory ===
                                    'Annual Returns and Balance Sheet eForms' && (
                                    <p>
                                      FY:{' '}
                                      {highlightText(
                                        doc.financialYear,
                                        searchTerm
                                      )}
                                    </p>
                                  )}
                                  <p className='text-muted-foreground md:whitespace-nowrap'>
                                    Filed on:{' '}
                                    <span className='whitespace-nowrap'>
                                      {highlightText(
                                        doc.filingDate,
                                        searchTerm
                                      )}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            {/* IF category is Other Attachments or version is v2, THEN DO NOT SHOW ATTACHMENTS COLUMN */}
                            {activeCategory !== 'Other Attachments' &&
                              version !== 'v2' && (
                                <TableCell className='p-4 align-top'>
                                  {doc.attachments &&
                                  doc.attachments.length > 0 ? (
                                    <div className='space-y-1.5'>
                                      <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                                        <Paperclip className='h-4 w-4 flex-shrink-0' />
                                        <span>
                                          {doc.attachments.length} Attachment
                                          {doc.attachments.length > 1
                                            ? 's'
                                            : ''}
                                        </span>
                                      </div>
                                      <div className='space-y-1.5'>
                                        {doc.attachments.map(
                                          (attachment, attachmentIndex) => (
                                            <div
                                              key={attachmentIndex}
                                              className='flex items-center gap-2'
                                            >
                                              <CornerDownRight className='h-4 w-4 flex-shrink-0' />
                                              <FileText className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
                                              <span>
                                                {highlightText(
                                                  attachment.name,
                                                  searchTerm
                                                )}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                                      <Paperclip className='h-4 w-4 flex-shrink-0' />{' '}
                                      No Attachments
                                    </span>
                                  )}
                                </TableCell>
                              )}

                            <TableCell className='w-44 p-4'>
                              {doc.numberOfPages &&
                                doc.numberOfPages >= 0 &&
                                !!doc.sizeKB && (
                                  <div className='flex-center mb-2 flex gap-1.5 whitespace-nowrap text-xs font-semibold text-muted-foreground'>
                                    <span className='flex w-fit items-center gap-1'>
                                      <FileText className='size-4 flex-shrink-0' />
                                      {doc.numberOfPages}{' '}
                                      {doc.numberOfPages === 1
                                        ? 'Page'
                                        : 'Pages'}
                                    </span>
                                    <span className='w-fit rounded-full bg-muted px-2 py-1 text-[10px]'>
                                      {formatFileSize(doc.sizeKB)}
                                    </span>
                                  </div>
                                )}

                              {/* IF COMPANY UNLOCKED THEN SHOW DOWNLOAD BUTTON, OTHERWISE SHOW UNLOCK COMPANY BUTTON */}
                              {isUnlockedListLoading ? (
                                <Skeleton className='h-10 w-full max-w-48 bg-white' />
                              ) : isUnlocked.isUnlocked ? (
                                <Button
                                  variant='default'
                                  size='sm'
                                  className='w-full'
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/unlock-companies/company-details/${formatToUrl(companyData.data.company)}/${companyData.data.cin}?tab=public-docs`
                                    )
                                  }
                                >
                                  <CheckCircle className='mr-1.5 size-4' />
                                  View Doc
                                </Button>
                              ) : doc.downloadUrl ? (
                                <Button
                                  variant='default'
                                  size='sm'
                                  className='w-full'
                                  onClick={() => {
                                    const downloadUrl = doc.downloadUrl;
                                    window.open(
                                      downloadUrl,
                                      '_blank',
                                      'noopener,noreferrer'
                                    );
                                  }}
                                >
                                  <Download className='mr-2 h-4 w-4' />
                                  Download
                                </Button>
                              ) : (
                                <>
                                  {companyData.data.companyType === 'LLP' ? (
                                    <UnlockCompanyBtn
                                      btnText='Unlock'
                                      companyData={companyData}
                                      isSamePage={true}
                                      className='mx-auto bg-primary text-background hover:bg-primary hover:text-background'
                                    />
                                  ) : (
                                    <UnlockPublicDocsBtn
                                      btnText='Download'
                                      companyData={companyData}
                                      className='mx-auto bg-primary text-background hover:bg-primary hover:text-background'
                                    />
                                  )}
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                  </Table>
                </motion.div>
              </AnimatePresence>
            ) : (
              // IF NO DATA AVAILABLE
              <div className='flex h-80 flex-col items-center justify-center p-6 text-center'>
                <FileQuestion className='mb-4 h-16 w-16 text-gray-400' />
                <h3 className='mb-2 text-lg font-semibold'>
                  No {activeCategory} Available
                </h3>
                <p className='mb-4 max-w-md text-sm text-muted-foreground'>
                  We couldn&apos;t find any {activeCategory} for this company at
                  the moment. This could be due to recent incorporation, pending
                  filings, or data processing delays.
                </p>
                <div className='flex items-center justify-center space-x-2 text-sm'>
                  <AlertCircle className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
                  <p className='text-muted-foreground'>
                    Please check back later or contact support if you believe
                    this is an error.
                  </p>
                </div>
              </div>
            )}

            {/* Render pagination controls if there are multiple pages */}
            {totalPages > 1 && (
              <div className='absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 md:p-6'>
                <div className='text-sm text-muted-foreground'>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                  {filteredData.length} results
                </div>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? 'default' : 'outline'
                            }
                            size='sm'
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page}>...</span>;
                      }
                      return null;
                    }
                  )}
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default DocsSection;
