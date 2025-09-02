'use client';

import { TOneTimeComplianceData } from '@/app/(root)/company/_types/CompanyDetails';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrencyINR } from '@/lib/formatters';
import { cn, getColumnBadgeClasses, isCustomDateFormat } from '@/lib/utils';
import React, { useState } from 'react';
import { RiArrowRightSLine, RiCheckboxBlankCircleFill } from 'react-icons/ri';

type Props = {
  filteredData: TOneTimeComplianceData[];
};

const TableDesktopView = ({ filteredData }: Props) => {
  const [showDescription, setShowDescription] = useState<number | null>(null);

  return (
    <div className='mt-6 hidden md:block'>
      <Card className='overflow-hidden rounded-md'>
        <Table>
          <TableHeader>
            <TableRow className='divide-x bg-muted'>
              <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                Form Code
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                Form Name
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                Form Due On
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                Form Filed On
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                Filing Status
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 text-right font-semibold text-foreground'>
                Application Fee
              </TableHead>
              <TableHead className='whitespace-nowrap bg-light-silver p-4 text-right font-semibold text-foreground'>
                Late Fee
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData &&
              filteredData.map((data, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    className='divide-x'
                    onClick={() => {
                      setShowDescription(
                        showDescription === index ? null : index
                      );
                    }}
                  >
                    <TableCell className='flex items-center whitespace-nowrap p-4'>
                      <RiArrowRightSLine
                        className={`-translate-x-2 transition-all ${
                          showDescription === index ? 'rotate-90' : ''
                        }`}
                      />{' '}
                      {data.formCode}
                    </TableCell>
                    <TableCell className='p-4 align-top'>
                      {data.formName}
                    </TableCell>
                    <TableCell className='whitespace-nowrap p-4 align-top'>
                      {data.dueDate}
                    </TableCell>
                    <TableCell className='whitespace-nowrap p-4 align-top'>
                      <div className='flex items-center gap-1.5 capitalize'>
                        {isCustomDateFormat(data.filingDate) ? null : (
                          <RiCheckboxBlankCircleFill
                            className={cn(
                              'inline text-xs',
                              getColumnBadgeClasses(data.filingDate)
                            )}
                          />
                        )}
                        {data.filingDate}
                      </div>
                    </TableCell>
                    <TableCell className='whitespace-nowrap p-4 align-top'>
                      <div className='flex items-center gap-1.5 capitalize'>
                        {isCustomDateFormat(data.filingStatus) ? null : (
                          <RiCheckboxBlankCircleFill
                            className={cn(
                              'inline text-xs',
                              getColumnBadgeClasses(data.filingStatus)
                            )}
                          />
                        )}
                        {data.filingStatus}
                      </div>
                    </TableCell>
                    <TableCell className='whitespace-nowrap p-4 text-right align-top'>
                      {formatCurrencyINR(data.normalFee)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap p-4 text-right align-top text-destructive'>
                      {formatCurrencyINR(data.additionalFee)}
                    </TableCell>
                  </TableRow>
                  {showDescription === index && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className='m-4 space-y-2 rounded-md bg-muted p-3'>
                          <h4 className='font-semibold'>
                            {data.formCode} : {data.formName}
                          </h4>
                          <p>{data.formDescription}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default TableDesktopView;
