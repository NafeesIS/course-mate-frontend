'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FaUserPlus } from 'react-icons/fa';
import { redirectToAuth } from 'supertokens-auth-react';

const SignUpBtn = ({ className }: { className?: string }) => {
  return (
    <Button
      onClick={() => redirectToAuth({ show: 'signup' })}
      className={cn(
        buttonVariants({
          variant: 'gooeyLeft',
          className: 'flex items-center gap-2',
        }),
        className
      )}
    >
      <FaUserPlus />
      Sign Up
    </Button>
  );
};

export default SignUpBtn;
