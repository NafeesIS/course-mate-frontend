import { Card, CardContent } from '@/components/ui/card';
import type React from 'react';

const DatabaseOverview = ({
  stats,
}: {
  stats: {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }[];
}) => {
  return (
    <div className='wrapper'>
      <Card className='overflow-hidden border'>
        <CardContent className='flex flex-col items-center justify-between p-4 sm:p-6 md:flex-row'>
          <div className='flex items-center space-x-4'>
            <h2 className='text-sm font-semibold sm:text-base'>
              New Companies (Feb 2025)
            </h2>
          </div>
          <div className='mt-4 flex flex-wrap items-center gap-4 md:gap-16'>
            {stats.map((stat) => (
              <div key={stat.title} className='flex items-center space-x-2'>
                <div className={`rounded-full ${stat.bgColor} p-2`}>
                  {stat.icon}
                </div>
                <div>
                  <div className='text-sm font-semibold'>{stat.value}</div>
                  <p className='text-xs text-gray-500'>{stat.title}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseOverview;
