import { Calendar, Database, Mail, Phone, Search, Tag } from 'lucide-react';

const WhatsIncluded = () => {
  return (
    <div className='bg-gradient-to-b from-white to-gray-200 py-12 lg:py-16'>
      <div className='wrapper mx-auto px-4'>
        <h2 className='bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl lg:h-14 lg:text-5xl'>
          What&apos;s Included
        </h2>
        <p className='mx-auto max-w-lg text-center text-sm text-gray-600 dark:text-gray-400 lg:text-lg'>
          Subscribe today and get access to these premium features and services.
        </p>
        <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
          <FeatureCard
            icon={<Mail className='size-6 text-blue-500 md:size-8' />}
            title='Director Email ID'
            description='Get verified email addresses of 3M+ company directors'
            demo='john.doe@company.com'
          />
          <FeatureCard
            icon={<Phone className='size-6 text-green-500 md:size-8' />}
            title='Director Mobile Number'
            description='Access direct mobile numbers of key decision-makers'
            demo='+91 98765 43210'
          />
          <FeatureCard
            icon={<Calendar className='size-6 text-purple-500 md:size-8' />}
            title='365 Days Validity'
            description='Your purchased credits are valid for a full year'
            demo='Valid until: 31 Dec 2024'
          />
          <FeatureCard
            icon={<Tag className='size-6 text-red-500 md:size-8' />}
            title='Bulk Discounts'
            description='Enjoy lower rates when you purchase more credits'
            demo='Up to 50% off on bulk orders'
          />
          {/* <FeatureCard
            icon={<Users className='size-6 md:size-8 text-indigo-500' />}
            title='Comprehensive Profiles'
            description='Access detailed information about directors and companies'
            demo='10+ data points per profile'
          /> */}
          <FeatureCard
            icon={<Search className='size-6 text-yellow-500 md:size-8' />}
            title='Advanced Search'
            description='Find the right contacts with powerful search filters'
            demo='Search by industry, location, etc.'
          />
          <FeatureCard
            icon={<Database className='size-6 text-cyan-500 md:size-8' />}
            title='Regular Updates'
            description='Stay informed with the latest company data'
            demo='Updated weekly'
          />
          {/* <FeatureCard
            icon={<Shield className='size-6 md:size-8 text-gray-500' />}
            title='Data Security'
            description='Your searches and data are protected with encryption'
            demo='256-bit AES encryption'
          /> */}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  // demo,
}: {
  icon: any;
  title: string;
  description: string;
  demo?: string;
}) => (
  <div className='group relative overflow-hidden rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg md:p-6'>
    <div className='mb-4 flex size-10 items-center justify-center rounded-full bg-gray-100 transition-all group-hover:scale-110 md:size-12'>
      {icon}
    </div>
    <h3 className='mb-2 text-base font-semibold text-gray-900 lg:text-xl'>
      {title}
    </h3>
    <p className='text-sm text-gray-600 md:mb-4 lg:text-base'>{description}</p>
    {/* <div className='rounded bg-gray-100 px-3 py-2 text-sm text-gray-700'>
      <span className='font-medium'>Demo:</span> {demo}
    </div> */}
    <svg
      className='absolute -right-16 -top-16 h-64 w-64 text-gray-100 transition-all group-hover:text-gray-200'
      fill='currentColor'
      viewBox='0 0 200 200'
    >
      <path d='M42.5,-64.3C54.8,-56.7,64.2,-44.3,71.1,-30.3C78.1,-16.3,82.5,-0.7,79.4,13.3C76.2,27.3,65.4,39.7,53.1,48.1C40.8,56.5,27,60.9,12.9,64.4C-1.2,67.9,-15.6,70.4,-29.5,67.3C-43.4,64.2,-56.8,55.5,-65.6,43.1C-74.5,30.7,-78.8,14.7,-78.9,-1.5C-79,-17.7,-74.9,-34.1,-65.3,-45.6C-55.8,-57.1,-40.8,-63.7,-26.8,-69.4C-12.8,-75,-0.6,-79.7,12.6,-78.5C25.8,-77.3,51.5,-70.3,42.5,-64.3Z' />
    </svg>
  </div>
);

export default WhatsIncluded;
