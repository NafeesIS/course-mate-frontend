'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  BadgeCheck,
  Calendar,
  Clock,
  Globe,
  Loader2,
  MapPin,
  Route,
} from 'lucide-react';
import { ISubscriptionDetail } from '../_hooks/useSubscriptionDetails';

interface SubscriptionDetailsProps {
  subscriptions?: ISubscriptionDetail[];
  isLoading?: boolean;
  error?: any;
}

export default function SubscriptionDetails({
  subscriptions,
  isLoading,
  error,
}: SubscriptionDetailsProps) {
  const serviceName = {
    '66d04172f9a519da7ffe4ad3': 'Email and Phone',
    '66cf5d594541a8f007d984f1': 'Email Only',
  };

  // Sort subscriptions to show active plans at the top
  const sortedSubscriptions = subscriptions
    ? subscriptions.sort((a, b) => {
        // Active subscriptions come first
        if (
          a.status.toLowerCase() === 'active' &&
          b.status.toLowerCase() !== 'active'
        ) {
          return -1;
        }
        if (
          b.status.toLowerCase() === 'active' &&
          a.status.toLowerCase() !== 'active'
        ) {
          return 1;
        }

        // If both have same status priority, sort by end date (newest first)
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      })
    : [];

  const calculateRemainingTime = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} left`;
    }
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return `${years}y ${remainingMonths}m left`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className='rounded-lg border shadow-none'>
      <CardHeader className='p-2 pt-4 sm:p-4'>
        <div className='flex items-center gap-2'>
          <div className='flex size-7 items-center justify-center rounded-lg bg-green-100'>
            <Route className='size-4 text-green-600' />
          </div>
          <div>
            <CardTitle className='text-sm font-semibold'>
              {/* Active Plans */}
              Your Subscription Plans
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-2 sm:p-4 sm:pt-2'>
        <div className='max-h-96 space-y-2 overflow-y-auto'>
          {isLoading ? (
            <div className='flex h-20 items-center justify-center gap-2 rounded-lg bg-muted'>
              <Loader2 className='size-6 animate-spin' />
              <p className='animate-pulse text-sm'>Loading...</p>
            </div>
          ) : error ? (
            <div className='flex h-32 flex-col items-center justify-center space-y-2 text-center'>
              <AlertCircle className='h-6 w-6 text-destructive' />
              <p className='text-sm text-destructive'>
                {error?.message ?? 'Error loading subscriptions'}
              </p>
            </div>
          ) : !subscriptions ||
            subscriptions.length === 0 ||
            (sortedSubscriptions && sortedSubscriptions.length === 0) ? (
            <div className='flex h-20 items-center justify-center rounded-lg bg-muted'>
              <p className='text-sm text-muted-foreground'>
                No subscription plans found
              </p>
            </div>
          ) : (
            sortedSubscriptions &&
            sortedSubscriptions.map((sub) => (
              <div
                key={sub._id}
                className='space-y-2 rounded-lg border border-border bg-card p-3'
              >
                {/* Header: Plan and Status */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <BadgeCheck className='h-4 w-4 text-primary' />
                    <span className='text-sm font-medium capitalize'>
                      {(serviceName as Record<string, string>)[sub.serviceId] ??
                        sub.plan}
                    </span>
                  </div>
                  <Badge
                    variant='outline'
                    className={`text-xs capitalize ${getStatusColor(sub.status)}`}
                  >
                    {sub.status}
                  </Badge>
                </div>

                {/* Date Range and Remaining Time */}
                <div className='flex items-center gap-1 text-muted-foreground'>
                  <Calendar className='size-3' />
                  <div className='flex items-center gap-1 text-xs'>
                    <span>{formatDate(sub.startDate)}</span>-
                    <span>{formatDate(sub.endDate)}</span>
                  </div>
                </div>

                {/* Remaining Time */}
                <div className='flex items-center gap-1 text-xs'>
                  <Clock className='h-3 w-3 text-blue-500' />
                  <span className='font-medium text-blue-600'>
                    {calculateRemainingTime(sub.endDate)}
                  </span>
                </div>

                {/* Coverage Options */}
                <div className='flex items-start gap-1 text-xs'>
                  {sub.options.includes('All') ? (
                    <div className='flex items-center gap-1'>
                      <Globe className='h-3 w-3 text-green-500' />
                      <span className='font-medium text-green-600'>
                        All Zones
                      </span>
                    </div>
                  ) : (
                    <div className='flex items-start gap-1'>
                      <MapPin className='mt-0.5 h-3 w-3 text-blue-500' />
                      <div className='flex-1'>
                        <span className='text-muted-foreground'>Zones: </span>
                        <span className='text-foreground'>
                          {sub.options.slice(0, 5).join(', ')}
                          {sub.options.length > 5 && (
                            <span className='text-muted-foreground'>
                              {' '}
                              +{sub.options.length - 5} more
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
