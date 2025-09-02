'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import React from 'react';

const HeroBreadcrumb = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  // Define a mapping of routes to breadcrumb labels and links
  const breadcrumbRoutes = [
    { path: '/', label: 'Home' },
    { path: '/search/company', label: 'Company' },
    { path: '/search/director', label: 'Director' },
  ];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className='text-white/80'>
        {breadcrumbRoutes.map((route, index) => (
          <React.Fragment key={index}>
            {/* Check if the current path includes the route path */}
            {pathname.includes(route.path) && (
              <>
                <BreadcrumbItem>
                  {/* Render a link for the current route */}
                  <BreadcrumbLink
                    href={route.path}
                    className={`${
                      pathname === route.path
                        ? 'pointer-events-none text-white'
                        : 'text-white/90 hover:text-white/90'
                    } hover:underline`}
                  >
                    {route.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* Render breadcrumb separator for all routes except the last one */}
                {index < breadcrumbRoutes.length - 2 && <BreadcrumbSeparator />}
              </>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default HeroBreadcrumb;
