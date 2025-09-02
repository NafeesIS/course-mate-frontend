import Image from 'next/image';
import rocket from '../../../../../../public/assets/business-services/llp-registration/rocket.svg';
import GetStartedDialogLLP from './GetStartedDialogLLP';
const ProtectLLP = () => {
  return (
    <div className='wrapper'>
      <div className='wrapper flex items-start justify-between gap-4 rounded-md bg-gradient-to-r from-[#D4EAFF] to-[#DADDDF] py-4'>
        <Image src={rocket} alt='rocket' />
        <div className='flex w-full flex-col items-start justify-between gap-1.5 md:flex-row md:items-center md:gap-4'>
          <div className='mr-auto flex max-w-4xl flex-col items-start justify-start'>
            <p className='text-start text-base font-semibold lg:text-lg'>
              Protect Your LLP from Penalties – Act Now with FileSure!
            </p>
            <p className='text-muted-foreground-darker text-start text-xs font-normal lg:text-sm'>
              Managing LLP compliance can be overwhelming, but FileSure makes it
              easy. We take care of all the complex filings, ensuring your
              business stays compliant and penalty-free.{' '}
            </p>
          </div>
          <GetStartedDialogLLP />
        </div>
      </div>
    </div>
  );
};

export default ProtectLLP;
