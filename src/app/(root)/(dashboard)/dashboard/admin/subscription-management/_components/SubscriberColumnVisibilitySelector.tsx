'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { RiEqualizerLine } from 'react-icons/ri';

// Extend the ColumnMeta type to include our custom properties
declare module '@tanstack/react-table' {
  // eslint-disable-next-line no-unused-vars
  interface ColumnMeta<TData, TValue> {
    isVisible?: boolean;
    name?: string;
  }
}

interface SubscriberColumnVisibilitySelectorProps<T> {
  table: Table<T>;
}

const SubscriberColumnVisibilitySelector = <T,>({
  table,
}: SubscriberColumnVisibilitySelectorProps<T>) => {
  const [open, setOpen] = useState(false);

  // Track temporary visibility state without updating the table directly
  const [tempVisibility, setTempVisibility] = useState<Record<string, boolean>>(
    () => {
      return table.getAllColumns().reduce(
        (acc, column) => {
          // Use `meta` to get the initial visibility state
          const isVisible =
            column.columnDef.meta?.isVisible ?? column.getIsVisible();
          acc[column.id] = isVisible;
          return acc;
        },
        {} as Record<string, boolean>
      );
    }
  );

  // Apply visibility changes to the table when `tempVisibility` changes
  useEffect(() => {
    if (!open) {
      table.getAllColumns().forEach((column) => {
        if (column.getCanHide()) {
          column.toggleVisibility(tempVisibility[column.id]);
        }
      });
    }
  }, [tempVisibility, open, table]);

  const handleCheckboxChange = (columnId: string, isVisible: boolean) => {
    setTempVisibility((prev) => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };

  const handleApply = () => {
    setOpen(false); // Close the dropdown after applying changes
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className='flex items-center gap-1 rounded-md border bg-transparent px-2 py-1.5 text-sm text-foreground transition-all hover:border-muted-foreground'>
        <RiEqualizerLine className='rotate-90' title='Columns' /> Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent className='absolute -right-52 z-50 mt-1 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-card text-xs shadow-lg ring-1 ring-black/5 focus:outline-none'>
        <div className='space-y-1 p-2 pt-0'>
          <span className='pointer-events-none -mx-2 block bg-muted py-1 text-center text-xs text-foreground'>
            Select columns to show
          </span>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuItem
                key={column.id}
                onSelect={(e) => e.preventDefault()}
                className='py-1'
              >
                <label className='flex items-center gap-2 text-xs capitalize'>
                  <input
                    type='checkbox'
                    checked={tempVisibility[column.id]}
                    onChange={(e) =>
                      handleCheckboxChange(column.id, e.target.checked)
                    }
                  />
                  {column.columnDef.meta?.name || column.id}
                </label>
              </DropdownMenuItem>
            ))}
          <button
            onClick={handleApply}
            className='mt-2 w-full rounded bg-primary p-2 text-center text-white'
          >
            Apply
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubscriberColumnVisibilitySelector;
