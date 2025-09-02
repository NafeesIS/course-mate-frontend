/* eslint-disable indent */
'use client';

import { ISessionObject } from '@/app/(root)/(auth)/_utils/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { IUserSignInDetails } from '@/store/userStoreTypes';
import { LayoutDashboard, PanelsTopLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  RiArrowRightSLine,
  RiBuilding2Line,
  RiCalculatorLine,
  RiCalendarTodoFill,
  RiContactsBookFill,
  RiMenu4Fill,
  RiUserSearchLine,
} from 'react-icons/ri';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import FileSureLogo from '../../../../public/assets/filesure-icon.png';
import CartIcon from './CartIcon';
import SearchBtn from './SearchBtn';
import SignInBtn from './SignInBtn';
import SignOutBtn from './SignOutBtn';

const MobileNav = ({
  userSignInDetails,
}: {
  userSignInDetails: IUserSignInDetails | null;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session: ISessionObject = useSessionContext();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <div className='flex flex-shrink-0 items-center gap-6 md:hidden'>
      <div className='flex items-center gap-1'>
        <SearchBtn />
        <CartIcon />
      </div>

      {!session.loading && session.doesSessionExist && userSignInDetails && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex-shrink-0 rounded-full'>
              {userSignInDetails?.data?.profilePicture ? (
                <Image
                  src={userSignInDetails?.data?.profilePicture}
                  alt='profile picture'
                  width={30}
                  height={30}
                  className='size-8 flex-shrink-0 cursor-pointer rounded-full ring-2 transition-all group-hover:ring-muted'
                />
              ) : (
                <div className='size-10 flex-shrink-0 cursor-pointer rounded-full bg-gray-300 ring-2 transition-all group-hover:ring-muted'></div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mr-4 mt-2 w-48'>
              <div className='p-1 text-[10px] text-muted-foreground'>
                <span>Signed in as</span>
                <span className='mt-0.5 block text-[10px] font-semibold text-foreground'>
                  {userSignInDetails?.data?.emails[0]}
                </span>
              </div>

              {/* <Separator className='my-2' /> */}

              <Link
                href='/dashboard'
                prefetch={false}
                className={cn(
                  'mt-1 block w-full',
                  pathname.includes('/dashboard') && 'hidden'
                )}
              >
                <Button
                  title='Dashboard'
                  size='sm'
                  variant='default'
                  className='h-7 w-full flex-shrink-0 items-center gap-2 px-2'
                >
                  <LayoutDashboard className='hidden size-3 xs:inline' />
                  <span className='text-xs'>Dashboard</span>
                </Button>
              </Link>

              <Separator className='my-2' />

              <SignOutBtn
                className='h-6 justify-center border bg-gray-100 text-xs'
                logoClassName='size-3'
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      {!pathname.includes('dashboard') && (
        <Drawer direction='right' open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger
            title='Open Menu'
            className={cn('flex-center text-xl text-white')}
          >
            <RiMenu4Fill />
          </DrawerTrigger>

          <DrawerContent className='h-full max-w-80 rounded-none'>
            <nav className='flex h-full flex-col text-gray-100'>
              <div className='flex-center relative bg-muted p-4'>
                <Image
                  src={FileSureLogo}
                  alt='FileSure Logo'
                  width={40}
                  height={40}
                  className='h-8 w-auto'
                />

                <button
                  title='Close Menu'
                  onClick={() => setIsOpen(false)}
                  className='absolute -left-2 top-11 rounded border bg-background p-2 text-lg text-muted-foreground shadow'
                >
                  <RiArrowRightSLine />
                </button>
              </div>
              <ul className='space-y-4 p-4 pb-8'>
                {/* Advanced Search Accordion */}
                <Accordion
                  type='multiple'
                  defaultValue={[
                    'advanced-search',
                    'business-services',
                    'data-services',
                  ]}
                >
                  <AccordionItem value='advanced-search'>
                    <AccordionTrigger className='text-foreground'>
                      Advanced Search
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className='space-y-4 pl-2'>
                        <li>
                          <Link
                            href='/search/company'
                            prefetch={false}
                            className='flex w-full items-center justify-start gap-2 rounded-none border-l-[3px] border-primary px-4 text-foreground'
                          >
                            <RiBuilding2Line className='flex-shrink-0 text-lg opacity-80' />
                            Company Search
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='/search/director'
                            prefetch={false}
                            className='flex w-full items-center justify-start gap-2 rounded-none border-l-[3px] border-primary px-4 text-foreground'
                          >
                            <RiUserSearchLine className='flex-shrink-0 text-lg opacity-80' />
                            Director Search
                          </Link>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Business Services Accordion */}
                  {/* <AccordionItem value='business-services'>
                    <AccordionTrigger className='text-foreground'>
                      Business Services
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className='space-y-4 pl-2'>
                        <li>
                          <Link
                            href='/business-services/registration-pvt-ltd'
                            prefetch={false}
                            className='flex w-full items-center justify-start gap-2 rounded-none border-l-[3px] border-primary px-4 text-foreground'
                          >
                            <RiArticleLine className='flex-shrink-0 text-lg opacity-80' />{' '}
                            Pvt Ltd Registration
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='/business-services/registration-llp'
                            prefetch={false}
                            className='flex w-full items-center justify-start gap-2 rounded-none border-l-[3px] border-primary px-4 text-foreground'
                          >
                            <RiArticleLine className='flex-shrink-0 text-lg opacity-80' />{' '}
                            LLP Registration
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='/business-services/annual-compliance-pvt-ltd'
                            prefetch={false}
                            className='flex w-full items-center justify-start gap-2 rounded-none border-l-[3px] border-primary px-4 text-foreground'
                          >
                            <RiArticleLine className='flex-shrink-0 text-lg opacity-80' />{' '}
                            Annual Compliance Pvt Ltd
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='/business-services/annual-compliance-llp'
                            prefetch={false}
                            className='flex w-full items-center justify-start gap-2 rounded-none border-l-[3px] border-primary px-4 text-foreground'
                          >
                            <RiArticleLine className='flex-shrink-0 text-lg opacity-80' />{' '}
                            Annual Compliance LLP
                          </Link>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem> */}

                  {/* Data Services Accordion */}
                  <AccordionItem value='data-services'>
                    <AccordionTrigger className='text-foreground'>
                      Data Services
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className='space-y-4 pl-2'>
                        <li>
                          <Link
                            href='/unlock-contact/bulk-unlock'
                            prefetch={false}
                            className='flex w-full items-center justify-start gap-2 rounded-none border-l-[3px] border-primary px-4 text-foreground'
                          >
                            <RiContactsBookFill className='flex-shrink-0 text-lg opacity-80' />{' '}
                            Director Contact
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='/new-company-alert'
                            prefetch={false}
                            className='flex w-full items-center justify-start gap-2 rounded-none border-l-[3px] border-primary px-4 text-foreground'
                          >
                            <RiCalendarTodoFill className='flex-shrink-0 text-lg opacity-80' />{' '}
                            New Company Alert
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='/tools/roi-calculator'
                            prefetch={false}
                            className='flex w-full items-center justify-start gap-2 rounded-none border-l-[3px] border-primary px-4 text-foreground'
                          >
                            <RiCalculatorLine className='flex-shrink-0 text-lg opacity-80' />
                            Marketing ROI Calculator
                          </Link>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* <Separator orientation='horizontal' className='opacity-80' /> */}

                {session.loading || session.doesSessionExist === false ? (
                  <>
                    <li>
                      <SignInBtn className='w-full' />
                    </li>
                  </>
                ) : (
                  <li className='mt-auto'>
                    <Link
                      href='/dashboard'
                      prefetch={false}
                      className={cn(
                        buttonVariants({
                          variant: 'gooeyLeft',
                          className: 'flex items-center gap-2',
                        })
                      )}
                    >
                      <PanelsTopLeft className='flex-shrink-0 text-lg opacity-80' />
                      Go to Dashboard
                    </Link>
                  </li>
                )}

                {/* <li className='flex justify-end'>
                <ModeToggle />
              </li> */}
              </ul>
            </nav>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default MobileNav;
