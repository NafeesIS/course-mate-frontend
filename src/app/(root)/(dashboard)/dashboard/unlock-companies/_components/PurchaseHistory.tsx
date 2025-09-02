'use client';

import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { RiBuilding2Fill } from 'react-icons/ri';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import { useUserSignInDetails } from '@/store/userStore';
import { useFetchUnlockedCompanies } from '../_hooks/useFetchUnlockedCompanies';
import UpgradeToReport from './UpgradeToReport';

type TCompany = {
  companyId: string;
  companyName: string;
  expiryDate: string;
  unlockedAt: string;
  unlockType: 'report' | 'documents';
};

type TSortColumn = keyof Pick<
  TCompany,
  'companyName' | 'companyId' | 'unlockedAt' | 'expiryDate' | 'unlockType'
>;

export default function PurchaseHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<TSortColumn>('unlockedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'report' | 'documents'>(
    'all'
  );

  const {
    userSignInDetails,
    userSignInDetailsLoading,
    userSignInDetailsError,
  } = useUserSignInDetails();
  const userId = userSignInDetails?.data?._id;
  const {
    data: companies,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchUnlockedCompanies(userId);

  const sortedAndFilteredCompanies = useMemo(() => {
    if (!companies || !companies.length) return [];

    return companies
      .filter((company: TCompany) => {
        const matchesSearch =
          company.companyName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          company.companyId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
          filterType === 'all' || company.unlockType === filterType;

        return matchesSearch && matchesType;
      })
      .sort((a: TCompany, b: TCompany) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [companies, searchTerm, sortColumn, sortDirection, filterType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = sortedAndFilteredCompanies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    sortedAndFilteredCompanies.length / itemsPerPage
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSort = (column: TSortColumn) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (column: TSortColumn) => {
    if (column !== sortColumn)
      return <ArrowUpDown className='ml-2 inline h-3 w-3' />;
    return sortDirection === 'asc' ? (
      <ArrowUp className='ml-2 inline h-3 w-3' />
    ) : (
      <ArrowDown className='ml-2 inline h-3 w-3' />
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  if (userSignInDetailsLoading || isLoading) {
    return (
      <Card className='w-full'>
        <CardContent className='flex h-64 items-center justify-center'>
          <LoadingWithSpinner text='Loading companies...' />
        </CardContent>
      </Card>
    );
  }

  if (userSignInDetailsError || isError) {
    return (
      <Card className='w-full'>
        <CardContent className='flex h-64 items-center justify-center'>
          <div className='text-center text-red-500'>
            <p className='text-base font-semibold'>
              Error: {((userSignInDetailsError || error) as Error).message}
            </p>
            <p className='mt-2 text-sm'>Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full overflow-hidden'>
      <CardHeader className='flex-row items-center justify-between space-y-0 p-4 pb-2 md:p-6 md:pb-3'>
        <div className='flex items-center gap-3'>
          <CardTitle className='text-sm font-semibold md:text-lg'>
            My List
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
            className='h-7 w-7 rounded-full text-foreground/90 hover:text-foreground/100'
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as typeof filterType)}
          >
            <SelectTrigger className='h-8 w-36 text-xs'>
              <SelectValue placeholder='Select type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              <SelectItem value='report'>Reports</SelectItem>
              <SelectItem value='documents'>Documents</SelectItem>
            </SelectContent>
          </Select>

          <div className='relative w-full sm:w-48'>
            <Search className='absolute left-2 top-2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-8 pl-8 text-xs'
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
        <AnimatePresence mode='wait'>
          {companies && companies.length > 0 ? (
            <motion.div
              key='table'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='overflow-x-auto'>
                <Table className='w-full min-w-[640px] text-xs md:text-sm'>
                  <TableHeader>
                    <TableRow className='bg-sky-50'>
                      <TableHead className='w-12'>#</TableHead>
                      <TableHead
                        className='min-w-40 cursor-pointer text-center hover:text-primary'
                        onClick={() => handleSort('companyName')}
                      >
                        Company {renderSortIcon('companyName')}
                      </TableHead>
                      <TableHead
                        className='cursor-pointer whitespace-nowrap'
                        onClick={() => handleSort('unlockedAt')}
                      >
                        Unlocked At {renderSortIcon('unlockedAt')}
                      </TableHead>
                      <TableHead
                        className='cursor-pointer whitespace-nowrap'
                        onClick={() => handleSort('expiryDate')}
                      >
                        Valid Till {renderSortIcon('expiryDate')}
                      </TableHead>
                      <TableHead
                        className='cursor-pointer whitespace-nowrap'
                        onClick={() => handleSort('unlockType')}
                      >
                        Type {renderSortIcon('unlockType')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCompanies.map(
                      (company: TCompany, index: number) => (
                        <TableRow key={company.companyId}>
                          <TableCell className='py-3 align-middle'>
                            {indexOfFirstItem + index + 1}.
                          </TableCell>
                          <TableCell className='py-3 align-top font-medium'>
                            <Link
                              href={`/dashboard/unlock-companies/company-details/${formatToUrl(company.companyName)}/${company.companyId}`}
                              prefetch={false}
                              className='flex items-center gap-4 rounded hover:bg-muted hover:underline'
                            >
                              <div className='flex-center size-8 flex-shrink-0 rounded-full border bg-gray-100'>
                                <RiBuilding2Fill className='size-4 text-gray-600' />
                              </div>
                              <div>
                                <p className='text-sm font-medium'>
                                  {company.companyName.length > 0
                                    ? toCamelCase(company.companyName)
                                    : '-'}
                                </p>
                                <p className='mt-1 text-xs text-muted-foreground'>
                                  CIN: {company.companyId}
                                </p>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className='whitespace-nowrap py-3 align-middle'>
                            <div className='flex items-center gap-1 font-normal'>
                              {/* <CalendarCheck className='inline h-4 w-4 text-muted-foreground' /> */}
                              {format(
                                new Date(company.unlockedAt),
                                'dd-MMM-yyyy'
                              )}
                            </div>
                          </TableCell>
                          <TableCell className='whitespace-nowrap py-3 align-middle'>
                            <div className='flex items-center gap-1 font-normal'>
                              {/* <CalendarClock className='inline h-4 w-4 text-muted-foreground' /> */}
                              {format(
                                new Date(company.expiryDate),
                                'dd-MMM-yyyy'
                              )}
                            </div>
                          </TableCell>
                          <TableCell className='whitespace-nowrap py-3 align-middle'>
                            <div className='flex items-center'>
                              <span
                                className={`rounded px-2 py-1 text-xs font-medium ${
                                  company.unlockType === 'report'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {company.unlockType}
                              </span>
                              {company.unlockType === 'documents' && (
                                <UpgradeToReport
                                  companyId={company.companyId}
                                  companyName={company.companyName}
                                />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>

              {sortedAndFilteredCompanies.length > itemsPerPage && (
                <div className='mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row'>
                  <p className='text-xs text-muted-foreground sm:text-sm'>
                    Showing {indexOfFirstItem + 1} to{' '}
                    {Math.min(
                      indexOfLastItem,
                      sortedAndFilteredCompanies.length
                    )}{' '}
                    of {sortedAndFilteredCompanies.length} Companies
                  </p>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className='h-4 w-4' />
                      <span className='sr-only'>Previous page</span>
                    </Button>
                    <div className='text-sm font-medium'>
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className='h-4 w-4' />
                      <span className='sr-only'>Next page</span>
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key='empty-state'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col items-center justify-center py-12 text-center'
            >
              <Building2 className='mb-4 h-12 w-12 text-muted-foreground' />
              <h3 className='mb-2 text-lg font-semibold'>
                No Companies Unlocked Yet
              </h3>
              <p className='text-sm text-muted-foreground'>
                Use the <span className='font-semibold'>Search Companies</span>{' '}
                bar above to find and unlock the company data you need.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
