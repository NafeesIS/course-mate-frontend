import { Building, Building2 } from 'lucide-react';
import { memo } from 'react';

// Memoized static icons to prevent recreation
export const CompanyIcon = memo(() => <Building2 className='h-4 w-4' />);
CompanyIcon.displayName = 'CompanyIcon';

export const LLPIcon = memo(() => <Building className='h-4 w-4' />);
LLPIcon.displayName = 'LLPIcon';
