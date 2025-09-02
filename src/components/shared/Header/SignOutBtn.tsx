'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Session from 'supertokens-auth-react/recipe/session';

const SignOutBtn = ({
  className,
  logoClassName,
}: {
  className?: string;
  logoClassName?: string;
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    await Session.signOut();

    toast.info(
      "You've been logged out. We appreciate your visit and look forward to seeing you again soon."
    );

    // redirectToAuth({ show: 'signin' });
    router.refresh();
  };

  return (
    <Button
      onClick={handleLogout}
      variant='ghost'
      className={cn('w-full justify-start hover:bg-muted', className)}
    >
      <LogOutIcon className={cn('mr-2 size-4', logoClassName)} />
      Logout
    </Button>
  );
};

export default SignOutBtn;
