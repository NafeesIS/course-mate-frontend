import Image from 'next/image';
import rocket from '../../../../../../public/assets/business-services/llp-registration/rocket.svg';
import RegisterNowLLPDialog from './RegisterNowLLPDialog';
const FilesureSimplify = () => {
  return (
    <div className='wrapper'>
      <div className='wrapper flex items-start justify-between gap-4 rounded-md bg-gradient-to-r from-[#D4EAFF] to-[#DADDDF] py-4'>
        <Image src={rocket} alt='rocket' />
        <div className='flex w-full flex-col items-start justify-between gap-1.5 md:flex-row md:items-center md:gap-4'>
          <div className='mr-auto flex max-w-4xl flex-col items-start justify-start'>
            <p className='text-start text-base font-semibold lg:text-lg'>
              Let Filesure Simplify Your LLP Registration!
            </p>
            <p className='text-muted-foreground-darker text-start text-xs font-normal lg:text-sm'>
              Filesure simplifies the entire LLP registration process by
              handling all the paperwork, legal requirements, and compliance
              checks. We ensure a smooth and hassle-free setup so you can focus
              on your business.{' '}
            </p>
          </div>
          <RegisterNowLLPDialog />
        </div>
      </div>
    </div>
  );
};

export default FilesureSimplify;
