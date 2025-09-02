import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, formatDate, parseISO } from 'date-fns';
import { IoMdCopy } from 'react-icons/io';
import { toast } from 'sonner';
import { DatePicker } from './DateRangePicker';

// TYPES
export type SortKey = 'dataDate' | 'sentDate';
export type SortDirection = 'asc' | 'desc';
export type FilterKey = 'dataDate' | 'sentDate';

export interface FileRow {
  planName: string; // e.g. "New Company Alerts"
  dataDate: string | Date; // the date the data represents (NOT when email was sent)
  sentDate: string | Date; // when the file/email was sent
  fileLink: string; // URL
}
export interface MetaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FileHistoryTableProps {
  rows: FileRow[];
  // external state (provided by parent)
  sortBy: SortKey;
  // eslint-disable-next-line no-unused-vars
  setSortBy: (v: SortKey) => void;
  // eslint-disable-next-line no-unused-vars
  setReset: (v: boolean) => void;
  sortDirection: SortDirection;
  // eslint-disable-next-line no-unused-vars
  setSortDirection: (v: SortDirection) => void;
  filterBy: FilterKey;
  // eslint-disable-next-line no-unused-vars
  setFilterBy: (v: FilterKey) => void;
  selectedDate?: Date;
  // eslint-disable-next-line no-unused-vars
  setSelectedDate: (v: Date | undefined) => void;
  // eslint-disable-next-line no-unused-vars
  setPage: (v: number) => void;
  meta?: MetaPagination;
}

// helpers
const toDate = (d: string | Date | null | undefined) => {
  if (!d) return null;
  return typeof d === 'string' ? parseISO(d) : d;
};

