import Image from 'next/image';
import rocket from '../../../../../../public/assets/business-services/llp-registration/rocket.svg';
import GetStartedDialog from './GetStartedDialog';
const StayCompliant = () => {
  return (
    <div className='wrapper'>
      <div className='wrapper flex items-start justify-between gap-4 rounded-md bg-gradient-to-r from-[#D4EAFF] to-[#DADDDF] py-4'>
        <Image src={rocket} alt='rocket' />
        <div className='flex w-full flex-col items-start justify-between gap-1.5 md:flex-row md:items-center md:gap-4'>
          <div className='mr-auto flex max-w-4xl flex-col items-start justify-start'>
            <p className='text-start text-base font-semibold lg:text-lg'>
              Stay Compliant, Avoid Penalties – Get Started with FileSure!
            </p>
            <p className='text-muted-foreground-darker text-start text-xs font-normal lg:text-sm'>
              Now that you’ve read the process, it’s time to take action. Click
              the button to get started with FileSure and avoid penalties. We’ll
              ensure your Private Limited Company stays compliant and
              penalty-free!{' '}
            </p>
          </div>
          <GetStartedDialog />
        </div>
      </div>
    </div>
  );
};

export default StayCompliant;
