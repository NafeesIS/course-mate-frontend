import SearchResultsLoader from '@/components/shared/SearchBar/SearchResultsLoader';
import { Card } from '@/components/ui/card';

const ResultsLoader = () => {
  return (
    <div className='relative'>
      <div className='flex-center absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 gap-2 opacity-80'>
        <div
          className='text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white'
          role='status'
        >
          <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
            Loading...
          </span>
        </div>
        <h4 className='text-lg font-medium'>Loading...</h4>
      </div>

      <div className='grid grid-cols-1 gap-6 blur-sm'>
        <Card className='rounded-md p-6'>
          <SearchResultsLoader />
        </Card>
        <Card className='rounded-md p-6'>
          <SearchResultsLoader />
        </Card>
        <Card className='rounded-md p-6'>
          <SearchResultsLoader />
        </Card>
        <Card className='rounded-md p-6'>
          <SearchResultsLoader />
        </Card>
        <Card className='rounded-md p-6'>
          <SearchResultsLoader />
        </Card>
        <Card className='rounded-md p-6'>
          <SearchResultsLoader />
        </Card>
      </div>
    </div>
  );
};

export default ResultsLoader;
