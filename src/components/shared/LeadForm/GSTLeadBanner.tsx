'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RiCalendarCheckFill } from 'react-icons/ri';
import { LeadForm } from './LeadForm';

export function GSTLeadBanner({ className }: { className?: string }) {
  return (
    <section className={cn('md:wrapper mx-auto my-8', className)}>
      <Card className='flex flex-col overflow-hidden rounded-md bg-muted md:flex-row md:justify-between'>
        <div className='flex flex-col justify-center p-4 tracking-wide md:p-8'>
          <h1 className='w-fit text-xl font-bold text-foreground md:text-2xl'>
            Hassle-Free <span className='text-primary'>GST Returns Filing</span>
          </h1>
          <p className='mt-6 rounded-r-md border-l-4 border-primary bg-background p-2 text-sm text-foreground'>
            <RiCalendarCheckFill className='mr-2 inline size-5 text-primary' />
            Avoid penalties and stay compliant with our timely GST filing
            services.
          </p>
          <ul className='mt-6 list-none space-y-3 text-sm text-muted-foreground'>
            <li>
              <span className='font-bold text-foreground'>
                Fast & Reliable:
              </span>{' '}
              <span className='font-semibold'>GST filing</span> at the
              government portal within{' '}
              <span className='font-bold text-foreground'>24 hours</span> by top
              CAs.
            </li>

            <li>
              <span className='font-bold text-foreground'>Cost Savings:</span>{' '}
              <span className='font-semibold'>GSTR 2A/2B</span> Reconciliation
              ensures that your time and efforts are saved and you are able to
              claim <span className='font-semibold'>maximum ITC</span>.
            </li>
            <li>
              <span className='font-bold text-foreground'>Expert Support:</span>{' '}
              Get assistance from experienced professionals to ensure your
              filings are accurate and on time.
            </li>
            <li>
              <span className='font-bold text-foreground'>
                Affordable Pricing:
              </span>{' '}
              Quality services at competitive rates, tailored to your business
              needs.
            </li>
          </ul>
        </div>
        <div className='mt-6 w-full bg-sky-100 p-4 md:mt-0 md:max-w-sm md:px-8'>
          <h2 className='mb-4 text-center text-xl font-bold text-foreground md:text-2xl'>
            Get Started!
          </h2>
          {/* FORM */}
          <LeadForm source='gst-returns-filing' />
        </div>
      </Card>
    </section>
  );
}
