'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FaSignInAlt } from 'react-icons/fa';
import { redirectToAuth } from 'supertokens-auth-react';

const SignInBtn = ({ className }: { className?: string }) => {
  return (
    <Button
      onClick={() => redirectToAuth({ show: 'signin' })}
      className={cn(
        buttonVariants({
          variant: 'gooeyLeft',
          className: 'flex items-center gap-2',
        }),
        className
      )}
    >
      <FaSignInAlt />
      Sign In
    </Button>
  );
};

export default SignInBtn;
