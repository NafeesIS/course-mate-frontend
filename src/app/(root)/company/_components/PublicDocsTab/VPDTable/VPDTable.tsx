'use client';

import { useUnlockedCompaniesList } from '@/app/(root)/(dashboard)/dashboard/unlock-companies/company-details/[...slug]/_hooks/useUnlockedCompaniesList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { parse } from 'date-fns';
import { Search, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { TCompanyMasterData } from '../../../_types/CompanyDetails';
import { IDocument, IDownloadStatus } from '../../../_types/PublicDocsTypes';
import { CategoryFilter } from './CategoryFilter';
import { ColumnFilter } from './ColumnFilter';
import { createColumns } from './columns';
import { DownloadButtons } from './DownloadButtons';
import { FormIdFilter } from './FormIdFilter';
import { Pagination } from './Pagination';
import { YearFilter } from './YearFilter';

const OTHER_ATTACHMENTS_KEYWORDS = ['opt', 'optional', 'attach', 'attachment'];

interface VPDTableAttachmentProps {
  data: IDocument[];
  version?: 'v2' | 'v3';
  companyData: TCompanyMasterData;
  className?: string;
  tableClassName?: string;
  downloadStatus?: IDownloadStatus;
}

export function VPDTable({
  data,
  version,
  companyData,
  className,
  tableClassName,
  downloadStatus,
}: VPDTableAttachmentProps) {
  const pathname = usePathname();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState<
    string[]
  >([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [tempSelectedFormIds, setTempSelectedFormIds] = useState<string[]>([]);
  const [isFormIdDropdownOpen, setIsFormIdDropdownOpen] = useState(false);

  const { isCompanyUnlocked, isLoading: isUnlockedListLoading } =
    useUnlockedCompaniesList({ enableCaching: true });
  const isUnlocked = pathname.includes('/dashboard/admin/')
    ? { isUnlocked: true, unlockType: null } // if admin, it will be unlocked always
    : isCompanyUnlocked(companyData.data.cin as string);

  // Initialize tempSelectedFormIds when selectedFormIds changes
  useEffect(() => {
    setTempSelectedFormIds(selectedFormIds);
  }, [selectedFormIds]);

  // Calculate document counts per category
  const categoryCounts = useMemo(() => {
    return data.reduce(
      (acc, doc) => {
        let category: string;
        if (
          doc.attachmentLabel &&
          OTHER_ATTACHMENTS_KEYWORDS.some(
            (keyword) =>
              doc.attachmentLabel &&
              doc.attachmentLabel.toLowerCase().includes(keyword)
          )
        ) {
          category = 'Other Attachments';
        } else if (doc.documentCategory.includes('Change in Directors')) {
          category = 'Change in Directors/Designated Partner';
        } else {
          category = doc.documentCategory;
        }
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [data]);

  // Check if any filters are applied
  const hasActiveFilters = useMemo(() => {
    return (
      selectedCategories.length > 0 ||
      selectedYears.length > 0 ||
      selectedFormIds.length > 0 ||
      columnFilters.length > 0
    );
  }, [selectedCategories, selectedYears, selectedFormIds, columnFilters]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setTempSelectedCategories([]);
    setSelectedYears([]);
    setSelectedFormIds([]);
    setTempSelectedFormIds([]);
    setColumnFilters([]);
    setGlobalFilter('');
    setSorting([]);
  };

  // Apply category filters
  const applyCategoryFilters = () => {
    setSelectedCategories(tempSelectedCategories);
    setIsCategoryDropdownOpen(false);
  };

  // Cancel category filter changes
  const cancelCategoryFilters = () => {
    setTempSelectedCategories(selectedCategories);
    setIsCategoryDropdownOpen(false);
  };

  // Initialize column visibility based on version
  useEffect(() => {
    if (version === 'v2') {
      setColumnVisibility({
        sizeKB: false,
        numberOfPages: false,
        attachments: false,
      });
    }
  }, [version]);

  // Filter data based on selected categories and years
  const filteredData = useMemo(() => {
    const filteredDocs = data.filter((doc) => {
      // Category filtering logic
      let category: string;
      if (
        doc.attachmentLabel &&
        OTHER_ATTACHMENTS_KEYWORDS.some(
          (keyword) =>
            doc.attachmentLabel &&
            doc.attachmentLabel.toLowerCase().includes(keyword)
        )
      ) {
        category = 'Other Attachments';
      } else if (doc.documentCategory.includes('Change in Directors')) {
        category = 'Change in Directors/Designated Partner';
      } else {
        category = doc.documentCategory;
      }

      // // If no categories selected and no year filter, hide Other Attachments
      // if (
      //   selectedCategories.length === 0 &&
      //   selectedYears.length === 0 &&
      //   category === 'Other Attachments'
      // ) {
      //   return false;
      // }
      // If categories are selected, check if this category is selected
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(category)
      ) {
        return false;
      }

      // Form ID filtering
      if (
        version === 'v3' &&
        selectedFormIds.length > 0 &&
        doc.formId &&
        !selectedFormIds.includes(doc.formId)
      ) {
        return false;
      }

      // Year filtering
      if (selectedYears.length > 0) {
        const filingDate = parse(doc.filingDate, 'dd-MMM-yyyy', new Date());
        const filingYear = filingDate.getFullYear();
        if (!selectedYears.includes(filingYear)) {
          return false;
        }
      }

      return true;
    });

    // Sort filtered documents from present to past (newest to oldest)
    return filteredDocs.sort((a, b) => {
      const dateA = parse(a.filingDate, 'dd-MMM-yyyy', new Date());
      const dateB = parse(b.filingDate, 'dd-MMM-yyyy', new Date());
      return dateB.getTime() - dateA.getTime(); // Always sort from newest to oldest
    });
  }, [data, selectedCategories, selectedYears, selectedFormIds, version]);

  const table = useReactTable({
    data: filteredData,
    columns: createColumns(
      companyData,
      isUnlocked,
      isUnlockedListLoading,
      version
    ),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableColumns =
        version === 'v3'
          ? ['fileName', 'documentCategory', 'filingDate', 'formId']
          : ['fileName', 'documentCategory', 'filingDate'];
      const searchValue = filterValue.toLowerCase();

      return searchableColumns.some((column) => {
        const value = row.getValue(column)?.toString().toLowerCase() || '';
        return value.includes(searchValue);
      });
    },
  });

  return (
    <div className={cn('w-full', className)}>
      <div className='flex flex-col-reverse gap-4 py-4 sm:flex-row sm:items-center sm:justify-between md:overflow-x-auto md:px-0.5'>
        {/* FILTERS */}
        <div className='flex flex-wrap items-center justify-start gap-2 sm:flex-nowrap'>
          <div className='relative w-full min-w-60'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search documents...'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='w-full bg-white pl-8 pr-8 text-xs md:text-sm'
            />
            {globalFilter && (
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2'
                onClick={() => setGlobalFilter('')}
              >
                <X className='h-4 w-4 text-muted-foreground' />
              </Button>
            )}
          </div>

          {/* CATEGORY FILTER */}
          <CategoryFilter
            selectedCategories={selectedCategories}
            tempSelectedCategories={tempSelectedCategories}
            setTempSelectedCategories={setTempSelectedCategories}
            isCategoryDropdownOpen={isCategoryDropdownOpen}
            setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
            categoryCounts={categoryCounts}
            onApply={applyCategoryFilters}
            onCancel={cancelCategoryFilters}
          />

          {/* YEAR FILTER */}
          {/* FORM ID FILTER */}
          {version === 'v3' && (
            <FormIdFilter
              selectedFormIds={selectedFormIds}
              tempSelectedFormIds={tempSelectedFormIds}
              setTempSelectedFormIds={setTempSelectedFormIds}
              isFormIdDropdownOpen={isFormIdDropdownOpen}
              setIsFormIdDropdownOpen={setIsFormIdDropdownOpen}
              documents={data}
              onApply={() => {
                setSelectedFormIds(tempSelectedFormIds);
                setIsFormIdDropdownOpen(false);
              }}
              onCancel={() => {
                setTempSelectedFormIds(selectedFormIds);
                setIsFormIdDropdownOpen(false);
              }}
            />
          )}

          <YearFilter
            selectedYears={selectedYears}
            onYearsChange={setSelectedYears}
            incorporationDate={companyData.data.dateOfIncorporation}
            documents={data}
          />

          {/* COLUMNS FILTER */}
          <ColumnFilter table={table} />
        </div>

        {/* DOWNLOAD BUTTONS */}
        <DownloadButtons
          downloadStatus={downloadStatus}
          version={version}
          companyData={companyData}
          isUnlocked={isUnlocked}
        />
      </div>

      {/* ACTIVE FILTERS */}
      {hasActiveFilters && (
        <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap gap-2'>
            {/* CATEGORY FILTERS */}
            {selectedCategories.map((category) => (
              <div
                key={category}
                className='flex items-center gap-1 rounded-full border bg-gradient-to-r from-primary/10 to-primary/20 px-2 py-1 text-xs font-medium text-primary sm:px-3'
              >
                <span className='max-w-[120px] truncate sm:max-w-[200px]'>
                  {category}
                </span>
                <button
                  onClick={() =>
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category)
                    )
                  }
                  className='ml-1 rounded-full p-0.5 hover:bg-primary/20'
                >
                  <X className='h-3 w-3' />
                </button>
              </div>
            ))}

            {/* FORM ID FILTERS */}
            {version === 'v3' &&
              selectedFormIds.map((formId) => (
                <div
                  key={formId}
                  className='flex items-center gap-1 rounded-full border bg-gradient-to-r from-primary/10 to-primary/20 px-2 py-1 text-[10px] font-medium text-primary sm:px-3 sm:text-xs'
                >
                  <span className='whitespace-nowrap'>{formId}</span>
                  <button
                    onClick={() =>
                      setSelectedFormIds(
                        selectedFormIds.filter((f) => f !== formId)
                      )
                    }
                    className='ml-1 rounded-full p-0.5 hover:bg-primary/20'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </div>
              ))}

            {/* YEAR FILTER */}
            {selectedYears.length > 0 && (
              <>
                {selectedYears.map((year) => (
                  <div
                    key={year}
                    className='flex items-center gap-1 rounded-full border bg-gradient-to-r from-primary/10 to-primary/20 px-2 py-1 text-[10px] font-medium text-primary sm:px-3 sm:text-xs'
                  >
                    <span className='whitespace-nowrap'>{year}</span>
                    <button
                      onClick={() =>
                        setSelectedYears(
                          selectedYears.filter((y) => y !== year)
                        )
                      }
                      className='ml-1 rounded-full p-0.5 hover:bg-primary/20'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* RESET FILTERS */}
            <button
              onClick={resetFilters}
              className='flex w-fit items-center gap-1 rounded-full border bg-gradient-to-r from-destructive/10 to-destructive/20 px-3 py-1 text-xs font-medium text-red-600'
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className={cn('rounded-md border bg-white', tableClassName)}>
        <Table>
          <TableHeader className='text-xs lg:text-sm'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='text-xs md:text-sm'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={index % 2 === 0 ? 'bg-muted/50' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    createColumns(
                      companyData,
                      isUnlocked,
                      isUnlockedListLoading,
                      version
                    ).length
                  }
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col-reverse items-center justify-between gap-2 px-2 py-4 md:flex-row'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-muted-foreground'>Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[10, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination table={table} />
      </div>
    </div>
  );
}
