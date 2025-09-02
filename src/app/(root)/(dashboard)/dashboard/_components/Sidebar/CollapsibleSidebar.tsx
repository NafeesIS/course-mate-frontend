'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useUserSignInDetails } from '@/store/userStore';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  UserCog,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUnlockBulkPurchaseStore } from '../../director-contacts/_store/unlockContactStore';
import { CollapsedSidebarIcons } from './CollapsedSidebarIcons';
import SidebarContents from './SidebarContents';
import { adminNavItems, navItems } from './SidebarItems';

export default function CollapsibleSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);

  // Store: User Sign In Details
  const isLoading = useUserSignInDetails(
    (state) => state.userSignInDetailsLoading
  );
  const isAdmin = useUserSignInDetails(
    (state) => state.userSignInDetails?.data.roles.includes('admin') ?? false
  );
  const bulkUnlockCredits = useUserSignInDetails(
    (state) => state.userSignInDetails?.data.bulk_unlock_credits
  );

  // Store: Unlocked Credits
  const setAvailableDirectorUnlockCredits = useUnlockBulkPurchaseStore(
    (state) => state.setAvailableDirectorUnlockCredits
  );
  const setAvailableCompanyUnlockCredits = useUnlockBulkPurchaseStore(
    (state) => state.setAvailableCompanyUnlockCredits
  );

  // Update credits when bulk unlock credits change
  useEffect(() => {
    if (!bulkUnlockCredits) return;

    const availableDirectorsCredits = bulkUnlockCredits.find(
      (item) => item.creditType === 'directorUnlock'
    );
    const availableCompanyCredits = bulkUnlockCredits.find(
      (item) => item.creditType === 'companyUnlock'
    );

    if (availableDirectorsCredits?.availableCredits) {
      setAvailableDirectorUnlockCredits(
        availableDirectorsCredits.availableCredits
      );
    }
    if (availableCompanyCredits?.availableCredits) {
      setAvailableCompanyUnlockCredits(
        availableCompanyCredits.availableCredits
      );
    }
  }, [
    bulkUnlockCredits,
    setAvailableDirectorUnlockCredits,
    setAvailableCompanyUnlockCredits,
  ]);

  // Check if user is in admin view
  useEffect(() => {
    setIsAdminView(pathname.includes('dashboard/admin'));
  }, [pathname]);

  if (isLoading) {
    return null;
  }

  const switchOptions = [
    { label: 'User Dashboard', value: 'user', icon: User },
    { label: 'Admin Dashboard', value: 'admin', icon: UserCog },
  ];

  const handleSwitchOption = (value: string) => {
    const newPath = value === 'admin' ? '/dashboard/admin' : '/dashboard';
    router.push(newPath);
    setIsAdminView(value === 'admin');
  };

  return (
    <aside
      className={cn(
        'sticky top-16 z-40 flex h-[calc(100vh-64px)] min-h-0 flex-col bg-transparent transition-all duration-300 ease-in-out',
        isExpanded ? 'w-64' : 'w-16'
      )}
    >
      <div
        className={cn(
          'min-h-0 flex-grow transition-opacity duration-300',
          isExpanded ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch', // For iOS Safari smooth scrolling
        }}
      >
        <SidebarContents items={isAdminView ? adminNavItems : navItems} />
      </div>

      {!isExpanded && (
        <div
          className='absolute inset-x-0 top-0 h-[calc(100vh-64px)] overflow-y-auto pr-1 pt-1 transition-opacity duration-300'
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <CollapsedSidebarIcons
            items={isAdminView ? adminNavItems : navItems}
          />
        </div>
      )}

      {isAdmin && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 z-20 mb-4 mt-auto bg-white px-4 transition-opacity duration-300',
            isExpanded ? 'opacity-100' : 'pointer-events-none opacity-0'
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
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-foreground shadow transition-transform duration-300 hover:scale-110'
      >
        {isExpanded ? (
          <ChevronLeft className='h-4 w-4' />
        ) : (
          <ChevronRight className='h-4 w-4' />
        )}
      </button>
    </aside>
  );
}
