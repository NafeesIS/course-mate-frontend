'use client';

import { Card } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import React, { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';
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

interface CampaignPieOverviewChartProps {
  campaignStatusData?: { name: string; value: number }[];
  colors?: string[];
  chartData?: any[];
}

const CampaignPieOverviewChart: React.FC<CampaignPieOverviewChartProps> = ({
  campaignStatusData,
  colors = ['#f59e0b', '#22c55e'],
  chartData,
}) => {
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Function to determine screen size
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMediumScreen(width >= 1024 && width <= 1536); // Screen between 1024px and 1279px
      setIsSmallScreen(width < 420);
    };

    // Add event listener for resizing
    window.addEventListener('resize', handleResize);

    // Initial check on component mount
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (chartData?.length === 0) {
    return (
      <Card className='h-96 lg:col-span-2'>
        <div className='flex h-full items-center justify-center'>
          <p className='text-lg text-gray-500'>
            No campaigns available for the selected period.
          </p>
        </div>
      </Card>
    );
  }
  return (
    <Card className='xl:col-span-2'>
      <ChartContainer config={chartConfig} className='max-h-96 min-h-72 w-full'>
        <PieChart>
          <Pie
            data={campaignStatusData}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
            startAngle={isMediumScreen || isSmallScreen ? -270 : 0}
            className='text-xs sm:text-sm'
          >
            {campaignStatusData?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ChartContainer>
    </Card>
  );
};

export default CampaignPieOverviewChart;
