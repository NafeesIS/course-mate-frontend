import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Card } from '@/components/ui/card';
import { useState } from 'react';
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiRestartLine,
} from 'react-icons/ri';
import ColumnFilters from './ColumnFilters';
import ColumnVisibilitySelector from './ColumnVisibilitySelector';
import Pagination from './Pagination';

const ChargesTable = ({ data, columns }: any) => {
  // Helper function to format date
  function formatDate(dateString: any) {
    if (dateString === '-' || !dateString) {
      return dateString;
    }
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);

    // Ensure proper format with hyphens
    const [month, day, year] = formattedDate.replace(',', '').split(' ');
    return `${month}-${day.padStart(2, '0')}-${year}`;
  }

  // Update date formats
  data.forEach((item: any) => {
    item.createdOn = formatDate(item.createdOn);
    item.modifiedOn = formatDate(item.modifiedOn);
    item.closedOn = formatDate(item.closedOn);
    item.amount = item.amount.toString();
  });

  // Assuming your original code with useState
  const [sorting, setSorting] = useState<any>([]);
  const [filtering, setFiltering] = useState<string>(''); // Assuming filtering is a string

  // CREATE TABLE INSTANCE
  const table: any = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting as any,
    onGlobalFilterChange: setFiltering as any,
  });

  return (
    <section className='bg-blueGray-50 py-1'>
      {/* TABLE ACTIONS */}
      <div className='flex flex-row justify-end gap-2  rounded-md p-2 text-xs sm:items-center sm:text-sm'>
        {/* SEARCH BOX */}
        {/* <GlobalSearch filtering={filtering} setFiltering={setFiltering} /> */}
        <div className='flex  flex-row flex-wrap justify-start gap-2 sm:items-center'>
          {/* EXPORT TO EXCEL */}
          {/* <ExportToExcel data={excelData} fileName={title} /> */}
          {/* RESET FILTERS */}
          <button
            type='button'
            title='Reset Filters'
            onClick={() => {
              // refetch();
              table.reset();
            }}
            className='flex items-center gap-1 rounded border p-2 text-foreground transition-all hover:border-muted-foreground'
          >
            <RiRestartLine />
            Reset
          </button>
          {/* COLUMNS: FILTER / CHECKBOX */}
          <ColumnVisibilitySelector table={table} />
        </div>
      </div>
      <Card className='relative mx-auto flex w-full min-w-0 flex-col overflow-hidden break-words rounded-md border  xl:mb-0'>
        <div className='block w-full overflow-x-auto'>
          <table className='w-full border-collapse items-center'>
            <thead>
              {table?.getHeaderGroups()?.map((headerGroup: any, index: any) => (
                <tr key={index} className='divide-x border border-b-muted'>
                  {headerGroup.headers.map((header: any) => (
                    // ** HEADER **
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`bg-muted p-2  text-left  text-xs font-bold uppercase text-foreground transition-all sm:text-sm  ${
                        header.column.getCanSort()
                          ? 'cursor-pointer hover:bg-muted'
                          : ''
                      }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div className='flex flex-col gap-2'>
                          <div
                            title={`${
                              header.column.getCanSort()
                                ? `Click to sort by ${header.column.columnDef.name}`
                                : header.column.columnDef.name
                            }`}
                            role='button'
                            onClick={header.column.getToggleSortingHandler()}
                            className='flex h-10 items-center justify-between gap-4'
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span>
                                <RiArrowUpSFill
                                  className={`text-gray-400 ${
                                    header.column.getIsSorted() === 'asc'
                                      ? 'text-gray-900'
                                      : ''
                                  }`}
                                />
                                <RiArrowDownSFill
                                  className={`text-gray-400 ${
                                    header.column.getIsSorted() === 'desc'
                                      ? 'text-gray-900'
                                      : ''
                                  }`}
                                />
                              </span>
                            )}
                          </div>

                          {/* COLUMN FILTER */}
                          {header.column.getCanFilter() && (
                            <ColumnFilters
                              column={header.column}
                              table={table}
                            />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows && table.getRowModel().rows.length ? (
                table?.getRowModel()?.rows?.map((row: any, index: any) => (
                  <tr key={index} className={index % 2 === 0 ? '' : 'bg-muted'}>
                    {/* ** CELL / DATA ** */}
                    {row.getVisibleCells().map((cell: any, index: any) => (
                      <td
                        key={index}
                        className='align-center border-l-0 border-r-2 border-t-0 px-2 py-4  text-xs sm:text-sm'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                // ** NO RECORD FOUND **
                <tr className='h-32 text-center'>
                  <td colSpan={12}>No Record Found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination table={table} />
      </Card>
    </section>
  );
};

export default ChargesTable;
