'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BarChart, DollarSign, Eye, TrendingUp, Users } from 'lucide-react';
import {
  RiBarChartGroupedLine,
  RiCalendarEventLine,
  RiExchangeDollarLine,
  RiFileTextLine,
  RiGroupLine,
  RiLineChartLine,
  RiMoneyDollarCircleLine,
  RiPieChart2Line,
} from 'react-icons/ri';

const offerItems = [
  {
    title: 'Funding Rounds Overview',
    icon: <RiMoneyDollarCircleLine className='text-3xl text-primary' />,
    description:
      'Detailed breakdown of each funding round, including dates, amounts, and investors',
  },
  {
    title: 'Ownership Structure',
    icon: <RiPieChart2Line className='text-3xl text-primary' />,
    description:
      'Visualize how ownership percentages change across funding rounds',
  },
  {
    title: 'Valuation Trends',
    icon: <RiLineChartLine className='text-3xl text-primary' />,
    description:
      'Track company valuation growth from seed to latest funding round',
  },
  {
    title: 'Investor Profiles',
    icon: <RiGroupLine className='text-3xl text-primary' />,
    description:
      'Get insights into major investors, including their portfolio and investment history',
  },
  {
    title: 'Funding Timeline',
    icon: <RiCalendarEventLine className='text-3xl text-primary' />,
    description:
      'Chronological view of funding events and major company milestones',
  },
  {
    title: 'Dilution Analysis',
    icon: <RiBarChartGroupedLine className='text-3xl text-primary' />,
    description:
      'Understand how each funding round affects existing shareholders',
  },
  {
    title: 'Exit Scenarios',
    icon: <RiExchangeDollarLine className='text-3xl text-primary' />,
    description:
      'Projected returns for different exit valuations and timelines',
  },
  {
    title: 'Term Sheet Summaries',
    icon: <RiFileTextLine className='text-3xl text-primary' />,
    description: 'Key terms and conditions from each funding round',
  },
];

const FundingDetails = () => {
  return (
    <div className='wrapper'>
      <div className='mt-10'>
        <h2 className='text-lg font-semibold text-gray-800'>What We Offer</h2>
        <div className='mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
          {offerItems.map((item, index) => (
            <Card
              key={index}
              className='rounded-md border-t-4 border-primary bg-white shadow-sm transition-all hover:shadow-md'
            >
              <CardContent className='flex flex-col p-6'>
                <div className='rounded-md bg-primary/10 text-3xl'>
                  {item.icon}
                </div>
                <h3 className='mt-3 text-sm font-semibold text-gray-900'>
                  {item.title}
                </h3>
                <p className='mt-2 text-xs text-gray-600'>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className='mt-10 flex flex-col justify-between gap-4 bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:flex-row md:p-6'>
        <div className='flex-col-center text-center'>
          <h2 className='text-2xl font-bold text-gray-800'>
            Why Our Funding Insights Matter
          </h2>
          <p className='mt-4 text-balance text-sm text-gray-700 md:text-base'>
            Understanding a company&apos;s funding history and capital structure
            is crucial for investors, analysts, and business leaders. Our
            comprehensive data and analysis provide you with:
          </p>
          <ul className='ml-2 mt-6 list-disc space-y-2 text-balance text-left text-xs text-gray-700 md:ml-4 md:text-sm'>
            <li className='flex items-center space-x-2'>
              <Eye className='h-4 w-4 flex-shrink-0 text-gray-600' />
              <span>
                Clear visibility into the company&apos;s growth trajectory and
                investor confidence
              </span>
            </li>
            <li className='flex items-center space-x-2'>
              <TrendingUp className='h-4 w-4 flex-shrink-0 text-gray-600' />
              <span>
                Insights into potential future funding needs and expansion plans
              </span>
            </li>
            <li className='flex items-center space-x-2'>
              <Users className='h-4 w-4 flex-shrink-0 text-gray-600' />
              <span>
                Understanding of the balance of power among shareholders
              </span>
            </li>
            <li className='flex items-center space-x-2'>
              <BarChart className='h-4 w-4 flex-shrink-0 text-gray-600' />
              <span>
                Ability to benchmark against industry peers and identify market
                trends
              </span>
            </li>
            <li className='flex items-center space-x-2'>
              <DollarSign className='h-4 w-4 flex-shrink-0 text-gray-600' />
              <span>
                Valuable context for valuation assessments and investment
                decisions
              </span>
            </li>
          </ul>
        </div>

        {/* <div className='grid flex-shrink-0 grid-cols-2 gap-6 md:w-1/3'>
          {[
            { Icon: HandCoins, color: 'text-blue-500', bgColor: 'bg-blue-100' },
            {
              Icon: BadgePercent,
              color: 'text-green-500',
              bgColor: 'bg-green-100',
            },
            {
              Icon: CandlestickChart,
              color: 'text-purple-500',
              bgColor: 'bg-purple-100',
            },
            {
              Icon: Landmark,
              color: 'text-indigo-500',
              bgColor: 'bg-indigo-100',
            },
          ].map(({ Icon, color, bgColor }, index) => (
            <div
              key={index}
              className={`flex items-center justify-center whitespace-nowrap rounded-full ${bgColor} p-6 shadow-inner`}
            >
              <Icon className={`size-12 ${color}`} strokeWidth={1.5} />
            </div>
          ))}
        </div> */}
      </Card>
    </div>
  );
};

export default FundingDetails;
