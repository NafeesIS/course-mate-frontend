import { BASE_URL_BACKEND } from '@/constants';
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '../../../../components/ui/card';

async function getAssociatedDirectors(din: string) {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/directors/associatedDirectors?din=${din}`
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

const AssociatedDirectors = async ({
  din,
  className,
}: {
  din: string;
  className?: string;
}) => {
  const associatedCompanies = await getAssociatedDirectors(din);

  if (!associatedCompanies || associatedCompanies.data.length === 0) {
    return null;
  }

  return (
    <section className={cn('wrapper', className)}>
      <h4 className='px-1 text-start text-lg font-semibold sm:text-center md:text-xl xl:text-start'>
        Other Associated Directors
      </h4>
      <div className='grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 md:grid-cols-3 md:gap-5 md:pt-8 lg:grid-cols-4'>
        {associatedCompanies.data &&
          associatedCompanies.data.map((directorInfo: any, index: number) => {
            const { fullName, DIN, company } = directorInfo;
            return (
              <Card
                key={index}
                className='group rounded-md transition-all hover:shadow-md'
              >
                <Link
                  href={`/director/${formatToUrl(directorInfo.fullName)}/${DIN}`}
                  prefetch={false}
                  className='flex flex-col gap-1.5 p-4 text-xs md:text-sm'
                >
                  <div className='flex items-start gap-3'>
                    <div className=' flex shrink-0 items-center justify-center rounded-full bg-purple-100'>
                      <UserCircle className='h-5 w-5 text-purple-700' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h6 className='truncate text-sm font-semibold'>
                        {fullName}
                      </h6>
                      <ul className='mt-1 space-y-1 text-xs text-gray-500 dark:text-gray-400'>
                        {company &&
                          company.slice(0, 2).map((c: any, index: number) => (
                            <li
                              key={index}
                              className={company.length > 1 ? 'truncate' : ''}
                            >
                              {c.designation} at{' '}
                              {c.companyName.length > 0
                                ? toCamelCase(c.companyName)
                                : '-'}
                            </li>
                          ))}
                        {company && company.length > 3 && (
                          <li>and {company.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
      </div>
    </section>
  );
};

export default AssociatedDirectors;
