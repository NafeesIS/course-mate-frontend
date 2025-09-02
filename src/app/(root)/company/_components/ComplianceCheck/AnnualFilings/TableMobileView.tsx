/* eslint-disable indent */
'use client';

import { TAnnualFilingsData } from '@/app/(root)/company/_types/CompanyDetails';
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
import LateAGMDesc from './LateAGMDesc';

type Props = {
  selectedViewOption: string;
  filteredData: TAnnualFilingsData[];
  companyType: string;
};

const TableMobileView = ({
  selectedViewOption,
  filteredData,
  companyType,
}: Props) => {
  return (
    <div className='mt-6 space-y-6 md:mt-8 md:hidden'>
      {selectedViewOption === 'financial-year' && (
        <>
          {filteredData &&
            filteredData.map((annualFiling, index) => (
              <Card key={index} className='overflow-hidden rounded-md'>
                <Table className='text-sm'>
                  <TableBody>
                    <TableRow>
                      <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                        Form Code
                      </TableHead>
                      <TableCell className='flex w-[60%] items-center gap-3 whitespace-nowrap p-4 align-top'>
                        {annualFiling.formCode}

                        <Drawer>
                          <DrawerTrigger title='Form Description'>
                            <RiInformationLine className='text-lg' />
                          </DrawerTrigger>
                          <DrawerContent>
                            <div className='m-4 space-y-2 rounded-md bg-muted p-3'>
                              <h4 className='font-semibold'>
                                {annualFiling.formCode} :{' '}
                                {annualFiling.formName}
                              </h4>
                              <p>{annualFiling.formDescription}</p>
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
                        {annualFiling.formName}
                      </TableCell>
                    </TableRow>

                    {/* if company type is not LLP then show agm date */}
                    {companyType !== 'LLP' && (
                      <TableRow>
                        <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                          AGM Held On
                        </TableHead>
                        <TableCell className='w-[60%] p-4 align-top'>
                          {/* if isLateAgmHeld true -> then show tool tip */}
                          {annualFiling.isLateAgmHeld ? (
                            <Drawer>
                              <DrawerTrigger
                                title='See details'
                                className='flex items-center gap-1.5'
                              >
                                {annualFiling.agmDate}{' '}
                                <RiInformationLine className='text-red-500' />
                              </DrawerTrigger>
                              <DrawerContent>
                                <LateAGMDesc
                                  agmDate={annualFiling.agmDate}
                                  periodOfDelay={annualFiling.periodOfDelay}
                                />
                              </DrawerContent>
                            </Drawer>
                          ) : (
                            annualFiling.agmDate
                          )}
                        </TableCell>
                      </TableRow>
                    )}

                    {/* data of financial year 2021-22 for LLP Form 11 temporarily unavailable */}
                    {companyType === 'LLP' &&
                    // annualFiling.formCode === 'LLP Form 11' &&
                    annualFiling.filingStatus.includes(
                      'temporarily unavailable'
                    ) &&
                    annualFiling.financialYear === '2021-2022' ? (
                      // TODO: remove this code once financial year 2021-22 data available
                      <TableRow>
                        <TableCell colSpan={2} className='w-full p-6 text-sm '>
                          <h6 className='font-bold underline'>
                            Public documents that are temporary unavailable for
                            companies:
                          </h6>

                          <p className='mt-2 text-sm'>
                            LLP Form 3, and LLP Form 11 (FY: 2021-22)
                          </p>
                          <p className='mt-2 text-sm text-muted-foreground'>
                            MCA is upgrading to v3 and some of the public
                            documents are temporarily unavailable. Hence, the
                            data from these documents will not be updated till
                            the availability for the same is restored. All other
                            data will be available as usual.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        <TableRow>
                          <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                            Form Due On
                          </TableHead>
                          <TableCell className='inline-flex w-[60%] gap-1 p-4 align-top'>
                            {annualFiling.dueDate}{' '}
                            {annualFiling.formCode === 'LLP Form 11' &&
                              annualFiling.financialYear === '2019-2020' && (
                                <span className='-mt-1 text-[10px] font-extrabold text-muted-foreground'>
                                  &loz;
                                </span>
                              )}
                            {annualFiling.formCode === 'LLP Form 8' &&
                              annualFiling.financialYear === '2020-2021' && (
                                <span className='-mt-1 text-[8px] font-extrabold text-muted-foreground'>
                                  &Dagger;
                                </span>
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                            Form Filed On
                          </TableHead>
                          <TableCell className='w-[60%] p-4 align-top'>
                            <div className='flex items-center gap-1.5 capitalize'>
                              {isCustomDateFormat(
                                annualFiling.filingDate
                              ) ? null : (
                                <RiCheckboxBlankCircleFill
                                  className={cn(
                                    'inline text-xs',
                                    getColumnBadgeClasses(
                                      annualFiling.filingDate
                                    )
                                  )}
                                />
                              )}
                              {annualFiling.filingDate}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                            Filing Status
                          </TableHead>
                          <TableCell className='w-[60%] p-4 align-top'>
                            <div className='flex items-center gap-1.5 capitalize'>
                              {isCustomDateFormat(
                                annualFiling.filingStatus
                              ) ? null : (
                                <RiCheckboxBlankCircleFill
                                  className={cn(
                                    'inline flex-shrink-0 text-xs',
                                    getColumnBadgeClasses(
                                      annualFiling.filingStatus
                                    )
                                  )}
                                />
                              )}
                              {annualFiling.filingStatus}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                            Application Fee
                          </TableHead>
                          <TableCell className='w-[60%] p-4 align-top'>
                            {formatCurrencyINR(annualFiling.normalFee)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className='w-[40%] bg-light-silver p-4 align-top font-semibold text-foreground'>
                            Late Fee
                          </TableHead>
                          <TableCell className='flex w-[60%] gap-0.5 p-4 align-top text-destructive'>
                            {formatCurrencyINR(annualFiling.additionalFee)}
                            <span className='-mt-1 text-[8px]'>
                              {annualFiling.isAdditionalFeeManuallyAdded && '#'}
                            </span>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </Card>
            ))}
        </>
      )}

      {selectedViewOption === 'form-code' && (
        <>
          <Card className='overflow-hidden rounded-md'>
            <Table className='text-sm'>
              <TableBody>
                <TableRow>
                  <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                    Form Code
                  </TableHead>
                  <TableCell className='flex w-[60%] items-center gap-3 whitespace-nowrap p-4 align-top'>
                    {filteredData[0].formCode}
                    <Drawer>
                      <DrawerTrigger title='Form Description'>
                        <RiInformationLine className='text-lg' />
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className='m-4 space-y-2 rounded-md bg-muted p-3'>
                          <h4 className='font-semibold'>
                            {filteredData[0].formCode} :{' '}
                            {filteredData[0].formName}
                          </h4>
                          <p>{filteredData[0].formDescription}</p>
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
                    {filteredData[0].formName}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>

          {filteredData &&
            filteredData.map((annualFiling, index) => (
              <Card key={index} className='overflow-hidden rounded-md'>
                <Table className='text-sm'>
                  <TableBody>
                    <TableRow>
                      <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                        Financial Year
                      </TableHead>
                      <TableCell className='w-[60%] p-4 align-top'>
                        {annualFiling.financialYear}
                      </TableCell>
                    </TableRow>

                    {/* if company type is not LLP then show AGM */}
                    {companyType !== 'LLP' && (
                      <TableRow>
                        <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                          AGM Held On
                        </TableHead>
                        <TableCell className='w-[60%] p-4 align-top'>
                          {/* if isLateAgmHeld true -> then show tool tip */}
                          {annualFiling.isLateAgmHeld ? (
                            <Drawer>
                              <DrawerTrigger
                                title='See details'
                                className='flex items-center gap-1.5'
                              >
                                {annualFiling.agmDate}{' '}
                                <RiInformationLine className='text-red-500' />
                              </DrawerTrigger>
                              <DrawerContent>
                                <LateAGMDesc
                                  agmDate={annualFiling.agmDate}
                                  periodOfDelay={annualFiling.periodOfDelay}
                                />
                              </DrawerContent>
                            </Drawer>
                          ) : (
                            annualFiling.agmDate
                          )}
                        </TableCell>
                      </TableRow>
                    )}

                    {/* data of financial year 2021-22 for LLP Form 11 temporarily unavailable */}
                    {companyType === 'LLP' &&
                    // annualFiling.formCode === 'LLP Form 11' &&
                    annualFiling.filingStatus.includes(
                      'temporarily unavailable'
                    ) &&
                    annualFiling.financialYear === '2021-2022' ? (
                      // TODO: remove this code once financial year 2021-22 data available
                      <TableRow>
                        <TableCell colSpan={2} className='w-full p-6 text-sm '>
                          <h6 className='font-bold underline'>
                            Public documents that are temporary unavailable for
                            companies:
                          </h6>

                          <p className='mt-2 text-sm'>
                            LLP Form 3, and LLP Form 11 (FY: 2021-22)
                          </p>
                          <p className='mt-2 text-sm text-muted-foreground'>
                            MCA is upgrading to v3 and some of the public
                            documents are temporarily unavailable. Hence, the
                            data from these documents will not be updated till
                            the availability for the same is restored. All other
                            data will be available as usual.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        <TableRow>
                          <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                            {filteredData[0].formCode} Due On
                          </TableHead>
                          <TableCell className='inline-flex w-[60%] gap-1 p-4 align-top'>
                            {annualFiling.dueDate}{' '}
                            {annualFiling.formCode === 'LLP Form 11' &&
                              annualFiling.financialYear === '2019-2020' && (
                                <span className='-mt-1 text-[10px] font-extrabold text-muted-foreground'>
                                  &loz;
                                </span>
                              )}
                            {annualFiling.formCode === 'LLP Form 8' &&
                              annualFiling.financialYear === '2020-2021' && (
                                <span className='-mt-1 text-[8px] font-extrabold text-muted-foreground'>
                                  &Dagger;
                                </span>
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                            {filteredData[0].formCode} Filed On
                          </TableHead>
                          <TableCell className='w-[60%] p-4 align-top'>
                            <div className='flex items-center gap-1.5 capitalize'>
                              {isCustomDateFormat(
                                annualFiling.filingDate
                              ) ? null : (
                                <RiCheckboxBlankCircleFill
                                  className={cn(
                                    'inline flex-shrink-0 text-xs',
                                    getColumnBadgeClasses(
                                      annualFiling.filingDate
                                    )
                                  )}
                                />
                              )}
                              {annualFiling.filingDate}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                            Filing Status
                          </TableHead>
                          <TableCell className='w-[60%] p-4 align-top'>
                            <div className='flex items-center gap-1.5 capitalize'>
                              {isCustomDateFormat(
                                annualFiling.filingStatus
                              ) ? null : (
                                <RiCheckboxBlankCircleFill
                                  className={cn(
                                    'inline flex-shrink-0 text-xs',
                                    getColumnBadgeClasses(
                                      annualFiling.filingStatus
                                    )
                                  )}
                                />
                              )}
                              {annualFiling.filingStatus}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className='w-[40%] bg-muted p-4 align-top font-semibold text-foreground'>
                            Application Fee
                          </TableHead>
                          <TableCell className='w-[60%] p-4 align-top'>
                            {formatCurrencyINR(annualFiling.normalFee)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className='w-[40%] bg-light-silver p-4 align-top font-semibold text-foreground'>
                            Late Fee
                          </TableHead>
                          <TableCell className='flex w-[60%] gap-0.5 p-4 align-top text-destructive'>
                            {formatCurrencyINR(annualFiling.additionalFee)}
                            <span className='-mt-1 text-[8px]'>
                              {annualFiling.isAdditionalFeeManuallyAdded && '#'}
                            </span>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </Card>
            ))}
        </>
      )}
    </div>
  );
};

export default TableMobileView;
