import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eye, FileText, Home } from 'lucide-react';

// Quick Stats Component
const QuickStats = ({ meta }: { meta: any }) => {
  const publishedDocs = meta?.total;

  const isAtLimit = meta?.homepageTotal >= 3;

  return (
    <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
      <Card className='p-4'>
        <div className='flex items-center gap-2'>
          <FileText className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm font-medium'>Total Docs</span>
        </div>
        <p className='mt-1 text-2xl font-bold'>{meta?.total}</p>
      </Card>
      <Card
        className={cn('p-4', isAtLimit && 'border-orange-200 bg-orange-50')}
      >
        <div className='flex items-center gap-2'>
          <Home
            className={cn(
              'h-4 w-4',
              isAtLimit ? 'text-orange-600' : 'text-green-600'
            )}
          />
          <span className='text-sm font-medium'>On Homepage</span>
        </div>
        <div className='mt-1 flex items-baseline gap-2'>
          <p
            className={cn(
              'text-2xl font-bold',
              isAtLimit ? 'text-orange-600' : 'text-green-600'
            )}
          >
            {meta?.homepageTotal}
          </p>
          <span className='text-sm text-muted-foreground'>/ 3 max</span>
        </div>
        {isAtLimit && (
          <p className='mt-1 text-xs text-orange-600'>Limit reached</p>
        )}
      </Card>
      <Card className='p-4'>
        <div className='flex items-center gap-2'>
          <Eye className='h-4 w-4 text-blue-600' />
          <span className='text-sm font-medium'>Published</span>
        </div>
        <p className='mt-1 text-2xl font-bold text-blue-600'>{publishedDocs}</p>
      </Card>
    </div>
  );
};

export default QuickStats;
