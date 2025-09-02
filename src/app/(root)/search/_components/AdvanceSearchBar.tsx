'use client';

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { RiAlertLine, RiSearchLine } from 'react-icons/ri';
import { z } from 'zod';
import { Button } from '../../../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';

const querySchema = z.object({
  query: z
    .string()
    .trim()
    .min(4, { message: 'Please enter at least 4 characters' }) // minimum 4 characters
    .regex(/^[a-zA-Z0-9 & -]*$/, {
      message:
        'Invalid characters, use only letters, numbers, spaces, and hyphens',
    }),
});

const AdvanceSearchBar: React.FC<{
  defaultTab?: string;
  defaultSearchTerm?: string | null;
  className?: string;
}> = ({ defaultTab = 'company', defaultSearchTerm = '', className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState('');
  const [isPending, startTransition] = useTransition();

  const searchField = useForm<z.infer<typeof querySchema>>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      query: defaultSearchTerm ?? '',
    },
  });

  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    searchField.reset({ query: '' });
    setIsLoading('tab');
    startTransition(() => {
      router.push(`/search/${tabValue}`);
    });
  };

  const onSubmit = (values: z.infer<typeof querySchema>) => {
    const params = new URLSearchParams(searchParams);
    params.set('query', values.query.trim());
    setIsLoading('search');
    startTransition(() => {
      router.push(`/search/${tab}?${params.toString()}`);
    });
  };

  return (
    <>
      <div className='flex-center relative w-full'>
        <div
          className={cn(
            'w-full md:min-w-[760px] lg:w-10/12 xl:w-7/12',
            className
          )}
        >
          <div className='relative'>
            {/* SEARCH BAR */}
            <div className='flex flex-col gap-2 sm:flex-row sm:gap-4'>
              {/* TABS: COMPANY/DIRECTOR */}
              <Tabs
                value={tab}
                onValueChange={(value) => onTabChange(value)}
                className='w-full sm:w-96'
              >
                <TabsList className='grid h-12 w-full grid-cols-2'>
                  <TabsTrigger
                    value='company'
                    className='h-full text-sm md:text-base'
                  >
                    Company
                  </TabsTrigger>
                  <TabsTrigger
                    value='director'
                    className='h-full text-sm md:text-base'
                  >
                    Director
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Form {...searchField}>
                <form
                  onSubmit={searchField.handleSubmit(onSubmit)}
                  className='relative w-full'
                >
                  <FormField
                    control={searchField.control}
                    name='query'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={`Search by ${tab === 'company' ? 'Company Name/CIN' : 'Directors Name'}`}
                            {...field}
                            className='h-12 w-full rounded-lg bg-background text-sm text-foreground md:px-6 md:text-base'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* SEARCH BUTTON: GO TO ADVANCED SEARCH */}
                  <Button
                    type='submit'
                    variant='outline'
                    size='icon'
                    className={cn(
                      'group absolute right-2 top-1/2 -translate-y-1/2 overflow-hidden rounded-full border-0 text-center text-foreground transition-all duration-500 hover:right-2 hover:w-24 hover:border-2 hover:px-2 md:right-4',
                      searchField.formState.isSubmitting
                        ? 'pointer-events-none'
                        : '',
                      !searchField.formState.dirtyFields.query
                        ? 'pointer-events-none'
                        : '',
                      isPending && isLoading === 'search'
                        ? 'pointer-events-none'
                        : ''
                    )}
                  >
                    <>
                      <RiSearchLine
                        className={cn(
                          'h-5 w-6 transition-all duration-500',
                          isPending && isLoading === 'search'
                            ? 'animate-pulse duration-1000'
                            : ''
                        )}
                      />
                      <span className='ml-0 w-0 text-base opacity-0 transition-all duration-500 group-hover:ml-1 group-hover:w-full group-hover:opacity-100'>
                        {isPending && isLoading === 'search' ? (
                          <span className='animate-pulse text-xs duration-1000'>
                            Loading...
                          </span>
                        ) : (
                          'Search'
                        )}
                      </span>
                      {isPending && isLoading === 'search' && (
                        <div className='absolute h-full w-full animate-spin rounded-full border-2 border-gray-300 border-t-primary group-hover:animate-none group-hover:border-0' />
                      )}
                    </>
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* Display error message if form isn't valid */}
      {searchField.formState.errors.query && (
        <p className='mt-2 flex items-center gap-2 text-xs text-red-300 md:ml-8 md:text-sm'>
          <RiAlertLine className='text-sm md:text-base' />{' '}
          {searchField.formState.errors.query.message}
        </p>
      )}
    </>
  );
};

export default AdvanceSearchBar;
