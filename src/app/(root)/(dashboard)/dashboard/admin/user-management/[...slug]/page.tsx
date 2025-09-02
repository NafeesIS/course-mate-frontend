'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import BulkUnlockCreditsTab from './_components/BulkUnlockCreditsTab';
import OrdersTab from './_components/OrdersTab';
import SubscriptionsTab from './_components/SubscriptionsTab';
import { getSingleUserDetails } from './_services/services';

const SingleUserDetailsPage = () => {
  const params = useParams(); // Use Next.js hook to get route params safely
  const id = Array.isArray(params.slug) ? params.slug[0] : undefined; // Ensure we get the correct user ID

  // Prevent API call if ID is missing
  const {
    data: userData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => (id ? getSingleUserDetails(id) : Promise.resolve(null)), // Avoid calling API if id is undefined
    enabled: !!id, // Only run query if id exists
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1, // Retry once if the request fails
  });

  // Show loading state
  if (isLoading) {
    return <LoadingWithSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <Card className='mx-auto mt-10 max-w-3xl'>
        <CardContent className='flex flex-col items-center justify-center p-6 text-center'>
          <h3 className='mb-2 text-lg font-semibold'>Error Loading User</h3>
          <p className='text-sm text-muted-foreground'>
            An error occurred while fetching user details. Please try again
            later.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show user not found
  if (!userData && id) {
    return (
      <Card className='mx-auto mt-10 max-w-3xl'>
        <CardContent className='flex flex-col items-center justify-center p-6 text-center'>
          <h3 className='mb-2 text-lg font-semibold'>User Not Found</h3>
          <p className='text-sm text-muted-foreground'>
            We could not find any details for the provided user ID. Please
            ensure it is correct or try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <TabsContent value='orders'>
        <Suspense fallback={<LoadingWithSpinner />}>
          <OrdersTab userData={userData} />
        </Suspense>
      </TabsContent>

      <TabsContent value='bulk-unlock-credits'>
        <Suspense fallback={<LoadingWithSpinner />}>
          <BulkUnlockCreditsTab userData={userData} />
        </Suspense>
      </TabsContent>

      <TabsContent value='subscriptions'>
        <Suspense fallback={<LoadingWithSpinner />}>
          <SubscriptionsTab userData={userData} />
        </Suspense>
      </TabsContent>
    </div>
  );
};

export default SingleUserDetailsPage;
