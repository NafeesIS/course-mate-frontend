import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RiEqualizerLine } from 'react-icons/ri';

const ColumnVisibilitySelector = ({ table }: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center gap-1 rounded border bg-transparent p-2 text-foreground transition-all hover:border-muted-foreground'>
        <RiEqualizerLine className='rotate-90' title='Columns' /> Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent className='absolute right-0 z-50 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-card shadow-lg ring-1 ring-black/5 focus:outline-none'>
        <div className='space-y-1 p-2 pt-0'>
          <span className='pointer-events-none -mx-2 block bg-muted py-1 text-center text-xs text-foreground'>
            Select columns to show
          </span>
          {table
            .getAllColumns()
            .filter((column: any) => column.getCanHide())
            .map((column: any) => (
              <DropdownMenuItem key={column.id}>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={column.getIsVisible()}
                    onChange={(value) =>
                      column.toggleVisibility(value.target.checked)
                    }
                  />
                  {column.columnDef.name}
                </label>
              </DropdownMenuItem>
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnVisibilitySelector;
