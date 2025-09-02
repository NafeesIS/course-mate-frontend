'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import UserDetailsTabs from './_components/UserDetailsTabs';
import UserHero from './_components/UserHero';
import { getSingleUserDetails } from './_services/services';

export default function SingleUserDetailsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams(); // Use Next.js hook to get params
  const id = Array.isArray(params.slug) ? params.slug[0] : undefined; // Ensure id exists

  // Prevent calling useQuery if id is undefined
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

  return (
    <div className='min-h-screen'>
      <Breadcrumb className='mb-4'>
        <BreadcrumbList className='text-xs md:text-sm'>
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard/admin/user-management'>
              User Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{userData?.emails?.[0] || ''}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Show loading state */}
      {isLoading && (
        <Card className='mx-auto mt-10 max-w-3xl'>
          <CardContent className='flex flex-col items-center justify-center p-6 text-center'>
            <h3 className='mb-2 text-lg font-semibold'>Loading...</h3>
            <p className='text-sm text-muted-foreground'>
              Fetching user details, please wait.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Show error state */}
      {error && (
        <Card className='mx-auto mt-10 max-w-3xl'>
          <CardContent className='flex flex-col items-center justify-center p-6 text-center'>
            <h3 className='mb-2 text-lg font-semibold'>Error Loading User</h3>
            <p className='text-sm text-muted-foreground'>
              An error occurred while fetching user details. Please try again
              later.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Show user not found */}
      {!isLoading && !userData && id && (
        <Card className='mx-auto mt-10 max-w-3xl'>
          <CardContent className='flex flex-col items-center justify-center p-6 text-center'>
            <h3 className='mb-2 text-lg font-semibold'>User Not Found</h3>
            <p className='text-sm text-muted-foreground'>
              We could not find any details for the provided user email. Please
              ensure the email is correct or try again later.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Show user details if data is available */}
      {userData && (
        <>
          <UserHero userData={userData} />
          <UserDetailsTabs>{children}</UserDetailsTabs>
        </>
      )}
    </div>
  );
}
