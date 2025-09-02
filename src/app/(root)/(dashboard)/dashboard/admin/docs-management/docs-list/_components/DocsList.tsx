'use client';

import { Doc } from '@/app/(root)/docs/_types/types';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { BASE_URL_FRONTEND } from '@/constants';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from 'date-fns';
import { Edit, FileText, RefreshCw, Search, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { FcPlus } from 'react-icons/fc';
import { toast } from 'sonner';
import { deleteDocs, getAllDocs, updateDoc } from '../_services/services';
// import CreateDocsDialog from './CreateDocsDialog';
import DeleteDocsDialog from './DeleteDocsDialog';
import DocsPagination from './DocsPagination';
import { UpdateDocsFormData } from './UpdateDocForm';
import UpdateDocsDialog from './UpdateDocsDialog';

type SortField = 'createdAt' | 'updatedAt';
type SortOrder = 'asc' | 'desc';

const DocsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>('updatedAt');
  const [sort, setSort] = useState<SortOrder>('desc');
  const [searchInput, setSearchInput] = useState(''); // Input value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search query for API
  // const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<Doc | null>(null);
  // const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  // Use your actual API with useQuery
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['docs', page, limit, sort, sortBy, searchQuery, statusFilter],
    queryFn: () =>
      getAllDocs({
        page,
        limit,
        sort,
        sortBy,
        search: searchQuery || undefined,
        status: statusFilter,
      }),
    // gcTime: 1000 * 60 * 10, // 10 minute
    // staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });

  const docs = data?.data || [];
  const meta = data?.meta;

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      // Toggle sort order if same field
      setSort(sort === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default desc order
      setSortBy(field);
      setSort('desc');
    }
    setPage(1); // Reset to first page when sorting
  };

  // Limit change handler
  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1); // Reset to first page when limit changes
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1); // Reset to first page when status changes
  };

  // Search input change handler
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Execute search
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setPage(1); // Reset to first page when searching
  };

  // Handle Enter key press
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  };

  // Handler functions
  // const handleCreateDocs = async (formData: CreateDocsFormData) => {
  //   setIsCreating(true);

  //   try {
  //     await createDocs(formData);
  //     toast.success('Docs created successfully!');
  //     setCreateDialogOpen(false);
  //     refetch();
  //   } catch (error: unknown) {
  //     const message =
  //       error instanceof Error
  //         ? error.message
  //         : 'Failed to create doc. Please try again.';
  //     toast.error(message, { duration: 10000 });
  //   } finally {
  //     setIsCreating(false);
  //   }
  // };

  const handleUpdateDocs = async (data: UpdateDocsFormData) => {
    if (!selectedDocs) return;
    setIsUpdating(true);
    try {
      await updateDoc(selectedDocs._id, data);
      toast.success('Docs updated successfully!');
      setUpdateDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update doc. Please try again.';
      toast.error(message, { duration: 10000 });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteDocs = async () => {
    if (!selectedDocs) return;
    setIsDeleting(true);
    try {
      await deleteDocs(selectedDocs._id);
      toast.success('Docs deleted successfully!');
      setDeleteDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete doc. Please try again.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // const handleEditClick = (doc: Doc) => {
  //   setSelectedDocs(doc);
  //   setUpdateDialogOpen(true);
  // };

  const handleDeleteClick = (doc: Doc) => {
    setSelectedDocs(doc);
    setDeleteDialogOpen(true);
  };

  if (isError) {
    return (
      <Card className='mx-auto mt-10 max-w-3xl'>
        <CardContent className='p-6 text-center'>
          <FileText className='mx-auto h-12 w-12 text-muted-foreground opacity-50' />
          <h3 className='mt-4 text-lg font-semibold'>Failed To Fetch Docs</h3>
          <p className='text-sm text-muted-foreground'>
            Please reload the page or try again later
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900 md:text-2xl'>
                Docs Management
              </h2>
              <div className='flex items-center gap-2'>
                <p className='mt-1 hidden text-sm text-gray-600 sm:block'>
                  Manage your {meta?.total || 'All'} documentations
                </p>
                <Button
                  size='icon'
                  variant='outline'
                  className='h-6 hover:bg-primary hover:text-white'
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw
                    className={cn(
                      'h-3 w-3 text-xs',
                      isFetching && 'animate-spin'
                    )}
                  />
                </Button>
              </div>
            </div>
            <Link
              href='/dashboard/admin/docs-management/create-docs'
              className='flex h-9 items-center rounded-md border px-2.5 shadow-sm duration-200 hover:bg-slate-200'
            >
              <FcPlus className='mr-2 h-5 w-5' />
              Docs
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and Filters */}
          <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex max-w-md flex-1 gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  placeholder='Search docs...'
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchKeyDown}
                  className='pl-10'
                />
              </div>
              <Button
                onClick={handleSearch}
                variant='outline'
                className='h-9 bg-primary px-3 text-white duration-200 hover:bg-blue-900 hover:text-white'
              >
                <Search className='h-4 w-4' />
              </Button>
              {searchQuery && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleClearSearch}
                  className='px-3'
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-600 lg:text-sm'>
                  Status:
                </span>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className='w-20 xs:w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='published'>Published</SelectItem>
                    <SelectItem value='draft'>Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-600 lg:text-sm'>Show:</span>
                <Select
                  value={limit.toString()}
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className='w-20'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='5'>5</SelectItem>
                    <SelectItem value='10'>10</SelectItem>
                    <SelectItem value='20'>20</SelectItem>
                    <SelectItem value='50'>50</SelectItem>
                    <SelectItem value='100'>100</SelectItem>
                  </SelectContent>
                </Select>
                <span className='hidden text-xs text-gray-600 sm:block lg:text-sm'>
                  per page
                </span>
              </div>
            </div>
          </div>

          {/* Results Info */}
          {/* {meta && (
            <div className='mb-4 text-sm text-gray-600'>
              {searchQuery ? (
                <span>
                  Found {meta.total} result
                  {meta.total !== 1 ? 's' : ''} for {searchQuery}
                </span>
              ) : (
                <span>
                  Showing {meta.total} doc
                  {meta.total !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )} */}

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Meta Title</TableHead>
                  {/* <TableHead>Meta Description</TableHead> */}
                  {/* <TableHead>Description</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button
                      variant='ghost'
                      onClick={() => handleSort('createdAt')}
                      className='h-auto p-0 font-medium hover:bg-transparent'
                    >
                      Created
                      {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
                      {sortBy === 'createdAt' && (
                        <span className='ml-1 text-xs'>
                          {sort === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant='ghost'
                      onClick={() => handleSort('updatedAt')}
                      className='h-auto p-0 font-medium hover:bg-transparent'
                    >
                      Updated
                      {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
                      {sortBy === 'updatedAt' && (
                        <span className='ml-1 text-xs'>
                          {sort === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-8 text-center'>
                      <LoadingWithSpinner />
                    </TableCell>
                  </TableRow>
                ) : docs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-8 text-center'>
                      <div className='text-gray-500'>
                        {searchQuery
                          ? `No docs found matching "${searchQuery}"`
                          : 'No docs found. Create your first doc to get started.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  docs.map((doc) => (
                    <TableRow key={doc._id} className='hover:bg-gray-50'>
                      <TableCell className='font-medium'>
                        {doc.status === 'published' ? (
                          <Link
                            className='hover:text-primary'
                            href={`${BASE_URL_FRONTEND}/docs/${doc.categoryId?.slug}/${doc?.slug}`}
                          >
                            {doc.title}
                          </Link>
                        ) : (
                          doc.title
                        )}
                      </TableCell>

                      <TableCell className='text-gray-500'>
                        {doc?.slug}
                      </TableCell>
                      <TableCell className='text-gray-500'>
                        {doc.metaTitle}
                      </TableCell>
                      {/* <TableCell className='text-gray-500'>
                        {doc.metaDescription}
                      </TableCell>
                      <TableCell className='text-gray-500'>
                        {doc.description}
                      </TableCell> */}
                      <TableCell className='text-gray-500'>
                        {doc.status}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-gray-500'>
                        {formatDate(doc.createdAt, 'dd-MMM-yyyy')}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-gray-500'>
                        {formatDate(doc.updatedAt, 'dd-MMM-yyyy')}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end space-x-2'>
                          <Link
                            href={`/dashboard/admin/docs-management/update-docs/${doc?.slug}`}
                          >
                            <Button
                              variant='ghost'
                              size='sm'
                              // onClick={() => handleEditClick(doc)}
                              className='h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-900'
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                          </Link>

                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteClick(doc)}
                            className='h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-900'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && meta.total > 1 && (
            <div className='mt-6'>
              <DocsPagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {/* <CreateDocsDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateDocs}
        isLoading={isCreating}
      /> */}

      <UpdateDocsDialog
        isOpen={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        onSubmit={handleUpdateDocs}
        isLoading={isUpdating}
        doc={selectedDocs}
      />

      <DeleteDocsDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteDocs}
        isLoading={isDeleting}
        docs={selectedDocs}
      />
    </div>
  );
};

export default DocsList;
