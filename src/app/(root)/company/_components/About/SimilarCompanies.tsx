import { Card } from '@/components/ui/card';
import { BASE_URL_BACKEND } from '@/constants';
import { formatToUrl } from '@/lib/formatters';
import { cn, getStatusBadgeColor } from '@/lib/utils';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

type TCompanyInfo = {
  _id: string;
  cin: string;
  company: string;
  category: string;
  registrationNumber: string;
  classOfCompany: string;
  status: string;
  state: string;
  rocCode: string;
  companySubcategory: string;
  industry: string;
};

async function getSimilarCompaniesData(companyIndustry: string) {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/getSimilarCompanies?mainDivisionDescription=${companyIndustry}`
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

const SimilarCompanies = async ({
  companyIndustry,
  className,
}: {
  companyIndustry: string;
  className?: string;
}) => {
  const similarCompaniesData = await getSimilarCompaniesData(companyIndustry);

  if (!similarCompaniesData || similarCompaniesData.data.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <h4 className='mt-16 px-1 text-start text-lg font-semibold sm:text-center md:text-xl xl:text-start'>
        Similar Companies in {companyIndustry}
      </h4>
      <div className='grid grid-cols-2 gap-4 pt-6 md:grid-cols-3 md:gap-5 md:pt-8 lg:grid-cols-4'>
        {similarCompaniesData.data.map(
          (companyInfo: TCompanyInfo, index: number) => {
            return (
              <Card
                key={index}
                className='group rounded-md transition-all hover:shadow-md'
              >
                <Link
                  href={`/company/${formatToUrl(companyInfo.company)}/${companyInfo.cin}?tab=about`}
                  prefetch={false}
                  className='flex flex-col gap-1.5 p-4 text-xs md:text-sm'
                >
                  <div className='flex items-start gap-3'>
                    <div className='hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 md:flex'>
                      <Building2 className='h-4 w-4 text-sky-700' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h6 className='truncate text-sm font-semibold'>
                        {companyInfo.company}
                      </h6>
                      <p className='mt-1 truncate text-xs text-muted-foreground'>
                        {companyInfo.cin}
                      </p>
                      {/* <p className='truncate text-muted-foreground'>
                        {companyInfo.state}
                      </p> */}
                      <div
                        className={cn(
                          'flex-center mt-2 h-5 w-fit truncate rounded-md px-3 text-xs font-medium',
                          getStatusBadgeColor(companyInfo.status)
                        )}
                      >
                        {companyInfo.status}
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          }
        )}
      </div>
    </section>
  );
};

export default SimilarCompanies;
