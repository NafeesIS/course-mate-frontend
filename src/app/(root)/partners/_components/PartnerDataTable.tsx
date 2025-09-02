/* eslint-disable indent */
'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { areaOfSpecializationOptions } from '@/constants/partnerDirectory';
import useMediaQuery from '@/hooks/useMediaQuery';
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  RiArrowRightUpFill,
  RiCloseFill,
  RiFilter2Fill,
  RiRestartLine,
} from 'react-icons/ri';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Card } from '../../../../components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '../../../../components/ui/drawer';
import PartnerFilters from './PartnerFilters';

type Partner = {
  _id: string;
  partnerId: string;
  name: string;
  designation: string;
  profileImg: string;
  firmName: string;
  firmAddress: {
    state: string;
  };
  areaOfSpecialization: [{ value: string; label: string }];
};

const columns: ColumnDef<Partner>[] = [
  {
    accessorKey: 'name',
    header: 'Partner Name',
    cell: ({ row }) => {
      const partnerName = row.getValue<string>('name') || '-';
      const partnerId = row.original.partnerId || '-';
      const designation = row.original.designation || '-';
      const profileImg = row.original.profileImg || '';
      const firmName = row.original.firmName || '-';
      const state = row.original.firmAddress.state || '-';
      const areaOfSpecialization = row.original.areaOfSpecialization || [];

      return (
        <Link
          href={`/partners/${formatToUrl(partnerName)}/${partnerId}`}
          prefetch={false}
          target='_blank'
          className='group block rounded-md transition-all'
        >
          <Card className='relative flex flex-col items-center gap-3 rounded-md p-4 group-hover:border-muted md:flex-row md:gap-6'>
            <Avatar className='h-16 w-16 border md:h-20 md:w-20'>
              <AvatarImage
                src={profileImg}
                className='h-auto w-auto object-contain'
              />
              <AvatarFallback>{getInitials(partnerName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className='flex flex-col flex-wrap items-center gap-2 text-center md:flex-row md:text-left'>
                <span className='font-medium'>{partnerName}</span>{' '}
                <span className='hidden text-lg text-muted-foreground md:block'>
                  &bull;
                </span>
                <span className='text-xs text-muted-foreground md:text-sm'>
                  {designation}
                </span>
              </div>
              <div className='mt-2 flex flex-col flex-wrap items-center gap-1.5 text-xs text-muted-foreground md:mt-0 md:flex-row md:gap-2 md:text-sm'>
                <span>{firmName.length > 0 ? toCamelCase(firmName) : '-'}</span>
                <span className='hidden text-lg md:block'>&bull;</span>
                <span>{state}</span>
              </div>
              <ul className='mt-3 flex flex-wrap gap-2 md:mt-1.5'>
                {areaOfSpecialization.map((area, index) => (
                  <li
                    key={index}
                    className='rounded-lg bg-muted px-2 py-1 text-xs'
                  >
                    {area.label}
                  </li>
                ))}
              </ul>
            </div>
            <RiArrowRightUpFill className='absolute right-4 top-4 scale-0 text-lg text-primary transition-all group-hover:ml-0 group-hover:scale-100' />
          </Card>
        </Link>
      );
    },
  },
];

// Function to extract unique states from partners data
const extractUniqueStates = (partnersData: Partner[]) => {
  const states = new Set(
    partnersData.map((partner: Partner) => partner.firmAddress.state)
  );
  return Array.from(states);
};

export const PartnersDataTable = ({
  partnersData,
}: {
  partnersData: Partner[];
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [filteredPartnerData, setFilteredPartnerData] =
    useState<Partner[]>(partnersData);
  const [searchInput, setSearchInput] = useState<string>('');

  const stateOptions: string[] = extractUniqueStates(partnersData);

  useEffect(() => {
    let filteredData = partnersData;

    if (selectedSpecializations.length > 0) {
      filteredData = filteredData.filter((partner) =>
        partner.areaOfSpecialization.some((area) =>
          selectedSpecializations.includes(area.value)
        )
      );
    }

    if (selectedStates.length > 0) {
      filteredData = filteredData.filter((partner) =>
        selectedStates.includes(partner.firmAddress.state)
      );
    }

    if (searchInput) {
      filteredData = filteredData.filter((partner) =>
        partner.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    setFilteredPartnerData(filteredData);
  }, [selectedSpecializations, selectedStates, searchInput, partnersData]);

  const table = useReactTable({
    data: filteredPartnerData,
    columns,
    state: { sorting, columnFilters, pagination },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  const currentPage = table.getState().pagination.pageIndex;
  const totalRows = table.getCoreRowModel().rows.length;

  const startRow = currentPage * table.getState().pagination.pageSize + 1;
  const endRow = Math.min(
    startRow + table.getState().pagination.pageSize - 1,
    totalRows
  );

  const handleResetFilters = () => {
    setSelectedSpecializations([]);
    setSelectedStates([]);
    setSearchInput('');
    setColumnFilters([]);
    setSorting([]);
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  return (
    <div className='wrapper -mt-10 w-full'>
      <div className='flex items-center justify-center py-4'>
        <Input
          placeholder='Search by CA/CS name'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='z-20 max-w-xl bg-background px-4 py-6 text-base'
        />
      </div>

      <div className='flex flex-col items-center justify-between gap-4 py-2 md:flex-row'>
        {(selectedSpecializations.length > 0 || selectedStates.length > 0) && (
          <div className='flex flex-wrap gap-2'>
            {selectedSpecializations.map((specialization, index) => (
              <Badge key={index} variant='secondary' className='max-w-72 pr-1'>
                <span className='truncate'>{specialization}</span>{' '}
                <Button
                  variant='ghost'
                  size='icon'
                  className='ml-2 size-5 rounded-full p-1'
                  onClick={() =>
                    setSelectedSpecializations(
                      selectedSpecializations.filter(
                        (value) => value !== specialization
                      )
                    )
                  }
                >
                  <RiCloseFill />
                </Button>
              </Badge>
            ))}
            {selectedStates.map((state, index) => (
              <Badge key={index} variant='secondary' className='max-w-72 pr-1'>
                <span>{state}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='ml-2 size-5 rounded-full p-1'
                  onClick={() =>
                    setSelectedStates(
                      selectedStates.filter((value) => value !== state)
                    )
                  }
                >
                  <RiCloseFill />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        <div className='flex gap-2 md:gap-4'>
          {!isDesktop && (
            <Drawer direction='left'>
              <DrawerTrigger className='ml-auto' asChild>
                <Button
                  variant='outline'
                  title='Filter'
                  size='sm'
                  className='gap-1 px-2 py-1 text-xs'
                >
                  Filter <RiFilter2Fill className='text-sm' />
                </Button>
              </DrawerTrigger>
              <DrawerContent className='max-w-80 overflow-y-hidden rounded-none'>
                <aside className='divide-y-2 rounded-md border shadow-md'>
                  <PartnerFilters
                    title='Area of Specialization'
                    options={areaOfSpecializationOptions}
                    searchBar={true}
                    selectedValues={selectedSpecializations}
                    setSelectedValues={setSelectedSpecializations}
                  />
                  <PartnerFilters
                    title='State'
                    options={stateOptions}
                    searchBar={true}
                    selectedValues={selectedStates}
                    setSelectedValues={setSelectedStates}
                  />
                </aside>
              </DrawerContent>
            </Drawer>
          )}

          {(selectedSpecializations.length > 0 ||
            selectedStates.length > 0) && (
            <Button
              variant='outline'
              title='Reset Filters'
              size='sm'
              className='gap-1 px-2 py-1 text-xs'
              onClick={handleResetFilters}
            >
              <RiRestartLine className='text-sm' /> Reset
            </Button>
          )}
        </div>
      </div>

      <div className='mt-2 text-center text-xs text-muted-foreground md:text-sm'>
        Showing {startRow} - {endRow} of {totalRows} records
      </div>

      <div className='mt-2 flex gap-4'>
        {isDesktop && (
          <aside className='mt-2 h-fit w-1/4 min-w-72 divide-y-2 rounded-md border shadow-md'>
            <PartnerFilters
              title='Area of Specialization'
              options={areaOfSpecializationOptions}
              searchBar={true}
              selectedValues={selectedSpecializations}
              setSelectedValues={setSelectedSpecializations}
            />
            <PartnerFilters
              title='State'
              options={stateOptions}
              searchBar={true}
              selectedValues={selectedStates}
              setSelectedValues={setSelectedStates}
            />
          </aside>
        )}
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='border-0 hover:bg-background'
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
                  colSpan={columns.length}
                  className='h-40 text-center'
                >
                  <div className='flex flex-col items-center justify-center'>
                    <p className='text-lg font-medium'>No results found</p>
                    <p className='text-sm text-muted-foreground'>
                      Try adjusting your filters or search criteria
                    </p>
                    <Button
                      variant='outline'
                      title='Reset Filters'
                      size='sm'
                      className='mt-4'
                      onClick={handleResetFilters}
                    >
                      <RiRestartLine className='mr-2 text-sm' /> Reset Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
