'use client';

import { formatCurrencyINR } from '@/lib/formatters';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const ChargesChart = ({ chargeData }: { chargeData: any }) => {
  const { totalOpenCharges, totalSatisfiedCharges } = chargeData;

  const data = [
    { name: 'Open Charges', value: totalOpenCharges, color: '#38bdf8' },
    {
      name: 'Satisfied Charges',
      value: totalSatisfiedCharges,
      color: '#86efac',
    },
  ];

  return (
    <div className='flex h-60 flex-col items-center justify-center gap-4 pb-2 text-sm lg:h-44 lg:flex-row lg:gap-0 lg:pr-10'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            innerRadius={50}
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className='w-fit space-y-3 whitespace-nowrap'>
        {data.map((entry, index) => (
          <p
            key={index}
            className='flex items-center gap-2 text-xs font-semibold text-primary lg:text-sm'
          >
            <span
              className='h-4 w-4'
              style={{ background: entry.color }}
            ></span>{' '}
            {entry.name} - {formatCurrencyINR(entry.value)}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ChargesChart;
