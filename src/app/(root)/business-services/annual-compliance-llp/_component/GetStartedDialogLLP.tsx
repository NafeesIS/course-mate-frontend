'use client';

/* eslint-disable indent */
import CommonLeadForm from '@/components/shared/LeadForm/CommonLeadForm';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';

const GetStartedDialogLLP = ({
  buttonName = 'Get Started',
  buttonClassName = 'mt-2 px-8',
}) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const serviceType = ['Company compliance'];
  const sources = ['llp annual compliance landing page'];
  return (
    <div>
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              buttonVariants({ variant: 'gooeyLeft' }),
              buttonClassName
            )}
          >
            {buttonName}
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-80 sm:max-w-96'>
          <div className='mx-auto flex h-full flex-col items-center justify-center bg-card'>
            <DialogTitle className='mb-0 max-w-max text-start text-base font-semibold tracking-normal'>
              Annual Compliance for Limited Liability Partnership
            </DialogTitle>
            <DialogDescription className='mr-auto mt-2 max-w-max text-start text-xs text-muted-foreground sm:text-sm md:mb-3'>
              Fill Out the Form and Stay Compliant with Ease!
            </DialogDescription>
            <CommonLeadForm
              setIsFormModalOpen={setIsFormModalOpen}
              serviceType={serviceType}
              sources={sources}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetStartedDialogLLP;
