'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { CiDiscount1 } from 'react-icons/ci';
import RegisterNowLLPDialog from './RegisterNowLLPDialog';

const PricingCardsLLP = () => {
  const [selectedPlan, setSelectedPlan] = useState('Starter');

  return (
    <div className=''>
      <div className='wrapper mb-20 mt-12 py-8 md:py-12 lg:py-16'>
        <h2 className='mx-auto mb-10 max-w-md px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
          <span className='mr-1 italic text-primary'>Right Plan</span> for your
          business
        </h2>
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
        <div className='mx-auto flex max-w-[300px] gap-16 overflow-hidden md:grid md:max-w-full md:grid-cols-3 md:gap-6 lg:gap-14'>
          <div
            className={`min-w-[300px] max-w-[300px] rounded-lg border bg-white px-3 py-5 shadow-lg duration-200 md:min-w-0 md:max-w-full lg:px-5 lg:py-6 ${selectedPlan === 'Starter' ? 'translate-x-0' : '-translate-x-full md:-translate-x-0'}`}
          >
            <p className='mb-2 text-start text-lg font-semibold lg:mb-4'>
              Starter
            </p>
            <p className='text-muted-foreground-darker mb-2 text-start text-xs lg:text-sm'>
              Starter application filing: Regular processing time for results
            </p>
            <div className='flex items-center justify-start gap-4'>
              <div className='relative w-fit'>
                <p className='text-base font-medium'>₹1,999</p>
                <div className='absolute top-[9px] w-full translate-y-[-40%] rotate-[-16deg] border-b-[1px] border-[#E83E3E] md:top-[11px]'></div>
              </div>
              <p className='flex items-center justify-center gap-1 rounded-full bg-[#ECF8EB] px-2 py-0.5'>
                <CiDiscount1 className='text-xs' fill='#3EB837' />{' '}
                <span className='text-[8px] text-[#3EB837] lg:text-[10px]'>
                  25% Discount
                </span>
              </p>
            </div>
            <p className='my-4'>
              <span className='text-3xl font-bold'>₹1,499</span>{' '}
              <span className='text-xs text-muted-foreground lg:text-sm'>
                + Govt. Fee
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
            <RegisterNowLLPDialog
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
                    LLP Incorporation form filing done in{' '}
                    <span className='font-semibold'>21 days*</span>
                  </span>
                </p>
                <p className='flex items-center justify-start gap-2'>
                  <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                  <span className='text-xs lg:text-sm'>
                    LLP Incorporation Certificate
                  </span>
                </p>
                <p className='flex items-center justify-start gap-2'>
                  <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                  <span className='text-xs lg:text-sm'>
                    <span className='font-semibold'>LLP agreement</span> form
                    filing done in 14 days (Post Incorporation)
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
              Expedited application filing: Faster processing for quicker
              results
            </p>
            <div className='flex items-center justify-start gap-4'>
              <div className='relative w-fit'>
                <p className='text-base font-medium'>₹3,599</p>
                <div className='absolute top-[9px] w-full translate-y-[-40%] rotate-[-16deg] border-b-[1px] border-[#E83E3E] md:top-[11px]'></div>
              </div>
              <p className='flex items-center justify-center gap-1 rounded-full bg-[#ECF8EB] px-2 py-0.5'>
                <CiDiscount1 className='text-xs' fill='#3EB837' />{' '}
                <span className='text-[8px] text-[#3EB837] lg:text-[10px]'>
                  35% Discount
                </span>
              </p>
            </div>
            <p className='my-4'>
              <span className='text-3xl font-bold'>₹2,499</span>{' '}
              <span className='text-xs text-muted-foreground lg:text-sm'>
                + Govt. Fee
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
            <RegisterNowLLPDialog
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
                    <span className='font-semibold'> 24 hours*</span>
                  </span>
                </p>
                <p className='flex items-center justify-start gap-2'>
                  <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                  <span className='text-xs lg:text-sm'>
                    DSC in just{' '}
                    <span className='font-semibold'> 24 hours*</span>
                  </span>
                </p>
                <p className='flex items-center justify-start gap-2'>
                  <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                  <span className='text-xs lg:text-sm'>
                    LLP Incorporation form filing done in{' '}
                    <span className='font-semibold'> 14 days*</span>
                  </span>
                </p>
                <p className='flex items-center justify-start gap-2'>
                  <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                  <span className='text-xs lg:text-sm'>
                    LLP Incorporation Certificate
                  </span>
                </p>
                <p className='flex items-center justify-start gap-2'>
                  <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                  <span className='text-xs lg:text-sm'>
                    <span className='font-semibold'>LLP agreement </span> form
                    filing done in 7 days (Post Incorporation)
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
                    <span className='font-semibold'> Digital </span> welcome kit
                    that includes a checklist of all compliances
                  </span>
                </p>
                <p className='flex items-center justify-start gap-2'>
                  <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                  <span className='text-xs lg:text-sm'>
                    {' '}
                    <span className='font-semibold'> DIN </span> for directors
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div
            className={`min-w-[300px] max-w-[300px] rounded-lg border bg-background bg-gradient-to-b from-[#0076CE52] via-[#0076CE29] to-[#FFFFFF00] px-3 py-5 shadow-lg duration-200 md:min-w-0 md:max-w-full lg:px-5 lg:py-6 ${selectedPlan === 'Elite' ? '-translate-x-[728px] md:-translate-x-0' : 'translate-x-full md:translate-x-0'}`}
          >
            <p className='mb-2 text-start text-lg font-semibold lg:mb-4'>
              Elite
            </p>
            <p className='text-muted-foreground-darker mb-2 text-start text-xs lg:text-sm'>
              Complete solution (LLP incopration + Annual compliance)
            </p>
            <div className='flex items-center justify-start gap-4'>
              <div className='relative w-fit'>
                <p className='text-base font-medium'>₹21,999</p>
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
              <span className='text-3xl font-bold'>₹10,999</span>{' '}
              <span className='text-xs text-muted-foreground lg:text-sm'>
                + Govt. Fee
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
            <RegisterNowLLPDialog
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
                    Form 8 & 11 filing (One year)
                  </span>
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
                    One Year Income Tax filing (Upto turnover of 20 lakhs)
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
                    <span className='font-semibold'>
                      {' '}
                      30-minute call with a senior CA/CS{' '}
                    </span>{' '}
                    for your business planning
                  </span>
                </p>
                <p className='flex items-center justify-start gap-2'>
                  <AiOutlineCheck fill='#3EB837' className='min-w-5 max-w-5' />{' '}
                  <span className='text-xs lg:text-sm'>
                    Financial statement preparation
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
    </div>
  );
};

export default PricingCardsLLP;
