import { toCamelCase } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';
import { IPastCompanies } from '../_types/types';

interface DirectorCompaniesProps {
  companies: Array<{ nameOfTheCompany: string }>;
}

export function DirectorCompanies({ companies }: DirectorCompaniesProps) {
  const uniqueAssociatedLLPNames = Array.from(
    new Set(companies?.map((company: any) => company.nameOfTheCompany))
  );

  return (
    <div className='mt-6 px-4'>
      <h3 className='mb-4 text-sm font-semibold md:text-base'>
        Associated Companies
      </h3>
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {uniqueAssociatedLLPNames.map((company, index) => (
          <li
            key={index}
            className='flex items-center space-x-2 text-xs md:text-sm'
          >
            <Building2 className='size-4 flex-shrink-0 text-primary md:size-5' />
            <span className='truncate'>
              {company.length > 0 ? toCamelCase(company) : '-'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DirectorPastCompanies({
  pastCompanies,
}: {
  pastCompanies: IPastCompanies[];
}) {
  const uniqueAssociatedLLPNames = Array.from(
    new Set(
      pastCompanies?.map((company: IPastCompanies) => company.accountName)
    )
  );

  return (
    <div className='mt-6 px-4'>
      <h3 className='mb-4 text-sm font-semibold md:text-base'>
        Past Companies
      </h3>
      <ul
        className={cn(
          'grid grid-cols-1 gap-4',
          uniqueAssociatedLLPNames.length > 1 ? 'md:grid-cols-2' : ''
        )}
      >
        {uniqueAssociatedLLPNames.map((company, index) => (
          <li
            key={index}
            className='flex items-center space-x-2 text-xs md:text-sm'
          >
            <Building2 className='size-4 flex-shrink-0 text-primary md:size-5' />
            <span className='truncate'>
              {company.length > 0 ? toCamelCase(company) : '-'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
