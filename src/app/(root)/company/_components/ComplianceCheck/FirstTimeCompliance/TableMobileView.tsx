'use client';

import { TOneTimeComplianceData } from '@/app/(root)/company/_types/CompanyDetails';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { formatCurrencyINR } from '@/lib/formatters';
import { cn, getColumnBadgeClasses, isCustomDateFormat } from '@/lib/utils';
import { RiCheckboxBlankCircleFill, RiInformationLine } from 'react-icons/ri';

type Props = {
  filteredData: TOneTimeComplianceData[];
};

const TableMobileView = ({ filteredData }: Props) => {
  return (
    <div className='mt-6 space-y-6 md:mt-8 md:hidden'>
      {filteredData &&
        filteredData.map((data, index) => (
          <Card key={index} className='overflow-hidden rounded-md'>
            <Table className='text-sm'>
              <TableBody>
                <TableRow>
                  <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                    Form Code
                  </TableHead>
                  <TableCell className='flex w-[60%] items-center gap-3 whitespace-nowrap p-4 align-top'>
                    {data.formCode}

                    <Drawer>
                      <DrawerTrigger title='Form Description'>
                        <RiInformationLine className='text-lg' />
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className='m-4 space-y-2 rounded-md bg-muted p-3'>
                          <h4 className='font-semibold'>
                            {data.formCode} : {data.formName}
                          </h4>
                          <p>{data.formDescription}</p>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                    Form Name
                  </TableHead>
                  <TableCell className='w-[60%] p-4 align-top'>
                    {data.formName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                    Form Due On
                  </TableHead>
                  <TableCell className='w-[60%] p-4 align-top'>
                    {data.dueDate}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                    Form Filed On
                  </TableHead>
                  <TableCell className='w-[60%] p-4 align-top'>
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
                </TableRow>
                <TableRow>
                  <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                    Filing Status
                  </TableHead>
                  <TableCell className='w-[60%] p-4 align-top'>
                    <div className='flex items-center gap-1.5 capitalize'>
                      {isCustomDateFormat(data.filingStatus) ? null : (
                        <RiCheckboxBlankCircleFill
                          className={cn(
                            'inline flex-shrink-0 text-xs',
                            getColumnBadgeClasses(data.filingStatus)
                          )}
                        />
                      )}
                      {data.filingStatus}
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                    Application Fee
                  </TableHead>
                  <TableCell className='w-[60%] p-4 align-top'>
                    {formatCurrencyINR(data.normalFee)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className='w-[40%] bg-light-silver p-4 align-top font-semibold text-foreground'>
                    Late Fee
                  </TableHead>
                  <TableCell className='w-[60%] p-4 align-top text-destructive'>
                    {formatCurrencyINR(data.additionalFee)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        ))}
    </div>
  );
};

export default TableMobileView;
