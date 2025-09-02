'use client';

import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import { memo, useMemo } from 'react';
import { Area, AreaChart } from 'recharts';

interface SmallTrendChartProps {
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  xAxisKey: string;
}

// Using memo to prevent unnecessary re-renders when props don't change
export const SmallTrendChart = memo(function SmallTrendChart({
  data,
  dataKey,
  // xAxisKey,
}: SmallTrendChartProps) {
  // Memoize the chart config to prevent recreation on each render
  const chartConfig = useMemo(
    () => ({
      [dataKey]: {
        label: dataKey,
        color: 'hsl(var(--chart-1))',
      },
    }),
    [dataKey]
  ) satisfies ChartConfig;

  // Memoize the data to prevent unnecessary recalculations
  const optimizedData = useMemo(() => {
    // If we have too many data points, we can sample them
    if (data.length > 10) {
      const step = Math.floor(data.length / 10);
      return data.filter(
        (_, index) => index % step === 0 || index === data.length - 1
      );
    }
    return data;
  }, [data]);

  // Custom tooltip component memoized outside the render cycle
  // const CustomTooltip = useMemo(() => {
  //   const TooltipComponent = ({ active, payload }: any) => {
  //     if (active && payload && payload.length) {
  //       return (
  //         <div className='rounded-lg bg-background p-2 shadow-md ring-1 ring-border'>
  //           <p className='text-xs font-semibold text-foreground'>
  //             FY {payload[0].payload[xAxisKey]}
  //           </p>
  //           <p className='text-xs text-muted-foreground'>₹{payload[0].value}</p>
  //         </div>
  //       );
  //     }
  //     return null;
  //   };
  //   TooltipComponent.displayName = 'CustomTooltip';
  //   return TooltipComponent;
  // }, [xAxisKey]);

  // If no data or invalid data, return empty container to maintain layout
  if (!data || data.length === 0) {
    return <div className='h-6 w-20' />;
  }

  return (
    <ChartContainer config={chartConfig} className='h-6 w-20'>
      <AreaChart data={optimizedData}>
        {/* <Tooltip content={CustomTooltip} /> */}
        <Area
          type='monotone'
          dataKey={dataKey}
          stroke='hsl(var(--primary))'
          strokeWidth={1}
          // Reduce the number of dots rendered
          dot={false}
          activeDot={{
            r: 2,
            fill: 'hsl(var(--primary))',
            stroke: 'hsl(var(--background))',
            strokeWidth: 1,
          }}
          fill='#bacdf7'
          // Add isAnimationActive={false} to disable animations for better performance
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
});
