import { Card } from '@/components/ui/card';
import { whyIncorporateData } from '../_data/WhyIncorporateData';

const WhyIncorporate = () => {
  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto mb-6 max-w-lg px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Why <span className='mr-1 italic text-primary'>Incorporate</span> a
        Private Limited Company?
      </h2>
      {/* <Link
        href='#pricing'
        prefetch={false}
        className={cn(buttonVariants({ variant: 'gooeyLeft' }), 'px-8')}
      >
        Get alerts now
      </Link> */}
      <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-12 xl:gap-5'>
        {whyIncorporateData.map((benefit, index) => (
          <Card
            key={index}
            className='group flex flex-col items-center  gap-2 border bg-card px-3 py-5 text-center shadow-lg duration-200 hover:bg-primary hover:fill-white hover:text-white sm:my-0'
          >
            <div className='flex flex-col items-center justify-center gap-5'>
              {benefit.svg}
              <p className='px-2 text-base font-semibold lg:text-lg xl:px-8'>
                {benefit.title}
              </p>
            </div>
            <p className='text-muted-foreground-darker px-2 text-xs font-normal group-hover:text-muted lg:text-sm'>
              {benefit.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WhyIncorporate;
