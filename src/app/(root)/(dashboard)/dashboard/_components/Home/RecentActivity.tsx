import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import { format } from 'date-fns';
import { Building, User } from 'lucide-react';
import Link from 'next/link';
import { UnlockedCompany } from '../../unlock-companies/company-details/[...slug]/_store/unlockedCompaniesStore';

type UnlockedContact = {
  directorId: string;
  unlockedAt: string;
  fullName: string;
};

type RecentActivityProps = {
  unlockedContacts?: UnlockedContact[];
  unlockedCompanies?: UnlockedCompany[];
};

export default function RecentActivity({
  unlockedContacts,
  unlockedCompanies,
}: RecentActivityProps) {
  const allActivities = [
    ...(unlockedContacts?.length
      ? unlockedContacts.map((contact) => ({
          type: 'contact',
          id: contact.directorId,
          name: contact.fullName || '',
          date: new Date(contact.unlockedAt),
        }))
      : []),
    ...(unlockedCompanies?.length
      ? unlockedCompanies.map((company) => ({
          type: 'company',
          id: company.companyId,
          name: company.companyName || '',
          date: new Date(company.unlockedAt),
        }))
      : []),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xs md:text-sm'>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
        {allActivities && allActivities.length > 0 ? (
          <ul>
            {allActivities.map((activity, index) => (
              <li key={index}>
                <Link
                  href={
                    activity.type === 'company'
                      ? `/dashboard/unlock-companies/company-details/${formatToUrl(activity.name)}/${activity.id}`
                      : `/dashboard/director-contacts`
                  }
                  className='group flex items-center gap-4 p-2 hover:bg-muted'
                >
                  <div
                    className={`rounded-full p-2 ${activity.type === 'contact' ? 'bg-blue-100' : 'bg-green-100'}`}
                  >
                    {activity.type === 'contact' ? (
                      <User className='size-4 text-blue-600 md:size-5' />
                    ) : (
                      <Building className='size-4 text-green-600 md:size-5' />
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-xs font-medium text-gray-900 md:text-sm'>
                      {activity.name && activity.name.length > 0
                        ? toCamelCase(activity.name)
                        : '-'}
                    </p>
                    <p className='text-[10px] text-gray-500 md:text-xs'>
                      {activity.type === 'contact'
                        ? 'Director Contact Unlocked'
                        : 'Company Unlocked'}
                    </p>
                  </div>
                  <div className='text-[10px] text-gray-400 md:text-xs'>
                    {activity.date && activity.date instanceof Date
                      ? format(activity.date, 'dd-MMM-yyyy')
                      : '-'}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className='flex flex-col items-center gap-4 py-8'>
            <div className='flex gap-2'>
              <div className='rounded-full bg-blue-100 p-2'>
                <User className='size-4 text-blue-600 md:size-5' />
              </div>
              <div className='rounded-full bg-green-100 p-2'>
                <Building className='size-4 text-green-600 md:size-5' />
              </div>
            </div>
            <p className='text-center text-xs text-gray-500'>
              Your recent activity will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
