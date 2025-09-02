import { Card } from '@/components/ui/card';
import { AdvantagesData } from '../_data/data';

const Advantages = () => {
  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        <span className='mr-1 italic text-primary'>Advantages</span> of
        Company’s Annual compliance
      </h2>
      <div className='mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 xl:gap-5'>
        {AdvantagesData.map((benefit, index) => (
          <Card key={index} className='group w-full border bg-card shadow-lg'>
            <div className='h-2.5 w-full rounded-t-md bg-transparent duration-200 group-hover:bg-[#BCD0FE]'></div>
            <div className='flex w-full items-center justify-between gap-2 px-3 pb-5 pt-2.5 text-start sm:my-0'>
              <div className='flex flex-col items-start justify-center gap-2'>
                <p className='px-2 text-base font-semibold lg:text-lg'>
                  {benefit.title}
                </p>
                <p className='text-muted-foreground-darker px-2 text-xs font-normal lg:text-sm'>
                  {benefit.description}
                </p>
              </div>
              <div className='w-[20%]'>{benefit.svg}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Advantages;
