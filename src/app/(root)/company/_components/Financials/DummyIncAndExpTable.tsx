'use client';

import UpgradeToReport from '@/app/(root)/(dashboard)/dashboard/unlock-companies/_components/UpgradeToReport';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatToUrl } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowUpCircle,
  CalendarDays,
  CheckCircle,
  CornerDownRight,
  IndianRupee,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import UnlockCompanyBtn from '../../../../../components/shared/UnlockCompany/UnlockCompanyBtn';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
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
import {
  formatFinancialsCurrency,
  renderPercentageChange,
} from './utils/formatters';

export default function DummyIncAndExpTable({
  companyData,
  financialDocsData,
  years,
  unit = 'raw',
  isSamePage = false,
  isUnlocked = { isUnlocked: false, unlockType: null },
}: {
  companyData: TCompanyMasterData;
  financialDocsData: IFinancialDocsApiResponse;
  years: string[];
  unit?: string;
  isSamePage?: boolean;
  isUnlocked?: { isUnlocked: boolean; unlockType: string | null };
}) {
  const tableRef = useRef<HTMLDivElement>(null);
  const sortedYears = [...years].sort((a, b) => Number(a) - Number(b));

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      // Scroll to the right end by default
      tableElement.scrollLeft = tableElement.scrollWidth;
    }
  }, [sortedYears]);

  return (
    <Card className='mt-8 w-full md:mt-12'>
      <CardHeader className='p-3 md:p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col space-y-2'>
            {/* title */}
            <CardTitle className='flex flex-wrap items-end gap-1 text-balance text-base font-semibold md:gap-2 md:text-lg'>
              Statement of Income and Expenditure
              {/* <span className='text-sm text-muted-foreground md:text-base'>
                (FY {Math.min(...sortedYears.map(Number))} - FY{' '}
                {Math.max(...sortedYears.map(Number))})
              </span> */}
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
        </div>
      </CardHeader>
      <CardContent className='p-2 pt-0 md:p-4 md:pt-0'>
        <div className='relative'>
          <div className='absolute bottom-0 left-0 right-0 top-0 z-40 flex flex-col items-center bg-gray-200/20 p-4 pt-28 backdrop-blur-[3px] md:left-72 md:pt-40'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='flex-col-center z-50 w-full max-w-lg rounded-xl border border-white/20 bg-blue-700/80 p-8 shadow-2xl backdrop-blur-md'
            >
              <h2 className='mb-4 text-base font-bold text-white md:text-3xl'>
                Unlock Company Insights
              </h2>
              <p className='mb-6 text-center text-sm text-gray-200 md:text-lg'>
                Gain access to comprehensive financial statements and public
                documents, including:
              </p>
              <ul className='mb-8 space-y-2 text-xs text-gray-100 md:text-base'>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className='flex items-center'
                >
                  <span className='mr-2'>•</span> Statement of Assets and
                  Liabilities
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className='flex items-center'
                >
                  <span className='mr-2'>•</span> Statement of Income and
                  Expenditure
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className='flex items-center'
                >
                  <span className='mr-2'>•</span> Public Documents for Download
                </motion.li>
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {isUnlocked.isUnlocked &&
                isUnlocked.unlockType === 'documents' ? (
                  <UpgradeToReport
                    companyId={companyData.data.cin}
                    companyName={companyData.data.company}
                    customButton={
                      <button
                        className={`flex w-full items-center justify-center gap-2 rounded bg-yellow-300 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 md:w-auto md:text-base`}
                      >
                        <ArrowUpCircle className='h-5 w-5' />
                        Upgrade to Report
                      </button>
                    }
                  />
                ) : isUnlocked.isUnlocked &&
                  isUnlocked.unlockType === 'report' ? (
                  <div>
                    <p className='mb-1 text-[10px]'>Already unlocked!</p>
                    <Link
                      href={`/dashboard/unlock-companies/company-details/${formatToUrl(companyData.data.company)}/${companyData.data.cin}?tab=financials`}
                      prefetch={false}
                      className={cn(
                        buttonVariants({ variant: 'secondary' }),
                        'gap-1.5'
                      )}
                    >
                      <CheckCircle className='size-4' />
                      View Complete Report
                    </Link>
                  </div>
                ) : (
                  <UnlockCompanyBtn
                    companyData={companyData}
                    isSamePage={isSamePage}
                    className='bg-yellow-300 px-4 py-2 hover:bg-yellow-400 md:text-base'
                  />
                )}
              </motion.div>
            </motion.div>
          </div>

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

                {sortedYears.map((year) => (
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

                {sortedYears.map((year) => (
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

                {sortedYears.map((year) => (
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
                  colSpan={sortedYears.length + 1}
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
                    {/* <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    /> */}
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {sortedYears.map((year, index) => (
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
                            financialDocsData.data[sortedYears[index - 1]]
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
                <TableCell colSpan={sortedYears.length + 1}></TableCell>
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
                    {/* <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    /> */}
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {sortedYears.map((year, index) => (
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
                            financialDocsData.data[sortedYears[index - 1]]
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
                <TableCell colSpan={sortedYears.length + 1}></TableCell>
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
                    {/* <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    /> */}
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {sortedYears.map((year, index) => (
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
                            financialDocsData.data[sortedYears[index - 1]]
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
                    {/* <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    /> */}
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {sortedYears.map((year, index) => (
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
                            financialDocsData.data[sortedYears[index - 1]]
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
                  {/* <SmallTrendChart
                    data={getLineChartData('total_income')}
                    dataKey='value'
                    xAxisKey='year'
                  /> */}
                  <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                </TableCell>

                {sortedYears.map((year, index) => (
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
                          financialDocsData.data[sortedYears[index - 1]]
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
                  colSpan={sortedYears.length + 1}
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
                    {/* <SmallTrendChart
                      data={getLineChartData(item.key)}
                      dataKey='value'
                      xAxisKey='year'
                    /> */}
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {sortedYears.map((year, index) => (
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
                            financialDocsData.data[sortedYears[index - 1]]
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
