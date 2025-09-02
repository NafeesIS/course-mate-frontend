'use client';
import dynamic from 'next/dynamic';
const ChargesChart = dynamic(() => import('./ChargesChart'), {
  ssr: false,
});
const ChargesChartWrapper = ({ data }: any) => {
  return <ChargesChart data={data} />;
};

export default ChargesChartWrapper;
