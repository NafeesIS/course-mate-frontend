// components/ui/search-input.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import * as React from 'react';

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  isLoading?: boolean;
  showClearButton?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, isLoading, showClearButton, ...props }, ref) => {
    return (
      <div className='relative flex items-center'>
        <Search className='absolute left-3 h-4 w-4 text-muted-foreground' />
        <Input
          ref={ref}
          className={cn('h-10 pl-10 pr-10', className)}
          {...props}
        />
        <div className='absolute right-2 flex items-center space-x-1'>
          {isLoading && (
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
          )}
          {showClearButton && !isLoading && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0'
              onClick={onClear}
            >
              <X className='h-3 w-3' />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
