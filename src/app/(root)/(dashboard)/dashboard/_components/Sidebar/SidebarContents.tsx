'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LucideX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import filesureLogoLight from '../../../../../../../public/assets/filesure-logo.png';
import { TSidebarNavItem } from './SidebarItems';
import { SidebarNavItem, SidebarSubNavItem } from './SidebarNavLink';

export default function SidebarContents({
  items,
  setIsOpen,
}: {
  items: TSidebarNavItem[];
  // eslint-disable-next-line no-unused-vars
  setIsOpen?: (value: boolean) => void;
}) {
  const pathname = usePathname();

  const renderNavItem = (item: TSidebarNavItem) => {
    const isActive = item.href
      ? pathname === item.href
      : pathname.includes(item.label.toLowerCase().replace(' ', '-'));

    if (item.children) {
      return (
        <Accordion key={item.label} type='single' collapsible>
          <AccordionItem
            value={item.label.toLowerCase()}
            className='border-none'
          >
            <AccordionTrigger
              className={cn(
                'flex w-full items-center justify-between py-0 pr-2 text-left text-sm text-foreground hover:bg-blue-50 hover:no-underline'
              )}
            >
              <SidebarNavItem
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                className={isActive ? 'border-transparent bg-transparent' : ''}
              />
            </AccordionTrigger>
            <AccordionContent className='py-0'>
              {item.children.map((child) => (
                <SidebarSubNavItem
                  key={child.label}
                  href={child.href || ''}
                  icon={child.icon}
                  label={child.label}
                  isActive={pathname === child.href}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    return (
      <SidebarNavItem
        key={item.label}
        href={item.href || ''}
        icon={item.icon}
        label={item.label}
        isActive={isActive}
      />
    );
  };

  return (
    <aside className='flex h-full min-h-0 w-64 flex-col rounded-tr-lg border-r border-t bg-white py-4 shadow-xl'>
      <div className='flex items-start justify-between px-2 md:hidden'>
        <Link href='/'>
          <Image
            src={filesureLogoLight}
            alt={'FileSure Logo'}
            width={180}
            height={40}
            quality={100}
            priority
            className='h-7 w-fit'
          />
        </Link>

        {setIsOpen && (
          <button onClick={() => setIsOpen(false)} className='rounded border'>
            <LucideX className='size-4' />
          </button>
        )}
      </div>

      <Separator className='my-4 md:hidden' />

      <nav className='no-visible-scrollbar flex-1 space-y-2 overflow-y-auto pb-40 pr-2'>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            {renderNavItem(item)}
            {index === 0 && <Separator className='hidden md:block' />}
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
}
