'use client';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, Tooltip } from 'recharts';

interface SmallTrendChartProps {
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  xAxisKey: string;
  width?: number;
  height?: number;
}

export function SmallTrendChart({
  data,
  dataKey,
  xAxisKey,
  // width = 140,
  // height = 40,
}: SmallTrendChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey,
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className='h-6 w-20'>
      {/* <ResponsiveContainer width={width} height={height}> */}
      <AreaChart data={data}>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className='rounded-lg bg-background p-2 shadow-md ring-1 ring-border'>
                  <p className='text-xs font-semibold text-foreground'>
                    FY {payload[0].payload[xAxisKey]}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    ₹{payload[0].value}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        {/* <CartesianGrid vertical={true} /> */}
        <Area
          type='monotone'
          dataKey={dataKey}
          stroke='hsl(var(--primary))'
          strokeWidth={1}
          dot={{
            r: 1.5,
            fill: 'hsl(var(--primary))',
            strokeWidth: 0,
          }}
          activeDot={{
            r: 2,
            fill: 'hsl(var(--primary))',
            stroke: 'hsl(var(--background))',
            strokeWidth: 1,
          }}
          fill='#bacdf7'
        />
      </AreaChart>
      {/* </ResponsiveContainer> */}
    </ChartContainer>
  );
}
