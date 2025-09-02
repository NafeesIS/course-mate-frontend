'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getCampaignOverviewStats } from '../_services/services';

// Dynamically import the chart component
const CampaignBarOverviewChart = dynamic(
  () => import('./CampaignBarOverviewChart'),
  {
    ssr: false,
    loading: () => (
      <div className='flex h-96 items-center justify-center rounded border'>
        <p className='text-gray-500'>Loading chart component...</p>
      </div>
    ),
  }
);
const CampaignPieOverviewChart = dynamic(
  () => import('./CampaignPieOverviewChart'),
  {
    ssr: false,
    loading: () => (
      <div className='flex h-96 items-center justify-center rounded border'>
        <p className='text-gray-500'>Loading chart component...</p>
      </div>
    ),
  }
);

const ALL_YEAR_OPTION = 'All Year';
const ALL_MONTH_OPTION = 'All Month';

const currentYear = new Date().getFullYear().toString();
const currentMonth = new Date().toLocaleString('default', { month: 'short' });

const CampaignDashboardOverview: React.FC = () => {
  const [viewSelection, setViewSelection] = useState({
    year: currentYear,
    month: currentMonth,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', viewSelection.year, viewSelection.month],
    queryFn: () =>
      getCampaignOverviewStats({
        year: viewSelection.year,
        month: viewSelection.month,
      }),
    gcTime: 1000 * 60 * 10, // 10 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });

  const availableYears = useMemo(() => {
    const years = ['2024', '2025']; // Replace with dynamic logic if needed
    return [ALL_YEAR_OPTION, ...years];
  }, []);

  const availableMonths = useMemo(() => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return [ALL_MONTH_OPTION, ...months];
  }, []);

  const processedData = useMemo(() => {
    if (!data) return null;

    const campaignStatusData = [
      { name: 'Pending', value: data.pendingCampaignCount },
      { name: 'Sent', value: data.sentCampaignCount },
    ];

    return {
      totalDirectors: data.totalDirectors,
      activeFunnelDirectors: data.activeFunnelDirectors,
      pendingCampaignCount: data.pendingCampaignCount,
      sentCampaignCount: data.sentCampaignCount,
      campaignStatusData,
      chartData: data.chartData,
    };
  }, [data]);

  const handleYearChange = (year: string) => {
    setViewSelection({ year, month: ALL_MONTH_OPTION });
  };

  const handleMonthChange = (month: string) => {
    setViewSelection((prev) => ({ ...prev, month }));
  };

  const getChartTitle = () => {
    if (viewSelection.year === ALL_YEAR_OPTION)
      return 'Campaign Performance by Year';
    if (viewSelection.month === ALL_MONTH_OPTION)
      return `Campaign Performance in ${viewSelection.year}`;
    return `Campaign Performance in ${viewSelection.month} ${viewSelection.year}`;
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        <Card className='bg-primary text-white shadow-lg'>
          <CardContent className='p-4'>
            <h3 className='text-base font-semibold xl:text-lg'>
              Total Directors
            </h3>
            {isLoading ? (
              <RefreshCw className='h-4 w-4 animate-spin text-white' />
            ) : (
              <p className='text-2xl'>{processedData?.totalDirectors}</p>
            )}
          </CardContent>
        </Card>
        <Card className='bg-cyan-600 text-white shadow-lg'>
          <CardContent className='p-4'>
            <h3 className='text-base font-semibold xl:text-lg'>
              Active Funnel
            </h3>
            {isLoading ? (
              <RefreshCw className='h-4 w-4 animate-spin text-white' />
            ) : (
              <p className='text-2xl'>{processedData?.activeFunnelDirectors}</p>
            )}
          </CardContent>
        </Card>
        <Card className='bg-amber-500 text-white shadow-lg'>
          <CardContent className='p-4'>
            <h3 className='text-base font-semibold xl:text-lg'>
              Pending Campaigns
            </h3>
            {isLoading ? (
              <RefreshCw className='h-4 w-4 animate-spin text-white' />
            ) : (
              <p className='text-2xl'>{processedData?.pendingCampaignCount}</p>
            )}
          </CardContent>
        </Card>
        <Card className='bg-green-500 text-white shadow-lg'>
          <CardContent className='p-4'>
            <h3 className='text-base font-semibold xl:text-lg'>
              Sent Campaigns
            </h3>
            {isLoading ? (
              <RefreshCw className='h-4 w-4 animate-spin text-white' />
            ) : (
              <p className='text-2xl'>{processedData?.sentCampaignCount}</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div>{getChartTitle()}</div>
        <div className='flex items-center gap-2'>
          <Select value={viewSelection.year} onValueChange={handleYearChange}>
            <SelectTrigger className='w-28'>
              <SelectValue placeholder='Year' />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={viewSelection.month}
            onValueChange={handleMonthChange}
            disabled={viewSelection.year === ALL_YEAR_OPTION}
          >
            <SelectTrigger className='w-28'>
              <SelectValue placeholder='Month' />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-6'>
        {isLoading ? (
          <div className='col-span-6 flex items-center justify-center'>
            <LoadingWithSpinner />
          </div>
        ) : (
          <>
            <CampaignBarOverviewChart chartData={processedData?.chartData} />
            <CampaignPieOverviewChart
              campaignStatusData={processedData?.campaignStatusData}
              chartData={processedData?.chartData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignDashboardOverview;
