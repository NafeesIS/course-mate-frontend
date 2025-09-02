import { Building2, Users } from 'lucide-react';
import Image from 'next/image';
import rounded from '../../../../../public/assets/new-company-alert/rounded_vector.svg';
import triangle from '../../../../../public/assets/new-company-alert/triangle_vector.svg';
import { fetchCompanyAndLLPCounts } from '../_services/service';
import DatabaseOverview from './DataBaseOverview';
import ROICalculator from './RoiCalculator';

const RoiCalculatorWrapper = async () => {
  const companyAndLLPCountsData = await fetchCompanyAndLLPCounts();
  const previousMonthTotalCompanyLLP =
    companyAndLLPCountsData?.data?.previousMonthCompanies +
      companyAndLLPCountsData?.data?.previousMonthLLPs || 0;
  const previousMonthTotalDirectors =
    companyAndLLPCountsData?.data?.previousMonthDirectorCount || 0;
  const stats = [
    {
      title: 'Companies',
      value: `${companyAndLLPCountsData?.data?.previousMonthCompanies.toLocaleString(
        'en-IN'
      )}`,
      icon: <Building2 className='h-6 w-6 text-blue-500 sm:h-8 sm:w-8' />,
      color: 'border-t-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'LLPs',
      value: `${companyAndLLPCountsData?.data?.previousMonthLLPs.toLocaleString(
        'en-IN'
      )}`,
      icon: <Building2 className='h-6 w-6 text-amber-500 sm:h-8 sm:w-8' />,
      color: 'border-t-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Directors / Designated Partners',
      value: `${companyAndLLPCountsData?.data?.previousMonthDirectorCount.toLocaleString(
        'en-IN'
      )}`,
      icon: <Users className='h-6 w-6 text-green-500 sm:h-8 sm:w-8' />,
      color: 'border-t-green-500',
      bgColor: 'bg-green-50',
    },
  ];
  return (
    <div className='wrapper'>
      <div className='mx-auto mb-10 max-w-2xl lg:mb-16'>
        <div className='relative mx-auto max-w-4xl'>
          <h4 className='z-10 pt-8 text-center text-2xl font-semibold md:text-3xl lg:text-4xl xl:leading-snug'>
            New Company Alert <br className='sm:hidden' />
            <span className='text-nca-primary-blue'>ROI Calculator</span>{' '}
          </h4>
          <Image
            src={triangle}
            alt='triangle'
            width={80}
            height={80}
            className='absolute -left-8 top-0 -z-10 hidden lg:block'
          />
        </div>
        <div className='relative mx-auto max-w-4xl'>
          <p className='z-10 mt-2 text-center text-xs text-nca-sub-heading-text md:text-sm'>
            Want to see how you can maximize your profit with our New Company
            Alert subscription? Use this calculator to estimate your potential
            returns.
          </p>
          <Image
            src={rounded}
            alt='circle'
            width={120}
            height={120}
            className='absolute -bottom-6 -right-6 -z-10 hidden -rotate-[20deg] lg:block'
          />
        </div>
      </div>
      <DatabaseOverview stats={stats} />
      <ROICalculator
        previousMonthTotalCompanyLLP={previousMonthTotalCompanyLLP}
        previousMonthTotalDirectors={previousMonthTotalDirectors}
      />
    </div>
  );
};

export default RoiCalculatorWrapper;
