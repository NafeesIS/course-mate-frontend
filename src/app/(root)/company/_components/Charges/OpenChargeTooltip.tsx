'use client';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { IoTriangle } from 'react-icons/io5';
import { RxInfoCircled } from 'react-icons/rx';

const OpenChargeTooltip = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <Button
            className='h-5 w-5 bg-transparent p-0 hover:bg-transparent'
            onClick={handleToggle}
          >
            <RxInfoCircled className='text-sm text-primary lg:text-xl' />
          </Button>
        </TooltipTrigger>
        {/* {isOpen && ( */}
        <TooltipContent className='flex h-full max-h-96 w-full max-w-60 translate-y-2 flex-wrap whitespace-pre-wrap bg-transparent'>
          <p className='flex flex-col items-center justify-center'>
            <span className='translate-y-4 bg-black p-2 text-white'>
              When a company takes a loan or borrows money, it often has to
              promise something valuable, like property or assets, as security.
              This promise is called a charge. The company and the lender both
              sign documents to confirm this arrangement.
            </span>
            <span className='translate-y-2 rotate-180 text-2xl text-black'>
              <IoTriangle />
            </span>
          </p>
        </TooltipContent>
        {/* )} */}
      </Tooltip>
    </TooltipProvider>
  );
};

export default OpenChargeTooltip;
