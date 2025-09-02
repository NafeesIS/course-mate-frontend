import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

interface ColumnFilterProps<TData> {
  table: Table<TData>;
}

export function ColumnFilter<TData>({ table }: ColumnFilterProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          title='Columns'
          size='icon'
          className='h-9 flex-shrink-0 shadow-sm hover:bg-sky-100'
        >
          <Settings2 className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='ml-4 w-[280px] sm:w-60'>
        <div className='border-b p-3'>
          <h4 className='text-xs font-medium'>Customize Columns</h4>
          <p className='mt-1 text-[10px] text-muted-foreground'>
            Select columns to display
          </p>
        </div>
        <div className='max-h-[300px] overflow-y-auto p-2'>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='py-2 text-xs font-medium capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
