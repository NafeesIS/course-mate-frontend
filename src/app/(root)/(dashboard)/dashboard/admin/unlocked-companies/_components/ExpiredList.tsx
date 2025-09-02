'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarCheck,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { RiBuilding2Fill } from 'react-icons/ri';

// Define the Company type
type TCompany = {
  id: number;
  name: string;
  cin: string;
  unlockedAt: string;
  expiredOn: string;
  status: string;
};

// Define valid sort columns
type TSortColumn = keyof Pick<
  TCompany,
  'name' | 'cin' | 'unlockedAt' | 'expiredOn'
>;

// Dummy data
const companies: TCompany[] = [
  {
    id: 1,
    name: 'BADAMI TRADING LLP',
    cin: 'AAF-2332',
    unlockedAt: '2023-05-15',
    expiredOn: '2024-05-15',
    status: 'Active',
  },
  {
    id: 2,
    name: '100 COFOUNDERS LAB LLP',
    cin: 'AAD-9936',
    unlockedAt: '2023-06-01',
    expiredOn: '2024-06-01',
    status: 'Active',
  },
  {
    id: 3,
    name: 'ORSP LLP',
    cin: 'AAA-2347',
    unlockedAt: '2023-04-10',
    expiredOn: '2024-04-10',
    status: 'Active',
  },
  {
    id: 4,
    name: 'SAMIRA VENTURES LLP',
    cin: 'AAN-6047',
    unlockedAt: '2023-04-10',
    expiredOn: '2024-04-10',
    status: 'Active',
  },
  {
    id: 1,
    name: 'BADAMI TRADING LLP',
    cin: 'AAF-2332',
    unlockedAt: '2023-05-15',
    expiredOn: '2024-05-15',
    status: 'Active',
  },
  {
    id: 2,
    name: '100 COFOUNDERS LAB LLP',
    cin: 'AAD-9936',
    unlockedAt: '2023-06-01',
    expiredOn: '2024-06-01',
    status: 'Active',
  },
  {
    id: 3,
    name: 'ORSP LLP',
    cin: 'AAA-2347',
    unlockedAt: '2023-04-10',
    expiredOn: '2024-04-10',
    status: 'Active',
  },
  {
    id: 4,
    name: 'SAMIRA VENTURES LLP',
    cin: 'AAN-6047',
    unlockedAt: '2023-04-10',
    expiredOn: '2024-04-10',
    status: 'Active',
  },
  {
    id: 1,
    name: 'BADAMI TRADING LLP',
    cin: 'AAF-2332',
    unlockedAt: '2023-05-15',
    expiredOn: '2024-05-15',
    status: 'Active',
  },
  {
    id: 2,
    name: '100 COFOUNDERS LAB LLP',
    cin: 'AAD-9936',
    unlockedAt: '2023-06-01',
    expiredOn: '2024-06-01',
    status: 'Active',
  },
  {
    id: 3,
    name: 'ORSP LLP',
    cin: 'AAA-2347',
    unlockedAt: '2023-04-10',
    expiredOn: '2024-04-10',
    status: 'Active',
  },
  {
    id: 4,
    name: 'SAMIRA VENTURES LLP',
    cin: 'AAN-6047',
    unlockedAt: '2023-04-10',
    expiredOn: '2024-04-10',
    status: 'Active',
  },
];

export default function ExpiredUnlocks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<TSortColumn>('unlockedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sort and filter companies
  const sortedAndFilteredCompanies = useMemo(() => {
    return companies
      .filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.cin.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [searchTerm, sortColumn, sortDirection]);

  // Paginate companies
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = sortedAndFilteredCompanies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate total pages
  const totalPages = Math.ceil(
    sortedAndFilteredCompanies.length / itemsPerPage
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle sort
  const handleSort = (column: TSortColumn) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (column: string) => {
    if (column !== sortColumn)
      return <ArrowUpDown className='ml-2 inline size-3' />;
    return sortDirection === 'asc' ? (
      <ArrowUp className='ml-2 inline size-3' />
    ) : (
      <ArrowDown className='ml-2 inline size-3' />
    );
  };

  return (
    <Card className='w-full'>
      <CardHeader className='flex-row items-center justify-between pb-2'>
        <CardTitle className='text-lg font-semibold'>Expired Unlocks</CardTitle>
        <div className='relative w-40'>
          <Search className='absolute left-2 top-2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='h-8 p-1 pl-8'
          />
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        <Table>
          <TableHeader>
            <TableRow className='bg-sky-50'>
              <TableHead></TableHead>
              <TableHead
                className='min-w-40 cursor-pointer hover:text-primary'
                onClick={() => handleSort('name')}
              >
                Company {renderSortIcon('name')}
              </TableHead>
              {/* <TableHead
                className='min-w-36 cursor-pointer'
                onClick={() => handleSort('cin')}
              >
                CIN {renderSortIcon('cin')}
              </TableHead> */}
              <TableHead
                className='cursor-pointer whitespace-nowrap'
                onClick={() => handleSort('unlockedAt')}
              >
                Unlocked At {renderSortIcon('unlockedAt')}
              </TableHead>
              <TableHead
                className='cursor-pointer whitespace-nowrap'
                onClick={() => handleSort('expiredOn')}
              >
                Expired On {renderSortIcon('expiredOn')}
              </TableHead>
              <TableHead className='text-right'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCompanies.map((company, index) => (
              <TableRow key={index}>
                <TableCell className='align-top'>
                  {indexOfFirstItem + index + 1}.
                </TableCell>
                <TableCell className='align-top font-medium'>
                  <Link
                    href={`/dashboard/unlock-companies/company-details/${formatToUrl(company.name)}/${company.cin}`}
                    className='flex items-center gap-3 rounded hover:bg-muted hover:underline'
                  >
                    <div className='flex-center size-6 rounded border bg-gray-300'>
                      <RiBuilding2Fill className='size-4 text-white' />
                    </div>
                    {company.name.length > 0 ? toCamelCase(company.name) : '-'}
                  </Link>
                </TableCell>
                {/* <TableCell className='whitespace-nowrap align-top'>
                  {company.cin}
                </TableCell> */}
                <TableCell className='whitespace-nowrap align-top'>
                  <CalendarCheck className='mr-1.5 inline size-4 text-muted-foreground' />{' '}
                  {company.unlockedAt}
                </TableCell>
                <TableCell className='whitespace-nowrap align-top'>
                  <CalendarClock className='mr-1.5 inline size-4 text-muted-foreground' />{' '}
                  {company.expiredOn}
                </TableCell>
                <TableCell className='text-right align-top'>
                  <Link
                    href={`/dashboard/unlock-companies/company-details/${formatToUrl(company.name)}/${company.cin}`}
                    className='whitespace-nowrap rounded text-xs hover:bg-muted hover:underline'
                  >
                    <span className='flex items-center gap-2'>
                      <LockKeyhole className='inline size-3' />{' '}
                      <span>Renew Access</span>
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* pagination */}
        {sortedAndFilteredCompanies.length > itemsPerPage && (
          <div className='mt-4 flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              Showing {indexOfFirstItem + 1} to{' '}
              {Math.min(indexOfLastItem, sortedAndFilteredCompanies.length)} of{' '}
              {sortedAndFilteredCompanies.length} Companies
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
      </CardContent>
    </Card>
  );
}
