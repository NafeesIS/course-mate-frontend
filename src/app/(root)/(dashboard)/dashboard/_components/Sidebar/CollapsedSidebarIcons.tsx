'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TSidebarNavItem } from './SidebarItems';

export function CollapsedSidebarIcons({ items }: { items: TSidebarNavItem[] }) {
  const pathname = usePathname();

  const collapsedItems = items.flatMap((item) =>
    item.children
      ? item.children.filter((child) => child.showInCollapsed)
      : item.showInCollapsed
        ? [item]
        : []
  );

  return (
    <TooltipProvider>
      <div className='flex h-full flex-col items-center space-y-4 rounded-tr-lg border-r border-t bg-white py-4 pt-8'>
        {collapsedItems.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                href={item.href ?? ''}
                className={cn(
                  'flex-center size-8 rounded-md bg-background shadow transition-colors hover:text-foreground',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground shadow-md hover:text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className='size-5' />
                <span className='sr-only'>{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
