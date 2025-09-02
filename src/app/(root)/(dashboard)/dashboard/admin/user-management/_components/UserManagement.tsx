'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { IoPersonSharp, IoSearchSharp } from 'react-icons/io5';
import { RiLoopLeftLine } from 'react-icons/ri';
import { RxReset } from 'react-icons/rx';
import { getAllUsersDetails } from '../_services/services';
import { IUserDocument } from '../_types/types';
import BulkUnlockDetailsDialog from './BulkUnlockDetailsDialog';
import OrderDetailsDialog from './OrderDetailsDialog';
import SubscriptionDetailsDialog from './SubscriptionDetailsDialog';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<'timeJoined' | 'lastLogin' | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const {
    data: usersData,
    isLoading,
    refetch,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['users', page, limit, debouncedSearch],
    queryFn: () =>
      getAllUsersDetails({
        page,
        limit,
        name: debouncedSearch,
        email: debouncedSearch,
        phone: debouncedSearch,
      }),
    gcTime: 1000 * 60 * 10, // 1 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });
  const totalPages = usersData?.totalPages || 0;
  const totalUsers = usersData?.totalUsers || 0;

  const users = useMemo(() => {
    if (!usersData?.users) return [];

    const sortedUsers = [...usersData.users];

    if (sortField) {
      sortedUsers.sort((a, b) => {
        const dateA = a[sortField] ? new Date(a[sortField]) : null;
        const dateB = b[sortField] ? new Date(b[sortField]) : null;

        if (!dateA) return sortDirection === 'asc' ? 1 : -1;
        if (!dateB) return sortDirection === 'asc' ? -1 : 1;

        return sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    }

    return sortedUsers;
  }, [usersData, sortField, sortDirection]);

  const handleSearch = () => {
    const firstWord = searchQuery.split(' ')[0];
    setPage(1);
    setDebouncedSearch(firstWord);
  };

  const handleRefetch = () => {
    setSearchQuery('');
    refetch();
  };

  const handleReset = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setPage(1);
    setLimit(10);
    setSortField(null);
    setSortDirection('asc');
  };

  const handleSort = (field: 'timeJoined' | 'lastLogin') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const limitOptions = [5, 10, 20, 50];

  const renderTableContent = () => {
    if (isLoading || isFetching) {
      return (
        <TableRow>
          <TableCell colSpan={10} className='h-[400px] text-center'>
            <LoadingWithSpinner />
          </TableCell>
        </TableRow>
      );
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={10} className='text-center text-red-500'>
            Failed to load user data. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

    if (users.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={10} className='p-4 text-center'>
            No users found.
          </TableCell>
        </TableRow>
      );
    }

    return users.map((user: IUserDocument, index: number) => (
      <TableRow
        key={user._id}
        className={`divide-x ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
      >
        <TableCell className='p-3'>
          {user?.profilePicture ? (
            <Image
              width={36}
              height={36}
              src={user?.profilePicture}
              alt={user.meta_data?.firstName || 'Profile Picture'}
              quality={100}
              className='size-9 min-w-9 rounded-full ring-2'
            />
          ) : (
            <IoPersonSharp className='size-9 min-w-9 rounded-full bg-[#AECBFA] pt-1 text-[#3F6CE1]' />
          )}
        </TableCell>
        <TableCell className='p-3'>
          {`${user.meta_data?.firstName ?? ''} ${user.meta_data?.lastName ?? ''}`.trim() ||
            'N/A'}
        </TableCell>
        <TableCell className='p-3'>{user.emails?.[0] || 'N/A'}</TableCell>
        <TableCell className='p-3'>
          {user.meta_data?.mobileNumber || 'N/A'}
        </TableCell>
        <TableCell className='p-3 text-center'>
          <OrderDetailsDialog
            orders={user.orders}
            userId={user._id}
            title={`${user.emails?.[0]}`}
          />
        </TableCell>
        <TableCell className='p-3 text-center'>
          <SubscriptionDetailsDialog
            subscriptions={user.subscriptions}
            userId={user._id}
            title={`${user.emails?.[0]}`}
          />
        </TableCell>
        <TableCell className='p-3 text-center'>
          <BulkUnlockDetailsDialog
            data={user.bulk_unlock_credits}
            userId={user._id}
            title={`${user.emails?.[0]}`}
          />
        </TableCell>
        <TableCell className='whitespace-nowrap p-3'>
          {user.timeJoined
            ? format(new Date(user.timeJoined), 'dd-MMM-yyyy')
            : 'N/A'}
        </TableCell>
        <TableCell className='whitespace-nowrap p-3'>
          {user.lastLogin
            ? format(new Date(user.lastLogin), 'dd-MMM-yyyy')
            : 'N/A'}
        </TableCell>
        <TableCell className='flex justify-center whitespace-nowrap p-3'>
          <Link
            href={`user-management/${user._id}`}
            className='p-2 text-primary transition-colors duration-200 hover:text-blue-600'
          >
            <AiOutlineFileSearch className='h-5 w-5' />
          </Link>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card className='p-3 md:p-5 lg:p-6'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='rounded-lg bg-blue-50 p-2'>
            <Users className='h-6 w-6 text-blue-600' />
          </div>
          <div className='space-y-0.5'>
            <h2 className='text-lg font-semibold lg:text-xl'>
              User Management
            </h2>
            <p className='flex items-center gap-2 text-sm text-gray-500'>
              Total Users: {totalUsers || 0}
              <Button
                size='icon'
                variant='outline'
                className='h-7 hover:bg-primary hover:text-white'
                onClick={handleRefetch}
                disabled={isFetching}
              >
                <RiLoopLeftLine className={isFetching ? 'animate-spin' : ''} />
              </Button>
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 justify-self-end md:gap-4'>
          <div className='flex flex-wrap items-center gap-2 sm:flex-nowrap md:whitespace-nowrap'>
            <Select
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className='max-w-36 rounded-none'>
                <SelectValue placeholder='Limit' />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((limitOption) => (
                  <SelectItem key={limitOption} value={limitOption.toString()}>
                    {limitOption} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='relative w-60 sm:w-64 lg:w-[350px]'>
              <Input
                placeholder='Search Name, email, Phone'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-l-md rounded-r-full ${searchQuery ? 'pr-20' : 'pr-10'}`}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />

              <div className='absolute right-0 top-0 flex h-full items-center gap-1 bg-transparent pr-3'>
                {searchQuery && (
                  <button
                    className='bg-transparent text-gray-400 transition-colors hover:text-gray-600'
                    onClick={handleReset}
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  className={`translate-x-2 rounded-full p-1.5 ${
                    searchQuery.trim()
                      ? 'cursor-pointer bg-primary hover:bg-blue-600'
                      : 'cursor-not-allowed bg-gray-200'
                  }`}
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                >
                  <IoSearchSharp
                    className={
                      searchQuery.trim() ? 'text-white' : 'text-gray-400'
                    }
                    size={16}
                  />
                </button>
              </div>
            </div>
            <Button
              size='icon'
              variant='outline'
              onClick={handleReset}
              className='h-9 duration-300 hover:bg-primary hover:text-white'
            >
              <RxReset />
            </Button>
          </div>
        </div>
      </div>

      <Table className='rounded-md border text-xs sm:text-sm'>
        <TableHeader>
          <TableRow className='divide-x bg-muted'>
            {[
              '#DP',
              'Name',
              'Email',
              'Phone',
              'Orders',
              'Subscriptions',
              'Bulk Credits',
              'Joined Date',
              'Last Login',
              'Actions',
            ].map((label) => (
              <TableHead
                key={label}
                className='whitespace-nowrap p-3 text-left'
              >
                {['Joined Date', 'Last Login'].includes(label) ? (
                  <button
                    className='flex items-center gap-1'
                    onClick={() =>
                      handleSort(
                        label === 'Joined Date' ? 'timeJoined' : 'lastLogin'
                      )
                    }
                  >
                    {label}
                    {sortField ===
                    (label === 'Joined Date' ? 'timeJoined' : 'lastLogin')
                      ? sortDirection === 'asc'
                        ? ' ↑'
                        : ' ↓'
                      : ' ↕'}
                  </button>
                ) : (
                  label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableContent()}</TableBody>
      </Table>

      <Pagination className='mt-4'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              onClick={(e) => {
                e.preventDefault();
                setPage(Math.max(page - 1, 1));
              }}
              className={`p-1 text-[10px] sm:p-2 sm:text-sm ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= page - 1 && pageNumber <= page + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    className='h-auto w-auto px-1.5 py-1 text-[10px] sm:px-2.5 sm:py-1.5 sm:text-sm'
                    href='#'
                    isActive={page === pageNumber}
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

            if (pageNumber === page - 2 || pageNumber === page + 2) {
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
                setPage(Math.min(page + 1, totalPages));
              }}
              className={`p-1 text-[10px] sm:p-2 sm:text-sm ${
                page === totalPages ? 'pointer-events-none opacity-50' : ''
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Card>
  );
};

export default UserManagement;