const FileHistoryTable = ({
  rows,
  sortBy,
  setSortBy,
  setReset,
  sortDirection,
  setSortDirection,
  filterBy,
  setFilterBy,
  selectedDate,
  setSelectedDate,
  meta,
  setPage,
}: FileHistoryTableProps) => {
  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  const toggleSort = (column: SortKey) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const resetFilters = () => {
    setSelectedDate(undefined);
    setReset(true);
    setFilterBy('sentDate');
    setSortBy('sentDate');
    setSortDirection('desc');
  };

  // Helper function to get sort arrow
  const getSortArrow = (column: SortKey) => {
    if (sortBy !== column) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  let dateStart;
  if (selectedDate) {
    dateStart = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    );
  }
  return (
    <div>
      {/* Controls */}
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
        <h3 className='font-semibold'>File History ({rows.length} records)</h3>
        <div className='flex flex-wrap items-center gap-2'>
          <Select
            value={filterBy}
            onValueChange={(v) => {
              setFilterBy(v as FilterKey);
            }}
          >
            <SelectTrigger className='h-8 w-[100px] px-2 text-xs sm:w-28 sm:text-sm lg:h-9'>
              <SelectValue placeholder='Filter by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='sentDate'>Sent Date</SelectItem>
              <SelectItem value='dataDate'>Data Date</SelectItem>
            </SelectContent>
          </Select>

          <DatePicker
            selectedDate={selectedDate}
            onDateChange={(date) => {
              setSelectedDate(date);
            }}
            placeholderText={`Pick ${filterBy === 'sentDate' ? 'Sent' : 'Data'} Date`}
            className='w-32'
          />

          <Button
            variant='secondary'
            onClick={resetFilters}
            className='h-8 lg:h-9'
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      <div className='mb-2 text-xs text-gray-500'>
        {dateStart &&
          (filterBy === 'sentDate'
            ? `Email Sent Date: ${formatDate(dateStart, 'dd-MMM-yyyy')}`
            : `Email Data Process Date: ${formatDate(dateStart, 'dd-MMM-yyyy')}`)}
      </div>

      {/* Table */}
      <div className='w-full overflow-auto rounded-lg border'>
        {rows.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>
            {selectedDate
              ? `No file history found for ${format(selectedDate, 'dd-MMM-yyyy')}.`
              : 'No file history found.'}
          </div>
        ) : (
          <table className='w-full table-auto text-left text-sm'>
            <thead className='sticky top-0 z-10 divide-x whitespace-nowrap bg-gray-100 shadow-sm'>
              <tr className='divide-x'>
                <th className='hidden px-2 py-3 text-xs font-medium text-gray-700 sm:table-cell sm:text-sm'>
                  Plan Name
                </th>
                <th className='px-2 py-3 text-xs font-medium text-gray-700 sm:text-sm'>
                  <button
                    onClick={() => toggleSort('dataDate')}
                    className='flex items-center gap-1 hover:text-blue-600'
                  >
                    Data Date {getSortArrow('dataDate')}
                  </button>
                </th>
                <th className='px-2 py-3 text-xs font-medium text-gray-700 sm:text-sm'>
                  <button
                    onClick={() => toggleSort('sentDate')}
                    className='flex items-center gap-1 hover:text-blue-600'
                  >
                    Sent Date {getSortArrow('sentDate')}
                  </button>
                </th>
                <th className='px-2 py-3 text-xs font-medium text-gray-700 sm:text-sm'>
                  File Link
                </th>
                <th className='px-2 py-3 text-xs font-medium text-gray-700 sm:table-cell sm:text-sm md:hidden'>
                  Plan Name
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const dataD = toDate(row.dataDate);
                const sentD = toDate(row.sentDate);
                return (
                  <tr
                    key={`${row.planName}-${row.dataDate}-${row.sentDate}-${index}`}
                    className={`divide-x whitespace-nowrap border-t ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-gray-50'}`}
                  >
                    <td className='hidden p-2 sm:table-cell'>
                      <span className='text-xs sm:text-sm'>
                        {row.planName
                          ? row.planName === 'emailWithPhone'
                            ? 'Email With Phone'
                            : 'Email Only'
                          : 'unknown'}
                      </span>
                    </td>
                    <td className='p-2'>
                      <span className='text-xs sm:text-sm'>
                        {dataD ? format(dataD, 'dd-MMM-yyyy') : 'N/A'}
                      </span>
                    </td>
                    <td className='p-2'>
                      <span className='text-xs sm:text-sm'>
                        {sentD ? format(sentD, 'dd-MMM-yyyy') : 'N/A'}
                      </span>
                    </td>
                    <td className='p-2'>
                      {row.fileLink ? (
                        <div className='flex items-center gap-2 text-xs sm:text-sm'>
                          <a
                            href={row.fileLink}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            Download File
                          </a>
                          <button
                            onClick={() => handleCopyLink(row.fileLink)}
                            className='rounded-md p-1 hover:bg-gray-100'
                            title='Copy link'
                          >
                            <IoMdCopy className='h-3 w-3 text-gray-500 hover:text-gray-700' />
                          </button>
                        </div>
                      ) : (
                        <span className='text-xs text-gray-400'>No file</span>
                      )}
                    </td>
                    <td className='p-2 md:hidden'>
                      <span className='text-xs font-medium'>
                        {row.planName
                          ? row.planName === 'emailWithPhone'
                            ? 'Email With Phone'
                            : 'Email Only'
                          : 'unknown'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {meta && (
        <Pagination className='mt-4'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  setPage(Math.max(meta.page - 1, 1));
                }}
                className={`p-1 text-[10px] sm:p-2 sm:text-sm ${meta.page === 1 ? 'pointer-events-none opacity-50' : ''}`}
              />
            </PaginationItem>

            {Array.from({ length: meta.totalPages }, (_, i) => {
              const pageNumber = i + 1;
              if (
                pageNumber === 1 ||
                pageNumber === meta.totalPages ||
                (pageNumber >= meta.page - 1 && pageNumber <= meta.page + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      className='h-auto w-auto px-1.5 py-1 text-[10px] sm:px-2.5 sm:py-1.5 sm:text-sm'
                      href='#'
                      isActive={meta.page === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }

              if (
                pageNumber === meta.page - 2 ||
                pageNumber === meta.page + 2
              ) {
                return (
                  <PaginationItem key={`ellipsis-${pageNumber}`}>
                    <span className='pointer-events-none text-xs text-gray-500 sm:text-sm'>
                      ...
                    </span>
                  </PaginationItem>
                );
              }

              return null;
            })}

            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  setPage(Math.min(meta.page + 1, meta.totalPages));
                }}
                className={`p-1 text-[10px] sm:p-2 sm:text-sm ${
                  meta.page === meta.totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default FileHistoryTable;
