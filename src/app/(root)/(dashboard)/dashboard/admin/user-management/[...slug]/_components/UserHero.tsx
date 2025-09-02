import { format } from 'date-fns';
import { Mail, Phone, User } from 'lucide-react';
import Image from 'next/image';
import { ISingleUserData } from '../../_types/types';

const UserHero = ({ userData }: { userData: ISingleUserData }) => {
  const fullName = `${userData.meta_data?.firstName || ''} ${
    userData.meta_data?.lastName || ''
  }`.trim();
  const email = userData.emails?.[0] || 'N/A';
  const phone = userData.meta_data?.mobileNumber || 'N/A';

  const joinedDate = userData.timeJoined
    ? format(new Date(userData.timeJoined), 'dd-MMM-yyyy')
    : 'N/A';

  const lastLogin = userData.lastLogin
    ? format(new Date(userData.lastLogin), 'dd-MMM-yyyy')
    : 'N/A';

  return (
    <div className='w-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm'>
      <div className='flex w-full flex-col flex-wrap items-start space-y-3 sm:flex-row sm:items-end'>
        <div className='flex w-full items-center justify-start space-x-3 sm:w-auto'>
          <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 lg:h-24 lg:w-24'>
            {userData.profilePicture ? (
              <Image
                src={userData.profilePicture}
                alt='Profile Picture'
                width={96}
                height={96}
                quality={100}
                className='h-12 w-12 object-cover lg:h-full lg:w-full'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-gray-400'>
                <User className='h-12 w-12 sm:h-10 sm:w-10' />
              </div>
            )}
          </div>
          <div className='flex flex-col items-start justify-start'>
            <h2 className='mb-0.5 text-base font-semibold text-gray-900 sm:mb-1 sm:whitespace-nowrap md:text-lg lg:mb-3'>
              {fullName || 'No Name Available'}
            </h2>
            <div className='mb-0.5 flex max-w-96 items-center space-x-2 text-gray-600'>
              <Mail className='h-3 w-3 sm:h-4 sm:w-4' />
              <span className='break-all text-[10px] sm:text-xs md:text-sm'>
                {email}
              </span>
            </div>
            <div className='flex items-center space-x-2 text-gray-600'>
              <Phone className='h-3 w-3 sm:h-4 sm:w-4' />
              <span className='text-[10px] sm:text-xs md:text-sm'>{phone}</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className='grid w-full grid-cols-2 text-sm sm:ml-10 sm:w-auto md:ml-[60px] md:pb-0.5 lg:ml-10 lg:pb-2'>
          <div className='rounded-md bg-gray-50 p-2 sm:bg-transparent sm:p-0'>
            <span className='block text-xs font-medium text-gray-500 md:text-sm'>
              Joined At
            </span>
            <span className='text-[10px] sm:text-xs md:text-sm'>
              {joinedDate}
            </span>
          </div>
          <div className='ml-2 rounded-md bg-gray-50 p-2 sm:ml-6 sm:bg-transparent sm:p-0 md:ml-10 lg:ml-6'>
            <span className='block text-xs font-medium text-gray-500 md:text-sm'>
              Last Login
            </span>
            <span className='text-[10px] sm:text-xs md:text-sm'>
              {lastLogin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHero;
