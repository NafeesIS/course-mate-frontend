'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { KeyboardEvent } from 'react';

interface SearchSectionProps {
  din: string;
  setDin: (_newValue: string) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading: boolean;
  hasResults: boolean;
  className?: string;
}

export const SearchSection = ({
  din,
  setDin,
  onSearch,
  onReset,
  isLoading,
  hasResults,
  className,
}: SearchSectionProps) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleClear = () => {
    setDin('');
    if (hasResults) {
      onReset();
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className='p-4'>
        <CardTitle className='flex items-center gap-2 text-sm'>
          <Search className='size-4' />
          Search Director
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 pt-0'>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <div className='relative flex-1'>
            <Input
              placeholder='Enter Director DIN (e.g., 08151742)'
              value={din}
              onChange={(e) => setDin(e.target.value)}
              onKeyDown={handleKeyPress}
              className='h-12 pr-10'
            />
            {din && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={handleClear}
                className='absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-gray-100'
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
          <Button
            onClick={onSearch}
            disabled={isLoading || !din.trim()}
            className='h-12 px-6'
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
