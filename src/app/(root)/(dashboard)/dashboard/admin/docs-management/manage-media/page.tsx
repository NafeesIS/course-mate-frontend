'use client';

import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import ImageGallery from './_components/ImageGallery';
import PaginationControls from './_components/PaginationControls';
import { getMedia } from './_services/service';
import { ImageItem, MediaListResponse } from './_types/_types';

const MediaContent = () => {
  const pageSize = 12;
  const sas = true; // set false if your container is public
  const sasTtl = 15; // minutes
  const prefix = undefined as string | undefined;

  // tokenHistory[0] is always null = first page
  const [tokenHistory, setTokenHistory] = useState<(string | null)[]>([null]);
  const currentToken = tokenHistory[tokenHistory.length - 1] ?? null;

  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<MediaListResponse>({
      queryKey: [
        'media',
        { pageSize, sas, sasTtl, prefix, continuationToken: currentToken },
      ],
      queryFn: async () => {
        return getMedia({
          pageSize,
          sas,
          sasTtl,
          prefix,
          continuationToken: currentToken,
        });
      },
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    });

  const items: ImageItem[] = useMemo(
    () =>
      (data?.items ?? []).map((i) => ({
        name: i.name,
        url: i.url,
        size: i.size ?? 0,
        contentType: i.contentType,
        lastModified: i.lastModified ?? '',
      })),
    [data]
  );

  // Next = push the server-provided continuationToken and refetch
  const handleNext = () => {
    if (!data?.continuationToken) return;
    setTokenHistory((prev) => [...prev, data.continuationToken]);
  };

  // Prev = pop one (but never pop the initial null)
  const handlePrev = () => {
    setTokenHistory((prev) =>
      prev.length > 1 ? prev.slice(0, prev.length - 1) : prev
    );
  };

  const handleRefreshAll = () => {
    // Reset to first page and refetch fresh
    setTokenHistory([null]);
    refetch();
  };

  // Placeholder callbacks – wire dialogs later
  const handleUpdate = (item: ImageItem) => {
    console.log('Update clicked', item);
    // TODO: open update dialog, then on success: refetch();
  };

  const handleDelete = (item: ImageItem) => {
    console.log('Delete clicked', item);
    // TODO: open confirm dialog, perform delete, then refetch();
  };

  if (isLoading && !data) {
    return (
      <div className='space-y-4'>
        <h1 className='text-xl font-semibold'>Manage Media</h1>
        <div className='rounded-2xl border p-6 text-sm text-muted-foreground'>
          Loading media…
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='space-y-4'>
        <h1 className='text-xl font-semibold'>Manage Media</h1>
        <div className='rounded-2xl border p-6 text-sm text-red-600'>
          Failed to load media. Try again.
        </div>
      </div>
    );
  }

  const pageIndex = tokenHistory.length; // 1-based
  const hasPrev = tokenHistory.length > 1;
  const hasNext = Boolean(data?.continuationToken); // server says there’s another page

  return (
    <Card className='space-y-4 p-4 md:p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Manage Media</h1>
        <button
          onClick={handleRefreshAll}
          className='inline-flex items-center rounded-xl border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50'
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {items && (
        <>
          <ImageGallery
            items={items}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            emptyHint={
              <span className='text-sm text-muted-foreground'>
                No images yet.
              </span>
            }
          />

          {/* Pagination lives right under the gallery */}
          <PaginationControls
            pageIndex={pageIndex}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrev={handlePrev}
            onNext={handleNext}
            className='pt-2'
          />
        </>
      )}
    </Card>
  );
};

export default MediaContent;
