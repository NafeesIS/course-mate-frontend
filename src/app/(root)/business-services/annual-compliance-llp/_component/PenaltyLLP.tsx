import Image from 'next/image';
import fine from '../../../../../../public/assets/business-services/annual-compliance-llp/fine_llp.png';

const PenaltyLLP = () => {
  return (
    <div className='wrapper mb-10 mt-16 text-center'>
      <div className='flex h-full flex-col items-center justify-between gap-4 md:flex-row'>
        <div className='flex h-full w-full flex-col justify-between gap-4 text-start'>
          <h2 className='mr-auto max-w-xl text-start text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
            <span className='mr-1 italic text-primary'>Penalty </span>for
            non-filing of Form-8 and Form-11
          </h2>
          <p className='max-w-2xl text-sm font-normal lg:text-base'>
            In case the LLP is unable to file Form 8 and Form 11 before the due
            date, they will be liable for an additional fee of Rs.100/- per day
            till the date of filing.
          </p>
        </div>
        <Image
          src={fine}
          alt='fine'
          className='sm:max-w-[573px] md:max-w-96 lg:max-w-xl'
        />
      </div>
    </div>
  );
};

export default PenaltyLLP;
