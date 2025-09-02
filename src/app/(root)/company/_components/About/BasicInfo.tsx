import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { toCamelCase } from '@/lib/formatters';
import {
  Card,
  CardContent,
  CardHeader,
} from '../../../../../components/ui/card';

type Props = {
  companyData: TCompanyMasterData;
};

const BasicInfo = ({ companyData }: Props) => {
  const {
    dateOfIncorporation,
    category,
    companySubcategory,
    classOfCompany,
    listingStatus,
    industry,
    companyType,
  } = companyData.data || {};

  return (
    <Card className='overflow-hidden rounded-md shadow-sm'>
      <CardHeader className='bg-green-100 p-4 text-base font-normal'>
        Basic Information
      </CardHeader>
      <CardContent className='space-y-3 divide-y p-4 md:space-y-4'>
        <div className='grid grid-cols-1 gap-2 text-sm md:grid-cols-2'>
          <h6 className='font-semibold text-primary'>Date of incorporation:</h6>
          <p>{dateOfIncorporation}</p>
        </div>
        <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
          <h6 className='font-semibold text-primary'>Company Category:</h6>
          <p>{companyType === 'Company' ? category || '-' : 'N/A'}</p>
        </div>
        <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
          <h6 className='font-semibold text-primary'>Company Subcategory:</h6>
          <p>{companyType === 'Company' ? companySubcategory || '-' : 'N/A'}</p>
        </div>
        <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
          <h6 className='font-semibold text-primary'>Class of Company:</h6>
          <p>{companyType === 'Company' ? classOfCompany || '-' : 'N/A'}</p>
        </div>
        <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
          <h6 className='font-semibold text-primary'>Listing Status:</h6>
          <p>{listingStatus === 'Y' ? 'Listed' : 'Unlisted'}</p>
        </div>
        <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
          <h6 className='font-semibold text-primary'>Industry:</h6>
          <p>
            {industry.length > 0
              ? toCamelCase(industry).split(',').join(', ')
              : '-'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfo;
