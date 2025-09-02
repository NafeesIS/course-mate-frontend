'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useNCACampaignStatus } from '@/hooks/useNcaCampaign';
import { formatToUrl } from '@/lib/formatters';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaUnlockKeyhole } from 'react-icons/fa6';
import { MdExpandLess, MdExpandMore, MdUpdate } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import rounded from '../../../../../public/assets/new-company-alert/rounded_vector.svg';
import triangle from '../../../../../public/assets/new-company-alert/triangle_vector.svg';
import { RecentlyIncorporatedNCAProps } from '../_utils/types';

const RecentlyIncorporated = ({
  recentlyIncorporatedCompanies,
  recentlyIncorporatedLLPs,
  plans,
}: RecentlyIncorporatedNCAProps) => {
  const { isActive, discount } = useNCACampaignStatus();
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const emailPlan = plans.find((plan) => plan.name.includes('Email Only'));

  useEffect(() => {
    if (emailPlan?.pricingPlan?.baseMonthly) {
      const multiplier = isActive ? 1 - discount / 100 : 1;
      const monthlyPrice = Math.round(
        emailPlan.pricingPlan.baseMonthly * multiplier
      );
      setDiscountedPrice(
        isActive ? monthlyPrice : emailPlan.pricingPlan.baseMonthly
      );
    }
  }, [emailPlan, isActive, discount]);

  const companiesLLPs = [
    ...recentlyIncorporatedCompanies,
    ...recentlyIncorporatedLLPs,
  ];

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Display only 5 items when not expanded
  const displayedCompanies = expanded
    ? companiesLLPs
    : companiesLLPs.slice(0, 5);

  return (
    <div className='wrapper'>
      {/* Header Section */}
      <div className='relative mb-6 lg:mb-16'>
        <div className='relative mx-auto max-w-4xl'>
          <h3 className='z-10 pt-8 text-center text-2xl font-semibold md:text-3xl lg:text-4xl xl:leading-snug'>
            Recently Incorporated <br className='sm:hidden' />
            <span className='text-nca-primary-blue'>Indian Companies</span>{' '}
          </h3>
          <Image
            src={triangle}
            alt='triangle'
            width={80}
            height={80}
            className='absolute -top-5 left-20 -z-10 hidden lg:block'
          />
        </div>
        <div className='relative mx-auto max-w-4xl lg:mb-6'>
          <p className='mt-2 text-center text-xs text-nca-sub-heading-text md:px-10 md:text-sm'>
            Sample of our verified database updated daily, get the details with
            phone numbers and Emails
          </p>
          <Image
            src={rounded}
            alt='circle'
            width={120}
            height={120}
            className='absolute -bottom-12 right-10 -z-10 hidden -rotate-[25deg] lg:block'
          />
        </div>

        {/* Badges */}
        <div className='mt-6 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:mb-6 lg:mt-0'>
          <div className='flex items-center gap-2 whitespace-nowrap rounded-full bg-green-100 px-3 py-1.5'>
            <TiTick className='text-base text-green-500 xs:text-lg' />
            <span className='text-[10px] font-medium xs:text-xs md:text-sm'>
              Reliably Verified Data
            </span>
          </div>
          <div className='flex items-center gap-2 whitespace-nowrap rounded-full bg-blue-100 px-3 py-1.5'>
            <MdUpdate className='text-base text-blue-500 xs:text-lg' />
            <span className='text-[10px] font-medium xs:text-xs md:text-sm'>
              Real-Time Updates
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}

      <Card className='mx-auto w-full max-w-6xl overflow-x-auto'>
        <Table className='hidden w-full md:block'>
          <TableHeader className='w-full'>
            <TableRow className='w-full border-b bg-gray-100'>
              <TableHead className='w-[25%] px-4 py-3 text-left text-sm font-medium text-nca-sub-heading-text lg:text-base'>
                CIN
              </TableHead>
              <TableHead className='w-[30%] whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-nca-sub-heading-text lg:text-base'>
                Company Name
              </TableHead>
              <TableHead className='w-[15%] px-4 py-3 text-left text-sm font-medium text-nca-sub-heading-text lg:text-base'>
                State
              </TableHead>
              <TableHead className='w-[15%] whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-nca-sub-heading-text lg:text-base'>
                Incorporation Date
              </TableHead>
              <TableHead className='w-[15%] whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-nca-sub-heading-text lg:text-base'>
                View Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='w-full'>
            {displayedCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='h-96 text-center'>
                  No Data Available to show
                </TableCell>
              </TableRow>
            ) : (
              displayedCompanies.map((company, index) => (
                <TableRow
                  key={company._id}
                  className={`w-full border-b transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <TableCell className='w-[25%] px-4 py-2 text-xs lg:text-sm'>
                    {company.cin}
                  </TableCell>
                  <TableCell className='w-[30%] px-4 py-2 text-xs duration-150 hover:text-nca-primary-blue lg:text-sm'>
                    <Link
                      href={`/company/${formatToUrl(company.company)}/${company.cin}?tab=about`}
                      prefetch={false}
                      className='text-nca-primary-blue underline-offset-2 hover:underline'
                    >
                      {company.company}
                    </Link>
                  </TableCell>
                  <TableCell className='w-[15%] whitespace-nowrap px-4 py-2 text-xs lg:text-sm'>
                    {company.state}
                  </TableCell>
                  <TableCell className='w-[15%] px-4 py-2 text-xs lg:text-sm'>
                    {format(company.dateOfIncorporation, 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className='w-[15%] px-4 py-2 text-start'>
                    <a href='#pricing'>
                      <Button
                        variant='gooeyLeft'
                        className='flex h-8 items-center justify-start gap-2 border-none bg-transparent text-xs font-medium text-nca-primary-blue shadow-none transition-all duration-200 hover:bg-nca-primary-blue hover:text-white lg:text-sm'
                      >
                        <FaUnlockKeyhole /> Unlock
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className='block w-full bg-gray-50 p-2 md:hidden'>
          <div className='space-y-2'>
            {displayedCompanies.map((company, index) => (
              <div
                key={index}
                className='overflow-hidden rounded-lg border bg-white p-4 shadow'
              >
                <div className='mb-1.5 flex items-center justify-between'>
                  <h3 className='text-xs font-medium text-gray-900'>
                    {company.company}
                  </h3>
                </div>

                {/* Company details in two columns */}
                <div className='w-full'>
                  <div className='flex w-full flex-col gap-1 text-sm'>
                    <div className='flex w-full items-center justify-between gap-2 text-[10px] xs:text-[11px]'>
                      <div className='flex w-full items-center'>
                        <span className='mr-1 font-medium'>CIN:</span>
                        <span>{company.cin}</span>
                      </div>
                      <a href='#pricing'>
                        <Button
                          variant='outline'
                          className='flex h-6 items-center justify-start gap-1.5 border border-nca-primary-blue bg-transparent px-2 text-[10px] font-medium text-nca-primary-blue shadow-none transition-all duration-200 hover:bg-nca-primary-blue hover:text-white xs:text-[11px]'
                        >
                          <FaUnlockKeyhole /> Unlock
                        </Button>
                      </a>
                    </div>
                    <div className='flex w-full items-center justify-start gap-2 text-[10px] xs:text-[11px]'>
                      <div className='mr-2 flex items-center whitespace-nowrap'>
                        <MapPin size={12} className='mr-1' />
                        <span>{company.state}</span>
                      </div>
                      <div className='flex items-center whitespace-nowrap'>
                        <Calendar size={12} className='mr-1' />
                        <span>
                          {format(company.dateOfIncorporation, 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* See More/Less Button */}
        <div className='flex justify-center py-4'>
          <Button
            onClick={toggleExpanded}
            variant='outline'
            className='group flex items-center gap-1 rounded-full border border-nca-primary-blue/30 px-3 py-0.5 text-xs text-nca-primary-blue transition-all duration-300 hover:border-nca-primary-blue hover:bg-nca-primary-blue hover:text-white md:gap-2 md:px-4 md:py-1.5 md:text-sm'
          >
            {expanded ? (
              <>
                See Less
                <MdExpandLess className='group-hover:animate-bounce ' />
              </>
            ) : (
              <>
                See More
                <MdExpandMore className='group-hover:animate-bounce' />
              </>
            )}
          </Button>
        </div>
        <div className='rounded-b-xl bg-gradient-to-r from-nca-secondary-blue/90 to-nca-secondary-blue/95 p-4 sm:p-5'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex w-full flex-col items-center justify-between gap-3 md:flex-row md:gap-6'>
              <p className='w-full whitespace-nowrap text-center text-xs font-semibold leading-normal text-white xs:text-[15px] sm:text-start sm:text-lg'>
                Get New Company Alerts starting at just{' '}
                <br className='sm:hidden' />
                {discountedPrice !== null
                  ? `₹${discountedPrice}/month`
                  : 'Loading...'}
              </p>
              <div className='w-full md:w-auto'>
                <a href='#pricing'>
                  <Button
                    variant='gooeyLeft'
                    className='w-full bg-white px-8 py-3 text-sm font-bold text-nca-primary-blue transition-all duration-200 hover:bg-blue-50 md:w-36 lg:w-auto lg:text-base'
                  >
                    Choose Your Plan
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RecentlyIncorporated;
