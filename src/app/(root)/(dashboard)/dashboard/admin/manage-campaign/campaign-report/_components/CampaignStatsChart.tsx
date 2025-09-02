'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { format, startOfYear, subYears } from 'date-fns';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getCustomChartData } from '../_services/services';
// Dynamically import the chart component
const CampaignBarChart = dynamic(() => import('./CampaignBarChart'), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 items-center justify-center rounded border'>
      <p className='text-gray-500'>Loading chart component...</p>
    </div>
  ),
});

const CampaignStatsChart = () => {
  // Get the current year and month using date-fns
  const currentDate = new Date();
  const currentYear = format(currentDate, 'yyyy'); // Get current year
  const currentMonth = format(currentDate, 'MMM'); // Get current month abbreviation (e.g., Jan, Feb, etc.)

  const [filters, setFilters] = useState({
    year: currentYear,
    month: currentMonth,
    xAxis: 'scheduleDate' as 'incDate' | 'scheduleDate',
    yAxis: 'director' as 'company' | 'director',
  });

  const [queryEnabled, setQueryEnabled] = useState(false);

  const {
    data: chartData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: [
      'customChartData',
      filters.year,
      filters.month,
      filters.xAxis,
      filters.yAxis,
    ],
    queryFn: () =>
      getCustomChartData({
        year: filters.year === 'ALL' ? '' : filters.year,
        month: filters.month === 'ALL' ? '' : filters.month,
        xAxis: filters.xAxis,
        yAxis: filters.yAxis,
      }),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: queryEnabled,
  });

  // Reset query enabled after successful load
  useEffect(() => {
    if (isSuccess) {
      setQueryEnabled(false);
    }
  }, [isSuccess]);

  // Auto-generate report on initial load
  useEffect(() => {
    setQueryEnabled(true);
  }, []);

  const years = [
    'ALL',
    ...Array.from({ length: 5 }, (_, i) =>
      format(subYears(startOfYear(new Date()), i), 'yyyy')
    ),
  ];

  const months = [
    'ALL',
    ...Array.from({ length: 12 }, (_, i) => format(new Date(2020, i), 'MMM')),
  ];

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      if (key === 'year') {
        return {
          ...prev,
          year: value,
          month: value === 'ALL' ? 'ALL' : prev.month,
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const generateReport = () => {
    setQueryEnabled(true);
  };

  const getChartTitle = () => {
    const xAxisLabel =
      filters.xAxis === 'incDate' ? 'Incorporation Date' : 'Schedule Date';
    const yAxisLabel = filters.yAxis === 'company' ? 'Companies' : 'Directors';
    const timeframe =
      filters.month !== 'ALL'
        ? `${filters.month} ${filters.year}`
        : filters.year !== 'ALL'
          ? filters.year
          : 'All Time';

    return `${yAxisLabel} by ${xAxisLabel} (${timeframe})`;
  };

  const getXAxisLabel = () => {
    const prefix = filters.xAxis === 'incDate' ? 'Incorporation' : 'Schedule';

    if (filters.month !== 'ALL') return `${prefix} Date`;
    if (filters.year !== 'ALL') return `${prefix} Month`;
    return `${prefix} Year`;
  };

  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold lg:text-2xl'>
        Campaign Report
      </h2>
      <Card className='w-full'>
        <div className='grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-5'>
          <div className=''>
            <label className='mb-1 block text-sm font-medium'>Year</label>
            <Select
              value={filters.year}
              onValueChange={(value) => handleFilterChange('year', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Year' />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year === 'ALL' ? 'All Years' : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className=''>
            <label className='mb-1 block text-sm font-medium'>Month</label>
            <Select
              value={filters.month}
              onValueChange={(value) => handleFilterChange('month', value)}
              disabled={filters.year === 'ALL'}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Month' />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month === 'ALL' ? 'All Months' : month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className=''>
            <label className='mb-1 block text-sm font-medium'>X-Axis</label>
            <Select
              value={filters.xAxis}
              onValueChange={(value) =>
                handleFilterChange('xAxis', value as 'incDate' | 'scheduleDate')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='incDate'>Incorporation Date</SelectItem>
                <SelectItem value='scheduleDate'>Schedule Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className=''>
            <label className='mb-1 block text-sm font-medium'>Y-Axis</label>
            <Select
              value={filters.yAxis}
              onValueChange={(value) =>
                handleFilterChange('yAxis', value as 'company' | 'director')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='company'>Companies</SelectItem>
                <SelectItem value='director'>Directors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateReport}
            disabled={isLoading}
            className='col-span-2 h-9 sm:translate-y-6 lg:col-span-1'
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>

        {isError && (
          <div className='mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-600'>
            Failed to load chart data. Please try again.
          </div>
        )}

        {chartData && chartData.length > 0 ? (
          <div className='w-full'>
            <CampaignBarChart
              data={chartData}
              title={getChartTitle()}
              xAxisLabel={getXAxisLabel()}
              yAxisLabel={
                filters.yAxis === 'company'
                  ? 'Number of Companies'
                  : 'Number of Directors'
              }
              valueLabel={
                filters.yAxis === 'company' ? 'Companies' : 'Directors'
              }
            />
          </div>
        ) : chartData && chartData.length === 0 ? (
          <div className='flex h-96 items-center justify-center rounded border'>
            <p className='text-gray-500'>
              For selected parameters no campaign data available try different
              parameters
            </p>
          </div>
        ) : (
          <div className='flex h-96 items-center justify-center rounded border'>
            <p className='text-gray-500'>
              {isLoading
                ? 'Loading data...'
                : 'Select parameters and click "Generate Report" to view statistics'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CampaignStatsChart;
