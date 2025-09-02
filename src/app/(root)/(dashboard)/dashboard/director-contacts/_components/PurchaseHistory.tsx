'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatName, toCamelCase } from '@/lib/formatters';
import { useUserSignInDetails } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  CopyIcon,
  Info,
  MailOpen,
  PhoneIcon,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchUnlockedContacts } from '../_services/services';

const PurchaseHistory = () => {
  const { userSignInDetails } = useUserSignInDetails();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      'unlockedContacts',
      userSignInDetails?.data._id ?? '',
      page,
      limit,
      'unlockedAt',
      sortOrder,
      debouncedSearchTerm,
    ],
    queryFn: fetchUnlockedContacts,
    enabled: !!userSignInDetails?.data._id,
    refetchOnWindowFocus: false,
    retry: 3,
    staleTime: 1000 * 60 * 1, // 1 minutes
  });

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const contacts = data?.data.unlockedContacts || [];
  const hasPurchases = contacts.length > 0;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPage(1); // Reset to first page when sort changes
  }, []);

  return (
    <div>
      {/* Responsive Table */}
      <Card className='overflow-x-auto'>
        <CardHeader className='p-4 md:p-6'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
              <div className='flex items-center gap-2'>
                <CardTitle className='text-sm md:text-base'>
                  Purchase History
                </CardTitle>
                <Button
                  title='Refresh'
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    setIsRefreshing(true);
                    refetch().finally(() => setIsRefreshing(false));
                  }}
                  disabled={isLoading || isRefreshing}
                  className='h-5 w-5 text-foreground/90 hover:text-foreground/100'
                >
                  <RefreshCw
                    className={`size-2.5 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                </Button>
              </div>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search by name or DIN...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-8 pr-8'
                />
                {searchTerm && (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='absolute right-1 top-1.5 h-6 w-6 hover:bg-transparent'
                    onClick={() => setSearchTerm('')}
                  >
                    <X className='h-4 w-4 text-muted-foreground' />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
          <Table className='w-full border-collapse divide-y'>
            <TableHeader>
              <TableRow className='bg-muted text-xs text-muted-foreground lg:text-sm'>
                <TableHead className='hidden p-2 text-left sm:table-cell'>
                  #
                </TableHead>
                <TableHead className='p-2 text-left'>Name</TableHead>
                <TableHead className='hidden p-2 text-left lg:table-cell'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='flex w-full items-center gap-1'
                    onClick={toggleSortOrder}
                  >
                    <span>Unlocked At</span>
                    <span>
                      {sortOrder === 'asc' ? (
                        <SortAsc className='h-3 w-3' />
                      ) : (
                        <SortDesc className='h-3 w-3' />
                      )}
                    </span>
                  </Button>
                </TableHead>
                <TableHead className='p-2 text-left'>Contact Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='text-xs lg:text-sm'>
              {
                // if loading
                isLoading || (!data && !isError) ? (
                  <TableRow>
                    <TableCell colSpan={4} className='py-2'>
                      <div className='h-40 bg-sky-50'>
                        <LoadingWithSpinner className='h-full' />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : // if error
                isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className='h-40'>
                      <Info className='mx-auto size-6 text-red-500' />
                      <p className='mt-2 text-sm text-red-500'>
                        An error occurred while fetching your purchase history.{' '}
                        <br />
                        Please try again later.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : // if no data
                contacts.length === 0 || !contacts ? (
                  <TableRow>
                    <TableCell colSpan={4} className='py-10 text-center'>
                      <div className='flex flex-col items-center justify-center rounded-lg border bg-sky-50 p-4'>
                        <p className='text-xl font-semibold text-gray-800'>
                          {searchTerm ? 'No results found' : 'No purchases yet'}
                        </p>
                        <p className='mt-2 max-w-xs text-sm text-gray-600'>
                          {searchTerm
                            ? `No purchases found matching "${searchTerm}". Try a different search term.`
                            : "You haven't unlocked any director's contact information yet. Start searching for companies or directors to unlock contact details."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // if data
                  contacts.map((contact, index) => (
                    <TableRow key={index} className='border-b'>
                      <TableCell className='hidden px-2 py-3 sm:table-cell'>
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className='space-y-1.5 px-2 py-3'>
                        <div className='font-medium'>
                          {contact.fullName && contact.fullName.length > 0
                            ? toCamelCase(formatName(contact.fullName))
                            : '-'}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          DIN:{' '}
                          {contact.directorId && contact.directorId.length > 0
                            ? contact.directorId
                            : '-'}
                        </div>
                        <div className='text-[10px] text-muted-foreground lg:hidden'>
                          Unlocked at:{' '}
                          {contact.unlockedAt && contact.unlockedAt.length > 0
                            ? format(
                                new Date(contact.unlockedAt),
                                'dd-MMM-yyyy'
                              )
                            : '-'}
                        </div>
                      </TableCell>
                      <TableCell className='hidden px-2 py-3 text-center lg:table-cell'>
                        {contact.unlockedAt && contact.unlockedAt.length > 0
                          ? format(new Date(contact.unlockedAt), 'dd-MMM-yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell className='px-2 py-3'>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between gap-2'>
                            <div className='flex items-center'>
                              <PhoneIcon className='mr-1.5 size-3 text-muted-foreground lg:mr-2 lg:size-4' />
                              {contact.mobileNumber &&
                              contact.mobileNumber.length > 0 ? (
                                <a
                                  href={`tel:${contact.mobileNumber}`}
                                  className='hover:underline'
                                >
                                  {contact.mobileNumber}
                                </a>
                              ) : (
                                <span className='text-muted-foreground'>
                                  Not available
                                </span>
                              )}
                            </div>
                            {contact.mobileNumber &&
                              contact.mobileNumber.length > 0 && (
                                <button
                                  title='Copy phone number'
                                  onClick={() =>
                                    copyToClipboard(
                                      contact.mobileNumber,
                                      'Phone number'
                                    )
                                  }
                                  className='text-muted-foreground hover:text-foreground'
                                >
                                  <CopyIcon className='size-3 lg:size-4' />
                                </button>
                              )}
                          </div>
                          <div className='flex items-center justify-between gap-2'>
                            <div className='flex items-center'>
                              <MailOpen className='mr-1.5 size-3 text-muted-foreground lg:mr-2 lg:size-4' />
                              <span>
                                {contact.emailAddress &&
                                contact.emailAddress.length > 0 ? (
                                  <a
                                    href={`mailto:${contact.emailAddress.toLowerCase()}`}
                                    className='hover:underline'
                                  >
                                    {contact.emailAddress}
                                  </a>
                                ) : (
                                  <span className='text-muted-foreground'>
                                    Not available
                                  </span>
                                )}
                              </span>
                            </div>
                            {contact.emailAddress &&
                              contact.emailAddress.length > 0 && (
                                <button
                                  title='Copy email address'
                                  onClick={() =>
                                    copyToClipboard(
                                      contact.emailAddress.toLowerCase(),
                                      'Email address'
                                    )
                                  }
                                  className='text-muted-foreground hover:text-foreground'
                                >
                                  <CopyIcon className='size-3 lg:size-4' />
                                </button>
                              )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )
              }
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className='flex items-center justify-center'>
          {hasPurchases && data?.data.pagination && (
            <motion.div variants={itemVariants}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.max(page - 1, 1));
                      }}
                      className={
                        page === 1 ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>
                  {(() => {
                    const totalPages = data.data.pagination.totalPages;
                    const pages = [];
                    const maxVisiblePages = 5;

                    if (totalPages <= maxVisiblePages) {
                      // Show all pages if total pages are 5 or less
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationLink
                              href='#'
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(i);
                              }}
                              isActive={page === i}
                            >
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    } else {
                      // Always show first page
                      pages.push(
                        <PaginationItem key={1}>
                          <PaginationLink
                            href='#'
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(1);
                            }}
                            isActive={page === 1}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      );

                      // Calculate range of pages to show
                      let startPage = Math.max(2, page - 1);
                      let endPage = Math.min(totalPages - 1, page + 1);

                      // Adjust range if we're near the start or end
                      if (page <= 3) {
                        endPage = 4;
                      } else if (page >= totalPages - 2) {
                        startPage = totalPages - 3;
                      }

                      // Add ellipsis after first page if needed
                      if (startPage > 2) {
                        pages.push(
                          <PaginationItem key='start-ellipsis'>
                            <span className='px-2'>...</span>
                          </PaginationItem>
                        );
                      }

                      // Add middle pages
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationLink
                              href='#'
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(i);
                              }}
                              isActive={page === i}
                            >
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Add ellipsis before last page if needed
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <PaginationItem key='end-ellipsis'>
                            <span className='px-2'>...</span>
                          </PaginationItem>
                        );
                      }

                      // Always show last page
                      pages.push(
                        <PaginationItem key={totalPages}>
                          <PaginationLink
                            href='#'
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(totalPages);
                            }}
                            isActive={page === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    return pages;
                  })()}
                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(
                          Math.min(page + 1, data.data.pagination.totalPages)
                        );
                      }}
                      className={
                        page === data.data.pagination.totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PurchaseHistory;
