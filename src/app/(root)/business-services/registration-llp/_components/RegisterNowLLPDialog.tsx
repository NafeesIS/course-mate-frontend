'use client';

import CommonLeadForm from '@/components/shared/LeadForm/CommonLeadForm';
/* eslint-disable indent */
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

const RegisterNowLLPDialog = ({
  buttonName = 'Register Now',
  buttonClassName = 'mt-2 px-8',
}) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const serviceType = ['New company incorporation'];
  const sources = ['new llp incorporation landing page'];
  return (
    <div>
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              buttonVariants({ variant: 'gooeyLeft' }),
              buttonClassName
            )}
            onClick={() => setIsFormModalOpen(true)}
          >
            {buttonName}
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-80 sm:max-w-96'>
          <div className='mx-auto flex h-full flex-col items-center justify-center bg-card'>
            {/* <p className='mb-0 max-w-max text-start text-base font-semibold tracking-normal md:mb-3'>
              Apply for Limited Liability Partnership (LLP) Registration
            </p> */}
            {/* <p className=' mb-2 text-start text-xs text-muted-foreground sm:px-16 sm:text-sm'>
              Ready to Launch Your Private Limited Company? Fill the Form and
              Let Filesure Handle the Rest!
            </p> */}
            <DialogTitle className='mb-0 max-w-max text-start text-base font-semibold tracking-normal'>
              Apply for Limited Liability Partnership (LLP) Registration
            </DialogTitle>
            <DialogDescription className='mr-auto mt-2 max-w-max text-start text-xs text-muted-foreground sm:text-sm md:mb-3'>
              Fill the Form and Let Filesure Handle the Rest!
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

export default RegisterNowLLPDialog;
