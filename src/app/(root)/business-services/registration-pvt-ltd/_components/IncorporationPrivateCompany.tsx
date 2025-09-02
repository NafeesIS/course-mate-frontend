import Image from 'next/image';
import frame from '../../../../../../public/assets/business-services/plc-registration/frame.svg';
import wave from '../../../../../../public/assets/business-services/plc-registration/wave.svg';
import RegisterNowDialog from './RegisterNowDialog';
const IncorporationPrivateCompany = () => {
  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto mb-6 px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        <span className='mr-1 italic text-primary'>Incorporation</span> of
        Private Company
      </h2>
      <div className='mt-8 flex w-full flex-col items-center justify-between gap-6 px-2 lg:mt-12 lg:flex-row'>
        <ul className='text-muted-foreground-darker w-[100%] list-disc space-y-4 pl-2 text-start text-sm font-normal lg:w-[70%] lg:text-base'>
          <li>
            For Incorporating a private company in India, companies have to
            comply with the provisions of The Companies Act, 2013 and Rules made
            thereunder and other statutory Acts.
          </li>
          <li>
            A Private company can be incorporated with at least 2 directors and
            2 members.
          </li>
          <li>There can be Maximum 15 directors and 200 members.</li>
          <li>
            A company can be incorporated without any minimum paid up capital.
          </li>
          <li>A Company shall mandatorily have a Registered office address.</li>
          <li>
            Once a company is incorporated as a Private Limited Company it
            receives a Certificate of Incorporation (COI).
          </li>
          <li>
            Here are certain post incorporation compliances which every
            incorporated company must comply:
            <ol className='mt-2 list-inside list-decimal space-y-2'>
              <li>Filing of INC-20A</li>
              <li>Appointment of Auditor</li>
              <li>
                Issue of Share certificate (if a company incorporated as a
                company limited by shares)
              </li>
              <li>Payment of stamp duty</li>
            </ol>
          </li>
        </ul>
        <div className='relative h-full min-h-[435px] w-[320px] min-w-[320px] border-2 border-r-0 border-[#C9E8FF] bg-background text-start shadow-lg lg:w-[320px] lg:max-w-[320px]'>
          <div className='z-10 max-w-72 p-4'>
            <p className='text-lg sm:text-xl'>
              Incorporation Can be Tough, but{' '}
              <span className='text-primary'>Filesure</span> Makes It Easy!
            </p>
            <RegisterNowDialog />
          </div>
          <div className='mt-2 w-full'>
            <Image
              className='absolute bottom-0 right-0 object-cover'
              src={wave}
              alt='wave'
            />
            <Image
              className='absolute bottom-0 right-1 sm:bottom-3 lg:bottom-0 lg:right-0'
              src={frame}
              alt='frame'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncorporationPrivateCompany;
