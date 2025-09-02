import CompanyDetailsTabs from '@/app/(root)/company/_components/CompanyDetailsTabs';
import CompanyNotFound from '@/app/(root)/company/_components/CompanyNotFound';
import Hero from '@/app/(root)/company/_components/Hero';
import { getCompanyDetailsData } from '@/app/(root)/company/_services/getCompanyDetailsData';

export const revalidate = 3600; // cache for 1 minute

export default async function CompanyLayout({
  children,
  params: {
    // eslint-disable-next-line no-unused-vars
    slug: [company, cin],
  },
}: {
  children: React.ReactNode;
  params: {
    slug: string[];
  };
}) {
  const companyData = await getCompanyDetailsData(cin);

  return (
    <div className='min-h-screen'>
      {companyData.data === null ? (
        <CompanyNotFound />
      ) : (
        <>
          <Hero companyData={companyData} cinNo={cin} />
          <CompanyDetailsTabs companyData={companyData}>
            {children}
          </CompanyDetailsTabs>
        </>
      )}
    </div>
  );
}
