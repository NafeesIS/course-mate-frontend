import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { toCamelCase } from '@/lib/formatters';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
} from '../../../../../components/ui/card';

type Props = {
  companyData: TCompanyMasterData;
};

// eslint-disable-next-line no-unused-vars
const Contact = ({ companyData }: Props) => {
  const { address, website } = companyData.data || {};

  return (
    <Card className='overflow-hidden rounded-md shadow-sm'>
      <CardHeader className='bg-green-100 p-4 text-base font-normal'>
        Contact
      </CardHeader>
      <CardContent className='space-y-3 divide-y p-4 md:space-y-4'>
        <div className='grid grid-cols-1 gap-2 text-sm md:grid-cols-2'>
          <h6 className='font-semibold text-primary'>
            Address ({address?.addressType}):
          </h6>
          <p className='leading-relaxed'>
            {address?.registeredAddress
              ? toCamelCase(address.registeredAddress)
              : '-'}
          </p>
        </div>
        <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
          <h6 className='font-semibold text-primary'>Pincode:</h6>
          <p>{address?.pinCode || '-'}</p>
        </div>
        <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
          <h6 className='font-semibold text-primary'>Website:</h6>
          {/* 
            Validate if website is a valid URL using regex pattern:
            - Optional http:// or https:// prefix
            - Domain name with subdomains
            - Valid TLD (2-6 characters)
            - Optional path and query parameters
          */}
          {website &&
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
            website
          ) ? (
            // If valid URL, render as clickable link
            <Link
              href={website}
              className='w-fit text-primary hover:underline'
              prefetch={false}
              target='_blank'
            >
              {/* Remove protocol (http:// or https://) from displayed text */}
              {website.replace(/(^\w+:|^)\/\//, '')}
            </Link>
          ) : (
            // If invalid URL or empty, render as plain text
            <p>{website || '-'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Contact;
