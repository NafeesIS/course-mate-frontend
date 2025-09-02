import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowUpDown, ImageIcon, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ImageGalleryProps } from '../_types/_types';
import ImageCard from './ImageCard';

/**
 * ImageGallery
 *
 * Displays a responsive grid of image cards with search & sort controls,
 * plus Update and Delete buttons for each image (hooks provided via props).
 *
 * You can pass an array of items like:
 * {
 *   name: string;
 *   url: string;
 *   size?: number; // bytes
 *   contentType?: string;
 *   lastModified?: string | number | Date; // ISO or epoch
 * }
 */

export default function ImageGallery({
  items,
  className,
  onUpdate,
  onDelete,
  emptyHint,
}: ImageGalleryProps) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'size' | 'lastModified'>(
    'lastModified'
  );
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const data = q
      ? items.filter((it) =>
          [it.name, it.contentType]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(q)
        )
      : items.slice();

    data.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') {
        return a.name.localeCompare(b.name) * dir;
      }
      if (sortKey === 'size') {
        return ((a.size ?? 0) - (b.size ?? 0)) * dir;
      }
      // lastModified default
      const da = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const db = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return (da - db) * dir;
    });

    return data;
  }, [items, query, sortKey, sortDir]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className={'flex flex-col gap-4 ' + (className ?? '')}>
        {/* Toolbar */}
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div className='flex w-full items-center gap-2 md:w-auto'>
            <div className='relative w-full md:w-80'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60' />
              <Input
                placeholder='Search by name or type…'
                className='pl-9'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as any)}>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='lastModified'>Date</SelectItem>
                <SelectItem value='name'>Name</SelectItem>
                <SelectItem value='size'>Size</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              aria-label='Toggle sort order'
            >
              <ArrowUpDown className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border p-10 text-center'>
            <ImageIcon className='h-10 w-10 opacity-50' />
            <h3 className='mt-3 text-lg font-semibold'>No images found</h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              Try adjusting your search or upload new images.
            </p>
            {emptyHint && <div className='mt-4'>{emptyHint}</div>}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'>
            {filtered.map((item) => (
              <ImageCard
                key={item.url + item.name}
                item={item}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
