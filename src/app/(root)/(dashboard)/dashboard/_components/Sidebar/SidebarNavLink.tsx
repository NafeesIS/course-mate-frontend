'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

export const SidebarNavItem = ({
  href,
  icon: Icon,
  label,
  isActive,
  className,
}: {
  href?: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  className?: string;
}) => {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-2 border-l-[3px] border-white px-2 py-1 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-blue-50',
          isActive ? 'border-primary bg-blue-100' : '',
          className
        )}
      >
        <span
          className={cn(
            'flex-center size-8 rounded-md bg-background shadow',
            isActive ? 'bg-primary text-primary-foreground' : 'text-primary'
          )}
        >
          <Icon className={cn('size-5')} />
        </span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-l-[3px] border-white px-2 py-1 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-blue-50',
        isActive ? 'border-primary bg-blue-100' : '',
        className
      )}
    >
      <span
        className={cn(
          'flex-center size-8 rounded-md bg-background shadow',
          isActive ? 'bg-primary text-primary-foreground' : 'text-primary'
        )}
      >
        <Icon className={cn('size-5')} />
      </span>
      <span>{label}</span>
    </div>
  );
};

export const SidebarSubNavItem = ({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      'flex w-full items-center gap-2 border-l-[3px] border-white py-2.5 pl-[17px] pr-4 text-sm font-semibold transition-all hover:bg-blue-50',
      isActive
        ? 'border-primary bg-blue-100 text-foreground'
        : 'text-muted-foreground'
    )}
  >
    <Icon className={cn('size-4')} />
    <span>{label}</span>
  </Link>
);
