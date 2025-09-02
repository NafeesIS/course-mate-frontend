'use client';

import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

const chartConfig = {
  pending: {
    label: 'pending',
    color: '#f59e0b',
  },
  sent: {
    label: 'sent',
    color: '#22c55e',
  },
} satisfies ChartConfig;

interface CampaignBarOverviewChartProps {
  chartData: any[];
}

const CampaignBarOverviewChart: React.FC<CampaignBarOverviewChartProps> = ({
  chartData,
}) => {
  // Check if chartData is empty
  if (chartData.length === 0) {
    return (
      <Card className='h-96 lg:col-span-4'>
        <div className='flex h-full items-center justify-center'>
          <p className='text-lg text-gray-500'>
            No campaigns available for the selected period.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='lg:col-span-4'>
      <ChartContainer config={chartConfig} className='max-h-96 min-h-72 w-full'>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 2, bottom: 5 }}
        >
          <XAxis dataKey='period' className='text-xs sm:text-sm' />
          <YAxis className='text-xs sm:text-sm' />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey='pending'
            fill='#f59e0b'
            name='Pending'
            stackId='a'
            barSize={40}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='sent'
            fill='#22c55e'
            name='Sent'
            stackId='a'
            barSize={40}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
};

export default CampaignBarOverviewChart;
