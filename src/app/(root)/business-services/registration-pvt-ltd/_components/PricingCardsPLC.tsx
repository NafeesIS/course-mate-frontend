'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatPriceWithCommas } from '@/lib/utils';
import { useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { CiDiscount1 } from 'react-icons/ci';
import { RiArrowDownSLine } from 'react-icons/ri';
import { statePrice } from '../_data/WhyIncorporateData';
import GovtFeeBreakdown from './GovtFeeBreakdown';
import RegisterNowDialog from './RegisterNowDialog';

const PricingCardsPLC = () => {
  const [selectedPlan, setSelectedPlan] = useState('Starter');
  const [selectedState, setSelectedState] = useState<any>(null);

  const handleStateSelection = (state: any) => {
    setSelectedState(state);
  };
  // const handleBuyNowClick = (planName: string) => {
  //   if (selectedState === null) {
  //     // Show toast if no state is selected
  //     toast.info('Please select your state first.');
  //     return; // Stop the function from routing
  //   }

  //   // Proceed if state is selected
  //   setSelectedMyPlan(planName);
  //   setYourState(selectedState?.stateName);
  //   setStatePricing(selectedState?.totalAmount);
  //   router.push('/business-services/plan-purchase/checkout');
  // };

  // Function to handle state selection

  return (
    // <div className=''>
    <div className='wrapper mb-20 mt-12 py-8 md:py-12 lg:py-16'>
      <h2 className='mx-auto mb-10 max-w-md px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        <span className='mr-1 italic text-primary'>Right Plan</span> for your
        business
      </h2>
      <div className='mx-auto mb-10 flex max-w-2xl flex-col items-center justify-between gap-5 rounded-lg border bg-muted p-4 sm:flex-row md:p-8'>
        <div className='flex items-center justify-start gap-1.5 whitespace-nowrap text-xs font-semibold sm:text-sm lg:text-base'>
          <span>Select your state to view the Government Fee</span>{' '}
          <GovtFeeBreakdown />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className='w-full sm:max-w-56' asChild>
            <Button
              variant='outline'
              size='sm'
              className='h-8 w-full max-w-56 gap-2 border-primary bg-muted text-xs text-primary hover:text-primary'
            >
              {selectedState ? selectedState.stateName : 'Select State'}{' '}
              <RiArrowDownSLine />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='no-scrollbar max-h-64 w-56 divide-y overflow-scroll'>
            {statePrice.map((state, idx) => (
              <DropdownMenuCheckboxItem
                onClick={() => handleStateSelection(state)}
                checked={selectedState?.stateName === state.stateName}
                key={idx}
                className='hover:bg-muted'
              >
                {state.stateName}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className={`${selectedState ? 'visible scale-100' : 'h-0 scale-0'} -mt-5 duration-500`}
      >
        <div className='mb-5 flex items-center justify-start gap-2 sm:justify-center'>
          <p className='text-start text-[10px] font-semibold md:text-center lg:text-sm'>
            Breakdown of Government fee
          </p>
          <GovtFeeBreakdown buttonName='Show All' />
        </div>
        <Card
          className={`no-scrollbar mx-auto mb-5 max-h-80 w-full max-w-full overflow-scroll rounded-md sm:w-full sm:max-w-4xl`}
        >
          <Table className='min-w-4xl border-b text-[10px] lg:text-xs'>
            <TableHeader>
              <TableRow className='divide-x bg-muted'>
                <TableHead className='p-2 text-center font-semibold text-foreground lg:p-4'>
                  State of Registration
                </TableHead>

                <TableHead className='p-2 text-center font-semibold text-foreground lg:p-4'>
                  <span className='whitespace-nowrap'>2 DSC price</span> <br />
                  <span>(Inclusive of taxes)</span>
                </TableHead>
                <TableHead className='p-2 text-center font-semibold text-foreground lg:p-4'>
                  <span>RUN + PAN/TAN</span> <br />
                  <span>(Inclusive of taxes)</span>
                </TableHead>
                <TableHead className='p-2 text-center font-semibold text-foreground lg:p-4'>
                  <span className='whitespace-nowrap'>State filing fee</span>{' '}
                  <br />
                  <span>(Auth capital up to ₹1 Lakh)</span>
                </TableHead>
                <TableHead className='p-2 text-center font-semibold text-foreground lg:p-4'>
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

              <TableRow className={`divide-x text-center`}>
                <TableCell className='p-2 align-top md:whitespace-nowrap lg:p-4'>
                  {selectedState?.stateName}
                </TableCell>
                <TableCell className='p-2 align-top md:whitespace-nowrap lg:p-4'>
                  {formatPriceWithCommas(selectedState?.dscPrice)}
                </TableCell>
                <TableCell className='p-2 align-top md:whitespace-nowrap lg:p-4'>
                  {formatPriceWithCommas(selectedState?.panTan)}
                </TableCell>
                <TableCell className='p-2 align-top md:whitespace-nowrap lg:p-4'>
                  {formatPriceWithCommas(selectedState?.stateFilingFee)}
                </TableCell>
                <TableCell className='p-2 align-top md:whitespace-nowrap lg:p-4'>
                  {formatPriceWithCommas(selectedState?.totalAmount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className='mb-2 mr-auto mt-5 max-h-80 w-full px-4'>
            <p className='text-[10px] font-semibold'>Terms & Conditions</p>
            <ul className='mt-2 list-inside list-disc space-y-2 text-[10px] font-normal'>
              <li>
                Government fee (Company/TradeMark Registration), DSC token, and
                courier charges are extra and will be collected after expert
                consultation.
              </li>
              <li>
                Our promise for application filing (SPICe+) time depends on MCA
                portal availability.
              </li>
              <li>Each additional DSC will cost ₹2000 + taxes.</li>
            </ul>
          </div>
        </Card>
      </div>
      <div className='sticky top-[52px] z-20 mx-auto -mt-2 mb-4 flex max-w-[300px] items-center justify-center gap-5 bg-white py-2 md:hidden'>
        <Button
          className={cn(
            'cursor-pointer bg-transparent text-black duration-200 hover:bg-transparent hover:text-primary',
            selectedPlan === 'Starter'
              ? 'font-semibold text-primary underline underline-offset-8'
              : ''
          )}
          onClick={() => setSelectedPlan('Starter')}
        >
          Starter
        </Button>
        <Button
          className={cn(
            'cursor-pointer bg-transparent text-black duration-200 hover:bg-transparent hover:text-primary',
            selectedPlan === 'Standard'
              ? 'font-semibold text-primary underline underline-offset-8'
              : ''
          )}
          onClick={() => setSelectedPlan('Standard')}
        >
          Standard
        </Button>
        <Button
          className={cn(
            'cursor-pointer bg-transparent text-black duration-200 hover:bg-transparent hover:text-primary',
            selectedPlan === 'Elite'
              ? 'font-semibold text-primary underline underline-offset-8'
              : ''
          )}
          onClick={() => setSelectedPlan('Elite')}
        >
          Elite
        </Button>
      </div>
      <div className='mx-auto flex max-w-[300px] gap-16 overflow-hidden md:mt-6 md:grid md:max-w-full md:grid-cols-3 md:gap-6 lg:mt-8 lg:gap-8'>
        <div
          className={`min-w-[300px] max-w-[300px] rounded-lg border bg-white px-3 py-5 shadow-lg duration-200 md:min-w-0 md:max-w-full lg:px-5 lg:py-6 ${selectedPlan === 'Starter' ? 'translate-x-0' : '-translate-x-full md:-translate-x-0'}`}
        >
          <p className='mb-2 text-start text-lg font-semibold lg:mb-4'>
            Starter
          </p>
          <p className='text-muted-foreground-darker mb-2 text-start text-xs lg:text-sm'>
            Perfect for initiating private ltd company registration
          </p>
          <div className='flex items-center justify-start gap-4'>
            <div className='relative w-fit'>
              <p className='text-base font-medium'>₹1,499</p>
              <div className='absolute top-[9px] w-full translate-y-[-40%] rotate-[-16deg] border-b-[1px] border-[#E83E3E] md:top-[11px]'></div>
            </div>
            <p className='flex items-center justify-center gap-1 rounded-full bg-[#ECF8EB] px-2 py-0.5'>
              <CiDiscount1 className='text-xs' fill='#3EB837' />{' '}
              <span className='text-[8px] text-[#3EB837] lg:text-[10px]'>
                ₹500 Discount
              </span>
            </p>
          </div>
          <p className='my-4'>
            <span className='text-2xl font-bold'>₹999</span>{' '}
            <span className='text-xs text-muted-foreground lg:text-sm'>
              + ₹
              {selectedState
                ? `${formatPriceWithCommas(selectedState.totalAmount)} Govt. Fee`
                : 'Govt. Fee'}{' '}
              (to be paid later)
            </span>
          </p>
          <Separator />
          {/* <div className='my-3 flex items-center justify-start gap-4'>
              <Image src={coinMap} alt='coin map' />
              <div>
                <p className='mb-0.5 text-start text-xs font-semibold lg:text-sm'>
                  Get ₹1000 cashback*
                </p>
                <p className='text-start text-xs font-medium lg:text-sm'>
                  Upon opening current acct with our partner banks T&C
                </p>
              </div>
            </div>
            <Separator /> */}
          <RegisterNowDialog
            buttonName='Get Started'
            buttonClassName='mt-4 w-full px-8'
          />
          <div className=' mt-4'>
            <p className='mb-3 text-lg font-semibold'>What you will get</p>
            <div className='flex flex-col items-start justify-start gap-3'>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Expert assisted process
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Your company name is reserved in just{' '}
                  <span className='font-semibold'>2 - 4 days*</span>
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  DSC in <span className='font-semibold'>4 - 7 days*</span>
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  SPICe+ form filing in{' '}
                  <span className='font-semibold'>14 days*</span>
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Incorporation Certificate in{' '}
                  <span className='font-semibold'>14 - 21 days*</span>
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Company <span className='font-semibold'> PAN+TAN</span>
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  {' '}
                  <span className='font-semibold'> DIN</span> for directors
                </span>
              </p>
            </div>
          </div>
        </div>
        <div
          className={`min-w-[300px] max-w-[300px] rounded-lg border bg-white px-3 py-5 shadow-lg duration-200 md:min-w-0 md:max-w-full lg:px-5 lg:py-6 ${selectedPlan === 'Standard' ? '-translate-x-[364px] md:-translate-x-0' : ` ${selectedPlan === 'Elite' ? '-translate-x-[768px] md:translate-x-0' : 'translate-x-full md:translate-x-0'}`}`}
        >
          <p className='mb-2 text-start text-lg font-semibold lg:mb-4'>
            Standard
          </p>
          <p className='text-muted-foreground-darker mb-2 text-start text-xs lg:text-sm'>
            Quick private ltd company registration in 7 to 14 days
          </p>
          <div className='flex items-center justify-start gap-4'>
            <div className='relative w-fit'>
              <p className='text-base font-medium'>₹2,999</p>
              <div className='absolute top-[9px] w-full translate-y-[-40%] rotate-[-16deg] border-b-[1px] border-[#E83E3E] md:top-[11px]'></div>
            </div>
            <p className='flex items-center justify-center gap-1 rounded-full bg-[#ECF8EB] px-2 py-0.5'>
              <CiDiscount1 className='text-xs' fill='#3EB837' />{' '}
              <span className='text-[8px] text-[#3EB837] lg:text-[10px]'>
                50% Discount
              </span>
            </p>
          </div>
          <p className='my-4'>
            <span className='text-2xl font-bold'>₹1,499</span>{' '}
            <span className='text-xs text-muted-foreground lg:text-sm'>
              + ₹
              {selectedState
                ? `${formatPriceWithCommas(selectedState.totalAmount)} Govt. Fee`
                : 'Govt. Fee'}{' '}
              (to be paid later)
            </span>
          </p>
          <Separator />
          {/* <div className='my-3 flex items-center justify-start gap-4'>
              <Image src={coinMap} alt='coin map' />
              <div>
                <p className='mb-0.5 text-start text-xs font-semibold lg:text-sm'>
                  Get ₹1000 cashback*
                </p>
                <p className='text-start text-xs font-medium lg:text-sm'>
                  Upon opening current acct with our partner banks T&C
                </p>
              </div>
            </div>
            <Separator /> */}
          <RegisterNowDialog
            buttonName='Get Started'
            buttonClassName='mt-4 w-full px-8'
          />
          <div className=' mt-4'>
            <p className='mb-3 text-lg font-semibold'>What you will get</p>
            <div className='flex flex-col items-start justify-start gap-3'>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Expert assisted process
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Your company name is reserved in just{' '}
                  <span className='font-semibold'>1 - 2 days*</span>
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  DSC in just{' '}
                  <span className='font-semibold'> 3 - 4 days*</span>
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  SPICe+ form filing in{' '}
                  <span className='font-semibold'>5 - 7 days*</span>
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Incorporation Certificate in
                  <span className='font-semibold'> 7 - 14 days*</span>
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Company <span className='font-semibold'>PAN+TAN</span>{' '}
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  {' '}
                  <span className='font-semibold'> DIN </span> for directors
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  <span className='font-semibold'> Digital </span> welcome kit
                  that includes a checklist of all compliances
                </span>
              </p>
            </div>
          </div>
        </div>
        <div
          className={`min-w-[300px] max-w-[300px] rounded-lg border bg-background bg-gradient-to-b from-[#0076CE52] via-[#0076CE29] to-[#FFFFFF00] px-3 py-5 shadow-lg duration-200 md:min-w-0 md:max-w-full lg:px-5 lg:py-6 ${selectedPlan === 'Elite' ? '-translate-x-[728px] md:-translate-x-0' : 'translate-x-full md:translate-x-0'}`}
        >
          <p className='mb-2 text-start text-lg font-semibold lg:mb-4'>Elite</p>
          <p className='text-muted-foreground-darker mb-2 text-start text-xs lg:text-sm'>
            Complete solution (Company incopration + Annual compliance)
          </p>
          <div className='flex items-center justify-start gap-4'>
            <div className='relative w-fit'>
              <p className='text-base font-medium'>₹29,999</p>
              <div className='absolute top-[9px] w-full translate-y-[-40%] rotate-[-16deg] border-b-[1px] border-[#E83E3E] md:top-[11px]'></div>
            </div>
            <p className='flex items-center justify-center gap-1 rounded-full bg-[#ECF8EB] px-2 py-0.5'>
              <CiDiscount1 className='text-xs' fill='#3EB837' />{' '}
              <span className='text-[8px] text-[#3EB837] lg:text-[10px]'>
                17% Discount
              </span>
            </p>
          </div>
          <p className='my-4'>
            <span className='text-2xl font-bold'>₹24,999</span>{' '}
            <span className='text-xs text-muted-foreground lg:text-sm'>
              + ₹
              {selectedState
                ? `${formatPriceWithCommas(selectedState.totalAmount)} Govt. Fee`
                : 'Govt. Fee'}{' '}
              (to be paid later)
            </span>
          </p>
          <Separator />
          {/* <div className='my-3 flex items-center justify-start gap-4'>
              <Image src={coinMap} alt='coin map' />
              <div>
                <p className='mb-0.5 text-start text-xs font-semibold lg:text-sm'>
                  Get ₹1000 cashback*
                </p>
                <p className='text-start text-xs font-medium lg:text-sm'>
                  Upon opening current acct with our partner banks T&C
                </p>
              </div>
            </div>
            <Separator /> */}
          <RegisterNowDialog
            buttonName='Get Started'
            buttonClassName='mt-4 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 px-8 py-3'
          />
          <div className=' mt-4'>
            <p className='mb-3 text-lg font-semibold'>What you will get</p>
            <div className='flex flex-col items-start justify-start gap-3'>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs font-semibold lg:text-sm'>
                  Includes everything from the Standard Package
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Appointment of Auditor
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Issuance of share certificate
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>INC 20 A form filing</span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  DIR 3 KYC (For 2 directors)
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Accounting & Bookeeping (Upto 100 transactions)
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Financial statement preparation
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  AOC 4, MGT 7 & ADT 1 filing
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Annual filing (Upto turnover of 20 lakhs)
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Facilitation of Annual General Meeting
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  Statutory regulations PF, ESI
                </span>
              </p>
              <p className='flex items-center justify-start gap-2'>
                <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                <span className='text-xs lg:text-sm'>
                  One Year Income Tax filing (Upto turnover of 20 lakhs)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className='mt-4 text-center text-xs text-muted-foreground'>
        <strong>Note:</strong> *Timelines are estimates and may vary based on
        document accuracy and processing delays.
      </p>
    </div>
    // </div>
  );
};

export default PricingCardsPLC;
