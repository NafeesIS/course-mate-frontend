import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategories: string[];
  tempSelectedCategories: string[];
  // eslint-disable-next-line no-unused-vars
  setTempSelectedCategories: (categories: string[]) => void;
  isCategoryDropdownOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsCategoryDropdownOpen: (isOpen: boolean) => void;
  categoryCounts: Record<string, number>;
  onApply: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Incorporation Documents',
  'Certificates',
  'Annual Returns and Balance Sheet eForms',
  'Charge Documents',
  'Change in Directors/Designated Partner',
  'LLP Forms (Conversion of company to LLP)',
  'Other eForm Documents',
  'Other Attachments',
];

export function CategoryFilter({
  selectedCategories,
  tempSelectedCategories,
  setTempSelectedCategories,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  categoryCounts,
  onApply,
  onCancel,
}: CategoryFilterProps) {
  return (
    <DropdownMenu
      open={isCategoryDropdownOpen}
      onOpenChange={setIsCategoryDropdownOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-9 justify-start whitespace-nowrap px-3 text-left text-xs font-normal shadow-sm hover:bg-sky-100 md:text-sm',
            selectedCategories.length > 0
              ? 'text-primary ring-1 ring-primary'
              : 'text-muted-foreground'
          )}
        >
          <Filter className='h-4 w-4 sm:mr-2' />
          <span className='hidden sm:inline'>
            {selectedCategories.length > 0 ? (
              <span className='flex items-center gap-1'>
                Categories
                <span className='ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground md:size-5 md:text-xs'>
                  {selectedCategories.length}
                </span>
              </span>
            ) : (
              <>
                <span className='hidden sm:inline'>Filter by</span> Category
              </>
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='ml-4 w-[280px] sm:w-96'>
        <div className='border-b p-3'>
          <h4 className='text-xs font-medium'>Filter by Category</h4>
          <p className='mt-1 text-[10px] text-muted-foreground'>
            Select document categories to display
          </p>
        </div>
        <div className='max-h-[360px] overflow-y-auto p-2'>
          <div className='flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent'>
            <div className='flex items-center space-x-2.5'>
              <Checkbox
                id='all-categories'
                checked={
                  tempSelectedCategories.length ===
                  CATEGORIES.filter((category) => categoryCounts[category] > 0)
                    .length
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    // Only select categories that have documents
                    setTempSelectedCategories(
                      CATEGORIES.filter(
                        (category) => categoryCounts[category] > 0
                      )
                    );
                  } else {
                    setTempSelectedCategories([]);
                  }
                }}
                className='size-3.5'
                checkIconClassName='h-3 w-3'
              />
              <label
                htmlFor='all-categories'
                className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                All Categories
              </label>
            </div>
            <span className='text-xs text-muted-foreground'>
              ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
            </span>
          </div>

          {CATEGORIES.map((category) => {
            const categoryCount = categoryCounts[category] || 0;
            return (
              <div
                key={category}
                className='flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent'
              >
                <div className='flex items-center space-x-2.5'>
                  <Checkbox
                    id={category}
                    checked={tempSelectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTempSelectedCategories([
                          ...tempSelectedCategories,
                          category,
                        ]);
                      } else {
                        setTempSelectedCategories(
                          tempSelectedCategories.filter((c) => c !== category)
                        );
                      }
                    }}
                    className='size-3.5'
                    checkIconClassName='h-3 w-3'
                    disabled={categoryCount === 0}
                  />
                  <label
                    htmlFor={category}
                    className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {category}
                  </label>
                </div>
                <span
                  className={cn(
                    'text-xs',
                    categoryCount === 0
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  )}
                >
                  ({categoryCount})
                </span>
              </div>
            );
          })}
        </div>
        <div className='flex justify-end gap-2 border-t p-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={onCancel}
            className='h-8'
          >
            Cancel
          </Button>
          <Button size='sm' onClick={onApply} className='h-8'>
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
