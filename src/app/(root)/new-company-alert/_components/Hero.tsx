/* eslint-disable camelcase */

'use client';

import { Button } from '@/components/ui/button';
import { sendGTMEvent } from '@next/third-parties/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import rounded from '../../../../../public/assets/new-company-alert/rounded_vector.svg';
import triangle from '../../../../../public/assets/new-company-alert/triangle_vector.svg';
import { useNewCompanyAlertStore } from '../_store/company-alert-store';
import { ICompanyAlertPlan } from '../_utils/types';
import DownloadSampleFileDialog from './DownloadSampleFileDialog';

const Hero = ({ plans }: { plans: ICompanyAlertPlan[] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
  const emailMobilePlan = plans.find((plan) =>
    plan.name.includes('Email and Phone')
  );
  const allZones =
    emailMobilePlan?.zonalPricing &&
    emailMobilePlan?.zonalPricing.find((zone) => zone.zone === 'All');
  const trialPrice = allZones ? allZones.trial : 999;

  // Using Zustand store state
  const { setSelectedZones, setSelectedDuration, setSelectedPlan } =
    useNewCompanyAlertStore();
  const handleActivateTrial = () => {
    if (!emailMobilePlan || !trialPrice) return;

    setSelectedPlan(emailMobilePlan);
    setSelectedDuration('trial');
    if (allZones) {
      setSelectedZones([allZones]);
    }

    sendGTMEvent({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'INR',
        value: trialPrice,
        items: [
          {
            item_id: emailMobilePlan._id,
            item_name: `${emailMobilePlan.name} (trial)`,
            price: trialPrice,
            quantity: 1,
          },
        ],
      },
    });

    const redirectUrl = `/cart/subscription/new-company-alert`;
    router.push(redirectUrl);
  };

  return (
    <div className='wrapper mt-4 flex flex-col items-center justify-center rounded-t-[40px] bg-gradient-to-b from-nca-light-blue to-nca-light-blue-transparent xl:mt-6'>
      <div className='relative'>
        <h1 className='pt-10 text-center text-2xl font-bold md:text-3xl lg:pt-16 lg:text-[40px] xl:pt-20 xl:leading-snug'>
          Get Instant Access to The <br />{' '}
          <span className='text-nca-primary-blue'>Decision Maker</span> of B2B
          Organizations
        </h1>
        <Image
          src={triangle}
          alt='triangle'
          width={80}
          height={80}
          className='absolute left-14 top-6 hidden lg:block xl:top-9'
        />
      </div>
      <div className='relative'>
        <p className='mt-2 px-10 text-center text-xs text-nca-sub-heading-text md:text-sm'>
          Get newly registered company data—complete with 15+ essential details,
          including mobile numbers, email addresses, addresses, and
          more—delivered straight to your inbox. Unlock powerful insights, stay
          ahead of the competition, and connect with the right leads using
          accurate, up-to-date information that drives your business growth.
        </p>
        <Image
          src={rounded}
          alt='circle'
          width={120}
          height={120}
          className='absolute bottom-0 right-0 hidden md:-bottom-16 lg:block'
        />
      </div>
      <div className='mb-8 mt-6 flex w-full max-w-72 flex-col items-center justify-center gap-4 sm:max-w-md sm:flex-row md:my-8 md:mb-12'>
        <DownloadSampleFileDialog />{' '}
        <Button
          variant='gooeyLeft'
          className='mx-auto bg-nca-primary-blue px-8 font-semibold'
          onClick={handleActivateTrial}
        >
          Start 3-Day Trial for ₹{trialPrice}
        </Button>
      </div>
      <div className='relative mx-auto aspect-video h-full w-full max-w-4xl overflow-hidden rounded-[26px] bg-transparent shadow-[0px_4px_70px_0px_rgba(68,132,255,0.7)]'>
        {/* Video container with gradient border */}
        <div className='h-full w-full'>
          {/* Video thumbnail with play button overlay */}
          {!isPlaying && (
            <div
              className='group relative h-full w-full cursor-pointer overflow-hidden rounded-xl'
              onClick={() => setIsPlaying(true)}
            >
              <Image
                src={
                  'https://filesurestorage.blob.core.windows.net/filesure-frontend-assets/ewebinar-video-thumbnail.webp'
                }
                alt='Webinar thumbnail'
                width={1280}
                height={820}
                quality={100}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
              <div className='absolute inset-0 z-20 flex items-center justify-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white/20 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24'>
                  <Image
                    src='https://filesurestorage.blob.core.windows.net/filesure-frontend-assets/play_btn.svg'
                    alt='Play button'
                    width={80}
                    height={80}
                    priority
                    className='h-full w-full'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actual iframe (shown only when playing) */}
          {isPlaying && (
            <iframe
              width='560'
              height='315'
              src='https://www.youtube.com/embed/_Bw2eHUvwy8?si=himn-IDBBCV9oWj9&autoplay=1'
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
              className='absolute inset-0 h-full w-full rounded-xl'
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
