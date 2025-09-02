'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronRight, LucideIcon, Settings } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiMenu2Line } from 'react-icons/ri';
import SidebarContents from './SidebarContents';
import { TSidebarNavItem } from './SidebarItems';

const SidebarToggleForMobile = ({
  items,
  isAdmin,
  isAdminView,
  switchOptions,
  handleSwitchOption,
  className,
}: {
  items: TSidebarNavItem[];
  isAdmin: boolean | undefined;
  isAdminView: boolean;
  switchOptions: {
    label: string;
    value: string;
    icon: LucideIcon;
  }[];
  // eslint-disable-next-line no-unused-vars
  handleSwitchOption: (value: string) => void;
  className?: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <Drawer direction='left' open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        title='Open Menu'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'size-7 rounded bg-transparent p-0 text-gray-100 hover:bg-transparent hover:text-gray-50',
          className
        )}
      >
        {/* <Menu className='size-6' /> */}
        <RiMenu2Line className='size-7' />
      </DrawerTrigger>

      <DrawerContent className='h-full max-w-60 rounded-none border-none bg-transparent'>
        <SidebarContents setIsOpen={setIsOpen} items={items} />

        {/* to render the switch to admin view button */}
        {isAdmin && (
          <motion.div
            className={cn(
              'absolute bottom-0 left-0 right-0 z-20 mb-4 mt-auto bg-white px-4'
            )}
          >
            <span className='mb-2 text-xs text-gray-400'>Switch Dashboard</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-full justify-between'>
                  <span className='flex items-center'>
                    <Settings className='mr-2 h-4 w-4' />
                    {isAdminView ? 'Admin Dashboard' : 'User Dashboard'}
                  </span>
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-full'>
                {switchOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSwitchOption(option.value)}
                    className='cursor-pointer'
                  >
                    <option.icon className='mr-2 h-4 w-4' />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default SidebarToggleForMobile;
