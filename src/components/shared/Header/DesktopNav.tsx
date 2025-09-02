'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { IUserSignInDetails } from '@/store/userStoreTypes';
import { TAllServiceCatalogs } from '@/types/ServiceCatalogTypes';
import Image from 'next/image';
import Link from 'next/link';
import { FaSignInAlt } from 'react-icons/fa';
import {
  RiArrowDownSLine,
  RiCalculatorLine,
  RiCalendarTodoFill,
  RiContactsBookLine,
  RiDatabase2Fill,
  RiLayout2Fill,
} from 'react-icons/ri';
import { redirectToAuth } from 'supertokens-auth-react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import CartIcon from './CartIcon';
import SearchBtn from './SearchBtn';
import SignOutBtn from './SignOutBtn';

const DesktopNav = ({
  userSignInDetails,
  serviceCatalogFromDB,
  isDashboardRoute,
}: {
  userSignInDetails: IUserSignInDetails | null;
  serviceCatalogFromDB: TAllServiceCatalogs | null;
  isDashboardRoute: boolean;
}) => {
  const session = useSessionContext();
  const avatarToShow =
    userSignInDetails?.data?.meta_data?.avatarUrl ||
    userSignInDetails?.data?.profilePicture ||
    undefined;
  const first = userSignInDetails?.data?.meta_data?.firstName?.trim() || '';
  const last = userSignInDetails?.data?.meta_data?.lastName?.trim() || '';
  const name = `${first} ${last}`.trim() || 'User';
  const currency = serviceCatalogFromDB ? serviceCatalogFromDB?.currency : '';
  const directorUnlockCatalog = serviceCatalogFromDB?.serviceCatalog.find(
    (service) => service.serviceType === 'directorUnlock'
  );
  const singleDirectorUnlockPrice = directorUnlockCatalog?.directorUnlockPricing
    ? directorUnlockCatalog?.directorUnlockPricing.singleUnlock.price
    : '';

  return (
    <nav className='hidden w-full items-center justify-end gap-6 text-gray-100 md:flex'>
      <ul className='flex items-center gap-4'>
        <li>
          <SearchBtn />
        </li>

        {/* <li>
          <ModeToggle />
        </li> */}

        {/* <li className='group relative inline-block'>
          <button
            className={cn(
              buttonVariants({ variant: 'shine' }),
              'border border-transparent px-1.5 group-hover:border-muted-foreground'
            )}
          >
            <RiNumbersFill className='mr-2 inline-block' />
            Business Services
            <RiArrowDownSLine className='ml-1 inline-block transition-all group-hover:rotate-180' />
          </button>
          <div className='pointer-events-none absolute -z-50 min-w-80 rounded-lg bg-transparent pt-2 opacity-0 transition-all group-hover:pointer-events-auto group-hover:z-20 group-hover:opacity-100'>
            <div className='absolute -z-50 min-w-80 space-y-1.5 rounded-lg bg-muted p-2 text-foreground opacity-0 shadow-2xl transition-all group-hover:z-40 group-hover:opacity-100'>
  
              <Link
                href='/business-services/registration-pvt-ltd'
                prefetch={false}
                className='block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary'
              >
                <div className='flex items-center gap-2'>
                  <RiArticleLine className='flex-shrink-0 text-xl text-muted-foreground' />
                  <p className='text-sm font-semibold'>
                    Private Limited Company Registration
                  </p>
                </div>
                <Separator className='my-1' />
                <p className='mt-1 text-xs text-muted-foreground'>
                  Receive expert assistance with your company registration for a
                  smooth and hassle-free experience.
                </p>
              </Link>
 
              <Link
                href='/business-services/registration-llp'
                prefetch={false}
                className='block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary'
              >
                <div className='flex items-center gap-2'>
                  <RiArticleLine className='flex-shrink-0 text-xl text-muted-foreground' />
                  <p className='text-sm font-semibold'>LLP Registration</p>
                </div>
                <Separator className='my-1' />
                <p className='mt-1 text-xs text-muted-foreground'>
                  Start your Limited Liability Partnership (LLP) registration
                  with expert assistance and compliance support.
                </p>
              </Link>
          
              <Link
                href='/business-services/annual-compliance-pvt-ltd'
                prefetch={false}
                className='block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary'
              >
                <div className='flex items-center gap-2'>
                  <RiArticleLine className='flex-shrink-0 text-xl text-muted-foreground' />
                  <p className='text-sm font-semibold'>
                    Annual Compliance Pvt Ltd
                  </p>
                </div>
                <Separator className='my-1' />
                <p className='mt-1 text-xs text-muted-foreground'>
                  Ensure your Private Limited Company remains compliant and
                  penalty-free with our expert annual compliance services.
                </p>
              </Link>
    
              <Link
                href='/business-services/annual-compliance-llp'
                prefetch={false}
                className='block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary'
              >
                <div className='flex items-center gap-2'>
                  <RiArticleLine className='flex-shrink-0 text-xl text-muted-foreground' />
                  <p className='text-sm font-semibold'>Annual Compliance LLP</p>
                </div>
                <Separator className='my-1' />
                <p className='mt-1 text-xs text-muted-foreground'>
                  Get expert guidance for hassle-free LLP annual compliance and
                  stay penalty-free with ease.
                </p>
              </Link>
            </div>
          </div>
        </li> */}

        <li className='group relative inline-block'>
          <button
            className={cn(
              buttonVariants({ variant: 'shine' }),
              'border border-transparent px-1.5 group-hover:border-muted-foreground'
            )}
          >
            <RiDatabase2Fill className='mr-2 inline-block' />
            Data Services
            <RiArrowDownSLine className='ml-1 inline-block transition-all group-hover:rotate-180' />
          </button>
          <div className='absolute -ml-40 hidden min-w-80 rounded-lg bg-transparent pt-2  group-hover:block'>
            <div className='absolute z-40 hidden min-w-80 space-y-1.5 rounded-lg bg-muted p-2 text-foreground shadow-2xl transition-all group-hover:block'>
              {/* Director Contact */}
              <Link
                href='/unlock-contact/bulk-unlock'
                prefetch={false}
                className='block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary'
              >
                <div className='flex items-center gap-2.5'>
                  <RiContactsBookLine className='flex-shrink-0 text-xl text-muted-foreground' />
                  <p className='text-sm font-semibold'>Director Contact</p>
                </div>
                <Separator className='my-1' />
                <p className='mt-1 text-xs text-muted-foreground'>
                  Unlock director contact information only at{' '}
                  {!serviceCatalogFromDB ? (
                    '...'
                  ) : (
                    <>
                      {currency === 'INR' ? '₹' : '$'}
                      {singleDirectorUnlockPrice}. Instant access. No hidden
                      fees.
                    </>
                  )}
                </p>
              </Link>
              {/* New Company Alert */}
              <Link
                href='/new-company-alert'
                prefetch={false}
                className='block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary'
              >
                <div className='flex items-center gap-2.5'>
                  <RiCalendarTodoFill className='flex-shrink-0 text-xl text-muted-foreground' />
                  <p className='text-sm font-semibold'>New Company Alert</p>
                </div>
                <Separator className='my-1' />
                <p className='mt-1 text-xs text-muted-foreground'>
                  Get a list of newly incorporated companies every day,
                  including contact details.
                </p>
              </Link>
              {/* Marketing ROI Calculator */}
              <Link
                href='/tools/roi-calculator'
                prefetch={false}
                className='block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary'
              >
                <div className='flex items-center gap-2.5'>
                  <RiCalculatorLine className='flex-shrink-0 text-xl text-muted-foreground' />
                  <p className='text-sm font-semibold'>
                    Marketing ROI Calculator
                  </p>
                </div>
                <Separator className='my-1' />
                <p className='mt-1 text-xs text-muted-foreground'>
                  Calculate your return on investment across multiple marketing
                  channels.
                </p>
              </Link>
            </div>
          </div>
        </li>

        <CartIcon />

        {/* href='/auth?show=signup' */}
        {session.loading || session.doesSessionExist === false ? (
          <>
            <Separator orientation='vertical' className='h-7 opacity-80' />
            <li>
              <Button
                onClick={() => redirectToAuth({ show: 'signin' })}
                className={cn(
                  buttonVariants({
                    variant: 'gooeyLeft',
                    className: 'flex items-center gap-2',
                  })
                )}
              >
                <FaSignInAlt />
                Sign In
              </Button>
            </li>
          </>
        ) : (
          <>
            <Separator orientation='vertical' className='h-7 opacity-80' />

            {!isDashboardRoute && (
              <li>
                <Link href='/dashboard' prefetch={false} className='group'>
                  <Button
                    variant='gooeyLeft'
                    size='sm'
                    // className='text-gray-900'
                  >
                    <RiLayout2Fill className='mr-1.5 inline-block size-4' />
                    Dashboard
                  </Button>
                </Link>
              </li>
            )}

            <li className='group relative'>
              {avatarToShow ? (
                <Image
                  src={avatarToShow}
                  alt='profile picture'
                  title={name}
                  width={40}
                  height={40}
                  className='size-10 flex-shrink-0 cursor-pointer rounded-full ring-2 transition-all group-hover:ring-muted'
                />
              ) : (
                <div className='size-10 flex-shrink-0 cursor-pointer rounded-full bg-gray-300 ring-2 transition-all group-hover:ring-muted'></div>
              )}

              <div className='absolute right-0 hidden w-52 rounded-lg bg-transparent pt-2 group-hover:block'>
                <div className='z-10 hidden w-fit rounded-lg bg-white p-2 text-foreground shadow-2xl transition-all group-hover:block'>
                  <div className='p-2 text-xs text-muted-foreground'>
                    Signed in as{' '}
                    <span className='font-semibold text-foreground'>
                      {userSignInDetails?.data?.emails[0]}
                    </span>
                  </div>
                  <Separator className='my-2' />
                  {/* <Link href='/dashboard' prefetch={false}>
                    <Button
                      variant='ghost'
                      className='w-full justify-start hover:bg-muted'
                    >
                      <LayoutDashboard className='mr-2 h-4 w-4' />
                      Dashboard
                    </Button>
                  </Link> */}

                  <SignOutBtn />
                </div>
              </div>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default DesktopNav;
