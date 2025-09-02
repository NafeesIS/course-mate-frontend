import Image from 'next/image';
import wave from '../../../../../../public/assets/business-services/llp-registration/llp_wave.svg';
import frame from '../../../../../../public/assets/business-services/llp-registration/person_frame.svg';
import RegisterNowLLPDialog from './RegisterNowLLPDialog';

const IncorporationLLP = () => {
  return (
    <div className='mb-20 mt-16 bg-muted text-center'>
      <div className='wrapper py-8'>
        <h2 className='mx-auto max-w-md px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
          <span className='mr-1 italic text-primary'>Incorporation</span> of
          Limited Liability Partnership?
        </h2>
        <div className='mt-8 flex w-full flex-col items-center justify-between gap-6 px-2 md:flex-row-reverse'>
          <ul className='text-muted-foreground-darker w-[100%] list-disc space-y-4 pl-2 text-start text-sm font-normal group-hover:text-muted md:list-none md:pl-0 lg:w-[70%] lg:space-y-6 lg:text-base'>
            <li>
              For Incorporating a LLP in India, LLP have to comply with the
              provisions of Limited Liability Partnership Act, 2008 and the
              Rules made there under.
            </li>
            <li>
              A LLP must be registered with at least 2 Designated Partners and
              at least 1 Designated Partner shall be resident of India. A
              Designated Partner must have a DIN.
            </li>
            <li>A body corporate can also be a partner in LLP.</li>
            <li>
              LLP has to prepare a LLP agreement and has to pay stamp duty on
              the agreement.
            </li>
            <li>LLP shall mandatorily have a registered office.</li>
            <li>
              Once LLP is incorporated, its receives a Certificate of
              Incorporation (COI).
            </li>
            <li>
              No minimum capital requirement for incorporation but the partners
              must agree on the amount of capital to be contributed to the LLP.
            </li>
          </ul>
          <div className='relative h-full min-h-[420px] w-[320px] min-w-[320px] border-2 border-r-0 border-[#C9E8FF] bg-background text-start shadow-lg lg:w-[320px] lg:max-w-[320px]'>
            <div className='z-10 max-w-72 p-4'>
              <p className='text-lg sm:text-xl'>
                Start Your LLP Without the Stress- FileSure{' '}
                <span className='text-primary'>Filesure</span> Makes It
                Seamless!
              </p>
              <RegisterNowLLPDialog />
            </div>
            <div className='mt-2 w-full'>
              <Image
                className='absolute bottom-0 right-0 object-cover'
                src={wave}
                alt='stress'
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
    </div>
  );
};

export default IncorporationLLP;
