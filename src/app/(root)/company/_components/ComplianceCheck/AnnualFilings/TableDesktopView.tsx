/* eslint-disable indent */
'use client';

import { TAnnualFilingsData } from '@/app/(root)/company/_types/CompanyDetails';
import { Card } from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
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
import React, { useEffect, useState } from 'react';
import {
  RiArrowDownDoubleFill,
  RiArrowRightSLine,
  RiCheckboxBlankCircleFill,
  RiInformationLine,
} from 'react-icons/ri';
import LateAGMDesc from './LateAGMDesc';
import LateAGMTooltip from './LateAGMTooltip';

type Props = {
  selectedViewOption: string;
  filteredData: TAnnualFilingsData[];
  companyType: string;
};

const TableDesktopView = ({
  selectedViewOption,
  filteredData,
  companyType,
}: Props) => {
  const [showDescription, setShowDescription] = useState<number | null>(null);
  const [showFormDescription, setShowFormDescription] = useState(false);
  const [showLateAGMDescription, setShowLateAGMDescription] = useState<
    number | null
  >(null);
  const [displayedRows, setDisplayedRows] = useState(10); // Initial number of rows displayed

  useEffect(() => {
    setShowDescription(null);
    setShowFormDescription(false);
    setShowLateAGMDescription(null);
  }, [selectedViewOption, filteredData]);

  const toggleDisplayedRows = () => {
    setDisplayedRows(displayedRows === 10 ? filteredData.length : 10);
  };

  const handleShowLateAGMDesc = (index: number, periodOfDelay: any) => {
    if (periodOfDelay) {
      setShowLateAGMDescription(
        showLateAGMDescription === index ? null : index
      );
    }
  };

  return (
    <div className='mt-3 hidden md:block'>
      {selectedViewOption === 'financial-year' && (
        <Card className='rounded-md'>
          <Table>
            <TableHeader>
              <TableRow className='divide-x bg-muted'>
                <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                  Form Code *
                </TableHead>
                <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                  Form Name
                </TableHead>
                {companyType !== 'LLP' && (
                  <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                    AGM Held On
                  </TableHead>
                )}
                {/* TODO: */}
                <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                  Form Due On
                </TableHead>
                {/* TODO: */}
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
                filteredData.map((annualFiling, index) => (
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
                        <RiArrowRightSLine /** rotates based on form description show/hide */
                          className={`-translate-x-2 transition-all ${
                            showDescription === index ? 'rotate-90' : ''
                          }`}
                        />{' '}
                        {annualFiling.formCode}
                      </TableCell>
                      <TableCell className='min-w-40 p-4 align-top'>
                        {annualFiling.formName}
                      </TableCell>
                      {companyType !== 'LLP' && (
                        <TableCell className='whitespace-nowrap p-4 align-top'>
                          {/* if isLateAgmHeld true -> then show tool tip */}
                          {annualFiling.isLateAgmHeld ? (
                            <LateAGMTooltip
                              agmDate={annualFiling.agmDate}
                              periodOfDelay={annualFiling.periodOfDelay}
                            />
                          ) : (
                            annualFiling.agmDate
                          )}
                        </TableCell>
                      )}
                      <TableCell className='flex gap-1 whitespace-nowrap p-4 align-top'>
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

                      {/* data of financial year 2021-22 for LLP Form 11 temporarily unavailable */}
                      {companyType === 'LLP' &&
                      // annualFiling.formCode === 'LLP Form 11' &&
                      annualFiling.filingStatus.includes(
                        'temporarily unavailable'
                      ) &&
                      annualFiling.financialYear === '2021-2022' ? (
                        // TODO: remove this code once financial year 2021-22 data available
                        <HoverCard>
                          <TableCell colSpan={4} className='w-full align-top'>
                            <HoverCardTrigger className='flex w-full cursor-pointer items-center gap-1.5 p-4 text-muted-foreground'>
                              <RiInformationLine className='inline-block text-lg' />
                              <div>{annualFiling.filingStatus}</div>
                            </HoverCardTrigger>
                          </TableCell>
                          <HoverCardContent className='w-96'>
                            <h6 className='font-bold underline'>
                              Public documents that are temporary unavailable
                              for companies:
                            </h6>
                            <p className='mt-2 text-sm'>
                              LLP Form 3, and LLP Form 11 (FY: 2021-22)
                            </p>

                            <p className='mt-2 text-sm text-muted-foreground'>
                              MCA is upgrading to v3 and some of the public
                              documents are temporarily unavailable. Hence, the
                              data from these documents will not be updated till
                              the availability for the same is restored. All
                              other data will be available as usual.
                            </p>
                          </HoverCardContent>
                        </HoverCard>
                      ) : (
                        <>
                          <TableCell className='whitespace-nowrap p-4 align-top'>
                            <div className='flex items-center gap-1.5'>
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
                          <TableCell
                            className={cn('whitespace-nowrap p-4 align-top')}
                          >
                            <div className='flex items-center gap-1.5'>
                              {isCustomDateFormat(
                                annualFiling.filingStatus
                              ) ? null : (
                                <RiCheckboxBlankCircleFill
                                  className={cn(
                                    'inline text-xs',
                                    getColumnBadgeClasses(
                                      annualFiling.filingStatus
                                    )
                                  )}
                                />
                              )}
                              {annualFiling.filingStatus}
                            </div>
                          </TableCell>
                          <TableCell className='whitespace-nowrap p-4 text-right align-top'>
                            {formatCurrencyINR(annualFiling.normalFee)}
                          </TableCell>
                          <TableCell className='flex justify-end gap-0.5 whitespace-nowrap p-4 text-right align-top text-destructive'>
                            {formatCurrencyINR(annualFiling.additionalFee)}
                            <span className='-mt-1 text-[8px]'>
                              {annualFiling.isAdditionalFeeManuallyAdded && '#'}
                            </span>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                    {showDescription === index && (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <div className='m-4 space-y-2 rounded-md bg-muted p-3'>
                            <h4 className='font-semibold'>
                              {annualFiling.formCode} : {annualFiling.formName}
                            </h4>
                            <p>{annualFiling.formDescription}</p>
                          </div>
                          {annualFiling.isLateAgmHeld && (
                            <LateAGMDesc
                              agmDate={annualFiling.agmDate}
                              periodOfDelay={annualFiling.periodOfDelay}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {selectedViewOption === 'form-code' && (
        <Card className='overflow-hidden rounded-md'>
          <div className='flex divide-x'>
            <div
              className='flex w-[20%] cursor-pointer flex-col justify-center gap-4 p-4 transition-all hover:opacity-80'
              onClick={() => setShowFormDescription(!showFormDescription)}
            >
              <div>
                {/* FORM CODE */}
                <h6 className='flex items-center font-semibold'>
                  <RiArrowRightSLine
                    className={`-translate-x-2 transition-all ${
                      showFormDescription ? 'rotate-90' : ''
                    }`}
                  />{' '}
                  {filteredData[0].formCode}
                </h6>
                {/* FORM NAME */}
                <p className='ml-4 mt-2 text-sm font-normal'>
                  {filteredData[0].formName}
                </p>
              </div>

              {showFormDescription && (
                <div className='divide-y rounded bg-muted px-4 text-sm'>
                  {/* FORM DESCRIPTION */}
                  <div className='space-y-1.5 py-4'>
                    <h6 className='font-bold'>Form Description</h6>
                    <p className='text-sm font-normal'>
                      {filteredData[0].formDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Table>
              <TableHeader>
                <TableRow className='divide-x bg-muted'>
                  <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                    Financial Year
                  </TableHead>
                  {companyType !== 'LLP' && (
                    <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                      AGM Held On
                    </TableHead>
                  )}
                  <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                    {filteredData[0].formCode} Due On
                  </TableHead>
                  <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                    {filteredData[0].formCode} Filed On
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
                  filteredData
                    .slice(0, displayedRows)
                    .map((annualFiling, index) => (
                      <React.Fragment key={index}>
                        <TableRow
                          key={index}
                          className='divide-x'
                          onClick={() =>
                            handleShowLateAGMDesc(
                              index,
                              annualFiling.periodOfDelay
                            )
                          }
                        >
                          <TableCell className='whitespace-nowrap p-4 align-top'>
                            {annualFiling.financialYear}
                          </TableCell>
                          {companyType !== 'LLP' && (
                            <TableCell className='whitespace-nowrap p-4 align-top'>
                              {/* if isLateAgmHeld true -> then show tool tip */}
                              {annualFiling.isLateAgmHeld ? (
                                <LateAGMTooltip
                                  agmDate={annualFiling.agmDate}
                                  periodOfDelay={annualFiling.periodOfDelay}
                                />
                              ) : (
                                annualFiling.agmDate
                              )}
                            </TableCell>
                          )}

                          {/* data of financial year 2021-22 for LLP Form 11 temporarily unavailable */}
                          {companyType === 'LLP' &&
                          // annualFiling.formCode === 'LLP Form 11' &&
                          annualFiling.filingStatus.includes(
                            'temporarily unavailable'
                          ) &&
                          annualFiling.financialYear === '2021-2022' ? (
                            // TODO: remove this code once financial year 2021-22 data available
                            <HoverCard>
                              <TableCell
                                colSpan={5}
                                className='w-full align-top'
                              >
                                <HoverCardTrigger className='flex w-full cursor-pointer items-center gap-1.5 p-4 text-muted-foreground'>
                                  <RiInformationLine className='inline-block text-lg' />
                                  <div>{annualFiling.filingStatus}</div>
                                </HoverCardTrigger>
                              </TableCell>
                              <HoverCardContent className='w-96'>
                                <h6 className='font-bold underline'>
                                  Public documents that are temporary
                                  unavailable for companies:
                                </h6>
                                <p className='mt-2 text-sm'>
                                  LLP Form 3, and LLP Form 11 (FY: 2021-22)
                                </p>

                                <p className='mt-2 text-sm text-muted-foreground'>
                                  MCA is upgrading to v3 and some of the public
                                  documents are temporarily unavailable. Hence,
                                  the data from these documents will not be
                                  updated till the availability for the same is
                                  restored. All other data will be available as
                                  usual.
                                </p>
                              </HoverCardContent>
                            </HoverCard>
                          ) : (
                            // TODO: Add data of financial year 2021-22 once available
                            <>
                              <TableCell className='flex gap-1 whitespace-nowrap p-4 align-top'>
                                {annualFiling.dueDate}{' '}
                                {annualFiling.formCode === 'LLP Form 11' &&
                                  annualFiling.financialYear ===
                                    '2019-2020' && (
                                    <span className='-mt-1 text-[10px] font-extrabold text-muted-foreground'>
                                      &loz;
                                    </span>
                                  )}
                                {annualFiling.formCode === 'LLP Form 8' &&
                                  annualFiling.financialYear ===
                                    '2020-2021' && (
                                    <span className='-mt-1 text-[8px] font-extrabold text-muted-foreground'>
                                      &Dagger;
                                    </span>
                                  )}
                              </TableCell>
                              <TableCell className='whitespace-nowrap p-4 align-top'>
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
                              <TableCell
                                className={cn(
                                  'whitespace-nowrap p-4 align-top',
                                  annualFiling.filingStatus.includes('delay')
                                    ? 'text-destructive'
                                    : 'text-foreground'
                                )}
                              >
                                <div className='flex items-center gap-1.5 capitalize'>
                                  {isCustomDateFormat(
                                    annualFiling.filingStatus
                                  ) ? null : (
                                    <RiCheckboxBlankCircleFill
                                      className={cn(
                                        'inline text-xs',
                                        getColumnBadgeClasses(
                                          annualFiling.filingStatus
                                        )
                                      )}
                                    />
                                  )}
                                  {annualFiling.filingStatus}
                                </div>
                              </TableCell>
                              <TableCell className='whitespace-nowrap p-4 text-right align-top'>
                                {formatCurrencyINR(annualFiling.normalFee)}
                              </TableCell>
                              <TableCell className='flex justify-end gap-0.5 whitespace-nowrap p-4 text-right align-top text-destructive'>
                                {formatCurrencyINR(annualFiling.additionalFee)}{' '}
                                <span className='-mt-1 text-[8px]'>
                                  {annualFiling.isAdditionalFeeManuallyAdded &&
                                    '#'}
                                </span>
                              </TableCell>
                            </>
                          )}
                        </TableRow>

                        {showLateAGMDescription === index && (
                          <TableRow>
                            <TableCell colSpan={7}>
                              <LateAGMDesc
                                agmDate={annualFiling.agmDate}
                                periodOfDelay={annualFiling.periodOfDelay}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                {filteredData && filteredData.length > 10 && (
                  <TableRow
                    onClick={toggleDisplayedRows}
                    className='cursor-pointer'
                  >
                    <TableCell colSpan={6}>
                      <div className='flex-center gap-4 text-xs text-muted-foreground'>
                        {displayedRows === 10 ? 'See More' : 'See Less'}
                        <RiArrowDownDoubleFill
                          className={`-translate-x-2 transition-all ${
                            displayedRows === 10 ? '' : 'rotate-180'
                          }`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TableDesktopView;
