/* eslint-disable indent */
'use client';

import DesktopNav from '@/components/shared/Header/DesktopNav';
import useMediaQuery from '@/hooks/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';

import { ISessionObject } from '@/app/(root)/(auth)/_utils/types';
import {
  adminNavItems,
  navItems,
} from '@/app/(root)/(dashboard)/dashboard/_components/Sidebar/SidebarItems';
import { BASE_URL_BACKEND, BASE_URL_FRONTEND } from '@/constants';
import { getLocalStorage } from '@/lib/localStorage';
import { cn } from '@/lib/utils';
import { TPricingStore, usePricingStore } from '@/store/pricingStore';
import { TUserSignInDetails, useUserSignInDetails } from '@/store/userStore';
import { TAllServiceCatalogs } from '@/types/ServiceCatalogTypes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User, UserCog } from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import filesureLogoLight from '../../../../public/assets/filesure-logo-light.png';

const MobileNav = dynamic(() => import('./MobileNav'), { ssr: false });
const SidebarToggleForMobile = dynamic(
  () =>
    import(
      '@/app/(root)/(dashboard)/dashboard/_components/Sidebar/SidebarToggleForMobile'
    ),
  { ssr: false }
);

const Header = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isDashboardRoute =
    pathname.includes('/dashboard') || pathname.includes('/complete-profile');
  const isNewCompanyAlertRoute = pathname === '/new-company-alert';

  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight =
        document.getElementById('nca-banner-global')?.clientHeight || 0;
      // document.getElementById('OfferBannerAtTop')?.clientHeight || 0;
      // document.getElementById('McaMaintenanceBanner')?.clientHeight || 0;
      if (window.scrollY > bannerHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    // Check initial scroll position on mount
    handleScroll();
    // Add event listener on scroll
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // FETCH USER DETAILS + SET GLOBAL COOKIES IN MEMORY
  const session: ISessionObject = useSessionContext(); // get user session data
  const {
    userSignInDetails,
    setUserSignInDetails,
    setUserSignInDetailsLoading,
    setUserSignInDetailsError,
    setRefetchUserSignInDetails,
  }: TUserSignInDetails = useUserSignInDetails(); // get user details from store (if exist or empty)
  const fetchUserDetails = async () => {
    const response = await fetch(`${BASE_URL_BACKEND}/api/v1/users/user-info`);
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    return response.json();
  };
  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError,
    refetch: refetchUserDetails,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserDetails,
    enabled: session && !session.loading && session.doesSessionExist, // if session exists then fetch
    refetchOnWindowFocus: false,
    retry: 3,
  });
  // IF USER DETAILS ARE FETCHED, SET IT IN ZUSTAND STORE
  useEffect(() => {
    setUserSignInDetails(userData);
    setUserSignInDetailsLoading(userIsLoading);
    setUserSignInDetailsError(userError);
    setRefetchUserSignInDetails(refetchUserDetails);
  }, [
    userData,
    userIsLoading,
    userError,
    setUserSignInDetails,
    setUserSignInDetailsLoading,
    setUserSignInDetailsError,
    refetchUserDetails,
    setRefetchUserSignInDetails,
  ]);

  // CHECK IF USER PROFILE IS COMPLETE
  useEffect(() => {
    if (userData && (isDashboardRoute || pathname.includes('/cart'))) {
      if (
        !userData.data.meta_data.firstName ||
        !userData.data.meta_data.lastName ||
        !userData.data.meta_data.mobileNumber
      ) {
        const redirectTo = getLocalStorage('urlHistory');
        router.push(`/auth/complete-profile?redirectTo=${redirectTo}`); // Redirect to the form to complete user info
      }
    }
  }, [userData, router, isDashboardRoute, pathname]);

  // FETCH PRICING DETAILS OF DIFFERENT SERVICES
  const {
    serviceCatalogFromDB,
    setServiceCatalogFromDB,
    setServiceCatalogFromDBPending,
    setServiceCatalogFromDBError,
    setRefetchServiceCatalogFromDB,
  }: TPricingStore = usePricingStore(); // get pricing details from store

  const fetchPricing = async (): Promise<TAllServiceCatalogs> => {
    const { data } = await axios.get(
      `${BASE_URL_FRONTEND}/api/get-all-service-catalog`
    );
    return data;
  };
  const {
    data: pricing,
    isPending: pricingIsPending,
    error: pricingErrorFromQuery,
    refetch: refetchPricing,
  } = useQuery<TAllServiceCatalogs, Error>({
    queryKey: ['pricing'],
    queryFn: fetchPricing,
    retry: 3,
    refetchOnWindowFocus: false,
    staleTime: 3600000, // 1 hour in milliseconds
  });
  // IF PRICING DETAILS ARE FETCHED, SET IT IN ZUSTAND STORE
  useEffect(() => {
    setServiceCatalogFromDBPending(pricingIsPending);
    setServiceCatalogFromDBError(pricingErrorFromQuery);
    if (pricing) {
      setServiceCatalogFromDB(pricing);
    }
    setRefetchServiceCatalogFromDB(refetchPricing);
  }, [
    pricing,
    pricingIsPending,
    pricingErrorFromQuery,
    refetchPricing,
    setServiceCatalogFromDB,
    setServiceCatalogFromDBPending,
    setServiceCatalogFromDBError,
    setRefetchServiceCatalogFromDB,
  ]);

  // to check if the user is in admin view
  const [isAdminView, setIsAdminView] = useState(false);
  // to check if the user is in admin view
  useEffect(() => {
    setIsAdminView(pathname.includes('dashboard/admin'));
  }, [pathname]);
  // to check if the user is in admin view
  const isAdmin = userSignInDetails?.data.roles.includes('admin');
  const switchOptions = [
    { label: 'User Dashboard', value: 'user', icon: User },
    { label: 'Admin Dashboard', value: 'admin', icon: UserCog },
    // Add more options here in the future
  ];

  const handleSwitchOption = (value: string) => {
    const newPath = value === 'admin' ? '/dashboard/admin' : '/dashboard';
    router.push(newPath);
    setIsAdminView(value === 'admin');
  };

  return (
    <>
      <header
        id='search'
        className={cn(
          'absolute left-0 right-0 top-0 z-50 h-14 transition-all duration-300 ease-in-out md:h-16',
          // (isScrolled || (isScrolled && isDashboardRoute)) &&
          (isScrolled || isDashboardRoute) &&
            !isNewCompanyAlertRoute &&
            !isNewCompanyAlertRoute
            ? 'fixed h-14 shadow-md md:h-14'
            : ''
          // isDashboardRoute ? 'h-14 md:h-14' : ''
        )}
      >
        <div
          className={cn(
            'flex-between h-full gap-20 py-3 transition-all duration-500 ease-in-out',
            isScrolled ? 'lg:py-2' : '',
            isDashboardRoute ? 'pl-3 pr-4 lg:px-8 lg:py-2' : 'wrapper'
          )}
        >
          <div className='flex h-full items-center gap-3'>
            {!session.loading &&
              session.doesSessionExist &&
              userSignInDetails?.data.meta_data &&
              isDashboardRoute && (
                <>
                  {isAdmin && pathname.includes('dashboard/admin') ? (
                    <SidebarToggleForMobile
                      items={adminNavItems}
                      isAdmin={isAdmin}
                      isAdminView={isAdminView}
                      switchOptions={switchOptions}
                      handleSwitchOption={handleSwitchOption}
                      className='lg:hidden'
                    />
                  ) : (
                    <SidebarToggleForMobile
                      items={navItems}
                      isAdmin={isAdmin}
                      isAdminView={isAdminView}
                      switchOptions={switchOptions}
                      handleSwitchOption={handleSwitchOption}
                      className='lg:hidden'
                    />
                  )}
                </>
              )}
            {/* LOGO */}
            <Link
              href='/'
              prefetch={false}
              className='block flex-shrink-0 cursor-pointer'
            >
              <Image
                src={filesureLogoLight}
                alt={'FileSure Logo'}
                width={160}
                height={40}
                quality={100}
                priority
                className={cn(
                  'h-4 w-auto transition-all duration-500  ease-in-out md:h-6',
                  isScrolled ? 'lg:h-5' : '',
                  isDashboardRoute ? 'hidden lg:block lg:h-5' : ''
                )}
              />
            </Link>
          </div>

          {isDesktop ? (
            <DesktopNav
              userSignInDetails={userSignInDetails}
              serviceCatalogFromDB={serviceCatalogFromDB}
              isDashboardRoute={isDashboardRoute}
            />
          ) : (
            <MobileNav userSignInDetails={userSignInDetails} />
          )}
        </div>

        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 top-0 -z-20 bg-gradient-to-r from-midnight-blue to-navy-blue opacity-95 transition-all duration-500 ease-in-out'
            // isScrolled ? 'opacity-95' : '',
            // isDashboardRoute ? 'opacity-95' : ''
          )}
        />
      </header>
    </>
  );
};

export default Header;
