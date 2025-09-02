'use client';

import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calculator } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { IoIosArrowDown } from 'react-icons/io';
import { IoChatboxEllipses } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import dottedBg from '../../../../../public/assets/new-company-alert/dotted_bg.svg';
import { LegalEagle } from './LegalEagle';
import ScenarioSelector from './ScenarioSelector';

export default function ROICalculator({
  previousMonthTotalCompanyLLP,
  previousMonthTotalDirectors,
}: {
  previousMonthTotalCompanyLLP: number;
  previousMonthTotalDirectors: number;
}) {
  const [ticketSize, setTicketSize] = useState(25000);
  const [marginPercentage, setMarginPercentage] = useState(80);
  const [ticketSizeError, setTicketSizeError] = useState(false);
  const [marginError, setMarginError] = useState(false);
  const [conversionRatio, setConversionRatio] = useState(5);
  const [qualifiedLeads, setQualifiedLeads] = useState(5);
  const [revenueCalculation, setRevenueCalculation] = useState(false);
  const [costCalculation, setCostCalculation] = useState(false);
  const [companyCount] = useState(previousMonthTotalCompanyLLP);
  const [directorCount] = useState(previousMonthTotalDirectors);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeCard, setActiveCard] = useState(0);
  const MAX_TICKET_SIZE = 1000000000;
  const MAX_MARGIN = 100;

  const limitDecimalPlaces = (value: any) => {
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 2) {
        return `${parts[0]}.${parts[1].substring(0, 2)}`;
      }
    }
    return value;
  };

  const handleTicketChange = (e: any) => {
    let value = e.target.value;

    if (value === '') {
      setTicketSize(0);
      setTicketSizeError(false);
      return;
    }

    value = limitDecimalPlaces(value);
    const numValue = parseFloat(value);

    if (numValue > MAX_TICKET_SIZE) {
      setTicketSizeError(true);
      return;
    } else {
      setTicketSizeError(false);
    }

    setTicketSize(numValue);
  };

  const handleMarginChange = (e: any) => {
    let value = e.target.value;

    if (value === '') {
      setMarginPercentage(0);
      setMarginError(false);
      return;
    }

    value = limitDecimalPlaces(value);
    const numValue = parseFloat(value);

    if (numValue > MAX_MARGIN) {
      setMarginError(true);
      return;
    } else {
      setMarginError(false);
    }

    setMarginPercentage(numValue);
  };
  const scrollToCard = (index: number) => {
    const container = scrollRef.current;
    if (container) {
      const card = container.children.item(index) as HTMLElement;
      if (card) {
        container.scrollTo({
          left: card.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const firstCard = container.children[0] as HTMLElement;
      const cardWidth = firstCard?.offsetWidth || 1;
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveCard(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  // Auto-play functionality to change cards every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveCard((prevState) => {
        const nextCard = (prevState + 1) % 4; // Loop through 4 cards
        scrollToCard(nextCard); // Scroll to the next card
        return nextCard;
      });
    }, 3000); // Change card every 3 seconds

    // Cleanup the interval when component is unmounted
    return () => clearInterval(intervalId);
  }, []);
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })
      .format(num)
      .replace(/^₹/, '₹');
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(0) + '%';
  };

  const calculateReach = (contacts: number, openRate: number) => {
    return (contacts * openRate) / 100;
  };

  const calculateConversions = (
    reach: number,
    qualifiedLeads: number,
    conversionRatio: number
  ) => {
    return qualifiedLeads * (conversionRatio / 100);
  };

  const calculateRevenue = (
    conversions: number,
    contributionMargin: number
  ) => {
    return conversions * contributionMargin;
  };

  const calculateVolumePerCompany = () => {
    return directorCount; // Use the fixed number of directors
  };

  const getCostPerThousand = (channel: string) => {
    switch (channel) {
      case 'EMAIL':
        return 0.22 * 1000; // 22 paisa per email
      case 'SMS':
        return 1.0 * 1000; // 1 rupee per message
      case 'WHATSAPP':
        return 0.85 * 1000; // 85 paisa per message
      default:
        return 0;
    }
  };

  const calculateMarketingCost = (volume: number, costPerUnit: number) => {
    return (volume * costPerUnit) / 1000; // Cost per thousand
  };

  const calculateSubscriptionCost = (volume: number, channel: string) => {
    return channel === 'EMAIL' ? volume * 0.2 : volume * 2.0;
  };

  const calculateContributionMargin = (
    ticketSize: number,
    marginPercentage: number
  ) => {
    return ticketSize * (marginPercentage / 100);
  };

  const handleScenarioChange = (config: {
    ticketSize: number;
    conversionRatio: number;
    qualifiedLeads: number;
    scenario: string;
  }) => {
    setTicketSize(config.ticketSize);
    setConversionRatio(config.conversionRatio);
    setQualifiedLeads(config.qualifiedLeads);
  };

  const channels = ['EMAIL', 'SMS', 'WHATSAPP'];
  const channelIcons = [
    <MdEmail
      key='email'
      className='h-8 w-8 rounded-full bg-nca-primary-blue p-2 text-white'
    />,
    <IoChatboxEllipses
      key='sms'
      className='h-8 w-8 rounded-full bg-nca-primary-blue p-2 text-white'
    />,
    <FaWhatsapp
      key='whatsapp'
      className='h-8 w-8 rounded-full bg-nca-primary-blue p-2 text-white'
    />,
  ];
  const channelIconsTable = [
    <MdEmail key='email' className='h-5 w-5 text-nca-primary-blue' />,
    <IoChatboxEllipses key='sms' className='h-5 w-5 text-nca-primary-blue' />,
    <FaWhatsapp key='whatsapp' className='h-5 w-5 text-nca-primary-blue' />,
  ];
  const contactsPerChannel = Array(3).fill(companyCount);

  // Calculate total costs for each channel
  const totalCosts = contactsPerChannel.map((contacts, i) => {
    const volume = calculateVolumePerCompany();
    const costPerThousand = getCostPerThousand(channels[i]);
    const marketingCost = calculateMarketingCost(volume, costPerThousand);
    const subscriptionCost = calculateSubscriptionCost(contacts, channels[i]);
    return marketingCost + subscriptionCost; // Total cost for the channel
  });

  return (
    <div
      className='rounded-xl border bg-nca-background-soft p-4 sm:p-6'
      style={{
        backgroundImage: `url(${dottedBg.src})`,
      }}
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='py-4 md:py-6'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <p className='text-xs font-medium sm:text-sm'>
                Enter your ticket size
              </p>
              <input
                type='number'
                value={ticketSize === 0 ? '' : ticketSize}
                onChange={handleTicketChange}
                className='mt-1 w-full rounded-md border border-gray-300 p-2'
                placeholder='Enter ticket size'
                max={MAX_TICKET_SIZE}
              />
              {ticketSizeError && (
                <p className='mt-1 text-xs text-red-500'>
                  *Maximum ticket size is {formatCurrency(MAX_TICKET_SIZE)}
                </p>
              )}
            </div>
            <div>
              <p className='text-xs font-medium sm:text-sm'>
                Enter your margin percentage
              </p>
              <input
                type='number'
                value={marginPercentage === 0 ? '' : marginPercentage}
                onChange={handleMarginChange}
                className='mt-1 w-full rounded-md border border-gray-300 p-2'
                placeholder='Enter margin percentage'
              />
              {marginError && (
                <p className='mt-1 text-xs text-red-500'>
                  *Maximum margin percentage is 100
                </p>
              )}
            </div>
          </div>
          <div className='mt-4'>
            <p className='mb-2 text-base font-semibold sm:text-lg'>
              Select case scenario
            </p>
            <ScenarioSelector
              onScenarioChange={handleScenarioChange}
              ticketSize={ticketSize}
            />
          </div>
        </div>

        <div className='space-y-4 rounded-lg bg-nca-sky-blue p-4 md:p-6'>
          {/* <p className='text-xs font-semibold text-gray-800 md:text-sm'>
                  Selected Parameters
                </p> */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm lg:text-lg'>Net Revenue Per Sale</p>
              <p className='mt-1 text-xl font-semibold'>
                {formatCurrency((ticketSize * marginPercentage) / 100)}
              </p>
            </div>
            <div>
              <p className='text-sm lg:text-lg'>Margin Percentage</p>
              <p className='mt-1 text-xl font-semibold'>{marginPercentage}%</p>
            </div>
            <div>
              <p className='text-sm lg:text-lg'>Conversion Ratio</p>
              <p className='mt-1 text-xl font-semibold'>{conversionRatio}%</p>
            </div>
            <div>
              <p className='text-sm lg:text-lg'>Qualified Leads</p>
              <p className='mt-1 text-xl font-semibold'>{qualifiedLeads}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Investments and Returns */}
      <div className='mt-6 md:mt-3'>
        <p className='mb-3 text-base font-semibold sm:mb-4 sm:text-lg'>
          ROI Analysis
        </p>

        {/* Summary Cards */}
        <div>
          {/* Cards Container */}
          <div
            ref={scrollRef}
            className='no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible'
          >
            {channels.map((channel, index) => {
              const openRate = [20, 50, 95][index];
              const convRate = conversionRatio;

              const reach = calculateReach(contactsPerChannel[index], openRate);
              const qualifiedLeadsCount = Math.round(
                reach * (qualifiedLeads / 100)
              );
              const conversions = calculateConversions(
                reach,
                qualifiedLeadsCount,
                convRate
              );
              const contributionMargin = calculateContributionMargin(
                ticketSize,
                marginPercentage
              );
              const revenue = calculateRevenue(conversions, contributionMargin);
              const profit = revenue - totalCosts[index];
              const roi = (profit / totalCosts[index]) * 100;

              const roiColor =
                roi > 200
                  ? 'text-nca-primary-blue'
                  : roi > 100
                    ? 'text-amber-600'
                    : 'text-nca-primary-red';

              return (
                <div
                  key={channel}
                  className='min-w-[79vw] shrink-0 snap-start rounded-xl border border-nca-primary-blue bg-nca-sky-blue p-4 sm:min-w-0'
                >
                  <div className='mb-3 flex items-center justify-between sm:mb-4'>
                    <div className='flex items-center gap-1 sm:gap-2'>
                      {channelIcons[index]}
                      <p className='text-base font-medium sm:text-lg'>
                        {channel}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-2 text-xs sm:text-sm'>
                    <div className='flex justify-between'>
                      <span>Revenue</span>
                      <span className='font-medium text-gray-800'>
                        {formatCurrency(revenue)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Cost</span>
                      <span className='font-medium text-nca-primary-red'>
                        ({formatCurrency(totalCosts[index])})
                      </span>
                    </div>
                    <div className='mt-2 border-t pt-2'>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Profit</span>
                        <span className={`font-medium text-gray-800`}>
                          {formatCurrency(profit)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`mt-3 flex items-center justify-between rounded-md border border-nca-primary-blue px-3 py-1 text-xs sm:mt-4 sm:px-3 sm:py-2 sm:text-sm ${roiColor}`}
                  >
                    <span>ROI:</span>
                    <span className='font-medium'>{formatPercentage(roi)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots - only on mobile */}
          <div className='mt-4 flex justify-center space-x-2 sm:hidden'>
            {channels.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={`h-2 w-2 rounded-full ${
                  activeCard === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Calculation */}
      <div>
        <div>
          <div
            className='mt-10 flex cursor-pointer items-center justify-between duration-200 hover:bg-nca-sky-blue'
            onClick={() => setRevenueCalculation((prev) => !prev)}
          >
            <div className='flex items-start gap-2 text-base font-semibold sm:text-lg'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-chart-no-axes-combined text-nca-primary-blue'
              >
                <path d='M12 16v5' />
                <path d='M16 14v7' />
                <path d='M20 10v11' />
                <path d='m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15' />
                <path d='M4 18v3' />
                <path d='M8 14v7' />
              </svg>
              Revenue Calculation
            </div>
            <IoIosArrowDown
              className={`transition-transform duration-300 ${
                revenueCalculation ? 'rotate-180' : ''
              }`}
            />
          </div>
          <Separator className='my-4 h-[3px] bg-[#c1c5cc]' />
          <div className='overflow-hidden'>
            <div
              className={`mb-6 transition-all duration-100 ${revenueCalculation ? 'no-scrollbar h-full overflow-x-auto sm:h-full' : 'h-0 translate-y-6'} `}
            >
              <div className='w-full'>
                <Table className='w-full'>
                  <TableHeader className='w-full'>
                    <TableRow className='flex w-full'>
                      <TableHead className='sticky left-0 z-20 flex w-36 items-center bg-nca-background-soft sm:w-[49%]'>
                        Metrics
                      </TableHead>
                      {channels.map((channel, index) => (
                        <TableHead
                          key={channel}
                          className='w-32 min-w-32 bg-white text-start sm:w-[17%] md:bg-nca-background-soft'
                        >
                          <div className='flex h-full items-center justify-start gap-1 sm:gap-2'>
                            {channelIconsTable[index]}
                            <span className='hidden xs:inline'>{channel}</span>
                            <span className='xs:hidden'>
                              {channel.substring(0, 1)}
                            </span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className='text-start'>
                    {[
                      {
                        metric: 'NO OF COMPANIES',
                        values: Array(3).fill(companyCount.toLocaleString()),
                        editable: false, // Set to false to prevent editing
                      },
                      {
                        metric: 'OPEN RATE',
                        values: ['20%', '50%', '95%'],
                        rawValues: [20, 50, 95],
                      },
                      {
                        metric: 'REACH',
                        values: contactsPerChannel.map((contacts, i) => {
                          const reach = calculateReach(
                            contacts,
                            [20, 50, 95][i]
                          );
                          return reach.toLocaleString();
                        }),
                        rawValues: contactsPerChannel.map((contacts, i) => {
                          const reach = calculateReach(
                            contacts,
                            [20, 50, 95][i]
                          );
                          return reach;
                        }),
                      },
                      {
                        metric: `QUALIFIED LEADS (${qualifiedLeads}% of Reach)`,
                        values: contactsPerChannel.map((contacts, i) => {
                          const reach = calculateReach(
                            contacts,
                            [20, 50, 95][i]
                          );
                          return Math.round(
                            reach * (qualifiedLeads / 100)
                          ).toLocaleString();
                        }),
                        rawValues: contactsPerChannel.map((contacts, i) => {
                          const reach = calculateReach(
                            contacts,
                            [20, 50, 95][i]
                          );
                          return Math.round(reach * (qualifiedLeads / 100));
                        }),
                      },
                      {
                        metric: `NO OF CONVERSIONS (${conversionRatio}% of Qualified Leads)`,
                        values: contactsPerChannel.map((contacts, i) => {
                          const reach = calculateReach(
                            contacts,
                            [20, 50, 95][i]
                          );
                          const qualifiedLeadsCount = Math.round(
                            reach * (qualifiedLeads / 100)
                          );
                          return Math.round(
                            calculateConversions(
                              reach,
                              qualifiedLeadsCount,
                              conversionRatio
                            )
                          ).toLocaleString();
                        }),
                        rawValues: contactsPerChannel.map((contacts, i) => {
                          const reach = calculateReach(
                            contacts,
                            [20, 50, 95][i]
                          );
                          const qualifiedLeadsCount = Math.round(
                            reach * (qualifiedLeads / 100)
                          );
                          return Math.round(
                            calculateConversions(
                              reach,
                              qualifiedLeadsCount,
                              conversionRatio
                            )
                          );
                        }),
                      },
                      {
                        metric: 'CONTRIBUTION MARGIN',
                        values: Array(3).fill(
                          formatCurrency(
                            calculateContributionMargin(
                              ticketSize,
                              marginPercentage
                            )
                          )
                        ),
                      },
                      {
                        metric: 'ESTIMATED REVENUE',
                        values: contactsPerChannel.map((contacts, i) => {
                          const reach = calculateReach(
                            contacts,
                            [20, 50, 95][i]
                          );
                          const conversions = Math.round(
                            calculateConversions(
                              reach,
                              Math.round(reach * (qualifiedLeads / 100)),
                              conversionRatio
                            )
                          );
                          const contributionMargin =
                            calculateContributionMargin(
                              ticketSize,
                              marginPercentage
                            );
                          return formatCurrency(
                            calculateRevenue(conversions, contributionMargin)
                          );
                        }),
                        rawValues: contactsPerChannel.map((contacts, i) => {
                          const reach = calculateReach(
                            contacts,
                            [20, 50, 95][i]
                          );
                          const conversions = Math.round(
                            calculateConversions(
                              reach,
                              Math.round(reach * (qualifiedLeads / 100)),
                              conversionRatio
                            )
                          );
                          const contributionMargin =
                            calculateContributionMargin(
                              ticketSize,
                              marginPercentage
                            );
                          return calculateRevenue(
                            conversions,
                            contributionMargin
                          );
                        }),
                      },
                    ].map((row) => (
                      <TableRow className='flex' key={row.metric}>
                        <TableCell
                          className={`sticky left-0 z-10 w-36 bg-nca-background-soft text-xs font-medium sm:w-[49%] md:text-sm`}
                        >
                          {row.metric}
                        </TableCell>
                        {row.values.map((value, i) => (
                          <TableCell
                            key={i}
                            className={`w-32 min-w-32 bg-white text-start text-xs sm:w-[17%] md:bg-nca-background-soft md:text-sm`}
                          >
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            className='flex cursor-pointer items-center justify-between duration-100 hover:bg-nca-sky-blue'
            onClick={() => setCostCalculation((prev) => !prev)}
          >
            <div className='flex items-center gap-2 text-base font-semibold sm:text-lg'>
              <Calculator className='h-4 w-4 text-nca-primary-blue sm:h-5 sm:w-5' />
              Cost Calculation
            </div>
            <IoIosArrowDown
              className={`transition-transform duration-300 ${
                costCalculation ? 'rotate-180' : ''
              }`}
            />
          </div>
          <Separator className='my-4 h-[3px] bg-[#c1c5cc]' />
          <div className='overflow-hidden'>
            <div
              className={`mb-6 transition-all duration-100 ${costCalculation ? 'no-scrollbar h-full overflow-x-auto' : 'h-0 translate-y-6'} `}
            >
              <div className='w-full'>
                <Table className='w-full'>
                  <TableHeader className='w-full'>
                    <TableRow className='flex w-full'>
                      {/* Fixed Column */}
                      <TableHead className='sticky left-0 z-20 flex w-36 items-center bg-nca-background-soft sm:w-[49%]'>
                        Cost Metrics
                      </TableHead>
                      {/* Scrollable Columns */}
                      {channels.map((channel, index) => (
                        <TableHead
                          key={channel}
                          className='w-32 min-w-32 bg-white text-start sm:w-[17%] md:bg-nca-background-soft'
                        >
                          <div className='flex h-full items-center justify-start gap-1 sm:gap-2'>
                            {channelIconsTable[index]}
                            <span className='hidden xs:inline'>{channel}</span>
                            <span className='xs:hidden'>
                              {channel.substring(0, 1)}
                            </span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className='flex'>
                      <TableCell className='sticky left-0 z-10 w-36 bg-nca-background-soft text-xs font-medium sm:w-[49%] md:text-sm'>
                        SEND VOLUME (total directors)
                      </TableCell>
                      {Array(3)
                        .fill(directorCount)
                        .map((volume, i) => (
                          <TableCell
                            key={i}
                            className='w-32 min-w-32 bg-white text-start text-xs sm:w-[17%] md:bg-nca-background-soft md:text-sm'
                          >
                            {volume.toLocaleString()}
                          </TableCell>
                        ))}
                    </TableRow>
                    <TableRow className='flex'>
                      <TableCell className='sticky left-0 z-10 w-36 bg-nca-background-soft text-xs font-medium sm:w-[49%] md:text-sm'>
                        COST PER 1K SENDS
                      </TableCell>
                      {channels.map((channel, i) => (
                        <TableCell
                          key={i}
                          className='w-32 min-w-32 bg-white text-start text-xs sm:w-[17%] md:bg-nca-background-soft md:text-sm'
                        >
                          ₹{getCostPerThousand(channel)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className='flex'>
                      <TableCell className='sticky left-0 z-10 w-36 bg-nca-background-soft text-xs font-medium sm:w-[49%]  md:text-sm'>
                        MARKETING SPEND
                      </TableCell>
                      {contactsPerChannel.map((contacts, i) => {
                        const volume = calculateVolumePerCompany();
                        const costPerThousand = getCostPerThousand(channels[i]);
                        const marketingCost = calculateMarketingCost(
                          volume,
                          costPerThousand
                        );
                        return (
                          <TableCell
                            key={i}
                            className='w-32 min-w-32 bg-white text-start text-xs sm:w-[17%] md:bg-nca-background-soft md:text-sm'
                          >
                            {formatCurrency(marketingCost)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    <TableRow className='flex'>
                      <TableCell className='sticky left-0 z-10 w-36 bg-nca-background-soft text-xs font-medium sm:w-[49%] md:text-sm'>
                        DATA SUBSCRIPTION
                      </TableCell>
                      {contactsPerChannel.map((contacts, i) => {
                        const subscriptionCost = calculateSubscriptionCost(
                          contacts,
                          channels[i]
                        );
                        return (
                          <TableCell
                            key={i}
                            className='w-32 min-w-32 bg-white text-start text-xs sm:w-[17%] md:bg-nca-background-soft md:text-sm'
                          >
                            {formatCurrency(subscriptionCost)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    <TableRow className='flex'>
                      <TableCell className='sticky left-0 z-10 w-36 bg-nca-background-soft text-xs font-medium sm:w-[49%] md:text-sm'>
                        TOTAL COST
                      </TableCell>
                      {contactsPerChannel.map((contacts, i) => {
                        const volume = calculateVolumePerCompany();
                        const costPerThousand = getCostPerThousand(channels[i]);
                        const marketingCost = calculateMarketingCost(
                          volume,
                          costPerThousand
                        );
                        const subscriptionCost = calculateSubscriptionCost(
                          contacts,
                          channels[i]
                        );
                        const totalCost = marketingCost + subscriptionCost;
                        return (
                          <TableCell
                            key={i}
                            className='w-32 min-w-32 bg-white text-start text-xs font-semibold sm:w-[17%] md:bg-nca-background-soft md:text-sm'
                          >
                            {formatCurrency(totalCost)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
                <Separator className='my-4 h-[3px] bg-[#c1c5cc]' />
                {/* Description Section for ROI Analysis */}
                <div className='mt-8 space-y-0.5 text-xs text-muted-foreground sm:pl-1'>
                  <p>
                    The ROI Analysis section provides a comprehensive overview
                    of the return on investment for each marketing channel. The
                    calculations are based on the following key metrics:
                  </p>
                  <ul className='list-disc space-y-0.5 pl-6'>
                    <li>
                      <strong>Revenue:</strong> The total income generated from
                      conversions, reflecting the effectiveness of marketing
                      efforts.
                    </li>
                    <li>
                      <strong>Cost:</strong> The total expenses incurred for
                      each channel, which includes both marketing and
                      subscription costs.
                    </li>
                    <li>
                      <strong>Profit:</strong> Calculated as Revenue minus Cost,
                      indicating the net gain from marketing activities.
                    </li>
                    <li>
                      <strong>ROI (Return on Investment):</strong> Calculated as
                      (Profit / Cost) * 100, representing the percentage return
                      on investment for each channel.
                    </li>
                  </ul>
                </div>

                {/* Description Section for Marketing Performance */}
                <div className='mt-4 space-y-0.5 text-xs text-muted-foreground sm:pl-1'>
                  <p>
                    The table above summarizes the marketing performance across
                    various channels. Each metric is calculated using the
                    following formulas:
                  </p>
                  <ul className='list-disc space-y-0.5 pl-6'>
                    <li>
                      <strong>Reach:</strong> Calculated as (Number of Contacts
                      * Open Rate) / 100, representing the estimated audience
                      reached.
                    </li>
                    <li>
                      <strong>Qualified Leads:</strong> Determined as (Reach *
                      Qualified Leads Percentage) / 100, indicating the number
                      of leads that meet the qualification criteria.
                    </li>
                    <li>
                      <strong>Conversions:</strong> Calculated as (Qualified
                      Leads * Conversion Ratio) / 100, reflecting the number of
                      leads that convert into customers.
                    </li>
                    <li>
                      <strong>Estimated Revenue:</strong> Calculated as
                      (Conversions * Ticket Size), providing an estimate of the
                      revenue generated from conversions.
                    </li>
                  </ul>
                </div>

                {/* Description Section for Cost Calculation */}
                <div className='mt-4 space-y-0.5 text-xs text-muted-foreground sm:pl-1'>
                  <p>
                    The cost calculation table provides a detailed breakdown of
                    the expenses associated with each marketing channel. The
                    calculations are based on the following metrics:
                  </p>
                  <ul className='list-disc space-y-0.5 pl-6'>
                    <li>
                      <strong>Volume:</strong> The total number of directors,
                      calculated as (Number of Companies * 3), representing the
                      average number of directors per company.
                    </li>
                    <li>
                      <strong>Cost Per Thousand:</strong> The cost incurred for
                      sending messages or emails, expressed per thousand units.
                    </li>
                    <li>
                      <strong>Marketing Cost:</strong> Calculated as (Volume *
                      Cost Per Thousand) / 1000, indicating the total marketing
                      expenditure.
                    </li>
                    <li>
                      <strong>Subscription Cost:</strong> The cost associated
                      with the subscription model for each channel, reflecting
                      ongoing expenses.
                    </li>
                    <li>
                      <strong>Total Cost:</strong> The aggregate of Marketing
                      Cost and Subscription Cost for each channel, providing a
                      comprehensive view of total expenditures.
                    </li>
                  </ul>
                </div>
                <LegalEagle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
