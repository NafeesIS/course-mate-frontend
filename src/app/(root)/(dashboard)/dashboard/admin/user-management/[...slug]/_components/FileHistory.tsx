import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { compareAsc, compareDesc, format, isSameDay, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { IoMdCopy } from 'react-icons/io';
import { toast } from 'sonner';
import { IFileSentHistory } from '../../../subscription-management/_types/types';
import { DatePicker } from './DateRangePicker';

const extractFileInfo = (fileLink: string) => {
  try {
    const match = fileLink.match(
      /(\d{4}-\d{2}-\d{2})_([A-Za-z]+(?:_[A-Za-z]+)*)_/
    );
    if (!match) return { rawDataDate: null, dataDate: '', planName: 'Unknown' };

    const rawDataDate = match[1];
    const formattedDataDate = format(parseISO(rawDataDate), 'dd-MMM-yyyy');
    const planName = match[2].replace(/_/g, ' ');
    return { rawDataDate, dataDate: formattedDataDate, planName };
  } catch {
    return { rawDataDate: null, dataDate: '', planName: 'Unknown' };
  }
};

const FileHistory = ({
  fileSentHistory,
}: {
  fileSentHistory: IFileSentHistory[];
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [sortBy, setSortBy] = useState<'dataDate' | 'sentDate'>('sentDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'dataDate' | 'sentDate'>('sentDate');

  const resetFilters = () => {
    setSelectedDate(undefined);
    setSortBy('sentDate');
    setSortDirection('desc');
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  const sortedFiles = useMemo(() => {
    let files = fileSentHistory;

    if (selectedDate) {
      files = files.filter((file) => {
        const fileLink = file?.s3Link || file?.BlobLink;
        const { rawDataDate } = extractFileInfo(fileLink);
        const raw = rawDataDate ? parseISO(rawDataDate) : null;
        const sent = file?.emailSentDate ? new Date(file?.emailSentDate) : null;
        const dateToCompare = filterBy === 'dataDate' ? raw : sent;
        return dateToCompare && isSameDay(dateToCompare, selectedDate);
      });
    }

    return [...files].sort((a, b) => {
      const fileLinkA = a?.s3Link || a?.BlobLink;
      const fileLinkB = b?.s3Link || b?.BlobLink;
      const { rawDataDate: rawDateA } = extractFileInfo(fileLinkA);
      const { rawDataDate: rawDateB } = extractFileInfo(fileLinkB);

      const dateA =
        sortBy === 'dataDate' && rawDateA
          ? parseISO(rawDateA)
          : new Date(a?.emailSentDate);
      const dateB =
        sortBy === 'dataDate' && rawDateB
          ? parseISO(rawDateB)
          : new Date(b?.emailSentDate);

      return sortDirection === 'asc'
        ? compareAsc(dateA, dateB)
        : compareDesc(dateA, dateB);
    });
  }, [fileSentHistory, selectedDate, sortBy, sortDirection, filterBy]);

  const toggleSort = (column: 'dataDate' | 'sentDate') => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  return (
    <div>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
        <h3 className='font-semibold'>File History</h3>
        <div className='flex flex-wrap items-center gap-2'>
          <Select
            value={filterBy}
            onValueChange={(value) =>
              setFilterBy(value as 'dataDate' | 'sentDate')
            }
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
            onDateChange={setSelectedDate}
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

      <div className='max-h-96 w-full overflow-x-auto overflow-y-auto rounded-lg border'>
        {sortedFiles.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>
            No file history found.
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
                    className='flex items-center gap-1'
                  >
                    Data Date{' '}
                    {sortBy === 'dataDate'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </button>
                </th>
                <th className='px-2 py-3 text-xs font-medium text-gray-700 sm:text-sm'>
                  <button
                    onClick={() => toggleSort('sentDate')}
                    className='flex items-center gap-1'
                  >
                    Sent Date{' '}
                    {sortBy === 'sentDate'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </button>
                </th>
                <th className='px-2 py-3 text-xs font-medium text-gray-700 sm:text-sm'>
                  File Link
                </th>
                <th className='px-2 py-3 text-xs font-medium text-gray-700 sm:hidden sm:text-sm'>
                  Plan Name
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedFiles.map((file, index: number) => {
                const fileLink = file?.s3Link || file?.BlobLink;
                const { dataDate, planName } = extractFileInfo(fileLink);

                return (
                  <tr
                    key={index}
                    className={`divide-x whitespace-nowrap border-t ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-gray-50'}`}
                  >
                    <td className='hidden p-2 sm:table-cell'>{planName}</td>
                    <td className='p-2'>{dataDate}</td>
                    <td className='p-2'>
                      {format(new Date(file?.emailSentDate), 'dd-MMM-yyyy')}
                    </td>
                    <td className='p-2'>
                      <div className='flex items-center gap-4'>
                        <a
                          href={fileLink}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:underline'
                        >
                          Download File
                        </a>
                        <button
                          onClick={() => handleCopyLink(fileLink)}
                          className='rounded-md p-1 hover:bg-gray-100'
                          title='Copy link'
                        >
                          <IoMdCopy className='h-4 w-4 text-gray-500 hover:text-gray-700' />
                        </button>
                      </div>
                    </td>
                    <td className='p-2 sm:hidden'>{planName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FileHistory;
