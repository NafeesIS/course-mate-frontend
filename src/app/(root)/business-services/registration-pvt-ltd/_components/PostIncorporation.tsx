import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { postIncorporationData } from '../_data/WhyIncorporateData';

const PostIncorporation = () => {
  return (
    <div className='wrapper mb-10 mt-16 text-center'>
      <h2 className='mx-auto mb-6 max-w-[700px] px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Post-Incorporation{' '}
        <span className='italic text-primary'>Compliance Checklist</span>
      </h2>
      <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-12 xl:gap-5'>
        {postIncorporationData.map((benefit, index) => (
          <Card
            key={index}
            className='group relative flex flex-col items-center  gap-2 border bg-card px-3 py-5 text-center shadow-lg duration-200 hover:bg-primary hover:fill-white hover:text-white sm:my-0'
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
            {(benefit.id === '3' || benefit.id === '5') && (
              <>
                <Separator />
                <p className='text-muted-foreground-darker absolute bottom-1 px-2 text-[10px] font-normal group-hover:text-muted md:px-0 lg:px-2 lg:text-xs'>
                  Not applicable to company limited by guarantee
                </p>
              </>
            )}

            <p className='absolute left-8 top-0 rounded-b-md border border-t-0 p-2 font-semibold'>
              {benefit.id}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostIncorporation;
