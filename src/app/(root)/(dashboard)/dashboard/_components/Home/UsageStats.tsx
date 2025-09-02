import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building2, Coins, UserCircle2 } from 'lucide-react';
import Link from 'next/link';

type Credit = {
  availableCredits: number;
  expiryDate: string;
  creditType: string;
};

type UsageStatsProps = {
  credits: Credit[] | undefined;
};

export default function UsageStats({ credits }: UsageStatsProps) {
  const directorCredits =
    credits?.find((credit) => credit.creditType === 'directorUnlock')
      ?.availableCredits || 0;
  const companyCredits =
    credits?.find((credit) => credit.creditType === 'companyUnlock')
      ?.availableCredits || 0;

  const stats = [
    {
      label: 'Director Unlocks',
      available: directorCredits,
      icon: UserCircle2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/dashboard/director-contacts',
    },
    {
      label: 'Company Unlocks',
      available: companyCredits,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/dashboard/unlock-companies',
    },
  ];

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='relative bg-gradient-to-r from-blue-100 to-purple-100 p-4 md:p-6'>
        <CardTitle className='flex items-center justify-between text-xs md:text-sm'>
          <span>Your Remaining Credits</span>
          <Coins className='absolute right-2 top-0 size-8 text-muted-foreground opacity-20 md:size-16' />
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 md:p-6'>
        <div className='space-y-3'>
          {stats.map((stat) => (
            <Link href={stat.link} key={stat.label} className='group block'>
              <div
                className={`flex cursor-pointer items-center justify-between rounded-lg transition-all`}
              >
                <div className='flex items-center gap-3 text-xs md:text-sm'>
                  <div
                    className={`${stat.bgColor} ${stat.color} rounded-full p-2`}
                  >
                    <stat.icon className={`size-4`} />
                  </div>
                  <span className='font-medium text-foreground group-hover:underline'>
                    {stat.label}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <span
                    className={`rounded-full border-2 border-gray-300 px-4 py-1 text-xs font-semibold shadow md:text-sm`}
                  >
                    {stat.available}
                  </span>
                  <ArrowRight
                    className={`size-4 text-muted-foreground group-hover:text-foreground md:size-5`}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <p className='mt-8 text-center text-xs text-muted-foreground'>
          Don&apos;t let your credits go to waste! <br />
          Click on a category to start unlocking now.
        </p>
      </CardContent>
    </Card>
  );
}
