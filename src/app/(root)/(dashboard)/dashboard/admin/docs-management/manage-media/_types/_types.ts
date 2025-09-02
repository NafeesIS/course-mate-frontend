export type ImageItem = {
  name: string;
  url: string;
  size: number;
  contentType?: string;
  lastModified: string | number | Date;
};

export type ImageGalleryProps = {
  items: ImageItem[];
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onUpdate?: (item: ImageItem) => void; // wire dialog later
  // eslint-disable-next-line no-unused-vars
  onDelete?: (item: ImageItem) => void; // wire dialog later
  emptyHint?: React.ReactNode;
};

// Types that match the GET /media response
export type MediaListItem = {
  name: string;
  url: string;
  size?: number;
  contentType?: string;
  lastModified?: string;
};

export type MediaListResponse = {
  items: MediaListItem[];
  continuationToken: string | null;
};

export type GetMediaParams = {
  prefix?: string;
  pageSize?: number;
  continuationToken?: string | null;
  sas?: boolean;
  sasTtl?: number; // minutes
};
