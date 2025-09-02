'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';

interface DocsPerPageSelectorProps {
  currentPerPage: number;
  categorySlug: string;
  subcategorySlug?: string;
  isFeatured: boolean;
}

export default function PerPageDocs({
  currentPerPage,
  categorySlug,
  subcategorySlug,
  isFeatured,
}: DocsPerPageSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const perPageOptions = [
    { value: 6, label: '6 per page' },
    { value: 12, label: '12 per page' },
    { value: 24, label: '24 per page' },
    { value: 48, label: '48 per page' },
  ];

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('perPage', value);
    let newUrl = '';

    if (subcategorySlug) {
      newUrl = isFeatured
        ? `/docs/categories/${categorySlug}/${subcategorySlug}/featured?${params.toString()}`
        : `/docs/categories/${categorySlug}/${subcategorySlug}?${params.toString()}`;
    } else {
      newUrl = isFeatured
        ? `/docs/categories/${categorySlug}/featured?${params.toString()}`
        : `/docs/categories/${categorySlug}?${params.toString()}`;
    }
    router.push(newUrl);
  };

  return (
    <div className='flex w-full items-center gap-2 lg:w-auto'>
      <label className='text-xs font-semibold text-slate-600 md:text-sm'>
        Show:
      </label>
      <Select value={currentPerPage.toString()} onValueChange={handleChange}>
        <SelectTrigger className='h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border focus:outline-none focus:ring-0 lg:w-40'>
          <SelectValue placeholder='Select per page' />
        </SelectTrigger>
        <SelectContent>
          {perPageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
