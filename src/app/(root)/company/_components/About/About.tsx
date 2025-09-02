/* eslint-disable indent */
import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import BannerNewCompanyAlert1 from '@/components/custom-ad-banners/BannerNewCompanyAlert1';
import CTAUnlockCompanyData from '../CTA/CTAUnlockCompanyData';
import AssociatedEntities from './AssociatedEntities';
import BasicInfo from './BasicInfo';
import Charges from './Charges';
import Contact from './Contact';
import Directors from './Directors';
import FAQ from './FAQ';
import Financials from './Financials';
import SimilarCompanies from './SimilarCompanies';

type Props = {
  companyData: TCompanyMasterData;
};

const About = ({ companyData }: Props) => {
  const { about } = companyData.data || {};

  return (
    <div className='mt-10'>
      {/* <Summary companyData={companyData} /> */}
      <CTAUnlockCompanyData companyData={companyData} source='about-tab' />

      {/* ABOUT */}
      <div className='mt-8 space-y-3 md:mt-10 md:space-y-4'>
        {/* <h3 className='text-base font-normal'>
          About {company && toCamelCase(company)}
        </h3> */}
        <div className='space-y-3 divide-y md:space-y-4'>
          {about?.split('\n').map((item, i) => (
            <p key={i} className='text-sm leading-relaxed'>
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className='mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 md:gap-6'>
        <BasicInfo companyData={companyData} />
        <Directors companyData={companyData} />
      </div>

      <div className='mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 md:gap-6'>
        <Contact companyData={companyData} />
        <Charges companyData={companyData} />
      </div>

      <div className='mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 md:gap-6'>
        <Financials companyData={companyData} />
      </div>

      {/* ASSOCIATED ENTITIES (SHARED DIRECTORSHIP) */}
      {companyData.data &&
        companyData.data.associatedCompanies &&
        companyData.data.associatedCompanies.length > 0 && (
          <AssociatedEntities
            companyData={companyData}
            className='mt-8 md:mt-10'
          />
        )}

      {/* SIMILAR COMPANIES */}
      {companyData.data &&
        companyData.data.industry &&
        companyData.data.industry.length > 0 && (
          <SimilarCompanies
            companyIndustry={companyData.data.industry}
            className='mt-8 md:mt-10'
          />
        )}

      <BannerNewCompanyAlert1 className='my-16' />

      {/* FAQ */}
      {companyData.data && (
        <FAQ companyData={companyData} className='mt-8 md:mt-10' />
      )}

      {/* <GoogleAdUnit>
        <AdsBanner />
      </GoogleAdUnit> */}
    </div>
  );
};

export default About;
