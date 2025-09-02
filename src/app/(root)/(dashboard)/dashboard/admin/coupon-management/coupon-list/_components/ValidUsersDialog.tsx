'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useEffect, useMemo, useState } from 'react';
import { TCouponUser } from '../_types/types';

const ValidUsersDialog = ({
  validUsers,
  title,
}: {
  validUsers: TCouponUser[];
  title: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Reset page to 1 when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
  };

  const totalPages = Math.max(1, Math.ceil(validUsers.length / itemsPerPage));

  // Ensure currentPage stays within valid range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return validUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [validUsers, currentPage, itemsPerPage]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-7 px-2 text-xs lg:text-sm'
        >
          View Users
        </Button>
      </DialogTrigger>
      <DialogContent className='p-2 sm:min-w-[640px] md:min-w-[768px] lg:w-[1000px] lg:min-w-[1000px] lg:p-0'>
        <DialogHeader>
          <DialogTitle className='text-center'>
            <DialogDescription className='mt-2 text-base font-semibold text-black lg:text-lg'>
              {title}
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <Card className='no-scrollbar mx-auto w-full overflow-scroll rounded-md lg:w-[96%] lg:max-w-6xl'>
          {Array.isArray(validUsers) && validUsers.length > 0 ? (
            <div className='max-h-[70vh] w-full overflow-auto'>
              <table className='w-full table-auto text-xs lg:text-sm'>
                <thead className='sticky top-0 z-10 w-full whitespace-nowrap'>
                  <tr className='w-full divide-x divide-border bg-gray-100'>
                    <th className='p-3 text-left'>#</th>
                    <th className='p-3 text-left'>Name</th>
                    <th className='p-3 text-left'>Email</th>
                    <th className='p-3 text-left'>Phone Number</th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  {paginatedItems.map((user, index) => (
                    <tr
                      key={index}
                      className='w-full divide-x border-t hover:bg-gray-50'
                    >
                      <td className='p-3'>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      {/* Use .trim() to ensure values aren't just whitespace; show '-' if empty or blank */}
                      <td className='p-3'>
                        {user.name && user.name.trim() ? user.name : '-'}
                      </td>
                      <td className='p-3'>
                        {user.email && user.email.trim() ? user.email : '-'}
                      </td>
                      <td className='p-3'>
                        {user.mobileNumber && user.mobileNumber.trim()
                          ? user.mobileNumber
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='p-3 text-center text-muted-foreground'>
              No items available
            </p>
          )}
        </Card>
        {validUsers && validUsers.length > 0 && (
          <div className='mb-2 flex flex-col items-center justify-between px-0 sm:flex-row sm:gap-2 lg:px-6'>
            <div className='hidden whitespace-nowrap text-xs text-gray-500 sm:block'>
              Showing{' '}
              {validUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}{' '}
              - {Math.min(currentPage * itemsPerPage, validUsers.length)} of{' '}
              {validUsers.length} items
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(Math.max(currentPage - 1, 1));
                    }}
                    className={`p-1 text-[10px] sm:p-2 sm:text-sm ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNumber = i + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          className='h-auto w-auto px-1.5 py-1 text-[10px] sm:px-2.5 sm:py-1.5 sm:text-sm'
                          href='#'
                          isActive={currentPage === pageNumber}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
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
                      setCurrentPage(Math.min(currentPage + 1, totalPages));
                    }}
                    className={`p-1 text-[10px] sm:p-2 sm:text-sm ${
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className='hidden justify-end whitespace-nowrap sm:flex'>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-500 lg:text-sm'>
                  Items per page:
                </span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className='h-7 w-16 text-xs lg:text-sm'>
                    <SelectValue placeholder={String(itemsPerPage)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='3'>3</SelectItem>
                    <SelectItem value='5'>5</SelectItem>
                    <SelectItem value='10'>10</SelectItem>
                    <SelectItem value='20'>20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ValidUsersDialog;
