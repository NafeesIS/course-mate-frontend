'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { RiAccountPinCircleFill } from 'react-icons/ri';
import ctaImg from '../../../../public/assets/confused.svg';
import { LeadForm } from './LeadForm';

export function CTAPopup({ customTitle }: { customTitle?: string }) {
  // "Need Help with GST and ROC Compliance?"

  const [open, setOpen] = useState(false);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const ctaButtonTextRef = useRef<HTMLParagraphElement>(null);

  const pathname = usePathname();
  const bannerTitle =
    customTitle || pathname.includes('/company')
      ? 'Feeling Overwhelmed?'
      : 'Need Help with GST and ROC Compliance?';

  // useEffect(() => {
  //   const showPopup = () => {
  //     // don't show popup in the following pages
  //     if (pathname.includes('unlock-contact')) return;
  //     setOpen(true);
  //     sessionStorage.setItem('hasShownDialog', 'true');
  //   };

  //   const hasShownDialog = sessionStorage.getItem('hasShownDialog');
  //   if (!hasShownDialog) {
  //     const initialTimeout = setTimeout(showPopup, 15000); // Show popup after 15 seconds

  //     return () => {
  //       clearTimeout(initialTimeout);
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ctaButtonRef.current && ctaButtonTextRef.current) {
        ctaButtonRef.current.classList.add('ring-4');
        ctaButtonTextRef.current.classList.add('w-32', 'opacity-100');

        setTimeout(() => {
          if (ctaButtonRef.current && ctaButtonTextRef.current) {
            ctaButtonRef.current.classList.remove('ring-4');
            ctaButtonTextRef.current.classList.remove('w-32', 'opacity-100');
          }
        }, 10000); // Reset after 10 second (adjust timing as needed)
      }
    }, 20000); // Trigger every 20 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div className='overflow-hidden'>
      <Dialog open={open} onOpenChange={setOpen}>
        {!open && (
          <DialogTrigger
            className={cn('group fixed bottom-5 left-5 z-50')}
            asChild
          >
            <Button
              variant='gooeyLeft'
              size='lg'
              ref={ctaButtonRef}
              className='flex-center h-fit w-fit rounded-full p-2 ring-2 drop-shadow-2xl transition-all hover:ring-4'
            >
              <span>
                <RiAccountPinCircleFill className='text-2xl' />
              </span>
              <p
                ref={ctaButtonTextRef}
                className='w-0 opacity-0 transition-all group-hover:w-32 group-hover:opacity-100'
              >
                Talk to an Expert
              </p>
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className='left-[50%] top-[50%] max-w-xs translate-x-[-50%] translate-y-[-50%] overflow-hidden border-0 tracking-wide md:max-w-screen-md'>
          <h2 className='text-base font-semibold md:text-lg'>{bannerTitle}</h2>
          <Separator />
          <div className='grid items-end gap-8 md:grid-cols-2'>
            <Image
              src={ctaImg}
              alt='Confused'
              width={300}
              height={300}
              className='hidden h-full w-full bg-muted object-cover md:block'
            />
            <div className='text-center'>
              <h2 className='text-lg font-semibold md:text-xl'>
                Speak with an{' '}
                <span className='rounded bg-muted-foreground px-2 py-1 tracking-wide text-background'>
                  Expert!
                </span>
              </h2>
              <h6 className='md::text-base mt-3 text-sm font-medium opacity-80'>
                Get professional assistance for all your compliance and filing
                needs.
              </h6>
              <LeadForm source='cta-popup' className='mt-5' />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
