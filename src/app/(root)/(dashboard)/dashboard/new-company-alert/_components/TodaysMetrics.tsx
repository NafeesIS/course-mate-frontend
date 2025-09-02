import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { DatabaseZap } from 'lucide-react';
import { memo, useMemo } from 'react';
import { INcaEmailHistoryItem } from '../_hooks/useNcaEmailHistory';
import { CompanyIcon, LLPIcon } from './TodaysMetrics/Icons';
import InfoTooltip from './TodaysMetrics/InfoTooltip';
import MetricCard from './TodaysMetrics/MetricCard';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from './TodaysMetrics/StateComponents';
import { useMetricsData } from './TodaysMetrics/hooks/useMetricsData';

interface TodaysMetricsProps {
  filesData?: INcaEmailHistoryItem[];
  isLoading?: boolean;
  error?: any;
  todayISO?: string;
  hasActiveSubscriptions?: boolean;
}

function TodaysMetrics({
  filesData,
  isLoading,
  error,
  todayISO,
  hasActiveSubscriptions,
}: TodaysMetricsProps) {
  // Use custom hook for data processing
  const { data, latestEmailDates } = useMetricsData(filesData);

  // Memoize the formatted today date
  const formattedTodayDate = useMemo(() => {
    if (!todayISO) return null;
    return format(new Date(todayISO), 'EEEE, dd MMMM yyyy');
  }, [todayISO]);

  // Memoize the process date
  const processDate = useMemo(() => {
    return filesData?.[0]?.processDate;
  }, [filesData]);

  // Memoize the metrics arrays to prevent object recreation
  const companiesMetrics = useMemo(
    () => [
      { label: 'Total Companies', value: data.companies },
      { label: 'Directors', value: data.directors },
    ],
    [data.companies, data.directors]
  );

  const llpsMetrics = useMemo(
    () => [
      { label: 'Total LLPs', value: data.llps },
      { label: 'Partners', value: data.partners },
    ],
    [data.llps, data.partners]
  );

  // Memoize the header content
  const headerContent = useMemo(
    () => (
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex size-7 items-center justify-center rounded-lg bg-blue-100'>
            <DatabaseZap className='size-4 text-blue-600' />
          </div>
          <CardTitle className='text-sm font-semibold'>
            Data You Received Today{' '}
            {formattedTodayDate && (
              <span className='block text-xs text-muted-foreground sm:inline-block'>
                ({formattedTodayDate})
              </span>
            )}
          </CardTitle>
        </div>
        <InfoTooltip latestEmailDates={latestEmailDates} />
      </div>
    ),
    [formattedTodayDate, latestEmailDates]
  );

  // Memoize the metrics content
  const metricsContent = useMemo(
    () => (
      <div className='grid gap-2 sm:grid-cols-2 sm:gap-4'>
        <MetricCard
          icon={<CompanyIcon />}
          title='Companies'
          processDate={processDate}
          metrics={companiesMetrics}
          waiting={data.waitingForCompanies}
        />
        <MetricCard
          icon={<LLPIcon />}
          title='LLPs'
          processDate={processDate}
          metrics={llpsMetrics}
          waiting={data.waitingForLLPs}
        />
      </div>
    ),
    [
      processDate,
      companiesMetrics,
      llpsMetrics,
      data.waitingForCompanies,
      data.waitingForLLPs,
    ]
  );

  return (
    <Card className='rounded-lg border shadow-none'>
      <CardHeader className='p-2 pt-4 sm:p-4'>{headerContent}</CardHeader>
      <CardContent className='p-2 sm:p-4 sm:pt-2'>
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : filesData && filesData.length === 0 ? (
          <EmptyState hasActiveSubscriptions={hasActiveSubscriptions} />
        ) : (
          metricsContent
        )}
      </CardContent>
    </Card>
  );
}

// Export as memoized component to prevent unnecessary re-renders
export default memo(TodaysMetrics);
