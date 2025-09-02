'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ICategory } from '../../../_types/types';

interface MobileCategoryDropdownProps {
  categories: ICategory[];
  currentCategorySlug: string;
}

export default function MobileCategoryDropdown({
  categories,
  currentCategorySlug,
}: MobileCategoryDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Move getId function into the client component
  const getId = (id: any): string =>
    typeof id === 'string' ? id : id?.$oid ?? '';

  const currentCategory = categories.find(
    (category) => category.slug === currentCategorySlug
  );
  const currentCategoryName =
    currentCategorySlug === 'all'
      ? 'All Categories'
      : currentCategory?.name || currentCategorySlug;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className='sticky top-0 z-40 border-b border-slate-200 bg-white py-3'>
        <div className='flex items-center justify-between'>
          {/* Current Category Dropdown */}
          <div className='relative w-full'>
            <button
              onClick={toggleDropdown}
              className='flex w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-primary hover:bg-blue-100'
            >
              <span className='w-full truncate'>
                {currentCategorySlug === 'all' ? '📋' : '🏷️'}{' '}
                {currentCategoryName}
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
                  href='/docs/categories/all?page=1'
                  onClick={() => setIsDropdownOpen(false)}
                  className={`block px-4 py-2 text-sm no-underline transition-colors ${
                    currentCategorySlug === 'all'
                      ? 'bg-blue-50 font-semibold text-primary'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  📋 All Categories
                </Link>
                {categories.map((category) => (
                  <Link
                    key={getId(category._id)}
                    href={`/docs/categories/${category.slug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm no-underline transition-colors ${
                      currentCategorySlug === category.slug
                        ? 'bg-blue-50 font-semibold text-primary'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🏷️ {category.name}
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
