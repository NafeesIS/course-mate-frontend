'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import ManageCategoriesPage from '../manage-category/page';
import ManageSubcategoriesPage from '../manage-subcategory/page';
import ManageTagsPage from '../manage-tags/page';

const MANAGES = [
  { key: 'categories', label: 'Categories', component: ManageCategoriesPage },
  {
    key: 'subcategories',
    label: 'Subcategories',
    component: ManageSubcategoriesPage,
  },
  { key: 'tags', label: 'Tags', component: ManageTagsPage },
] as const;

type ManageKey = (typeof MANAGES)[number]['key'];
const STORAGE_KEY = 'admin.selectedTaxonomy';

export default function TagsCategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useRef(false);

  // 1) Safe initial state (no localStorage during render)
  const [manage, setManage] = useState<ManageKey>('categories');

  // 2) On mount, hydrate from ?manage= or localStorage
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const urlManage = searchParams?.get('manage');
    const lsManage =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

    const valid = (v: unknown): v is ManageKey =>
      MANAGES.some((x) => x.key === v);
    const initial = valid(urlManage)
      ? (urlManage as ManageKey)
      : valid(lsManage)
        ? (lsManage as ManageKey)
        : 'categories';

    setManage(initial);
    // ensure URL reflects the resolved initial manage without pushing history
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('manage', initial);
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) Persist changes to LS + URL
  useEffect(() => {
    if (!mounted.current) return; // skip first render until hydrated
    try {
      localStorage.setItem(STORAGE_KEY, manage);
    } catch {
      /* ignore quota or private mode */
    }
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('manage', manage);
    router.replace(`?${params.toString()}`);
  }, [manage, router, searchParams]);

  const ActiveComponent = useMemo(
    () =>
      MANAGES.find((v) => v.key === manage)?.component ?? ManageCategoriesPage,
    [manage]
  );

  return (
    <div>
      {/* Sticky toolbar */}
      <div className='sticky top-0 z-10 mb-4 rounded-2xl border bg-white/90 shadow-sm backdrop-blur-sm'>
        <div className='flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between md:p-4'>
          <div className='flex items-center gap-3'>
            <span className='text-xl font-semibold md:text-2xl'>Manage</span>

            {/* md+: segmented tabs */}
            <div
              role='tablist'
              aria-label='Choose taxonomy manage'
              className='hidden rounded-xl border p-1 shadow-sm md:flex'
            >
              {MANAGES.map((v) => (
                <button
                  key={v.key}
                  role='tab'
                  aria-selected={manage === v.key}
                  onClick={() => setManage(v.key)}
                  className={[
                    'rounded-lg px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-black/10',
                    manage === v.key
                      ? 'bg-primary text-white'
                      : 'bg-white hover:bg-gray-50',
                  ].join(' ')}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* sm: compact select */}
            <label className='md:hidden'>
              <span className='sr-only'>Select taxonomy manage</span>
              <select
                value={manage}
                onChange={(e) => setManage(e.target.value as ManageKey)}
                className='rounded-xl border bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10'
                aria-label='Select which table to show'
              >
                {MANAGES.map((v) => (
                  <option key={v.key} value={v.key}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Content */}

      <ActiveComponent />
    </div>
  );
}
