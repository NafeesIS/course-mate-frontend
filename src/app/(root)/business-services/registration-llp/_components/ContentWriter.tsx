import Image from 'next/image';
import writer from '../../../../../../public/assets/business-services/Bhagyashree_Katkar.jpg';
import logo from '../../../../../../public/assets/filesure-logo.png';

const ContentWriter = () => {
  return (
    <div className='wrapper mb-10'>
      <div className='flex items-start justify-start gap-4 rounded-md bg-muted p-4 lg:p-6'>
        <Image
          quality={100}
          src={writer}
          alt='writer'
          className='hidden size-16 rounded-full md:block'
        />
        <div className='flex flex-col text-start'>
          <div className='mb-2 flex items-center justify-start gap-2 md:mb-0'>
            <Image
              quality={100}
              src={writer}
              alt='writer'
              className='block size-12 rounded-full md:hidden'
            />
            <p className='flex max-w-96 flex-col items-start justify-start gap-1 text-sm font-semibold sm:text-base md:mb-2 md:max-w-full'>
              <span>
                Bhagyashree Katkar{' '}
                <span className='ml-1 rounded-full border border-primary px-1.5 py-0.5 text-xs font-normal text-primary'>
                  Author
                </span>{' '}
              </span>
              <span className='flex flex-row items-center justify-start gap-1 text-xs font-normal sm:text-sm'>
                Compliance Officer at{' '}
                <Image
                  className='w-16 sm:w-[72px]'
                  src={logo}
                  alt='logo'
                  width={80}
                  height={80}
                />{' '}
              </span>
            </p>
          </div>
          <p className='text-muted-foreground-darker text-xs font-normal group-hover:text-muted lg:text-sm'>
            Bhagyashree Katkar is a Compliance Officer at Filesure India Private
            Limited with over 2.5 years of experience in Corporate Compliance
            and 21 months in Indirect Tax. An LLB graduate, she specializes in
            the Companies Act, 2013, Trade Mark, and NCLT matters. Bhagyashree
            has been involved in secretarial audits for MNCs and conducted due
            diligence for various companies. Currently, she manages compliance
            for multiple clients at Filesure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentWriter;
