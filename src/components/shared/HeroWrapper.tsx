import { cn } from '@/lib/utils';

const HeroWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <section>
      <div className={cn('relative', className)}>
        <div className='wrapper flex-col-bottom relative w-full text-white'>
          {children}
        </div>

        {/* <div className='absolute -top-2 left-0 right-0 -z-10 flex justify-between overflow-hidden'>
          <Image
            src={heroBannerTwoShapeLeft}
            alt={'Hero Image'}
            width={500}
            height={280}
            sizes='100vw, (min-width:769px) 40vw'
            priority
            className='h-auto w-auto object-cover'
          />
          <Image
            src={heroBannerTwoShapeRight}
            alt={'Hero Image'}
            width={260}
            height={180}
            sizes='(max-width: 768px) 0vw, (min-width:769px) 20vw'
            // priority
            className='hidden h-auto w-auto object-cover md:inline-block'
          />
        </div> */}

        <div className='absolute bottom-0 left-0 right-0 top-0 -z-20 bg-gradient-to-r from-midnight-blue to-navy-blue'></div>
      </div>
    </section>
  );
};

export default HeroWrapper;
