import { AlertCircle, FileX, Loader2 } from 'lucide-react';
import { memo } from 'react';

// Memoized loading state component
export const LoadingState = memo(() => (
  <div className='flex h-20 items-center justify-center gap-2 rounded-lg bg-muted'>
    <Loader2 className='size-6 animate-spin' />
    <p className='animate-pulse text-sm'>Loading...</p>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Memoized error state component
export const ErrorState = memo(({ error }: { error: any }) => (
  <div className='flex h-20 items-center justify-center gap-2 rounded-lg bg-muted'>
    <AlertCircle className='size-6 text-destructive' />
    <p className='text-sm text-destructive'>
      {error?.message ?? 'Error loading files'}
    </p>
  </div>
));

ErrorState.displayName = 'ErrorState';

// Memoized empty state component
export const EmptyState = memo(
  ({ hasActiveSubscriptions }: { hasActiveSubscriptions?: boolean }) => (
    <div className='flex h-20 flex-col items-center justify-center gap-2 rounded-lg bg-muted text-center text-xs text-muted-foreground'>
      <FileX className='size-4' />
      {hasActiveSubscriptions ? (
        <span>
          You have an active subscription.
          <br />
          Your data will appear here as soon as it&apos;s available.
        </span>
      ) : (
        <span>No data available</span>
      )}
    </div>
  )
);

EmptyState.displayName = 'EmptyState';
