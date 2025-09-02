'use client';
import { CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { BiSolidQuoteAltRight } from 'react-icons/bi';
import { IoIosPerson } from 'react-icons/io';
import rounded from '../../../../../public/assets/new-company-alert/rounded_vector.svg';
import triangle from '../../../../../public/assets/new-company-alert/triangle_vector.svg';
import { Reviews } from '../_utils/Reviews';
const SatisfiedClient = () => {
  const CarouselSpacing = () => {
    return (
      <Carousel
        className='relative mx-auto w-full max-w-full'
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
      >
        <CarouselContent className='-ml-1'>
          {Reviews.map((item, index) => (
            <CarouselItem
              key={index}
              className='my-auto flex h-96 w-full items-center justify-center pl-1 sm:basis-1/2 sm:pl-4 lg:basis-1/3'
            >
              <div className='mx-auto h-full max-h-72 w-full max-w-[95%] rounded-[40px] bg-white shadow-[0px_12px_44px_0px_rgba(103,119,159,0.08)] sm:max-w-[350px] md:max-h-[300px]'>
                <CardContent className='group flex aspect-square max-h-72 w-full cursor-default items-center justify-center rounded-3xl p-6 duration-200 hover:rounded-[40px] hover:bg-nca-primary-blue md:max-h-[300px]'>
                  <div className='flex h-full flex-col justify-between xl:px-0'>
                    <div className='flex items-center gap-4'>
                      <div
                        className='rounded-full border
                          p-1'
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={180}
                            height={180}
                            quality={100}
                            className='h-16 w-16 min-w-16 rounded-full object-cover object-center md:h-[72px] md:w-[72px] md:min-w-[72px]'
                          />
                        ) : (
                          <IoIosPerson className='h-16 w-16 min-w-16 rounded-full text-[#CCE4F5] md:h-[72px] md:w-[72px] md:min-w-[72px]' />
                        )}
                      </div>
                      <div className='flex w-full max-w-full items-start justify-between gap-0'>
                        <div className='flex flex-col'>
                          <h6 className='text-base font-semibold group-hover:text-white md:text-lg xl:text-xl'>
                            {item.name}
                          </h6>
                          <p className='text-sm group-hover:text-white md:mt-1 md:text-base'>
                            {item.designation}
                          </p>
                        </div>
                        <BiSolidQuoteAltRight className='text-3xl text-yellow-400' />
                      </div>
                    </div>
                    <blockquote className='mt-6 h-full text-xs font-light text-nca-paragraph-text group-hover:text-white md:mt-8 md:text-sm'>
                      {item.review}
                    </blockquote>
                  </div>
                </CardContent>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='mx-auto max-w-24 sm:absolute sm:-top-28 sm:right-0 md:-top-32 md:max-w-full'>
          <div className='flex gap-2 sm:mt-8'>
            <CarouselPrevious className='relative left-0 h-10 w-12 translate-y-0 rounded-xl border-none text-black shadow-[0px_12px_44px_0px_rgba(103,_119,_159,_0.10)] hover:bg-nca-primary-blue hover:text-white hover:shadow lg:h-12 lg:w-14' />
            <CarouselNext className='relative right-0 h-10 w-12 translate-y-0 rounded-xl border-none text-black shadow-[0px_12px_44px_0px_rgba(103,_119,_159,_0.10)] hover:bg-nca-primary-blue hover:text-white hover:shadow lg:h-12 lg:w-14' />
          </div>
        </div>
      </Carousel>
    );
  };
  return (
    <div className='bg-[#f8f7f4] pt-12 lg:pb-16 lg:pt-32'>
      <div className='wrapper h-full pb-16'>
        <div className='relative h-16 max-w-full sm:h-20 sm:max-w-md'>
          <h6 className='absolute z-20 text-start text-2xl font-semibold md:text-3xl lg:text-4xl xl:leading-normal'>
            What Our <br />{' '}
            <span className={`z-20 text-nca-primary-blue`}>Satisfied</span>{' '}
            Client Say
          </h6>
          <Image
            src={triangle}
            alt='triangle'
            width={80}
            height={80}
            className='absolute left-6 top-0 hidden lg:block'
          />
          <Image
            src={rounded}
            alt='rounded'
            width={90}
            height={90}
            className='absolute -bottom-8 right-12 z-10 hidden lg:block'
          />
        </div>
        <div className='mx-auto mt-0 h-full max-w-full md:mt-8 lg:mt-14'>
          {CarouselSpacing()}
        </div>
      </div>
    </div>
  );
};
export default SatisfiedClient;
