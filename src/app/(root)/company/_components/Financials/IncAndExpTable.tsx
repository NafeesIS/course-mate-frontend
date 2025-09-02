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
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  CornerDownRight,
  Filter,
  IndianRupee,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  IFinancialDocsApiResponse,
  IFinancialIncomeStatement,
} from '../../_types/FinancialDocsDataType';
import './custom-table.css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './CustomTable';
import { SmallTrendChart } from './SmallTrendChart';
import {
  formatFinancialsCurrency,
  renderPercentageChange,
} from './utils/formatters';

export default function IncAndExpTable({
  financialDocsData,
  years,
  unit,
}: {
  financialDocsData: IFinancialDocsApiResponse;
  years: string[];
  unit: string;
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
    setFilteredYears(selectedYears.length > 0 ? selectedYears : years);
    setIsOpen(false); // Close the popover
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
        financialDocsData.data[year].income_statement[
          key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
        ] || 0,
    }));
  };

  return (
    <Card className='mt-8 w-full md:mt-12'>
      <CardHeader className='p-3 md:p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col space-y-2'>
            {/* title */}
            <CardTitle className='flex flex-wrap items-end gap-1 text-balance text-base font-semibold md:gap-2 md:text-lg'>
              Statement of Income and Expenditure
              <span className='text-sm text-muted-foreground md:text-base'>
                (FY {Math.min(...filteredYears.map(Number))} - FY{' '}
                {Math.max(...filteredYears.map(Number))})
              </span>
            </CardTitle>

            {/* currency */}
            <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
              <Badge
                variant='outline'
                className='flex items-center gap-1 text-[10px] md:text-xs'
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
                <TableHead className='sticky left-0 z-20 min-w-36 max-w-36 bg-primary text-background md:min-w-72 md:max-w-72'>
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

            {/* PERIOD */}
            <TableBody>
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 text-xs'>
                  From{' '}
                  <span className='text-muted-foreground'>(DD/MM/YYYY)</span>
                </TableCell>

                <TableHead className='sticky left-36 z-10 bg-background/80 md:left-72'>
                  <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                </TableHead>

                {filteredYears.map((year) => (
                  <TableCell key={year} className='text-right text-xs'>
                    {financialDocsData.data[year].income_statement
                      .period_from || '-'}{' '}
                    <span className='inline-block w-3'></span>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 text-xs'>
                  <CornerDownRight className='-mt-1 inline size-3 text-muted-foreground' />{' '}
                  To <span className='text-muted-foreground'>(DD/MM/YYYY)</span>
                </TableCell>

                <TableHead className='sticky left-36 z-10 bg-background/80 md:left-72'>
                  <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                </TableHead>

                {filteredYears.map((year) => (
                  <TableCell key={year} className='text-right text-xs'>
                    <CornerDownRight className='-mt-1 inline size-3 text-muted-foreground' />{' '}
                    {financialDocsData.data[year].income_statement.period_to ||
                      '-'}
                  </TableCell>
                ))}
              </TableRow>

              {/* INCOME */}
              <TableRow className='bg-muted'>
                <TableCell className='sticky left-0 z-10 border-y border-gray-300 bg-sky-100 font-semibold'>
                  INCOME
                </TableCell>
                <TableCell
                  className='border-y border-gray-300 bg-sky-100'
                  colSpan={filteredYears.length + 1}
                ></TableCell>
              </TableRow>
              {[
                { key: 'gross_turnover', label: 'Gross Turnover' },
                {
                  key: 'excise_duty',
                  label: 'Less: Excise Duty or Service Tax',
                },
                { key: 'net_turnover', label: 'Net Turnover Details' },
              ].map((item) => (
                <TableRow key={item.key}>
                  <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4'>
                    {item.label}
                  </TableCell>

                  {/* chart */}
                  <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                    <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    />
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {filteredYears.map((year, index) => (
                    <TableCell
                      key={year}
                      className={cn('text-right tracking-wide')}
                    >
                      {/* data */}
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].income_statement[
                          item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ],
                            financialDocsData.data[filteredYears[index - 1]]
                              .income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ]
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* DOMESTIC TURNOVER */}
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  (1) Domestic Turnover
                </TableCell>
                <TableCell colSpan={filteredYears.length + 1}></TableCell>
              </TableRow>
              {[
                {
                  key: 'dom_sale_of_goods_manufactured',
                  label: '(a) Sale of Goods Manufactured',
                },
                {
                  key: 'dom_sale_of_goods_traded',
                  label: '(b) Sale of Goods Traded',
                },
                {
                  key: 'dom_sale_of_services',
                  label: '(c) Sale or Supply of Services',
                },
              ].map((item) => (
                <TableRow key={item.key}>
                  <TableCell className='sticky left-0 z-10 bg-sky-50 pl-8'>
                    {item.label}
                  </TableCell>

                  {/* chart */}
                  <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                    <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    />
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {filteredYears.map((year, index) => (
                    <TableCell
                      key={year}
                      className={cn('text-right tracking-wide')}
                    >
                      {/* data */}
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].income_statement[
                          item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ],
                            financialDocsData.data[filteredYears[index - 1]]
                              .income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ]
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* EXPORT TURNOVER */}
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  (2) Export Turnover
                </TableCell>
                <TableCell colSpan={filteredYears.length + 1}></TableCell>
              </TableRow>
              {[
                {
                  key: 'export_sale_of_goods_manufactured',
                  label: '(a) Sale of Goods Manufactured',
                },
                {
                  key: 'export_sale_of_goods_traded',
                  label: '(b) Sale of Goods Traded',
                },
                {
                  key: 'export_sale_of_services',
                  label: '(c) Sale or Supply of Services',
                },
              ].map((item) => (
                <TableRow key={item.key}>
                  <TableCell className='sticky left-0 z-10 bg-sky-50 pl-8'>
                    {item.label}
                  </TableCell>

                  {/* chart */}
                  <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                    <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    />
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {filteredYears.map((year, index) => (
                    <TableCell
                      key={year}
                      className={cn('text-right tracking-wide')}
                    >
                      {/* data */}
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].income_statement[
                          item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ],
                            financialDocsData.data[filteredYears[index - 1]]
                              .income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ]
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* OTHER INCOME */}
              {[
                { key: 'other_income', label: 'Other Income' },
                {
                  key: 'stock_adjustments',
                  label: `Increase/ (Decrease) in Stocks [including for raw materials, work in progress and finished goods]`,
                },
              ].map((item) => (
                <TableRow key={item.key}>
                  <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4'>
                    {item.label}
                  </TableCell>

                  {/* chart */}
                  <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                    <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    />
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {filteredYears.map((year, index) => (
                    <TableCell
                      key={year}
                      className={cn('text-right tracking-wide')}
                    >
                      {/* data */}
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].income_statement[
                          item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ],
                            financialDocsData.data[filteredYears[index - 1]]
                              .income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ]
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* TOTAL INCOME */}
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  Total Income
                </TableCell>

                {/* chart */}
                <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                  <SmallTrendChart
                    data={getLineChartData('total_income')}
                    dataKey='value'
                    xAxisKey='year'
                  />
                  <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                </TableCell>

                {filteredYears.map((year, index) => (
                  <TableCell
                    key={year}
                    className='text-right font-medium tracking-wide'
                  >
                    {/* data */}
                    {formatFinancialsCurrency(
                      financialDocsData.data[year].income_statement
                        .total_income,
                      unit
                    )}

                    {/* percentage change */}
                    {index > 0 && (
                      <div className='mt-1 text-xs'>
                        {renderPercentageChange(
                          financialDocsData.data[year].income_statement
                            .total_income,
                          financialDocsData.data[filteredYears[index - 1]]
                            .income_statement.total_income
                        )}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* EXPENSE */}
              <TableRow className='bg-muted'>
                <TableCell className='sticky left-0 z-10 border-y border-gray-300 bg-sky-100 font-semibold'>
                  EXPENSES
                </TableCell>

                <TableCell
                  className='border-y border-gray-300 bg-sky-100'
                  colSpan={filteredYears.length + 1}
                ></TableCell>
              </TableRow>
              {[
                {
                  key: 'raw_material_consumed',
                  label: 'Raw Material Consumed',
                },
                {
                  key: 'purchases_for_resale',
                  label: 'Purchases Made for Re-sale',
                },
                {
                  key: 'consumption_stores',
                  label: 'Consumption of Stores and Spare Parts',
                },
                { key: 'power_and_fuel', label: 'Power and Fuel' },
                { key: 'personnel_expenses', label: 'Personnel Expenses' },
                {
                  key: 'administrative_expenses',
                  label: 'Administrative Expenses',
                },
                { key: 'payment_to_auditors', label: 'Payment to Auditors' },
                { key: 'selling_expenses', label: 'Selling Expenses' },
                { key: 'insurance_expenses', label: 'Insurance Expenses' },
                {
                  key: 'depreciation',
                  label: 'Depreciation and Amortization',
                },
                { key: 'interest', label: 'Interest' },
                { key: 'other_expenses', label: 'Other Expenses' },
                { key: 'total_expenditure', label: 'Total Expenditure' },
                {
                  key: 'net_profit_before_tax',
                  label: 'Net Profit or Net Loss (before taxes)',
                },
                { key: 'provision_for_tax', label: 'Provision for Tax' },
                { key: 'profit_after_tax', label: 'Profit after Tax' },
                {
                  key: 'profit_transferred_to_partners',
                  label: `Profit Transferred to Partners' Account`,
                },
                {
                  key: 'profit_transferred_to_reserves',
                  label: 'Profit Transferred to Reserves and Surplus',
                },
              ].map((item) => (
                <TableRow
                  key={item.key}
                  className={
                    item.key === 'total_expenditure' ||
                    // item.key === 'net_profit_before_tax' ||
                    item.key === 'profit_after_tax'
                      ? 'font-semibold'
                      : ''
                  }
                >
                  <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4'>
                    {item.label}
                  </TableCell>

                  {/* chart */}
                  <TableCell className='sticky left-36 z-10 bg-background/80 md:left-72'>
                    <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    />
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {filteredYears.map((year, index) => (
                    <TableCell
                      key={year}
                      className={cn(
                        'text-right tracking-wide',
                        item.key === 'total_expenditure' ||
                          // item.key === 'net_profit_before_tax' ||
                          item.key === 'profit_after_tax'
                          ? 'font-medium text-foreground'
                          : ''
                      )}
                    >
                      {/* data */}
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].income_statement[
                          item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ],
                            financialDocsData.data[filteredYears[index - 1]]
                              .income_statement[
                              item.key as keyof IFinancialIncomeStatement
                            ]
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
