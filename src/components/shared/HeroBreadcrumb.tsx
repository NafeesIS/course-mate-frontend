'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react';

const HeroBreadcrumb = ({
  breadcrumbRoutes,
  className,
}: {
  breadcrumbRoutes: { path: string; label: string }[];
  className?: string;
}) => {
  const pathname = usePathname();

  return (
    <Breadcrumb className={cn('max-w-[100vw] whitespace-nowrap', className)}>
      <BreadcrumbList className='px-4 text-xs text-white/80 md:text-sm'>
        {breadcrumbRoutes.map((route, index) => (
          <React.Fragment key={index}>
            {/* Check if the current path includes the route path */}
            {pathname.includes(route.path) && (
              <>
                <BreadcrumbItem className='truncate'>
                  {/* Render a link for the current route */}
                  <BreadcrumbLink
                    href={route.path}
                    className={cn(
                      'truncate whitespace-nowrap hover:underline',
                      pathname === route.path
                        ? 'pointer-events-none text-white'
                        : 'text-white/90 hover:text-white/90'
                    )}
                  >
                    {route.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* Render breadcrumb separator for all routes except the last one */}
                {index < breadcrumbRoutes.length - 1 && <BreadcrumbSeparator />}
              </>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default HeroBreadcrumb;
