'use client';

/* eslint-disable indent */
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPriceWithCommas } from '@/lib/utils';
import { FaInfoCircle } from 'react-icons/fa';
import 'react-phone-input-2/lib/style.css';
import { IStatePriceBreakdown } from '../../_types/types';
import { statePrice } from '../_data/WhyIncorporateData';

const GovtFeeBreakdown = ({ buttonName = '' }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          {buttonName === '' ? (
            <span>
              <FaInfoCircle className='text-primary' />
            </span>
          ) : (
            <Button
              className='h-6 px-4 py-2 text-[10px] duration-300 hover:bg-primary hover:text-white'
              variant='outline'
              size='sm'
            >
              {buttonName}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className='mr-auto max-h-[800px] w-full max-w-96 p-4 sm:w-[90%] sm:max-w-6xl lg:mx-auto'>
          <div className='bg-transparent'>
            <DialogTitle className='px-3 pb-3 text-start text-sm font-semibold md:pb-6 md:text-center lg:text-lg'>
              Breakdown of Government fee
            </DialogTitle>
            <div>
              <Card className='no-scrollbar mx-auto max-h-80 w-full max-w-80 overflow-scroll rounded-md sm:w-[96%] sm:max-w-6xl'>
                <Table className='min-w-4xl text-xs lg:text-sm'>
                  <TableHeader>
                    <TableRow className='divide-x bg-muted'>
                      <TableHead className='p-4 text-center font-semibold text-foreground'>
                        State of Registration
                      </TableHead>

                      <TableHead className='p-4 text-center font-semibold text-foreground'>
                        <span className='whitespace-nowrap'>2 DSC price</span>{' '}
                        <br />
                        <span>(Inclusive of taxes)</span>
                      </TableHead>
                      <TableHead className='p-4 text-center font-semibold text-foreground'>
                        <span>RUN + PAN/TAN</span> <br />
                        <span>(Inclusive of taxes)</span>
                      </TableHead>
                      <TableHead className='p-4 text-center font-semibold text-foreground'>
                        <span className='whitespace-nowrap'>
                          State filing fee
                        </span>{' '}
                        <br />
                        <span>(Auth capital up to ₹1 Lakh)</span>
                      </TableHead>
                      <TableHead className='p-4 text-center font-semibold text-foreground'>
                        Total Govt. Fee
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statePrice.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className='p-4 text-center'>
                          No data found
                        </TableCell>
                      </TableRow>
                    )}

                    {statePrice &&
                      statePrice.length > 0 &&
                      statePrice.map(
                        (item: IStatePriceBreakdown, index: number) => {
                          return (
                            <TableRow
                              key={index}
                              className={`divide-x text-center ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
                            >
                              <TableCell className='p-4 align-top md:whitespace-nowrap'>
                                {item.stateName}
                              </TableCell>
                              <TableCell className='p-4 align-top md:whitespace-nowrap'>
                                {formatPriceWithCommas(item.dscPrice)}
                              </TableCell>
                              <TableCell className='p-4 align-top md:whitespace-nowrap'>
                                {formatPriceWithCommas(item.panTan)}
                              </TableCell>
                              <TableCell className='p-4 align-top md:whitespace-nowrap'>
                                {formatPriceWithCommas(item.stateFilingFee)}
                              </TableCell>
                              <TableCell className='p-4 align-top md:whitespace-nowrap'>
                                {formatPriceWithCommas(item.totalAmount)}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                  </TableBody>
                </Table>
              </Card>
              <div className='mr-auto mt-5 max-h-80 w-full max-w-72 px-2 sm:w-[96%] sm:max-w-6xl md:mx-auto'>
                <ul className='mt-2 list-inside list-disc space-y-2 text-xs font-normal lg:text-sm'>
                  <DialogDescription className='text-xs font-semibold lg:text-sm'>
                    Terms & Conditions
                  </DialogDescription>
                  <li>
                    Government fee (Company/TradeMark Registration), DSC token
                    and courier charges are extra which will be collected after
                    expert consultation.
                  </li>
                  <li>
                    Our promise for application filing (SPICe+) time depends on
                    MCA portal availability.
                  </li>
                  <li>Each additional DSC will cost ₹2000 + taxes.</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GovtFeeBreakdown;
