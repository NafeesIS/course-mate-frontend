import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { useMemo } from 'react';
import { IDocument } from '../../../_types/PublicDocsTypes';

interface FormIdFilterProps {
  selectedFormIds: string[];
  tempSelectedFormIds: string[];
  setTempSelectedFormIds: (_formIds: string[]) => void;
  isFormIdDropdownOpen: boolean;
  setIsFormIdDropdownOpen: (_isOpen: boolean) => void;
  documents: IDocument[];
  onApply: () => void;
  onCancel: () => void;
}

export function FormIdFilter({
  selectedFormIds,
  tempSelectedFormIds,
  setTempSelectedFormIds,
  isFormIdDropdownOpen,
  setIsFormIdDropdownOpen,
  documents,
  onApply,
  onCancel,
}: FormIdFilterProps) {
  // Get unique form IDs from documents with counts
  const formIdCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach((doc) => {
      if (doc.formId) {
        counts[doc.formId] = (counts[doc.formId] || 0) + 1;
      }
    });
    return counts;
  }, [documents]);

  const uniqueFormIds = useMemo(() => {
    return Object.keys(formIdCounts).sort();
  }, [formIdCounts]);

  return (
    <DropdownMenu
      open={isFormIdDropdownOpen}
      onOpenChange={setIsFormIdDropdownOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-9 justify-start whitespace-nowrap px-3 text-left text-xs font-normal shadow-sm hover:bg-sky-100 md:text-sm',
            selectedFormIds.length > 0
              ? 'text-primary ring-1 ring-primary'
              : 'text-muted-foreground'
          )}
        >
          <Filter className='h-4 w-4 sm:mr-2' />
          <span className='hidden sm:inline'>
            {selectedFormIds.length > 0 ? (
              <span className='flex items-center gap-1'>
                Form IDs
                <span className='ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground md:size-5 md:text-xs'>
                  {selectedFormIds.length}
                </span>
              </span>
            ) : (
              <>
                <span className='hidden sm:inline'>Filter by</span> Form ID
              </>
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='ml-4 w-[280px] sm:w-96'>
        <div className='border-b p-3'>
          <h4 className='text-xs font-medium'>Filter by Form ID</h4>
          <p className='mt-1 text-[10px] text-muted-foreground'>
            Select form IDs to display
          </p>
        </div>
        <div className='max-h-[360px] overflow-y-auto p-2'>
          <div className='flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent'>
            <div className='flex items-center space-x-2.5'>
              <Checkbox
                id='all-form-ids'
                checked={tempSelectedFormIds.length === uniqueFormIds.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setTempSelectedFormIds(uniqueFormIds);
                  } else {
                    setTempSelectedFormIds([]);
                  }
                }}
                className='size-3.5'
                checkIconClassName='h-3 w-3'
              />
              <label
                htmlFor='all-form-ids'
                className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                All Form IDs
              </label>
            </div>
            <span className='text-xs text-muted-foreground'>
              ({Object.values(formIdCounts).reduce((a, b) => a + b, 0)})
            </span>
          </div>

          {uniqueFormIds.map((formId) => {
            const formIdCount = formIdCounts[formId] || 0;
            return (
              <div
                key={formId}
                className='flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent'
              >
                <div className='flex items-center space-x-2.5'>
                  <Checkbox
                    id={formId}
                    checked={tempSelectedFormIds.includes(formId)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTempSelectedFormIds([
                          ...tempSelectedFormIds,
                          formId,
                        ]);
                      } else {
                        setTempSelectedFormIds(
                          tempSelectedFormIds.filter((f) => f !== formId)
                        );
                      }
                    }}
                    className='size-3.5'
                    checkIconClassName='h-3 w-3'
                  />
                  <label
                    htmlFor={formId}
                    className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {formId}
                  </label>
                </div>
                <span className='text-xs text-muted-foreground'>
                  ({formIdCount})
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
