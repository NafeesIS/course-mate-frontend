'use client';

import CTAUnlockCompanyData from '@/app/(root)/company/_components/CTA/CTAUnlockCompanyData';
import { Card } from '@/components/ui/card';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import { AboutSection } from './AboutSection';
import { ChargesTable } from './ChargeTable';
import { ContactSection } from './ContactSection';
import { DirectorsTable } from './DirectorsTable';

interface AboutProps {
  companyData: TCompanyMasterData;
  isUnlocked: { isUnlocked: boolean; unlockType: string | null };
}

export default function About({ companyData, isUnlocked }: AboutProps) {
  const { data } = companyData;

  return (
    <div className='mt-8'>
      {!isUnlocked.isUnlocked && (
        <CTAUnlockCompanyData companyData={companyData} source='about-tab' />
      )}

      <AboutSection
        about={data.about}
        companyType={data.companyType}
        status={data.status}
        dateOfIncorporation={data.dateOfIncorporation}
        industry={data.industry}
        website={data.website}
      />

      <div className='mt-8'>
        <ContactSection
          email={data.email}
          website={data.website}
          address={data.address}
        />
      </div>

      <div className='mt-8'>
        {data.currentDirectors && data.currentDirectors.length > 0 ? (
          <DirectorsTable
            data={data.currentDirectors}
            title='Current Directors'
          />
        ) : (
          <Card className='p-4 text-center text-sm text-muted-foreground'>
            No directors data available for this company.
          </Card>
        )}
      </div>

      {data.pastDirectors && data.pastDirectors.length > 0 && (
        <div className='mt-8'>
          <DirectorsTable data={data.pastDirectors} title='Past Directors' />
        </div>
      )}

      {data.executiveTeam && data.executiveTeam.length > 0 && (
        <div className='mt-8'>
          <DirectorsTable data={data.executiveTeam} title='Executive Team' />
        </div>
      )}

      <div className='mt-8'>
        <ChargesTable cin={data.cin} />
      </div>
    </div>
  );
}
