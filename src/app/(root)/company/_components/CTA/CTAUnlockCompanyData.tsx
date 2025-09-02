'use client';

import { usePricingStore } from '@/store/pricingStore';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import CompanyReportsCTA from './CompanyReportsCTA';
import OnlyPublicDocsCTA from './OnlyPublicDocsCTA';

const CTAUnlockCompanyData = ({
  companyData,
  source,
}: {
  companyData: TCompanyMasterData;
  source?: string;
}) => {
  const { serviceCatalogFromDB, serviceCatalogFromDBPending } =
    usePricingStore();

  const companyUnlock = serviceCatalogFromDB?.serviceCatalog.find(
    (item) => item.serviceType === 'companyUnlock'
  );
  const vpdUnlock = serviceCatalogFromDB?.serviceCatalog.find(
    (item) => item.serviceType === 'vpdUnlock'
  );

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      {/* Company Report CTA */}
      <CompanyReportsCTA
        companyData={companyData}
        serviceCatalogFromDB={serviceCatalogFromDB}
        serviceCatalogFromDBPending={serviceCatalogFromDBPending}
        companyUnlock={companyUnlock}
        source={`${companyData.data.companyType} ${source} banner`}
      />

      {/* Public Documents CTA */}
      <OnlyPublicDocsCTA
        companyData={companyData}
        serviceCatalogFromDB={serviceCatalogFromDB}
        serviceCatalogFromDBPending={serviceCatalogFromDBPending}
        vpdUnlock={vpdUnlock}
        source={`${companyData.data.companyType} ${source} banner`}
      />
    </div>
  );
};

export default CTAUnlockCompanyData;
