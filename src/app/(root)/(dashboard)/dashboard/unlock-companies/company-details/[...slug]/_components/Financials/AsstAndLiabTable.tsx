'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toCamelCase } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  CornerDownRight,
  FileText,
  Filter,
  IndianRupee,
  Info,
  RotateCcw,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import {
  IFinancialAssets,
  IFinancialDocsApiResponse,
  IFinancialLiabilities,
} from '../../_types/FinancialDocsDataType';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './CustomTable';
import {
  formatFinancialsCurrency,
  renderPercentageChange,
  truncateMiddle,
} from './utils/formatters';

// Dynamically import the SmallTrendChart with SSR disabled
const SmallTrendChart = dynamic(
  () => import('./SmallTrendChart').then((mod) => mod.SmallTrendChart),
  {
    ssr: false,
    loading: () => (
      <div className='h-10 w-full animate-pulse rounded bg-muted/50' />
    ),
  }
);

export default function AsstAndLiabTable({
  financialDocsData,
  years,
  unit,
}: {
  financialDocsData: IFinancialDocsApiResponse;
  years: string[];
  unit: 'raw' | 'lakhs' | 'crores';
}) {
  const tableRef = useRef<HTMLDivElement>(null);
  const sortedYears = [...years].sort((a, b) => Number(a) - Number(b));
  const [showLeftArrow, setShowLeftArrow] = useState(true);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [filteredYears, setFilteredYears] = useState(sortedYears);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const scrollTable = (direction: 'left' | 'right') => {
    if (tableRef.current) {
      const scrollAmount = 200;
      const targetScroll =
        tableRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      tableRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
      // Scroll to the right end by default
      tableElement.scrollLeft = tableElement.scrollWidth;
      handleScroll();
      return () => tableElement.removeEventListener('scroll', handleScroll);
    }
  }, [filteredYears]);

  const handleYearToggle = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year)
        ? prev.filter((y) => y !== year)
        : [...prev, year].sort((a, b) => Number(a) - Number(b))
    );
  };

  const applyFilter = () => {
    setFilteredYears(selectedYears.length > 0 ? selectedYears : sortedYears);
    setIsOpen(false); // close the popover
  };

  const resetFilter = () => {
    setSelectedYears([]);
    setFilteredYears(sortedYears);
    setSearchTerm('');
    setIsOpen(false);
  };

  const filteredSortedYears = sortedYears.filter(
    (year) => year.includes(searchTerm) || `FY ${year}`.includes(searchTerm)
  );

  // Function to get data for the line chart
  const getLineChartData = (key: string) => {
    return filteredYears.map((year) => ({
      year,
      value:
        financialDocsData.data[year].assets[
          key as keyof (typeof financialDocsData.data)[typeof year]['assets']
        ] ||
        financialDocsData.data[year].liabilities[
          key as keyof (typeof financialDocsData.data)[typeof year]['liabilities']
        ] ||
        0,
    }));
  };

  return (
    <Card className='mt-4 w-full md:mt-4'>
      <CardHeader className='p-3 md:p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col space-y-2'>
            {/* title */}
            <CardTitle className='flex flex-wrap items-end gap-1 text-balance text-base font-semibold md:gap-2'>
              Statement of Assets and Liabilities
              <span className='text-sm text-muted-foreground md:text-base'>
                (FY {Math.min(...filteredYears.map(Number))} - FY{' '}
                {Math.max(...filteredYears.map(Number))})
              </span>
            </CardTitle>

            {/* currency */}
            <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
              <Badge
                variant='outline'
                className='flex items-center gap-1 text-[11px] font-semibold md:text-xs'
              >
                <IndianRupee className='size-3' />
                <span>INR (All amounts are in Indian Rupees)</span>
              </Badge>
            </div>
          </div>

          {/* filter options */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant='secondary' size='sm' title='Filter'>
                <Filter className='size-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium leading-none'>Filter Options</h4>
                  <p className='text-sm text-muted-foreground'>
                    Customize your view of the financial data.
                  </p>
                </div>
                <div className='grid gap-2'>
                  <div className='grid gap-1'>
                    <Label htmlFor='search'>Search Years</Label>
                    <Input
                      id='search'
                      placeholder='e.g. 2023 or FY 2023'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Separator />
                  <div className='grid gap-1'>
                    <Label>Select Years</Label>
                    <div className='h-[120px] space-y-2 overflow-y-auto'>
                      {filteredSortedYears.map((year) => (
                        <div key={year} className='flex items-center space-x-2'>
                          <Checkbox
                            id={`year-${year}`}
                            checked={selectedYears.includes(year)}
                            onCheckedChange={() => handleYearToggle(year)}
                          />
                          <label
                            htmlFor={`year-${year}`}
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            FY {year}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex justify-end gap-2'>
                  <Button
                    onClick={resetFilter}
                    variant='secondary'
                    size='sm'
                    className='text-muted-foreground hover:text-foreground'
                  >
                    <RotateCcw className='mr-1 h-4 w-4' />
                    Reset
                  </Button>
                  <Button onClick={applyFilter} size='sm'>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className='p-2 pt-0 md:p-4 md:pt-0'>
        <div className='relative'>
          {/* SCROLL HORIZONTALLY */}
          {showLeftArrow && (
            <button
              onClick={() => scrollTable('left')}
              className='absolute left-[256px] top-0 z-40 flex h-10 w-6 items-center justify-center bg-background/80 text-primary transition-all hover:bg-background/100 md:left-96'
            >
              <ChevronsLeft className='size-5' />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => scrollTable('right')}
              className='absolute right-0 top-0 z-40 flex h-10 w-6 items-center justify-center bg-background/80 text-primary transition-all hover:bg-background/100'
            >
              <ChevronsRight className='size-5' />
            </button>
          )}

          <Table customScrollRef={tableRef} className='text-xs md:text-sm'>
            {/* MAIN HEADER */}
            <TableHeader className='sticky top-0 z-20 bg-primary'>
              <TableRow className='sticky left-0 top-0 z-20 divide-x divide-gray-400'>
                <TableHead className='sticky left-0 min-w-36 max-w-36 bg-primary text-background md:min-w-72 md:max-w-72'>
                  Particulars
                </TableHead>

                <TableHead className='sticky left-36 w-28 bg-primary text-background md:left-72'>
                  Trend
                </TableHead>

                {filteredYears.map((year) => (
                  <TableHead
                    key={year}
                    className='min-w-[150px] text-background'
                  >
                    <div className='flex items-center justify-end gap-2'>
                      <CalendarDays className='h-4 w-4' />
                      FY {year}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Source Document(s) */}
              {/* TODO: tooltip > official form..... generate texts */}
              <TableRow className='divide-x'>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  Source Document(s)
                </TableCell>

                <TableHead className='sticky left-36 z-10 bg-background/80 md:left-72'>
                  <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                </TableHead>

                {filteredYears.map((year) => (
                  <TableCell
                    key={year}
                    className='space-y-1 text-left align-top'
                  >
                    {financialDocsData.data[year].metaData.documents.map(
                      (doc, index) => (
                        <div key={index}>
                          {doc.isAttachment ? (
                            <a
                              title={doc.fileName}
                              href={doc.s3Url}
                              target='_blank'
                              className='flex gap-1 text-xs hover:text-primary hover:underline'
                            >
                              <CornerDownRight className='ml-1 size-3 flex-shrink-0' />
                              <span className='text-[11px] font-medium transition-all'>
                                {truncateMiddle(doc.fileName, 22)}
                              </span>
                            </a>
                          ) : (
                            <a
                              href={doc.s3Url}
                              target='_blank'
                              className='flex gap-1 text-xs hover:text-primary hover:underline'
                            >
                              <FileText className='size-4 flex-shrink-0' />
                              {doc.fileName}
                            </a>
                          )}
                        </div>
                      )
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* Section I: CONTRIBUTION AND LIABILITIES */}
              <TableRow className='bg-muted'>
                <TableCell className='sticky left-0 z-10 border-y border-gray-300 bg-sky-100 font-bold'>
                  (I) CONTRIBUTION AND LIABILITIES
                </TableCell>
                <TableCell
                  className='border-y border-gray-300 bg-sky-100'
                  colSpan={filteredYears.length + 1}
                ></TableCell>
              </TableRow>

              {/* Partner's Funds Section */}
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  (1) Partner&apos;s Funds
                </TableCell>
                <TableCell colSpan={filteredYears.length + 1}></TableCell>
              </TableRow>
              {[
                {
                  key: 'contribution_received',
                  label: 'Contribution Received',
                },
                {
                  key: 'reserves_and_surplus',
                  label:
                    'Reserves and Surplus (including surplus being the profit/loss made during year)',
                },
              ].map((row) => (
                <TableRow key={row.key}>
                  <TableCell className='sticky left-0 z-10 bg-sky-50 pl-8'>
                    {row.label}
                  </TableCell>

                  <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                    <SmallTrendChart
                      data={getLineChartData(row.key)}
                      dataKey='value'
                      xAxisKey='year'
                    />
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {filteredYears.map((year, index) => (
                    <TableCell key={year} className={cn('text-right')}>
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].liabilities[
                          row.key as keyof (typeof financialDocsData.data)[typeof year]['liabilities']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].liabilities[
                              row.key as keyof IFinancialLiabilities
                            ],
                            financialDocsData.data[filteredYears[index - 1]]
                              .liabilities[
                              row.key as keyof IFinancialLiabilities
                            ]
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Liabilities Section */}
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  (2) Liabilities
                </TableCell>
                <TableCell colSpan={filteredYears.length + 1}></TableCell>
              </TableRow>
              {[
                { key: 'secured_loan', label: 'Secured Loans' },
                { key: 'unsecured_loan', label: 'Unsecured Loans' },
                { key: 'short_term_borrowing', label: 'Short Term Borrowings' },
                {
                  key: 'trade_payables',
                  label: 'Creditors/Trade Payables - Advance from customers',
                },
                {
                  key: 'other_liabilities',
                  label: 'Amount of Other Liabilities',
                },
              ].map((row) => (
                <TableRow key={row.key}>
                  <TableCell className='sticky left-0 z-10 bg-sky-50 pl-8'>
                    <div className='flex items-center gap-2'>{row.label}</div>
                  </TableCell>

                  {/* chart */}
                  <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                    <SmallTrendChart
                      data={getLineChartData(row.key)}
                      dataKey='value'
                      xAxisKey='year'
                    />
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {filteredYears.map((year, index) => (
                    <TableCell key={year} className='text-right'>
                      {/* tooltip for other specific liabilities */}
                      {row.key === 'other_liabilities' &&
                        financialDocsData.data[year].liabilities
                          .other_liabilities_specific && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className='mr-2 opacity-50 hover:opacity-90'>
                                <Info className='size-3' />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {financialDocsData.data[year].liabilities
                                    .other_liabilities_specific.length > 0
                                    ? toCamelCase(
                                        financialDocsData.data[year].liabilities
                                          .other_liabilities_specific
                                      )
                                    : '-'}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                      {/* data */}
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].liabilities[
                          row.key as keyof (typeof financialDocsData.data)[typeof year]['liabilities']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].liabilities[
                              row.key as keyof IFinancialLiabilities
                            ],
                            financialDocsData.data[filteredYears[index - 1]]
                              .liabilities[
                              row.key as keyof IFinancialLiabilities
                            ]
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Provisions Section */}
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  Provisions
                </TableCell>
                <TableCell colSpan={filteredYears.length + 1}></TableCell>
              </TableRow>
              {[
                { key: 'provisions_for_taxation', label: 'For Taxation' },
                {
                  key: 'provisions_for_contingencies',
                  label: 'For Contingencies',
                },
                { key: 'provisions_for_insurance', label: 'For Insurance' },
                { key: 'other_provisions', label: 'Other Provisions (if any)' },
              ].map((row) => (
                <TableRow key={row.key}>
                  <TableCell className='sticky left-0 z-10 bg-sky-50 pl-8'>
                    {row.label}
                  </TableCell>

                  {/* chart */}
                  <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                    <SmallTrendChart
                      data={getLineChartData(row.key)}
                      dataKey='value'
                      xAxisKey='year'
                    />
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {filteredYears.map((year, index) => (
                    <TableCell key={year} className={cn('text-right')}>
                      {/* data */}
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].liabilities[
                          row.key as keyof (typeof financialDocsData.data)[typeof year]['liabilities']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].liabilities[
                              row.key as keyof IFinancialLiabilities
                            ],
                            financialDocsData.data[filteredYears[index - 1]]
                              .liabilities[
                              row.key as keyof IFinancialLiabilities
                            ]
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Total Liabilities */}
              <TableRow className='font-semibold'>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4'>
                  Total (I)
                </TableCell>

                {/* chart */}
                <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                  <SmallTrendChart
                    data={getLineChartData('assets_total')}
                    dataKey='value'
                    xAxisKey='year'
                  />
                  <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                </TableCell>

                {filteredYears.map((year, index) => (
                  <TableCell key={year} className='text-right'>
                    {/* data */}
                    {formatFinancialsCurrency(
                      financialDocsData.data[year].liabilities
                        .liabilities_total,
                      unit
                    )}

                    {/* percentage change */}
                    {index > 0 && (
                      <div className='mt-1 text-xs'>
                        {renderPercentageChange(
                          financialDocsData.data[year].liabilities
                            .liabilities_total,
                          financialDocsData.data[filteredYears[index - 1]]
                            .liabilities.liabilities_total
                        )}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* Section II: ASSETS */}
              <TableRow className='bg-muted'>
                <TableCell className='sticky left-0 z-10 border-y border-gray-300 bg-sky-100 font-bold'>
                  (II) ASSETS
                </TableCell>
                <TableCell
                  className='border-y border-gray-300 bg-sky-100'
                  colSpan={filteredYears.length + 1}
                ></TableCell>
              </TableRow>

              {[
                {
                  key: 'gross_fixed_assets',
                  label: 'Gross Fixed Assets (including intangible assets)',
                },
                {
                  key: 'depreciation_and_amortization',
                  label: 'Less: depreciation and amortization',
                },
                { key: 'net_fixed_assets', label: 'Net Fixed Assets' },
                { key: 'investments', label: 'Investments' },
                { key: 'loans_and_advances', label: 'Loans and Advances' },
                { key: 'inventories', label: 'Inventories' },
                {
                  key: 'trade_receivables',
                  label: 'Debtors/Trade Receivables',
                },
                {
                  key: 'cash_and_equivalents',
                  label: 'Cash and Cash Equivalents',
                },
                { key: 'other_assets', label: 'Amount of Other Assets' },
              ].map((row) => (
                <TableRow key={row.key}>
                  <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4'>
                    <div className='flex items-center gap-2'>{row.label}</div>
                  </TableCell>

                  {/* chart */}
                  <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                    <SmallTrendChart
                      data={getLineChartData(row.key)}
                      dataKey='value'
                      xAxisKey='year'
                    />
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {filteredYears.map((year, index) => (
                    <TableCell key={year} className='text-right'>
                      {/* tooltip for other specific assets */}
                      {row.key === 'other_assets' &&
                        financialDocsData.data[filteredYears[0]].assets
                          .other_assets_specific && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className='mr-2 opacity-50 hover:opacity-90'>
                                <Info className='size-3' />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {financialDocsData.data[year].assets
                                    .other_assets_specific.length > 0
                                    ? toCamelCase(
                                        financialDocsData.data[year].assets
                                          .other_assets_specific
                                      )
                                    : '-'}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                      {/* data */}
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].assets[
                          row.key as keyof (typeof financialDocsData.data)[typeof year]['assets']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].assets[
                              row.key as keyof IFinancialAssets
                            ],
                            financialDocsData.data[filteredYears[index - 1]]
                              .assets[row.key as keyof IFinancialAssets]
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Total Assets */}
              <TableRow className='font-semibold'>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4'>
                  Total (II)
                </TableCell>

                {/* chart */}
                <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                  <SmallTrendChart
                    data={getLineChartData('assets_total')}
                    dataKey='value'
                    xAxisKey='year'
                  />
                  <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                </TableCell>

                {filteredYears.map((year, index) => (
                  <TableCell key={year} className='text-right'>
                    {/* data */}
                    {formatFinancialsCurrency(
                      financialDocsData.data[year].assets.assets_total,
                      unit
                    )}

                    {/* percentage change */}
                    {index > 0 && (
                      <div className='mt-1 text-[11px] font-semibold'>
                        {renderPercentageChange(
                          financialDocsData.data[year].assets.assets_total,
                          financialDocsData.data[filteredYears[index - 1]]
                            .assets.assets_total
                        )}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
