'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HowItWorks = () => {
  return (
    <Card className='w-full lg:mt-4'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-sm md:text-base'>How It Works</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className='ml-4 list-outside list-decimal space-y-2 text-xs text-gray-600 md:text-sm'>
          <li>Search for a company by CIN or Name</li>
          <li>Select the company from the search results</li>
          <li>Click &quot;Unlock Company&quot; to use 1 credit</li>
          <li>View the company&apos;s details in company page</li>
        </ol>
      </CardContent>
    </Card>
  );
};

export default HowItWorks;
