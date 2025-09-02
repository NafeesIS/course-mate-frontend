'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Card } from '@/components/ui/card';
import { format, isValid } from 'date-fns';
import { useState } from 'react';
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiRestartLine,
} from 'react-icons/ri';
import ColumnVisibilitySelector from './ColumnVisibilitySelector';
import CouponColumnFilters from './CouponColumnFilter';
import CouponTablePagination from './CouponTablePagination';

const CouponListTable = ({ data, columns }: any) => {
  // Helper function to format dates
  data.forEach((item: any) => {
    item.value = item.value ? item.value.toString() : '';
    item.minimumOrderValue = item.minimumOrderValue
      ? item.minimumOrderValue.toString()
      : '';
    item.maxRedemptions = item.maxRedemptions
      ? item.maxRedemptions.toString()
      : '';
    item.maxRedemptionsPerUser = item.maxRedemptionsPerUser
      ? item.maxRedemptionsPerUser.toString()
      : '';
    if (item.createdAt && isValid(new Date(item.createdAt))) {
      item.createdAt = format(new Date(item.createdAt), 'MMM-dd-yyyy');
    }
    if (item.expiryDate && isValid(new Date(item.expiryDate))) {
      item.expiryDate = format(new Date(item.expiryDate), 'MMM-dd-yyyy');
    }
  });

  const [sorting, setSorting] = useState<any>([]);
  const [filtering, setFiltering] = useState<string>('');

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
      <div className='flex flex-row justify-end gap-2 rounded-md p-2 text-xs sm:items-center sm:text-sm'>
        {/* RESET FILTERS BUTTON */}
        <button
          type='button'
          title='Reset Filters'
          onClick={() => {
            table.setSorting([]); // Reset sorting
            table.setGlobalFilter(''); // Reset global filter
            table.getAllColumns().forEach((column: any) => {
              column.setFilterValue(''); // Reset individual column filters
            });
          }}
          className='flex items-center gap-1 rounded border p-2 text-foreground transition-all hover:border-muted-foreground'
        >
          <RiRestartLine />
          Reset
        </button>

        {/* COLUMN VISIBILITY SELECTOR */}
        <ColumnVisibilitySelector table={table} />
      </div>

      <Card className='relative mx-auto flex w-full min-w-0 flex-col overflow-hidden break-words rounded-md border xl:mb-0'>
        <div className='block w-full overflow-x-auto'>
          <table className='w-full border-collapse items-center'>
            <thead>
              {table?.getHeaderGroups()?.map((headerGroup: any, index: any) => (
                <tr key={index} className='divide-x border border-b-muted'>
                  {headerGroup.headers.map((header: any) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`min-w-24 max-w-28 bg-muted px-2.5 pb-3 pt-3 text-left text-xs font-semibold capitalize text-foreground transition-all sm:text-sm ${
                        header.column.getCanSort()
                          ? 'cursor-pointer hover:bg-muted'
                          : ''
                      }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div className='flex flex-col gap-6'>
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
                            <CouponColumnFilters
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
                    {row.getVisibleCells().map((cell: any, index: any) => (
                      <td
                        key={index}
                        className='align-center border-l-0 border-r-2 border-t-0 px-2 py-4 text-xs sm:text-sm'
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
                <tr className='h-32 text-center'>
                  <td colSpan={12}>No Record Found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <CouponTablePagination table={table} />
      </Card>
    </section>
  );
};

export default CouponListTable;
