import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { Card } from '@/components/ui/card';
import { formatToUrl } from '@/lib/formatters';
import { cn, getStatusBadgeColor } from '@/lib/utils';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

type Props = {
  companyData: TCompanyMasterData;
  className?: string;
};

const AssociatedEntities = ({ companyData, className }: Props) => {
  const { associatedCompanies } = companyData.data || {};

  return (
    <section className={className}>
      <h4 className='px-1 text-start text-lg font-semibold sm:text-center md:text-xl xl:text-start'>
        Associated Entities (Shared directorship)
      </h4>
      <div className='grid grid-cols-2 gap-4 pt-6 md:grid-cols-3 md:gap-5 md:pt-8 lg:grid-cols-4'>
        {associatedCompanies?.map((companyInfo, index) => {
          return (
            <Card
              key={index}
              className='group rounded-md transition-all hover:shadow-md'
            >
              <Link
                href={`/company/${formatToUrl(companyInfo.nameOfTheCompany)}/${companyInfo.cin_LLPIN}?tab=about`}
                prefetch={false}
                className='flex flex-col gap-1.5 p-4 text-xs md:text-sm'
              >
                <div className='flex items-start gap-3'>
                  <div className='hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 md:flex'>
                    <Building2 className='h-4 w-4 text-sky-700' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h6 className='truncate text-sm font-semibold'>
                      {companyInfo.nameOfTheCompany}
                    </h6>
                    <p className='mt-1 truncate text-xs text-muted-foreground'>
                      {companyInfo.cin_LLPIN}
                    </p>
                    <div
                      className={cn(
                        'flex-center mt-2 h-5 w-fit truncate rounded-md px-3 text-xs font-medium',
                        getStatusBadgeColor(companyInfo.companyStatus)
                      )}
                    >
                      {companyInfo.companyStatus}
                    </div>
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

export default AssociatedEntities;
