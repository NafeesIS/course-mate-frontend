'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export type GoogleAdUnitProps = {
  children: React.ReactNode;
};

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    adsbygoogle?: any | any[];
  }
}

const GoogleAdUnitClient: React.FC<GoogleAdUnitProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, [pathname, searchParams]);
  return <div className='wrapper py-10'>{children}</div>;
};

export default GoogleAdUnitClient;
