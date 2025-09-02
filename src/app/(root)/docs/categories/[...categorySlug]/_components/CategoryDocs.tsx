import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BiCategoryAlt, BiSolidCategoryAlt } from 'react-icons/bi';
import { IoPricetag, IoPricetagOutline } from 'react-icons/io5';
import { LuListTodo } from 'react-icons/lu';
import DocsCard from '../../../_components/DocsCard';
import DocsPagination from '../../../_components/DocsPagination';
import SearchBarWithPopularSearch from '../../../_components/SearchBarWithPopularSearch';
import { Doc, ICategory, ISubcategory } from '../../../_types/types';
import FeaturedToggle from './FeaturedToggle';
import MobileCategoryDropdown from './MobileCategoryDropdown';
import PerPageDocs from './PerPageDocs';

const validatePage = (pageParam: string | undefined): number => {
  const page = parseInt(pageParam || '1', 10);
  return isNaN(page) || page < 1 ? 1 : page;
};
const validatePerPage = (perPageParam: string | undefined): number => {
  const perPage = parseInt(perPageParam || '6', 10);
  const validOptions = [6, 12, 24, 48];
  return validOptions.includes(perPage) ? perPage : 6;
};

export default function CategoryDocs({
  params,
  searchParams,
  categories,
  subcategories,
  docs,
  paginationData,
  isFeatured,
}: {
  params: { categorySlug: string };
  searchParams: { page?: string; perPage?: string };
  categories: ICategory[];
  subcategories?: ISubcategory[];
  docs: Doc[];
  paginationData: any;
  isFeatured: boolean;
}) {
  const slugArray = params.categorySlug; // array
  const categorySlug = slugArray?.[0] || 'all';
  const subcategorySlug =
    slugArray?.[1] !== 'featured' ? slugArray?.[1] : undefined;
  const docsPerPage = parseInt(searchParams.perPage || '6', 10);
  const requestedPage = validatePage(searchParams.page);
  const requestedPerPage = validatePerPage(searchParams.perPage);
  const needsRedirect =
    (searchParams.page && requestedPage.toString() !== searchParams.page) ||
    (searchParams.perPage &&
      requestedPerPage.toString() !== searchParams.perPage);
  if (needsRedirect) {
    const params = new URLSearchParams();
    params.set('page', requestedPage.toString());
    if (requestedPerPage !== 6) {
      params.set('perPage', requestedPerPage.toString());
    }
    redirect(`/docs/categories/${categorySlug}?${params.toString()}`);
  }

  const getId = (id: any): string =>
    typeof id === 'string' ? id : id?.$oid ?? '';

  const currentCategory = categories.find(
    (category) => category.slug === categorySlug
  );
  let subcategoryName = '';
  const currentCategoryName =
    categorySlug === 'all'
      ? 'All Documentations'
      : `${currentCategory?.name} Category` || `${categorySlug} Category`;
  let basePath = '';

  if (subcategorySlug) {
    basePath = isFeatured
      ? `/docs/categories/${categorySlug}/${subcategorySlug}/featured`
      : `/docs/categories/${categorySlug}/${subcategorySlug}`;
  } else {
    basePath = isFeatured
      ? `/docs/categories/${categorySlug}/featured`
      : `/docs/categories/${categorySlug}`;
  }

  // If category not found, show not found UI
  if (!currentCategory && categorySlug !== 'all') {
    return (
      <div className='mx-auto mt-20 max-w-96 rounded-xl border bg-white px-6 py-12 text-center shadow-sm md:mt-24 lg:px-8 lg:py-16'>
        <div className='mx-auto max-w-md'>
          <div className='mb-4 text-4xl'>📄</div>
          <p className='m-0 text-lg text-slate-500'>
            No documents found for this category.
          </p>
          <p className='mt-2 text-sm text-slate-400'>
            Try selecting a different category or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='wrapper'>
      {/* Mobile Category Sidebar - Hidden on desktop */}
      <div className='sticky top-14 z-20 md:hidden'>
        <MobileCategoryDropdown
          categories={categories}
          currentCategorySlug={categorySlug}
        />
      </div>

      <div className='flex items-start gap-6 py-4 lg:py-8'>
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className='sticky top-14 hidden max-h-[calc(100vh-4rem)] w-64 flex-none overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block xl:w-72'>
          <div className='p-3'>
            {/* All Categories Link */}
            <div>
              <Link
                href={
                  isFeatured
                    ? `/docs/categories/all/featured?page=1`
                    : `/docs/categories/all?page=1`
                }
                className='group relative block'
              >
                <div
                  className={`flex items-center rounded-lg px-4 py-2 text-xs font-semibold shadow transition-all duration-200 md:text-sm ${
                    categorySlug === 'all'
                      ? 'bg-blue-50 text-primary hover:bg-blue-100'
                      : 'text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LuListTodo className='mr-3 h-4 w-4' />
                  <span className='font-semibold'>All Categories</span>
                </div>
              </Link>
            </div>

            {/* Categories List */}
            <nav className='mt-4'>
              <ul className='space-y-1'>
                {categories.map((category) => {
                  const isActive = categorySlug === category.slug;
                  const hasSubcategories =
                    subcategories && subcategories.length > 0;
                  const showSubcategories = isActive && hasSubcategories;

                  return (
                    <li key={category._id}>
                      <Link
                        href={
                          isFeatured
                            ? `/docs/categories/${category.slug}/featured?page=1`
                            : `/docs/categories/${category.slug}?page=1`
                        }
                        title={category.name}
                        className='group relative block'
                      >
                        <div
                          className={`flex items-center justify-between rounded-lg px-4 py-2 text-xs transition-all duration-200 md:text-sm ${
                            isActive
                              ? `text-primary shadow-sm hover:bg-blue-100 ${subcategorySlug ? 'bg-transparent' : 'bg-blue-50'}`
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          <div className='flex items-center'>
                            {isActive ? (
                              <BiSolidCategoryAlt className='mr-3 h-4 w-4' />
                            ) : (
                              <BiCategoryAlt className='mr-3 h-4 w-4' />
                            )}
                            <span className='font-medium'>{category.name}</span>
                          </div>

                          {hasSubcategories && isActive ? (
                            <div
                              className={`transform transition-transform duration-200 ${
                                showSubcategories ? 'rotate-90' : 'rotate-0'
                              }`}
                            >
                              <ChevronRight className='h-4 w-4' />
                            </div>
                          ) : (
                            <ChevronRight className='h-4 w-4' />
                          )}
                        </div>
                      </Link>

                      {/* Subcategories */}

                      <div
                        className={`overflow-hidden duration-300 ${showSubcategories ? 'h-auto' : 'h-[0.5px]'}`}
                      >
                        <ul className='ml-3 mt-2 space-y-1 border-l border-slate-200 pl-1'>
                          {subcategories?.map((subcat) => {
                            const isSubActive = subcategorySlug === subcat.slug;
                            if (isSubActive) {
                              subcategoryName = subcat.name;
                            }

                            return (
                              <li key={subcat._id}>
                                <Link
                                  href={
                                    isFeatured
                                      ? `/docs/categories/${category.slug}/${subcat.slug}/featured?page=1`
                                      : `/docs/categories/${category.slug}/${subcat.slug}?page=1`
                                  }
                                  title={subcat.name}
                                  className='group relative block'
                                >
                                  <div
                                    className={`flex items-center justify-between whitespace-nowrap rounded-md px-2 py-2 text-xs transition-all duration-200 ${
                                      isSubActive
                                        ? 'bg-blue-50 font-medium text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                  >
                                    <span className='flex items-center gap-1'>
                                      {isSubActive ? (
                                        <IoPricetag className='mr-2 h-3 w-3' />
                                      ) : (
                                        <IoPricetagOutline className='mr-2 h-3 w-3' />
                                      )}
                                      <span>{subcat.name}</span>
                                    </span>
                                    <ChevronRight className='h-4 w-4' />
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className='min-w-0 flex-1'>
          {/* Header Section */}
          <div className='z-20 mb-6 rounded-xl border bg-white p-4 shadow-sm md:sticky md:top-14 lg:mb-8'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='flex items-center'>
                <h1 className='text-sm font-semibold text-slate-800 md:text-base xl:text-lg'>
                  {subcategoryName !== ''
                    ? `${subcategoryName} Subcategory`
                    : currentCategoryName}
                </h1>
                <p className='ml-1 text-base font-bold text-slate-500 lg:text-lg'>
                  ({paginationData?.total})
                </p>
              </div>

              <FeaturedToggle isFeatured={isFeatured} />
            </div>
            <div className='mt-2 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
              <div className='mr-auto w-full max-w-2xl'>
                <SearchBarWithPopularSearch showPopularTags={false} />
              </div>
              {/* Docs Per Page Selector */}
              <PerPageDocs
                currentPerPage={docsPerPage}
                categorySlug={categorySlug}
                isFeatured={isFeatured}
                subcategorySlug={subcategorySlug}
              />
            </div>
          </div>

          {/* Docs Grid */}
          {docs.length === 0 ? (
            <div className='mb-8 rounded-xl border bg-white px-6 py-12 text-center shadow-sm lg:px-8 lg:py-16'>
              <div className='mx-auto max-w-md'>
                <div className='mb-4 text-4xl'>📄</div>
                <p className='m-0 text-lg text-slate-500'>
                  No documents found for this category.
                </p>
                <p className='mt-2 text-sm text-slate-400'>
                  Try selecting a different category or check back later.
                </p>
              </div>
            </div>
          ) : (
            <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:mb-12 lg:grid-cols-2 lg:gap-6'>
              {docs.map((doc) => (
                <DocsCard
                  // key={`${getId(doc._id)}-${Math.random()}-${doc.subcategoryId.name ? doc.subcategoryId.name : doc.categoryId.name}`}
                  key={getId(doc._id)}
                  doc={doc}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {paginationData && (
            <DocsPagination
              meta={paginationData}
              basePath={basePath}
              currentPerPage={docsPerPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
