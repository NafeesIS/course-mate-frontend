import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { memo, useMemo } from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  processDate?: string;
  metrics: { label: string; value: number }[];
  waiting: boolean;
}

// Memoized MetricCard component to prevent re-renders
const MetricCard = memo(
  ({ icon, title, processDate, metrics, waiting }: MetricCardProps) => {
    // Memoize the formatted date to avoid recalculation
    const formattedDate = useMemo(() => {
      if (!processDate) return null;
      return format(new Date(processDate), 'dd MMMM yyyy');
    }, [processDate]);

    return (
      <Card className='rounded-lg border shadow-none'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-xs font-medium text-muted-foreground xs:text-sm'>
            <span>{icon}</span>
            <span>
              {title}
              {formattedDate && (
                <span className='ml-1 text-xs text-muted-foreground'>
                  registered on {formattedDate}
                </span>
              )}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='grid gap-4 xs:grid-cols-2'>
            {metrics.map((metric) => (
              <div className='space-y-1' key={metric.label}>
                <p className='text-xs text-muted-foreground'>{metric.label}</p>
                {waiting ? (
                  <div className='flex items-center gap-2'>
                    <Loader2 className='h-3 w-3 animate-spin' />
                    <Badge variant='outline' className='text-xs'>
                      Processing
                    </Badge>
                  </div>
                ) : (
                  <p className='text-2xl font-semibold'>
                    {metric.value.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
);

MetricCard.displayName = 'MetricCard';

export default MetricCard;
