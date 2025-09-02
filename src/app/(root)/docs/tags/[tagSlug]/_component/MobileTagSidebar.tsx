'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Tag {
  _id: any;
  name: string;
  slug: string;
}

interface MobileTagSidebarProps {
  tags: Tag[];
  currentTagSlug: string;
}

export default function MobileTagSidebar({
  tags,
  currentTagSlug,
}: MobileTagSidebarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Move getId function into the client component
  const getId = (id: any): string =>
    typeof id === 'string' ? id : id?.$oid ?? '';

  const currentTag = tags.find((tag) => tag.slug === currentTagSlug);
  const currentTagName =
    currentTagSlug === 'all' ? 'All Tags' : currentTag?.name || currentTagSlug;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className='sticky top-0 z-40 border-b border-slate-200 bg-white py-3'>
        <div className='flex items-center justify-between'>
          {/* Current Tag Dropdown */}
          <div className='relative w-full'>
            <button
              onClick={toggleDropdown}
              className='flex w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-primary hover:bg-blue-100'
            >
              <span className='w-full truncate'>
                {currentTagSlug === 'all' ? '📋' : '🏷️'} {currentTagName}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className='absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-200 bg-white py-2 shadow-lg'>
                <Link
                  href='/docs/tags/all?page=1'
                  onClick={() => setIsDropdownOpen(false)}
                  className={`block px-4 py-2 text-sm no-underline transition-colors ${
                    currentTagSlug === 'all'
                      ? 'bg-blue-50 font-semibold text-primary'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  📋 All Tags
                </Link>
                {tags.map((tag) => (
                  <Link
                    key={getId(tag._id)}
                    href={`/docs/tags/${tag.slug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm no-underline transition-colors ${
                      currentTagSlug === tag.slug
                        ? 'bg-blue-50 font-semibold text-primary'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🏷️ {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
