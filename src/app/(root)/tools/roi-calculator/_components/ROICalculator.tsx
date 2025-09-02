'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpIcon,
  Building2,
  Calculator,
  Mail,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import DatabaseOverview from './DatabaseOverview';
import NewCompanyAlertCTA from './NewCompanyAlertCTA';
import ScenarioSelector from './ScenarioSelector';

const stats = [
  {
    title: 'Companies',
    value: '17,679',
    icon: <Building2 className='h-6 w-6 text-blue-500 sm:h-8 sm:w-8' />,
    color: 'border-t-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'LLPs',
    value: '5,400',
    icon: <Building2 className='h-6 w-6 text-amber-500 sm:h-8 sm:w-8' />,
    color: 'border-t-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Directors / Designated Partners',
    value: '54,086',
    icon: <Users className='h-6 w-6 text-green-500 sm:h-8 sm:w-8' />,
    color: 'border-t-green-500',
    bgColor: 'bg-green-50',
  },
];

const LegalEagle = () => (
  <div className='wrapper mt-8'>
    {/* <Card className='border-t-4 border-t-yellow-500'>
      <CardHeader className='flex flex-row items-center space-y-0 bg-yellow-50'>
        <AlertTriangle className='mr-2 h-5 w-5 text-yellow-500' />
        <CardTitle className='text-base font-semibold text-yellow-700'>
          The &ldquo;We&apos;re Not Fortune Tellers&ldquo; Disclaimer
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 text-sm text-gray-600'>
        <p>
          This message, including any hypothetical scenarios described, is
          provided for informational and illustrative purposes only and does not
          constitute professional advice. These scenarios are hypothetical and
          are not indicative of any specific outcome or past performance.
          Results will vary based on individual efforts and external factors. We
          make no promises or guarantees regarding your success or income level.
        </p>
        <p className='mt-2'>
          Please note that individual successes are influenced by personal
          abilities, market conditions, and other external factors. We assume no
          responsibility for decisions made or actions taken based on the
          content of this message. Always consult with qualified professionals
          before making significant business decisions.
        </p>
      </CardContent>
    </Card> */}
    <Card className='border-t-4 border-t-yellow-500'>
      <CardHeader className='flex flex-row items-center space-y-0 bg-yellow-50'>
        <Calculator className='mr-2 h-5 w-5 text-yellow-500' />
        <CardTitle className='text-base font-semibold text-yellow-700'>
          ROI Calculator Disclaimer: Numbers Don&apos;t Lie, But They Do
          Daydream
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 text-sm text-gray-600'>
        <p>
          This ROI Calculator is designed to provide estimates based on the
          information you input and some assumptions we&apos;ve made. While
          we&apos;ve done our best to make it accurate, please remember:
        </p>
        <ul className='mt-2 list-disc space-y-1 pl-5'>
          <li>
            The future is unpredictable. Market conditions, competition, and
            other factors can impact actual results.
          </li>
          <li>
            This tool uses hypothetical scenarios that may not reflect
            real-world complexity.
          </li>
          <li>
            Your actual ROI may vary significantly from these projections.
          </li>
          <li>
            This calculator is for informational purposes only and should not be
            considered as financial advice.
          </li>
        </ul>
        <p className='mt-2'>
          We recommend using this as a starting point for discussions with
          qualified professionals before making any significant business
          decisions. Remember, in business, as in life, your mileage may vary!
        </p>
      </CardContent>
    </Card>
  </div>
);

