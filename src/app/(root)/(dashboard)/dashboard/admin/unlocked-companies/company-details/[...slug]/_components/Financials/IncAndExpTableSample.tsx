'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CalendarDays, CornerDownRight } from 'lucide-react';
import { IFinancialDocsApiResponse } from '../../_types/FinancialDocsDataType';
import { formatFinancialsCurrency } from './utils/formatters';

export default function IncAndExpTableSample({
  financialDocsData,
  years,
  unit,
}: {
  financialDocsData: IFinancialDocsApiResponse;
  years: string[];
  unit: string;
}) {
  return (
    <Card className='mt-12 w-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm font-semibold md:text-base'>
          Statement of Income and Expenditure (FY{' '}
          {Math.min(...years.map(Number))} - FY {Math.max(...years.map(Number))}
          )
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='w-full'>
          <div className='relative'>
            <Table>
              <TableHeader className='bg-primary'>
                <TableRow>
                  <TableHead className='min-w-80 text-background'>
                    Particulars
                  </TableHead>
                  {years.map((year) => (
                    <TableHead
                      key={year}
                      className='min-w-[150px] text-right text-background'
                    >
                      <div className='flex flex-col items-end gap-2'>
                        <div className='flex items-center justify-end gap-2'>
                          <CalendarDays className='h-4 w-4' />
                          FY {year}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              {/* PERIOD */}
              <TableBody>
                <TableRow>
                  <TableCell className='text-xs'>
                    From{' '}
                    <span className='text-muted-foreground'>(DD/MM/YYYY)</span>
                  </TableCell>
                  {years.map((year) => (
                    <TableCell key={year} className='text-right text-xs'>
                      {financialDocsData.data[year].income_statement
                        .period_from || '-'}{' '}
                      <span className='inline-block w-3'></span>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className='text-xs'>
                    <CornerDownRight className='-mt-1 inline size-3 text-muted-foreground' />{' '}
                    To{' '}
                    <span className='text-muted-foreground'>(DD/MM/YYYY)</span>
                  </TableCell>
                  {years.map((year) => (
                    <TableCell key={year} className='text-right text-xs'>
                      <CornerDownRight className='-mt-1 inline size-3 text-muted-foreground' />{' '}
                      {financialDocsData.data[year].income_statement
                        .period_to || '-'}
                    </TableCell>
                  ))}
                </TableRow>

                {/* INCOME */}
                <TableRow className='bg-muted'>
                  <TableCell
                    className='font-semibold'
                    colSpan={years.length + 1}
                  >
                    INCOME
                  </TableCell>
                </TableRow>
                {[
                  { key: 'gross_turnover', label: 'Gross turnover' },
                  {
                    key: 'excise_duty',
                    label: 'Less: Excise duty or service tax',
                  },
                  { key: 'net_turnover', label: 'Net Turnover Details' },
                ].map((item) => (
                  <TableRow key={item.key}>
                    <TableCell className='bg-background'>
                      {item.label}
                    </TableCell>
                    {years.map((year) => (
                      <TableCell key={year} className={cn('text-right')}>
                        {formatFinancialsCurrency(
                          financialDocsData.data[year].income_statement[
                            item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                          ],
                          unit
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* DOMESTIC TURNOVER */}
                <TableRow>
                  <TableCell
                    colSpan={years.length + 1}
                    className='sticky left-0 z-20 bg-background'
                  >
                    (1) Domestic Turnover
                  </TableCell>
                </TableRow>
                {[
                  {
                    key: 'dom_sale_of_goods_manufactured',
                    label: '(a) Sale of goods manufactured',
                  },
                  {
                    key: 'dom_sale_of_goods_traded',
                    label: '(b) Sale of goods traded',
                  },
                  {
                    key: 'dom_sale_of_services',
                    label: '(c) Sale or supply of services',
                  },
                ].map((item) => (
                  <TableRow key={item.key}>
                    <TableCell className='bg-background pl-6'>
                      {item.label}
                    </TableCell>
                    {years.map((year) => (
                      <TableCell key={year} className={cn('text-right')}>
                        {formatFinancialsCurrency(
                          financialDocsData.data[year].income_statement[
                            item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                          ],
                          unit
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* EXPORT TURNOVER */}
                <TableRow>
                  <TableCell
                    colSpan={years.length + 1}
                    className='sticky left-0 z-20 bg-background'
                  >
                    (2) Export Turnover
                  </TableCell>
                </TableRow>
                {[
                  {
                    key: 'export_sale_of_goods_manufactured',
                    label: '(a) Sale of goods manufactured',
                  },
                  {
                    key: 'export_sale_of_goods_traded',
                    label: '(b) Sale of goods traded',
                  },
                  {
                    key: 'export_sale_of_services',
                    label: '(c) Sale or supply of services',
                  },
                ].map((item) => (
                  <TableRow key={item.key}>
                    <TableCell className='bg-background pl-6'>
                      {item.label}
                    </TableCell>
                    {years.map((year) => (
                      <TableCell key={year} className={cn('text-right')}>
                        {formatFinancialsCurrency(
                          financialDocsData.data[year].income_statement[
                            item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                          ],
                          unit
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* OTHER INCOME */}
                {[
                  { key: 'other_income', label: 'Other income' },
                  {
                    key: 'stock_adjustments',
                    label: `Increase/ (decrease) in stocks [including for raw materials, work in progress and finished goods]`,
                  },
                ].map((item) => (
                  <TableRow key={item.key}>
                    <TableCell className='bg-background'>
                      {item.label}
                    </TableCell>
                    {years.map((year) => (
                      <TableCell key={year} className={cn('text-right')}>
                        {formatFinancialsCurrency(
                          financialDocsData.data[year].income_statement[
                            item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                          ],
                          unit
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* TOTAL INCOME */}
                <TableRow>
                  <TableCell className='font-semibold'>Total Income</TableCell>
                  {years.map((year) => (
                    <TableCell key={year} className='text-right font-medium'>
                      {formatFinancialsCurrency(
                        financialDocsData.data[year].income_statement
                          .total_income,
                        unit
                      )}
                    </TableCell>
                  ))}
                </TableRow>

                {/* EXPENSE */}
                <TableRow className='bg-muted'>
                  <TableCell
                    className='font-semibold'
                    colSpan={years.length + 1}
                  >
                    EXPENSES
                  </TableCell>
                </TableRow>
                {[
                  {
                    key: 'raw_material_consumed',
                    label: 'Raw material consumed',
                  },
                  {
                    key: 'purchases_for_resale',
                    label: 'Purchases made for re-sale',
                  },
                  {
                    key: 'consumption_stores',
                    label: 'Consumption of stores and spare parts',
                  },
                  { key: 'power_and_fuel', label: 'Power and fuel' },
                  { key: 'personnel_expenses', label: 'Personnel Expenses' },
                  {
                    key: 'administrative_expenses',
                    label: 'Administrative expenses',
                  },
                  { key: 'payment_to_auditors', label: 'Payment to auditors' },
                  { key: 'selling_expenses', label: 'Selling expenses' },
                  { key: 'insurance_expenses', label: 'Insurance expenses' },
                  {
                    key: 'depreciation',
                    label: 'Depreciation and amortization',
                  },
                  { key: 'interest', label: 'Interest' },
                  { key: 'other_expenses', label: 'Other expenses' },
                  { key: 'total_expenditure', label: 'Total expenditure' },
                  {
                    key: 'net_profit_before_tax',
                    label: 'Net Profit or Net Loss (before taxes)',
                  },
                  { key: 'provision_for_tax', label: 'Provision for Tax' },
                  { key: 'profit_after_tax', label: 'Profit after Tax' },
                  {
                    key: 'profit_transferred_to_partners',
                    label: `Profit transferred to Partners' account`,
                  },
                  {
                    key: 'profit_transferred_to_reserves',
                    label: 'Profit transferred to Reserves and surplus',
                  },
                ].map((item) => (
                  <TableRow
                    key={item.key}
                    className={
                      item.key === 'total_expenditure' ||
                      item.key === 'net_profit_before_tax' ||
                      item.key === 'profit_after_tax'
                        ? 'font-semibold'
                        : ''
                    }
                  >
                    <TableCell className='bg-background'>
                      {item.label}
                    </TableCell>
                    {years.map((year) => (
                      <TableCell
                        key={year}
                        className={cn(
                          'text-right',

                          item.key === 'total_expenditure' ||
                            item.key === 'net_profit_before_tax' ||
                            item.key === 'profit_after_tax'
                            ? 'font-medium text-foreground'
                            : ''
                        )}
                      >
                        {formatFinancialsCurrency(
                          financialDocsData.data[year].income_statement[
                            item.key as keyof (typeof financialDocsData.data)[typeof year]['income_statement']
                          ],
                          unit
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
