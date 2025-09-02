'use client';
import PrcessIncorporationHero from './PrcessIncorporationHero';
import ProcessIncorporationDescription from './ProcessIncorporationDescription';

const ProcessIncorporation = () => {
  return (
    <div className='mb-20 mt-16 text-center'>
      <h2 className='mx-auto px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        <span className='mr-1 italic text-primary'>
          Process for Incorporation{' '}
        </span>
        of Private Company
      </h2>
      <div className='w-full'>
        <div className='relative'>
          <div className='wrapper sticky top-8 z-20 bg-background pt-8'>
            <PrcessIncorporationHero />
          </div>
          <div className='relative -z-10'>
            <div className='wrapper'>
              <ProcessIncorporationDescription />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessIncorporation;
