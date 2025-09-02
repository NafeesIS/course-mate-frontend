/* eslint-disable camelcase */
'use client';

import { useNewCompanyAlertStore } from '@/app/(root)/new-company-alert/_store/company-alert-store';
import { ICompanyAlertPlan } from '@/app/(root)/new-company-alert/_utils/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BASE_URL_BACKEND } from '@/constants';
import { sendGTMEvent } from '@next/third-parties/google';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpCircle,
  CalendarDays,
  CheckCircle2,
  Info,
  Mails,
  Phone,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import StarIcon from '../../../../../../../public/assets/new-company-alert/star.svg';

const TrialCartItem = () => {
  const { data: fetchPlanData } = useQuery({
    queryKey: ['companyAlertPlans'],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${BASE_URL_BACKEND}/api/v1/service-catalog/filter?serviceNames=New%20Company%20Alert%20-%20Email%20Only,New%20Company%20Alert%20-%20Email%20and%20Phone`,
          { cache: 'no-store' }
        );
        if (!res.ok) {
          throw new Error('Failed to fetch plans');
        }
        return res.json();
      } catch (error) {
        console.error('Error fetching plans:', error);
        return null;
      }
    },
    staleTime: 3600000, // 1 hour in milliseconds
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 3600000, // 1 hour in milliseconds
  });

  const plans: ICompanyAlertPlan[] = fetchPlanData?.data;

  const {
    selectedPlan,
    setSelectedDuration,
    setSelectedZones,
    setSelectedPlan,
  } = useNewCompanyAlertStore();

  const [isUpgrading, setIsUpgrading] = useState(false);

  // Define the features for each plan type
  const emailOnlyFeatures = {
    inclusions: [
      { name: 'Daily Email Contacts', hasStarIcon: false },
      { name: 'Email ID of Company', hasStarIcon: true },
      { name: 'Email ID of ALL Directors', hasStarIcon: true },
      { name: 'Full Company Address with Pin code', hasStarIcon: false },
      { name: 'Company name and CIN', hasStarIcon: false },
      { name: 'Director names and DIN', hasStarIcon: false },
      { name: 'Companies and LLPs both', hasStarIcon: false },
      { name: 'Date of Incorporation', hasStarIcon: false },
      { name: 'Company Class & Type', hasStarIcon: false },
      { name: 'Authorised & Paid Up Capital', hasStarIcon: false },
      { name: 'Nature of Business', hasStarIcon: false },
    ],
    exclusions: [{ name: 'Mobile Number of Directors', hasStarIcon: false }],
  };

  const emailAndPhoneFeatures = {
    inclusions: [
      { name: 'Daily Email + Phone Contacts', hasStarIcon: false },
      { name: 'Mobile Number of ALL Directors', hasStarIcon: true },
      { name: 'Email ID of Company', hasStarIcon: true },
      { name: 'Email ID of ALL Directors', hasStarIcon: true },
      { name: 'Full Company Address with Pin code', hasStarIcon: false },
      { name: 'Company name and CIN', hasStarIcon: false },
      { name: 'Director names and DIN', hasStarIcon: false },
      { name: 'Companies and LLPs both', hasStarIcon: false },
      { name: 'Date of Incorporation', hasStarIcon: false },
      { name: 'Company Class & Type', hasStarIcon: false },
      { name: 'Authorised & Paid Up Capital', hasStarIcon: false },
      { name: 'Nature of Business', hasStarIcon: false },
    ],
    exclusions: [],
  };

  // Determine which feature set to use based on the plan name
  const features = selectedPlan?.name.includes('Email Only')
    ? emailOnlyFeatures
    : emailAndPhoneFeatures;

  const isEmailOnlyPlan = selectedPlan?.name.includes('Email Only');

  // Find the Email and Phone plan for upgrade
  const emailAndPhonePlan = plans?.find((plan) =>
    plan.name.includes('Email and Phone')
  );

  const handleUpgradeToEmailAndPhone = () => {
    if (!emailAndPhonePlan || isUpgrading) return;

    setIsUpgrading(true);

    // Artificial delay of 1.5 seconds
    setTimeout(() => {
      setSelectedPlan(emailAndPhonePlan);
      setSelectedDuration('trial');

      const allZone = emailAndPhonePlan.zonalPricing?.find(
        (z) => z.zone === 'All'
      );
      if (allZone) {
        setSelectedZones([allZone]);
      }

      sendGTMEvent({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'INR',
          value: allZone?.trial,
          items: [
            {
              item_id: emailAndPhonePlan._id,
              item_name: `${emailAndPhonePlan.name} (trial)`,
              price: allZone?.trial,
              quantity: 1,
            },
          ],
        },
      });

      setIsUpgrading(false);
    }, 500);
  };

  return (
    <Card className='overflow-hidden'>
      <CardContent className='space-y-6 p-4 md:p-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Plan Title with Highlight */}
          <div className='flex flex-col gap-4'>
            <div>
              <p className='text-xs text-muted-foreground'>Plan Name</p>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={selectedPlan?.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className='mt-1 flex items-center text-balance text-sm font-semibold md:text-base'>
                    <Mails className='mr-2 size-4 flex-shrink-0 text-primary' />
                    <Phone className='mr-2 size-[14px] flex-shrink-0 text-primary' />
                    {selectedPlan?.name}
                    <motion.span
                      className='ml-2 rounded-full border bg-green-600 px-2.5 py-0.5 text-sm text-white shadow'
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      Trial
                    </motion.span>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Features list with animation */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={selectedPlan?.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='rounded-lg bg-muted p-4'
              >
                {!selectedPlan?.name.includes('Email Only') && (
                  <motion.p
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    className='mb-2 flex items-center gap-2 text-xs font-medium text-primary'
                  >
                    <Info className='size-4' />
                    Full Access to {selectedPlan?.name} Features
                  </motion.p>
                )}
                <p className='text-xs'>
                  During your 3-day trial, you&apos;ll enjoy complete access to{' '}
                  <strong>{selectedPlan?.name}</strong> features for newly
                  registered companies.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Trial Duration */}
          <div className='mt-4 flex items-center'>
            <div>
              <p className='text-xs text-muted-foreground'>Trial Duration</p>
              <p className='mt-1 flex items-center text-sm font-semibold md:text-base'>
                <CalendarDays className='mr-2 size-4 text-primary' />3 Days
              </p>
            </div>
          </div>

          {/* Features */}
          <div className='mt-6'>
            <h3 className='mb-4 text-sm font-semibold'>
              What&apos;s included in the trial:
            </h3>

            <ul className='mt-3 space-y-2 text-xs md:mt-4 md:text-sm'>
              {/* Inclusions */}
              {features.inclusions.map((feature, idx) => (
                <motion.li
                  key={`inclusion-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className='flex items-center gap-2 text-xs'
                >
                  <CheckCircle2 className='h-4 w-4 text-green-500' />
                  {feature.name}
                  {feature.hasStarIcon && (
                    <Image
                      src={StarIcon || '/placeholder.svg'}
                      alt='Star icon'
                      width={16}
                      height={16}
                      className='inline-block'
                    />
                  )}
                </motion.li>
              ))}

              {/* Exclusions */}
              {features.exclusions.map((feature, idx) => (
                <motion.li
                  key={`exclusion-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className='flex items-center gap-2 text-xs'
                >
                  <RiCloseFill className='text-base text-red-600' />
                  {feature.name}
                  {feature.hasStarIcon && (
                    <Image
                      src={StarIcon || '/placeholder.svg'}
                      alt='Star icon'
                      width={16}
                      height={16}
                      className='inline-block'
                    />
                  )}
                </motion.li>
              ))}
            </ul>

            {/* Upgrade Button - Only show for Email Only plan */}
            {isEmailOnlyPlan && emailAndPhonePlan && (
              <div>
                <div className='mt-6 flex flex-col gap-4 rounded-lg border bg-green-50 p-3 shadow-sm md:flex-row md:justify-between'>
                  <p className='text-xs text-gray-700 md:text-sm'>
                    <strong>Unlock phone numbers</strong> and supercharge your
                    outreach! <br />
                    Get direct access to decision-makers.
                  </p>
                  <Button
                    onClick={handleUpgradeToEmailAndPhone}
                    variant='default'
                    size='sm'
                    className='bg-green-600 hover:bg-green-700'
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? (
                      <>
                        <motion.div
                          className='mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent'
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'linear',
                          }}
                        />
                        <span>Upgrading...</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpCircle className='mr-2 size-4' />
                        <span>Upgrade to Email + Phone Trial</span>
                        <Zap className='ml-2 h-4 w-4' />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default TrialCartItem;
