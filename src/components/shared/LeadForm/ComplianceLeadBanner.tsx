'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RiCheckboxMultipleFill } from 'react-icons/ri';
import { LeadForm } from './LeadForm';

export function ComplianceLeadBanner({ className }: { className?: string }) {
  return (
    <section className={cn('md:wrapper mx-auto my-8', className)}>
      <Card className='flex flex-col overflow-hidden rounded-md bg-sky-100 md:flex-row md:justify-between'>
        <div className='flex flex-col justify-center p-4 tracking-wide md:p-8'>
          <h1 className='w-fit text-xl font-bold text-foreground md:text-2xl'>
            Effortless{' '}
            <span className='text-primary'>ROC Annual Compliance</span> Services{' '}
            <br />
            for Private Limited & LLP company
          </h1>
          <p className='mt-6 rounded-r-md border-l-4 border-primary bg-background p-2 text-sm text-foreground'>
            <RiCheckboxMultipleFill className='mr-2 inline size-5 text-primary' />
            Simplify your annual compliance needs with our expert support —
            swift, accurate, and hassle-free.
          </p>

          <ul className='mt-6 list-none space-y-3 text-sm text-muted-foreground'>
            <li>
              {/* <RiFileTextFill className='my-1 mr-2 inline size-4 text-green-500' /> */}
              <span className='font-bold text-foreground'>
                Premium Services:
              </span>{' '}
              Compliance filing by India&apos;s most qualified CAs.
            </li>
            <li>
              {/* <RiServiceFill className='my-1 mr-2 inline size-4 text-blue-500' /> */}
              <span className='font-bold text-foreground'>
                Comprehensive Support:
              </span>{' '}
              360° corporate legal assistance.
            </li>
            <li>
              {/* <RiTimerFill className='my-1 mr-2 inline size-4 text-purple-500' /> */}
              <span className='font-bold text-foreground'>Timely Filing:</span>{' '}
              Ensure all filings are done accurately and on time.
            </li>
            <li>
              {/* <RiShieldCheckFill className='my-1 mr-2 inline size-4 text-red-500' /> */}
              <span className='font-bold text-foreground'>
                Affordable Pricing:
              </span>{' '}
              Quality services at competitive rates, tailored to your business
              needs.
            </li>
          </ul>
        </div>
        <div className='w-full bg-muted p-4 md:mt-0 md:max-w-sm md:px-8'>
          <h2 className='mb-4 text-center text-xl font-bold text-foreground md:text-2xl'>
            Get Started!
          </h2>
          {/* FORM */}
          <LeadForm source='annual-compliance-services' />
        </div>
      </Card>
    </section>
  );
}