export default function ROICalculator() {
  const [ticketSize, setTicketSize] = useState(25000);
  const [marginPercentage, setMarginPercentage] = useState(80);
  const [conversionRatio, setConversionRatio] = useState(5);
  const [qualifiedLeads, setQualifiedLeads] = useState(5);

  const [companyCount] = useState(23079);
  const [directorCount] = useState(54086);

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
    <Mail key='email' className='h-5 w-5 text-green-500' />,
    <MessageSquare key='sms' className='h-5 w-5 text-blue-500' />,
    <FaWhatsapp key='whatsapp' className='h-5 w-5 text-emerald-500' />,
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

  // const getTotalProfit = () => {
  //   return channels.reduce((total, channel, index) => {
  //     const openRate = [50, 50, 95][index];
  //     const reach = calculateReach(contactsPerChannel[index], openRate);
  //     const qualifiedLeadsCount = Math.round(reach * (qualifiedLeads / 100));
  //     const conversions = calculateConversions(
  //       reach,
  //       qualifiedLeadsCount,
  //       conversionRatio
  //     );
  //     const contributionMargin = calculateContributionMargin(
  //       ticketSize,
  //       marginPercentage
  //     );
  //     const revenue = calculateRevenue(conversions, contributionMargin);
  //     const profit = revenue - totalCosts[index];
  //     return total + profit;
  //   }, 0);
  // };

  // const getProfitSuggestion = () => {
  //   const totalProfit = getTotalProfit();
  //   const profitMargin = (totalProfit / (ticketSize * companyCount)) * 100;

  //   if (profitMargin > 20) {
  //     return '🚀  Excellent ROI! Consider scaling your operations.';
  //   } else if (profitMargin > 10) {
  //     return '😄  Good profit! Optimize to boost your returns.';
  //   } else if (profitMargin > 0) {
  //     return "🙂  You're profitable. Focus on increasing efficiency.";
  //   } else if (profitMargin > -10) {
  //     return '😕  Slight loss. Analyze costs and improve conversions.';
  //   } else {
  //     return '😰  Significant loss. Revise pricing and reduce costs.';
  //   }
  // };

  return (
    <div className='space-y-6 pb-20 sm:space-y-8 sm:pb-28'>
      <div className='bg-muted pb-6 pt-20 sm:pt-24'>
        <div className='px-4 text-center sm:px-6 lg:px-8'>
          <h1 className='text-gradient text-base font-bold tracking-tight sm:text-lg md:text-xl lg:text-3xl'>
            <span className='mr-1 text-primary'>New Company Alert</span> ROI
            Calculator
          </h1>
          <p className='mx-auto mt-1 max-w-2xl text-xs text-muted-foreground sm:mt-2 sm:text-sm'>
            Want to see how you can maximize your profit with our New Company
            Alert subscription? Use this calculator to estimate your potential
            returns.
          </p>
        </div>
      </div>

      <DatabaseOverview stats={stats} />

      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Card className='border-t-4 border-t-blue-500'>
          <CardContent className='p-4 md:p-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='py-4 md:py-6'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <h3 className='text-xs font-semibold sm:text-sm'>
                      Enter your ticket size
                    </h3>
                    <input
                      type='number'
                      value={ticketSize}
                      onChange={(e) => setTicketSize(Number(e.target.value))}
                      className='mt-1 w-full rounded-md border border-gray-300 p-2'
                      placeholder='Enter ticket size'
                    />
                  </div>
                  <div>
                    <h3 className='text-xs font-semibold sm:text-sm'>
                      Enter your margin percentage
                    </h3>
                    <input
                      type='number'
                      value={marginPercentage}
                      onChange={(e) =>
                        setMarginPercentage(Number(e.target.value))
                      }
                      className='mt-1 w-full rounded-md border border-gray-300 p-2'
                      placeholder='Enter margin percentage'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <h3 className='mb-2 text-xs font-semibold sm:text-sm'>
                    Select case scenario
                  </h3>
                  <ScenarioSelector
                    onScenarioChange={handleScenarioChange}
                    ticketSize={ticketSize}
                  />
                </div>
              </div>

              <div className='space-y-4 rounded-lg bg-gray-50 p-4 md:p-6'>
                {/* <h3 className='text-xs font-semibold text-gray-800 md:text-sm'>
                  Selected Parameters
                </h3> */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>
                      Net Revenue Per Sale
                    </p>
                    <p className='mt-1 text-xl font-semibold'>
                      {formatCurrency((ticketSize * marginPercentage) / 100)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Margin Percentage</p>
                    <p className='mt-1 text-xl font-semibold'>
                      {marginPercentage}%
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Conversion Ratio</p>
                    <p className='mt-1 text-xl font-semibold'>
                      {conversionRatio}%
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Qualified Leads</p>
                    <p className='mt-1 text-xl font-semibold'>
                      {qualifiedLeads}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='mt-6 rounded-lg bg-blue-50 p-4 text-blue-700'> */}
            {/* <h4 className='mb-2 text-lg font-semibold'>Profit Analysis</h4> */}
            {/* {getProfitSuggestion()} */}
            {/* </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Investments and Returns */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-3 text-base font-bold sm:mb-4 sm:text-lg'>
          ROI Analysis
        </h2>
        <Card className='relative overflow-hidden border-t-4 border-t-gray-200'>
          {/* <CardHeader className='bg-primary/5 px-4 py-3 sm:px-6 sm:py-4'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
              <ArrowUpIcon className='h-4 w-4 text-primary sm:h-5 sm:w-5' />
              Multi-Channel Marketing Performance
            </CardTitle>
          </CardHeader> */}
          <CardContent className='p-4 sm:p-6'>
            {/* Summary Cards */}
            <div className='grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3'>
              {channels.map((channel, index) => {
                const openRate = [20, 50, 95][index];
                const convRate = conversionRatio;

                const reach = calculateReach(
                  contactsPerChannel[index],
                  openRate
                );
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
                const revenue = calculateRevenue(
                  conversions,
                  contributionMargin
                );

                // Use totalCosts[index] for profit calculation
                const profit = revenue - totalCosts[index];
                const roi = (profit / totalCosts[index]) * 100; // Calculate ROI based on total cost

                const roiColor =
                  roi > 200
                    ? 'text-blue-600'
                    : roi > 100
                      ? 'text-amber-600'
                      : 'text-red-600';

                return (
                  <Card
                    key={channel}
                    className={`border-t-4 ${index === 0 ? 'border-t-blue-500' : index === 1 ? 'border-t-green-500' : index === 2 ? 'border-t-emerald-500' : 'border-t-purple-500'}`}
                  >
                    <CardContent className='p-4 sm:pt-6'>
                      <div className='mb-3 flex items-center justify-between sm:mb-4'>
                        <div className='flex items-center gap-1 sm:gap-2'>
                          {channelIcons[index]}
                          <p className='text-base font-medium sm:text-lg'>
                            {channel}
                          </p>
                        </div>
                        <ArrowUpIcon
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${roi > 0 ? 'text-green-500' : 'text-red-500'}`}
                        />
                      </div>
                      <div className='space-y-2 text-xs sm:text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Revenue</span>
                          <span className='font-medium text-gray-800'>
                            {formatCurrency(revenue)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Cost</span>
                          <span className='font-medium text-red-700'>
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
                        className={`mt-3 flex items-center justify-between rounded-full border bg-sky-50 px-3 py-1 text-xs font-bold sm:mt-4 sm:px-4 sm:py-2 sm:text-sm ${roiColor}`}
                      >
                        <span>ROI:</span>
                        <span className='font-bold'>
                          {formatPercentage(roi)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <NewCompanyAlertCTA />

      {/* Revenue Calculation */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Card className='border-t-4 border-t-gray-200'>
          <CardHeader className='bg-primary/5 px-4 pb-0 pt-4 sm:px-6 sm:pt-6'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
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
                className='lucide lucide-chart-no-axes-combined text-primary'
              >
                <path d='M12 16v5' />
                <path d='M16 14v7' />
                <path d='M20 10v11' />
                <path d='m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15' />
                <path d='M4 18v3' />
                <path d='M8 14v7' />
              </svg>
              Revenue Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className='overflow-auto px-0 py-0 sm:px-6 sm:py-6'>
            <div className='min-w-[640px]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[120px] sm:w-auto'>
                      Metrics
                    </TableHead>
                    {channels.map((channel, index) => (
                      <TableHead key={channel} className='text-center'>
                        <div className='flex items-center justify-center gap-1 sm:gap-2'>
                          {channelIcons[index]}
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
                        const reach = calculateReach(contacts, [20, 50, 95][i]);
                        return reach.toLocaleString();
                      }),
                      rawValues: contactsPerChannel.map((contacts, i) => {
                        const reach = calculateReach(contacts, [20, 50, 95][i]);
                        return reach;
                      }),
                    },
                    {
                      metric: `QUALIFIED LEADS (${qualifiedLeads}% of Reach)`,
                      values: contactsPerChannel.map((contacts, i) => {
                        const reach = calculateReach(contacts, [20, 50, 95][i]);
                        return Math.round(
                          reach * (qualifiedLeads / 100)
                        ).toLocaleString();
                      }),
                      rawValues: contactsPerChannel.map((contacts, i) => {
                        const reach = calculateReach(contacts, [20, 50, 95][i]);
                        return Math.round(reach * (qualifiedLeads / 100));
                      }),
                    },
                    {
                      metric: `NO OF CONVERSIONS (${conversionRatio}% of Qualified Leads)`,
                      values: contactsPerChannel.map((contacts, i) => {
                        const reach = calculateReach(contacts, [20, 50, 95][i]);
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
                        const reach = calculateReach(contacts, [20, 50, 95][i]);
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
                        const reach = calculateReach(contacts, [20, 50, 95][i]);
                        const conversions = Math.round(
                          calculateConversions(
                            reach,
                            Math.round(reach * (qualifiedLeads / 100)),
                            conversionRatio
                          )
                        );
                        const contributionMargin = calculateContributionMargin(
                          ticketSize,
                          marginPercentage
                        );
                        return formatCurrency(
                          calculateRevenue(conversions, contributionMargin)
                        );
                      }),
                      rawValues: contactsPerChannel.map((contacts, i) => {
                        const reach = calculateReach(contacts, [20, 50, 95][i]);
                        const conversions = Math.round(
                          calculateConversions(
                            reach,
                            Math.round(reach * (qualifiedLeads / 100)),
                            conversionRatio
                          )
                        );
                        const contributionMargin = calculateContributionMargin(
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
                    <TableRow key={row.metric}>
                      <TableCell className={`text-xs font-medium sm:text-sm`}>
                        {row.metric}
                      </TableCell>
                      {row.values.map((value, i) => (
                        <TableCell
                          key={i}
                          className={`text-center text-xs sm:text-sm`}
                        >
                          {value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className='mt-8 border-t-4 border-t-gray-200'>
          <CardHeader className='bg-primary/5 px-4 pb-0 pt-4 sm:px-6 sm:pt-6'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
              <Calculator className='h-4 w-4 text-primary sm:h-5 sm:w-5' />
              Cost Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className='overflow-auto px-0 py-0 sm:px-6 sm:py-6'>
            <div className='min-w-[640px]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[120px] sm:w-auto'>
                      Cost Metrics
                    </TableHead>
                    {channels.map((channel, index) => (
                      <TableHead key={channel} className='text-center'>
                        <div className='flex items-center justify-center gap-1 sm:gap-2'>
                          {channelIcons[index]}
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
                  <TableRow>
                    <TableCell className='text-xs font-medium sm:text-sm'>
                      SEND VOLUME (total directors)
                    </TableCell>
                    {Array(3)
                      .fill(directorCount)
                      .map((volume, i) => (
                        <TableCell
                          key={i}
                          className='text-center text-xs sm:text-sm'
                        >
                          {volume.toLocaleString()}
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className='text-xs font-medium sm:text-sm'>
                      COST PER 1K SENDS
                    </TableCell>
                    {channels.map((channel, i) => (
                      <TableCell
                        key={i}
                        className='text-center text-xs sm:text-sm'
                      >
                        ₹{getCostPerThousand(channel)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className='text-xs font-medium sm:text-sm'>
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
                          className='text-center text-xs sm:text-sm'
                        >
                          {formatCurrency(marketingCost)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className='text-xs font-medium sm:text-sm'>
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
                          className='text-center text-xs sm:text-sm'
                        >
                          {formatCurrency(subscriptionCost)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow className='bg-gray-50'>
                    <TableCell className='text-xs font-medium sm:text-sm'>
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
                          className='text-center text-xs font-semibold sm:text-sm'
                        >
                          {formatCurrency(totalCost)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Description Section for ROI Analysis */}
        <div className='mt-4 space-y-0.5 pl-6 text-xs text-muted-foreground'>
          <p>
            The ROI Analysis section provides a comprehensive overview of the
            return on investment for each marketing channel. The calculations
            are based on the following key metrics:
          </p>
          <ul className='list-disc space-y-0.5 pl-6'>
            <li>
              <strong>Revenue:</strong> The total income generated from
              conversions, reflecting the effectiveness of marketing efforts.
            </li>
            <li>
              <strong>Cost:</strong> The total expenses incurred for each
              channel, which includes both marketing and subscription costs.
            </li>
            <li>
              <strong>Profit:</strong> Calculated as Revenue minus Cost,
              indicating the net gain from marketing activities.
            </li>
            <li>
              <strong>ROI (Return on Investment):</strong> Calculated as (Profit
              / Cost) * 100, representing the percentage return on investment
              for each channel.
            </li>
          </ul>
        </div>

        {/* Description Section for Marketing Performance */}
        <div className='mt-4 space-y-0.5 pl-6 text-xs text-muted-foreground'>
          <p>
            The table above summarizes the marketing performance across various
            channels. Each metric is calculated using the following formulas:
          </p>
          <ul className='list-disc space-y-0.5 pl-6'>
            <li>
              <strong>Reach:</strong> Calculated as (Number of Contacts * Open
              Rate) / 100, representing the estimated audience reached.
            </li>
            <li>
              <strong>Qualified Leads:</strong> Determined as (Reach * Qualified
              Leads Percentage) / 100, indicating the number of leads that meet
              the qualification criteria.
            </li>
            <li>
              <strong>Conversions:</strong> Calculated as (Qualified Leads *
              Conversion Ratio) / 100, reflecting the number of leads that
              convert into customers.
            </li>
            <li>
              <strong>Estimated Revenue:</strong> Calculated as (Conversions *
              Ticket Size), providing an estimate of the revenue generated from
              conversions.
            </li>
          </ul>
        </div>

        {/* Description Section for Cost Calculation */}
        <div className='mt-4 space-y-0.5 pl-6 text-xs text-muted-foreground'>
          <p>
            The cost calculation table provides a detailed breakdown of the
            expenses associated with each marketing channel. The calculations
            are based on the following metrics:
          </p>
          <ul className='list-disc space-y-0.5 pl-6'>
            <li>
              <strong>Volume:</strong> The total number of directors, calculated
              as (Number of Companies * 3), representing the average number of
              directors per company.
            </li>
            <li>
              <strong>Cost Per Thousand:</strong> The cost incurred for sending
              messages or emails, expressed per thousand units.
            </li>
            <li>
              <strong>Marketing Cost:</strong> Calculated as (Volume * Cost Per
              Thousand) / 1000, indicating the total marketing expenditure.
            </li>
            <li>
              <strong>Subscription Cost:</strong> The cost associated with the
              subscription model for each channel, reflecting ongoing expenses.
            </li>
            <li>
              <strong>Total Cost:</strong> The aggregate of Marketing Cost and
              Subscription Cost for each channel, providing a comprehensive view
              of total expenditures.
            </li>
          </ul>
        </div>
      </div>

      {/* <NewCompanyAlertCTA /> */}

      <LegalEagle />
    </div>
  );
}
