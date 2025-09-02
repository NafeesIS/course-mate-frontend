/* eslint-disable camelcase */
'use client';

import { useNewCompanyAlertStore } from '@/app/(root)/new-company-alert/_store/company-alert-store';
import { MotionDiv } from '@/components/shared/Motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { sendGTMEvent } from '@next/third-parties/google';
import { FileWarningIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { ICompanyAlertPlan, IZonalPricing } from '../../_utils/types';
import NewEmailMobilePlanCardWithPromo from './NewEmailMobilePlanCardWithPromo';
import NewEmailPlanCardWithPromo from './NewEmailPlanCardWithPromo';

// Props for PricingCards
interface PricingCardsProps {
  duration: 'monthly' | 'quarterly' | 'annually';
  plans: ICompanyAlertPlan[];
}

const PricingCards: FC<PricingCardsProps> = ({ duration, plans }) => {
  const router = useRouter();
  const emailPlan = plans.find((plan) => plan.name.includes('Email Only'));
  const emailMobilePlan = plans.find((plan) =>
    plan.name.includes('Email and Phone')
  );
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Using Zustand store state
  const {
    selectedZones,
    setSelectedZones,
    setSelectedDuration,
    setSelectedPlan,
  } = useNewCompanyAlertStore();

  useEffect(() => {
    if (emailMobilePlan?.zonalPricing) {
      if (selectedZones.length === 0) {
        const defaultZone = emailMobilePlan?.zonalPricing.find(
          (z) => z.zone === 'All'
        ) as IZonalPricing;
        setSelectedZones([defaultZone]);
      } else {
        const existingZones = selectedZones.map((z) => z.zone);
        const updatedZones = emailMobilePlan?.zonalPricing.filter((z) =>
          existingZones.includes(z.zone)
        );
        setSelectedZones(updatedZones || []);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailMobilePlan]);

  useEffect(() => {
    // Check if all individual zones (North, East, South, West) are selected
    const allZonesSelected = ['North', 'East', 'South', 'West'].every((zone) =>
      selectedZones.some((selectedZone) => selectedZone.zone === zone)
    );

    if (emailMobilePlan?.zonalPricing && allZonesSelected) {
      // Automatically select the "All" zone and deselect individual zones
      const allZone = emailMobilePlan?.zonalPricing.find(
        (z) => z.zone === 'All'
      );
      if (allZone) {
        setSelectedZones([allZone]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZones, emailMobilePlan]);

  const handleZoneSelect = (zone: IZonalPricing) => {
    const isAllZone = zone.zone === 'All';

    // If "All" is selected, deselect all other zones and select only "All"
    if (isAllZone) {
      if (selectedZones.some((item) => item.zone === 'All')) {
        // If "All" is already selected, deselect it
        setSelectedZones([]);
      } else {
        // Select only "All"
        setSelectedZones([zone]);
      }
    } else {
      // If another zone is selected, deselect "All" if it is selected
      const updatedZones = selectedZones.some((item) => item.zone === zone.zone)
        ? selectedZones.filter((item) => item.zone !== zone.zone)
        : [...selectedZones.filter((item) => item.zone !== 'All'), zone];

      setSelectedZones(updatedZones);
    }
  };

  const handleZoneRemove = (zone: IZonalPricing) => {
    setSelectedZones(selectedZones.filter((item) => item.zone !== zone.zone));
  };

  const handleBuyNow = (
    plan: ICompanyAlertPlan,
    duration: 'monthly' | 'quarterly' | 'annually' | 'trial',
    price: number | undefined,
    discountedPrice: number | undefined,
    selectedZones?: IZonalPricing[]
  ) => {
    // If "Email and Phone" plan is selected and no zone is selected, open the dialog
    if (
      plan.name.includes('Email and Phone') &&
      !selectedZones?.length &&
      duration !== 'trial'
    ) {
      setDialogOpen(true); // Open the dialog instead of alerting
      return;
    }

    setSelectedPlan(plan);
    setSelectedDuration(duration);

    if (plan.name.includes('Email and Phone') && selectedZones) {
      setSelectedZones(selectedZones);
    } else if (duration === 'trial') {
      const allZone = plan.zonalPricing?.find((z) => z.zone === 'All');
      if (allZone) {
        setSelectedZones([allZone]);
      }
    }

    sendGTMEvent({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'INR',
        value: discountedPrice,
        items: [
          {
            item_id: plan._id,
            item_name:
              duration === 'trial' ? `${plan.name} (trial)` : plan.name,
            price: discountedPrice,
            quantity: 1,
          },
        ],
      },
    });

    const redirectUrl = `/cart/subscription/new-company-alert`;
    router.push(redirectUrl);
  };

  return (
    <>
      <MotionDiv
        initial={{ opacity: 1, y: 20 }}
        animate={{
          opacity: [0, 1],
          y: [20, 0],
          transition: { duration: 0.3, ease: 'easeIn' },
        }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className='flex flex-col items-center gap-6 md:justify-center md:gap-10'
      >
        {emailPlan && (
          <NewEmailPlanCardWithPromo
            emailPlan={emailPlan}
            duration={duration}
            handleBuyNow={handleBuyNow}
          />
        )}
        <Separator className='my-4 h-[1px] bg-nca-primary-blue' />
        {emailMobilePlan && (
          <NewEmailMobilePlanCardWithPromo
            emailMobilePlan={emailMobilePlan}
            duration={duration}
            selectedZones={selectedZones}
            handleZoneSelect={handleZoneSelect}
            handleZoneRemove={handleZoneRemove}
            handleBuyNow={handleBuyNow}
          />
        )}
      </MotionDiv>

      {/* Dialog for Zone selection */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='max-w-sm'>
          <DialogHeader className=''>
            <DialogTitle className='flex flex-row items-center gap-2 text-lg font-semibold text-foreground'>
              <FileWarningIcon
                className='h-6 w-6 text-red-500'
                aria-hidden='true'
              />
              Select a Zone
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className='text-sm text-gray-600'>
            Please select at least one zone to proceed with the{' '}
            <strong>&quot;Email + Phone&quot;</strong> plan.
          </DialogDescription>
          <DialogFooter className='flex justify-end'>
            <Button variant='default' onClick={() => setDialogOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PricingCards;
