'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { RiArrowDownSFill } from 'react-icons/ri';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

type Tab = {
  title: string | React.ReactNode | any;
  value: string;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div
        className='mx-auto'
        // className={cn(
        //   'no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:overflow-visible',
        //   containerClassName
        // )}
      >
        {/* Tabs for larger screens */}
        <div
          className={cn(
            'no-visible-scrollbar relative hidden w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:flex',
            containerClassName
          )}
        >
          {propTabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => moveSelectedTabToTop(idx)}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className={cn(
                'relative w-fit rounded-full px-4 py-2 text-foreground opacity-60 transition-all duration-300 ease-in',
                active.value === tab.value && 'opacity-100',
                tabClassName
              )}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {active.value === tab.value && (
                <motion.div
                  layoutId='clickedbutton'
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                  className={cn(
                    'absolute inset-0 rounded-full bg-gray-200 dark:bg-zinc-800',
                    activeTabClassName
                  )}
                />
              )}
              <span className='relative block'>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Dropdown for mobile devices */}
        <div className='sm:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='mx-auto w-fit rounded-full border border-background bg-muted p-0.5'>
                <Button
                  variant='outline'
                  className='w-fit min-w-52 gap-1.5 rounded-full bg-background text-center font-semibold shadow'
                >
                  {propTabs.find((tab) => tab.value === active.value)?.title ||
                    'Select an option'}{' '}
                  <RiArrowDownSFill className='text-lg' />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex-col-center w-52 gap-2 rounded-2xl'>
              {propTabs.map((tab, idx) => (
                <DropdownMenuItem
                  key={idx}
                  onSelect={() => moveSelectedTabToTop(idx)}
                  className={cn(
                    'flex-center w-full text-xs font-semibold',
                    active.value === tab.value
                      ? 'rounded-full border bg-white opacity-100 shadow'
                      : 'opacity-60'
                  )}
                >
                  {tab.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn('mt-32', contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
  return (
    <div className='relative h-full w-full'>
      {tabs.map((tab, idx) => (
        <React.Fragment key={tab.value}>
          {/* Desktop */}
          <motion.div
            layoutId={tab.value}
            style={{
              scale: 1 - idx * 0.1,
              top: hovering ? idx * -40 : 0,
              zIndex: -idx,
              opacity: idx < 3 ? 1 - idx * 0.1 : 0,
            }}
            animate={{
              y: isActive(tab) ? [0, 40, 0] : 0,
              // opacity: [0.5, 1],
            }}
            // transition={{ duration: 0.3, ease: 'easeIn' }}
            className={cn(
              'absolute left-0 top-0 hidden h-full w-full md:block',
              className
            )}
          >
            {tab.content}
          </motion.div>
          {/* Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
            className={cn(
              'absolute left-0 top-0 h-full w-full md:hidden',
              className
            )}
          >
            {tab.content}
          </motion.div>
        </React.Fragment>
      ))}
    </div>
  );
};
