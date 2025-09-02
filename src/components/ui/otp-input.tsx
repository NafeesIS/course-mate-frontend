'use client';
import { cn } from '@/lib/utils';
import { SlotProps } from 'input-otp';

// Feel free to copy. Uses @shadcn/ui tailwind colors.
export function Slot(props: SlotProps, className?: string) {
  return (
    <div
      className={cn(
        'relative h-14 w-10 text-[2rem]',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border-y border-r border-border first:rounded-l-md first:border-l last:rounded-r-md',
        'group-focus-within:border-accent-foreground/20 group-hover:border-accent-foreground/20',
        'outline outline-0 outline-accent-foreground/20',
        { 'outline-4 outline-accent-foreground': props.isActive },
        className
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

// You can emulate a fake textbox caret!
export function FakeCaret() {
  return (
    <div className='pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center'>
      <div className='h-8 w-px bg-white' />
    </div>
  );
}

// Inspired by Stripe's MFA input.
export function FakeDash() {
  return (
    <div className='flex w-10 items-center justify-center'>
      <div className='h-1 w-3 rounded-full bg-border' />
    </div>
  );
}
