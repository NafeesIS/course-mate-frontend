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
import { formatCurrency } from '../../user-management/[...slug]/_components/OrdersTab';
import { formatUnlockCredits } from '../../user-management/_components/OrderDetailsDialog';
import { TOrderItem } from '../_types/types';

const ItemsDialog = ({
  items,
  title,
}: {
  items: TOrderItem[];
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

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Ensure currentPage stays within valid range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-7 px-2 text-xs lg:text-sm'
        >
          View Items
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
          {Array.isArray(items) && items.length > 0 ? (
            <div className='max-h-[70vh] w-full overflow-auto'>
              <table className='w-full table-auto text-xs lg:text-sm'>
                <thead className='sticky top-0 z-10 w-full whitespace-nowrap'>
                  <tr className='w-full divide-x divide-border bg-gray-100'>
                    <th className='p-3 text-left'>#</th>
                    <th className='p-3 text-left'>Service Name</th>
                    <th className='p-3 text-left'>Service Type</th>
                    <th className='p-3 text-left'>Unlocked Credits</th>
                    <th className='p-3 text-left'>Plan</th>
                    <th className='p-3 text-center'>Quantity</th>
                    <th className='p-3 text-right'>Price</th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  {paginatedItems.map((item, index) => (
                    <tr
                      key={index}
                      className='w-full divide-x border-t hover:bg-gray-50'
                    >
                      <td className='p-3'>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className='p-3'>{item.serviceName}</td>
                      <td className='p-3'>{item.serviceType || '-'}</td>
                      <td className='flex flex-col justify-start gap-1 p-3'>
                        <span>
                          {formatUnlockCredits(
                            item.customAttributes?.bulkUnlockCredits,
                            item.customAttributes?.companyUnlockCredits
                          )}
                        </span>
                        <span className='text-[10px] text-muted-foreground'>
                          {item.customAttributes?.companyId
                            ? `CIN: ${item.customAttributes?.companyId}`
                            : ''}
                        </span>
                      </td>
                      <td className='p-3'>
                        {item.customAttributes?.plan || '-'}
                      </td>
                      <td className='p-3 text-center'>{item.quantity}</td>
                      <td className='p-3 text-right'>
                        {formatCurrency(item.price, item.currency)}
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
        {items && items.length > 0 && (
          <div className='mb-2 flex flex-col items-center justify-between px-0 sm:flex-row sm:gap-2 lg:px-6'>
            <div className='hidden whitespace-nowrap text-xs text-gray-500 sm:block'>
              Showing{' '}
              {items.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
              {Math.min(currentPage * itemsPerPage, items.length)} of{' '}
              {items.length} items
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                    className={`p-1 text-[10px] lg:p-2 lg:text-sm ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      className='h-auto w-auto px-1.5 py-1 text-[10px] lg:px-2.5 lg:py-1.5 lg:text-sm'
                      href='#'
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                    className={`p-1 text-[10px] lg:p-2 lg:text-sm ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
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

export default ItemsDialog;
