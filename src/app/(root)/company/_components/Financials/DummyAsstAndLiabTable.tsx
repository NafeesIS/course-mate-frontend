'use client';

import UpgradeToReport from '@/app/(root)/(dashboard)/dashboard/unlock-companies/_components/UpgradeToReport';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowUpCircle,
  CalendarDays,
  CheckCircle,
  CornerDownRight,
  FileText,
  IndianRupee,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import UnlockCompanyBtn from '../../../../../components/shared/UnlockCompany/UnlockCompanyBtn';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import { IFinancialDocsApiResponse } from '../../_types/FinancialDocsDataType';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './CustomTable';
import { formatFinancialsCurrency } from './utils/formatters';

export default function DummyAsstAndLiabTable({
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
    <Card className='mt-4 w-full md:mt-6'>
      <CardHeader className='p-3 md:p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col space-y-2'>
            {/* title */}
            <CardTitle className='flex flex-wrap items-end gap-1 text-balance text-base font-semibold md:gap-2 md:text-lg'>
              Statement of Assets and Liabilities
              {/* <span className='text-sm text-muted-foreground md:text-base'>
                (FY {Math.min(...sortedYears.map(Number))} - FY{' '}
                {Math.max(...sortedYears.map(Number))})
              </span> */}
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
        </div>
      </CardHeader>
      <CardContent className='p-2 pt-0 md:p-4 md:pt-0'>
        <div className='relative'>
          <div className='absolute bottom-0 left-0 right-0 top-0 z-40 flex flex-col items-center bg-gray-200/20 p-4 pt-28 backdrop-blur-[3px] md:left-72 md:pt-40'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='flex-col-center z-50 w-full max-w-lg rounded-xl border border-white/20 bg-blue-700/90 p-8 shadow-2xl backdrop-blur-md'
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
                    <p className='mb-1 text-[10px] text-white'>
                      Already unlocked!
                    </p>
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

                <TableHead className='sticky left-36 z-20 w-28 bg-primary px-4 text-background md:left-72'>
                  <div className='flex items-center gap-1'>
                    <span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-chart-no-axes-combined'
                      >
                        <path d='M12 16v5' />
                        <path d='M16 14v7' />
                        <path d='M20 10v11' />
                        <path d='m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15' />
                        <path d='M4 18v3' />
                        <path d='M8 14v7' />
                      </svg>
                    </span>
                    <span>Trend</span>
                  </div>
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

                {sortedYears.map((year) => (
                  <TableCell
                    key={year}
                    className='space-y-1 text-left align-top'
                  >
                    {financialDocsData.data[year].metaData.documents.map(
                      (doc, index) => (
                        <div key={index}>
                          {doc.isAttachment ? (
                            <a
                              href={doc.s3Url}
                              target='_blank'
                              className='flex gap-1 text-xs hover:text-primary hover:underline'
                            >
                              <CornerDownRight className='ml-1 size-3 flex-shrink-0' />
                              <span className='text-[11px] font-medium'>
                                {doc.fileName}
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
                  colSpan={sortedYears.length + 1}
                ></TableCell>
              </TableRow>

              {/* Partner's Funds Section */}
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  (1) Partner&apos;s Funds
                </TableCell>
                <TableCell colSpan={sortedYears.length + 1}></TableCell>
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
                    {/* <SmallTrendChart
                      data={getLineChartData(row.key)}
                      dataKey='value'
                      xAxisKey='year'
                    /> */}

                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {sortedYears.map((year) => (
                    <TableCell key={year} className={cn('text-right')}>
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].liabilities[
                          row.key as keyof (typeof financialDocsData.data)[typeof year]['liabilities']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {/* {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].liabilities[
                              row.key as keyof IFinancialLiabilities
                            ],
                            financialDocsData.data[sortedYears[index - 1]]
                              .liabilities[
                              row.key as keyof IFinancialLiabilities
                            ]
                          )}
                        </div>
                      )} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Liabilities Section */}
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  (2) Liabilities
                </TableCell>
                <TableCell colSpan={sortedYears.length + 1}></TableCell>
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
                    {/* <SmallTrendChart
                      data={getLineChartData(row.key)}
                      dataKey='value'
                      xAxisKey='year'
                    /> */}
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {sortedYears.map((year) => (
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
                      {/* {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].liabilities[
                              row.key as keyof IFinancialLiabilities
                            ],
                            financialDocsData.data[sortedYears[index - 1]]
                              .liabilities[
                              row.key as keyof IFinancialLiabilities
                            ]
                          )}
                        </div>
                      )} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Provisions Section */}
              <TableRow>
                <TableCell className='sticky left-0 z-10 bg-sky-50 pl-4 font-semibold'>
                  Provisions
                </TableCell>
                <TableCell colSpan={sortedYears.length + 1}></TableCell>
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
                    {/* <SmallTrendChart
                      data={getLineChartData(row.key)}
                      dataKey='value'
                      xAxisKey='year'
                    /> */}
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {sortedYears.map((year) => (
                    <TableCell key={year} className={cn('text-right')}>
                      {/* data */}
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].liabilities[
                          row.key as keyof (typeof financialDocsData.data)[typeof year]['liabilities']
                        ],
                        unit
                      )}

                      {/* percentage change */}
                      {/* {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].liabilities[
                              row.key as keyof IFinancialLiabilities
                            ],
                            financialDocsData.data[sortedYears[index - 1]]
                              .liabilities[
                              row.key as keyof IFinancialLiabilities
                            ]
                          )}
                        </div>
                      )} */}
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
                  {/* <SmallTrendChart
                    data={getLineChartData('assets_total')}
                    dataKey='value'
                    xAxisKey='year'
                  /> */}
                  <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                </TableCell>

                {sortedYears.map((year) => (
                  <TableCell key={year} className='text-right'>
                    {/* data */}
                    {formatFinancialsCurrency(
                      financialDocsData.data[year].liabilities
                        .liabilities_total,
                      unit
                    )}

                    {/* percentage change */}
                    {/* {index > 0 && (
                      <div className='mt-1 text-xs'>
                        {renderPercentageChange(
                          financialDocsData.data[year].liabilities
                            .liabilities_total,
                          financialDocsData.data[sortedYears[index - 1]]
                            .liabilities.liabilities_total
                        )}
                      </div>
                    )} */}
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
                  colSpan={sortedYears.length + 1}
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
                    {/* <SmallTrendChart
                      data={getLineChartData(row.key)}
                      dataKey='value'
                      xAxisKey='year'
                    /> */}
                    <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                  </TableCell>

                  {sortedYears.map((year) => (
                    <TableCell key={year} className='text-right'>
                      {/* tooltip for other specific assets */}
                      {row.key === 'other_assets' &&
                        financialDocsData.data[sortedYears[0]].assets
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
                      {/* {index > 0 && (
                        <div className='mt-1 text-[11px] font-semibold'>
                          {renderPercentageChange(
                            financialDocsData.data[year].assets[
                              row.key as keyof IFinancialAssets
                            ],
                            financialDocsData.data[sortedYears[index - 1]]
                              .assets[row.key as keyof IFinancialAssets]
                          )}
                        </div>
                      )} */}
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
                  {/* <SmallTrendChart
                    data={getLineChartData('assets_total')}
                    dataKey='value'
                    xAxisKey='year'
                  /> */}
                  <span className='absolute left-0 top-0 -z-10 h-full w-full border-r backdrop-blur-sm'></span>
                </TableCell>

                {sortedYears.map((year) => (
                  <TableCell key={year} className='text-right'>
                    {/* data */}
                    {formatFinancialsCurrency(
                      financialDocsData.data[year].assets.assets_total,
                      unit
                    )}

                    {/* percentage change */}
                    {/* {index > 0 && (
                      <div className='mt-1 text-[11px] font-semibold'>
                        {renderPercentageChange(
                          financialDocsData.data[year].assets.assets_total,
                          financialDocsData.data[sortedYears[index - 1]]
                            .assets.assets_total
                        )}
                      </div>
                    )} */}
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
