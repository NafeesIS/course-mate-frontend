'use client';

import { useNewCompanyAlertStore } from '@/app/(root)/new-company-alert/_store/company-alert-store';
import { ICompanyAlertPlan } from '@/app/(root)/new-company-alert/_utils/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { getStateFullName } from '@/constants/stateData';
import { usePricingStore } from '@/store/pricingStore';
import { IZonalPricing } from '@/types/ServiceCatalogTypes';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Mails,
  MapPinned,
  Phone,
  Star,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const CartItemDetails = () => {
  const { serviceCatalogFromDB } = usePricingStore();
  const {
    selectedPlan,
    selectedDuration,
    selectedZones,
    setSelectedPlan,
    setSelectedDuration,
    setSelectedZones,
  } = useNewCompanyAlertStore();

  const [totalCompanyCount, setTotalCompanyCount] = useState(0);
  const orderedZones = useMemo(() => {
    if (selectedPlan?.name.includes('Email Only')) {
      return (
        serviceCatalogFromDB?.serviceCatalog.find(
          (service) => service.name === 'New Company Alert - Email Only'
        )?.zonalPricing || []
      );
    }

    if (selectedPlan?.zonalPricing) {
      const zoneOrder = ['All', 'West', 'East', 'North', 'South'];
      return zoneOrder
        .map(
          (zoneName) =>
            selectedPlan.zonalPricing &&
            selectedPlan.zonalPricing.find((z) => z.zone === zoneName)
        )
        .filter((zone): zone is IZonalPricing => zone !== undefined);
    }

    return [];
  }, [selectedPlan, serviceCatalogFromDB]);

  useEffect(() => {
    if (selectedPlan?.name.includes('Email Only')) {
      setSelectedZones(orderedZones);
    }

    if (selectedZones) {
      const total = selectedZones.reduce(
        (acc, zone) => acc + zone.approxCompanies,
        0
      );
      setTotalCompanyCount(total);
    }
  }, [selectedPlan, selectedZones, orderedZones, setSelectedZones]);

  // Handle plan change
  const handlePlanChange = useCallback(
    (planName: string) => {
      const newPlan = serviceCatalogFromDB?.serviceCatalog.find(
        (service) => service.name === planName
      );
      if (newPlan) {
        setSelectedPlan(newPlan as ICompanyAlertPlan);
        const allZone = newPlan.zonalPricing?.find((z) => z.zone === 'All');
        if (allZone) setSelectedZones([allZone]);
      }
    },
    [serviceCatalogFromDB, setSelectedPlan, setSelectedZones]
  );

  const handleDurationChange = useCallback(
    (value: string) => {
      setSelectedDuration(value as 'monthly' | 'quarterly' | 'annually');
    },
    [setSelectedDuration]
  );

  // Handle zone selection
  const handleZoneToggle = useCallback(
    (zone: IZonalPricing) => {
      if (selectedPlan?.name.includes('Email Only')) return;

      const individualZones = ['North', 'South', 'East', 'West'];

      let updatedZones: IZonalPricing[];

      if (zone.zone === 'All') {
        updatedZones = [zone];
      } else {
        const zonesWithoutAll = selectedZones.filter((z) => z.zone !== 'All');
        const isZoneAlreadySelected = zonesWithoutAll.some(
          (z) => z.zone === zone.zone
        );

        if (isZoneAlreadySelected) {
          updatedZones = zonesWithoutAll.filter((z) => z.zone !== zone.zone);
        } else {
          updatedZones = [...zonesWithoutAll, zone];

          const allSelected = individualZones.every((zoneName) =>
            updatedZones.some((z) => z.zone === zoneName)
          );

          if (allSelected) {
            const allZone = serviceCatalogFromDB?.serviceCatalog
              .find((s) => s.name === selectedPlan?.name)
              ?.zonalPricing?.find((z) => z.zone === 'All');
            if (allZone) {
              updatedZones = [allZone];
            }
          }
        }
      }

      setSelectedZones(updatedZones);
    },
    [selectedPlan, selectedZones, serviceCatalogFromDB, setSelectedZones]
  );

  return (
    <Card className='overflow-hidden'>
      <CardContent className='space-y-6 p-4 md:p-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Plan Selection */}
          <div className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-xs text-muted-foreground'>Plan Name</p>
              <p className='mt-1 flex items-center text-balance text-sm font-semibold md:text-base'>
                {selectedPlan?.name.includes('Email Only') ? (
                  <Mails className='mr-2 size-4 flex-shrink-0 text-primary' />
                ) : (
                  <>
                    <Mails className='mr-2 size-4 flex-shrink-0 text-primary' />
                    <Phone className='mr-2 size-[14px] flex-shrink-0 text-primary' />
                  </>
                )}
                {selectedPlan?.name}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-[150px] justify-between gap-1.5 text-xs md:text-sm'
                >
                  Change Plan
                  <ChevronDown className='h-4 w-4 opacity-50' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[200px]'>
                <DropdownMenuRadioGroup
                  value={selectedPlan?.name}
                  onValueChange={handlePlanChange}
                  className='divide-y'
                >
                  <DropdownMenuRadioItem
                    value='New Company Alert - Email Only'
                    className='cursor-pointer'
                  >
                    Email Only
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value='New Company Alert - Email and Phone'
                    className='cursor-pointer'
                  >
                    Email + Mobile
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Duration Selection */}
          <div className='mt-4 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground'>Plan Validity</p>
              <p className='mt-1 flex items-center text-sm font-semibold capitalize md:text-base'>
                <CalendarDays className='mr-2 size-4 text-primary' />
                {selectedDuration}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='justify-between gap-1.5 text-xs md:w-[180px] md:text-sm'
                >
                  Change Duration <ChevronDown className='h-4 w-4 opacity-50' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[200px]'>
                <DropdownMenuRadioGroup
                  value={selectedDuration}
                  onValueChange={handleDurationChange}
                  className='divide-y'
                >
                  <DropdownMenuRadioItem value='monthly'>
                    1 Month
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='quarterly' className='relative'>
                    3 Months
                    <span className='absolute right-2 top-1/2 ml-2 -translate-y-1/2 transform rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground'>
                      Popular
                    </span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='annually'>
                    12 Months
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className='my-4 flex flex-wrap items-center'>
            <div>
              <p className='text-xs text-muted-foreground'>Zones</p>
              <p className='mt-1 flex flex-wrap items-center gap-2'>
                <MapPinned className='size-4 text-primary' />
                {selectedZones.map((zone) => (
                  <span
                    key={zone.zone}
                    className='inline-block rounded-md bg-blue-100 px-3 py-1.5 text-xs text-foreground'
                  >
                    {zone.zone}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Zone Selection - Only for Email + Mobile plan */}
          <AnimatePresence>
            {selectedPlan?.name.includes('Email and Phone') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className='overflow-hidden'
              >
                <div className='rounded-lg border bg-muted/50 p-2 md:p-4'>
                  <h3 className='flex items-center text-xs font-medium text-muted-foreground'>
                    Choose Zones to Receive Director&apos;s Mobile Numbers for
                    Targeted Outreach
                  </h3>
                  <div className='mt-2 flex items-center gap-2 rounded-md bg-primary/10 py-2'>
                    <span className='rounded bg-primary px-2 py-0.5 text-sm font-medium text-primary-foreground'>
                      {totalCompanyCount.toLocaleString()}
                    </span>
                    <span className='text-xs font-semibold'>
                      approx. companies data per month
                    </span>
                  </div>

                  <div className='mt-2 space-y-2'>
                    {orderedZones.map((zone) => (
                      <motion.div
                        key={zone.zone}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className='rounded-lg border bg-background p-2 transition-shadow hover:shadow-md md:p-4'
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <h4 className='text-sm font-medium'>
                              {zone.zone === 'All'
                                ? 'All India'
                                : `India ${zone.zone}`}
                            </h4>
                            <p className='mt-1 text-xs text-muted-foreground'>
                              Approx. {zone.approxCompanies.toLocaleString()}{' '}
                              companies per month
                            </p>
                          </div>
                          <Button
                            variant={
                              selectedZones.some((z) => z.zone === zone.zone)
                                ? 'default'
                                : 'outline'
                            }
                            size='sm'
                            onClick={() => handleZoneToggle(zone)}
                            className='text-xs md:text-sm'
                          >
                            {selectedZones.some((z) => z.zone === zone.zone) ? (
                              <>
                                <CheckCircle2 className='mr-2 h-4 w-4' /> Added
                              </>
                            ) : (
                              'Add'
                            )}
                          </Button>
                        </div>
                        {zone.zone !== 'All' && (
                          <div className='mt-2 flex flex-wrap gap-1'>
                            {zone.stateIncludes.map((state) => {
                              const stateName = getStateFullName(state);
                              if (!stateName) return null;
                              return (
                                <span
                                  key={state}
                                  className='rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground'
                                >
                                  {stateName}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Separator className='my-6' />

          {/* Features */}
          <div>
            <h3 className='mb-4 text-sm font-semibold'>
              What&apos;s included:
            </h3>
            <ul className='space-y-2'>
              {selectedPlan?.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className='flex items-center gap-2 text-sm'
                >
                  <CheckCircle2 className='h-4 w-4 text-green-500' />
                  {feature}
                  {(feature.includes('Mobile Number') ||
                    feature.includes('Email ID')) && (
                    <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default CartItemDetails;
