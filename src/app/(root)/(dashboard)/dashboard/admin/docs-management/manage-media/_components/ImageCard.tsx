import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { Edit, ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ImageItem } from '../_types/_types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function ImageCard({
  item,
  onUpdate,
  onDelete,
}: {
  item: ImageItem;
  // eslint-disable-next-line no-unused-vars
  onUpdate?: (item: ImageItem) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (item: ImageItem) => void;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <Card className='rounded-lg shadow-sm'>
      <div className='relative h-40 w-full rounded-t-lg bg-muted'>
        {errored ? (
          <div className='flex h-full items-center justify-center text-muted-foreground'>
            <ImageIcon className='h-8 w-8' />
          </div>
        ) : (
          <Image
            src={item.url}
            alt={item.name}
            width={400}
            height={300}
            priority
            className='h-full w-full rounded-t-lg object-cover'
            onError={() => setErrored(true)}
          />
        )}
      </div>

      <CardContent className='p-3'>
        <div className='truncate text-base font-medium md:text-sm'>
          {item.name}
        </div>
        <div className='text-xs text-muted-foreground'>
          {item.contentType ?? 'unknown'} · {formatBytes(item.size)}
        </div>
      </CardContent>

      <CardFooter className='flex justify-between px-3 pb-3 text-xs text-muted-foreground'>
        <span>{format(item?.lastModified, 'dd-MMM-yyyy')}</span>
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='secondary'
            className='h-7'
            onClick={() => onUpdate?.(item)}
          >
            <Edit className='h-3 w-3' />
          </Button>
          <Button
            size='sm'
            variant='destructive'
            className='h-7'
            onClick={() => onDelete?.(item)}
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ImageCard;
