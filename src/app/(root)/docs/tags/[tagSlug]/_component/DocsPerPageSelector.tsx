'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface DocsPerPageSelectorProps {
  currentPerPage: number;
  tagSlug: string;
}

export default function DocsPerPageSelector({
  currentPerPage,
  tagSlug,
}: DocsPerPageSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const perPageOptions = [
    { value: 6, label: '6 per page' },
    { value: 12, label: '12 per page' },
    { value: 24, label: '24 per page' },
    { value: 48, label: '48 per page' },
  ];

  const handlePerPageChange = (newPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 when changing per page
    params.set('page', '1');
    params.set('perPage', newPerPage.toString());

    const newUrl = `/docs/tags/${tagSlug}?${params.toString()}`;
    router.push(newUrl);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentOption = perPageOptions.find(
    (option) => option.value === currentPerPage
  );

  return (
    <div className='flex w-full items-center gap-2 lg:w-auto'>
      <label
        htmlFor='perPage'
        className='text-sm font-semibold text-slate-600 md:text-base'
      >
        Show:
      </label>

      {/* Custom Dropdown */}
      <div className='relative w-full lg:w-40' ref={dropdownRef}>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='flex h-10 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500'
        >
          <span>{currentOption?.label || `${currentPerPage} per page`}</span>
          <ChevronDown
            className={`ml-2 h-4 w-4 text-slate-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className='absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg'>
            {perPageOptions.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => handlePerPageChange(option.value)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-slate-50 focus:bg-slate-50 focus:outline-none ${
                  option.value === currentPerPage
                    ? 'bg-slate-100 font-medium text-slate-900'
                    : 'text-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
