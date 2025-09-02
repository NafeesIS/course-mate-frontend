import { Card } from '@/components/ui/card';
import { IBulkUnlockCredits } from '@/store/userStoreTypes';
import { Bell, Building2, Search, UserRound } from 'lucide-react';
import Link from 'next/link';

export default function DashboardActions({
  credits,
}: {
  credits: IBulkUnlockCredits[] | undefined;
}) {
  const directorCredits = credits?.find(
    (credit) => credit.creditType === 'directorUnlock'
  )?.availableCredits;
  const companyCredits = credits?.find(
    (credit) => credit.creditType === 'companyUnlock'
  )?.availableCredits;
  const actions = [
    {
      label: `Unlock Directors (${directorCredits || 0})`,
      icon: UserRound,
      href: '/dashboard/director-contacts',
    },
    {
      label: `Unlock Companies (${companyCredits || 0})`,
      icon: Building2,
      href: '/dashboard/unlock-companies',
    },
    {
      label: 'New Company Alert',
      icon: Bell,
      href: '/dashboard/new-company-alert',
    },
    {
      label: 'Advanced Search',
      icon: Search,
      href: '/search/company',
    },
  ];

  return (
    <Card className='grid grid-cols-1 gap-2 overflow-hidden py-4 md:grid-cols-2 md:gap-4 md:py-0 lg:grid-cols-4'>
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`flex items-center rounded-none px-4 py-2 text-center text-xs transition-colors duration-200 hover:bg-gray-50 hover:shadow-md md:justify-center md:py-4 md:text-sm`}
        >
          <action.icon className='mr-2 size-5' />
          <span className='font-semibold'>{action.label}</span>
        </Link>
      ))}
    </Card>
  );
}
