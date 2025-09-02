'use client';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

interface CampaignBarChartProps {
  data: Array<{ period: string; value: number }>;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  valueLabel: string;
}
const chartConfig = {
  period: {
    label: 'period',
    color: '#14b8a6',
  },
  value: {
    label: 'value',
    color: '#14b8a6',
  },
} satisfies ChartConfig;
const CampaignBarChart: React.FC<CampaignBarChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  valueLabel,
}) => {
  return (
    <>
      <h3 className='mb-2 text-center font-medium'>{title}</h3>
      <ChartContainer config={chartConfig} className='max-h-96 w-full'>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            className='text-xs sm:text-sm'
            dataKey='period'
            label={{
              value: xAxisLabel,
              position: 'insideBottom',
              offset: -5,
              dy: 20,
              style: { fontSize: 12 },
            }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />

          <YAxis
            className='text-xs sm:text-sm'
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              dx: -16, // Push the label left
              style: { fontSize: 12 },
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value} ${valueLabel}`, '']}
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: 'none',
            }}
          />
          <Bar
            dataKey='value'
            fill='#14b8a6'
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ChartContainer>
    </>
  );
};

export default CampaignBarChart;
