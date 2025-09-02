import Link from 'next/link';
import { redirect } from 'next/navigation';
import DocsCard from '../../../_components/DocsCard';
import DocsPagination from '../../../_components/DocsPagination';
import SearchBarWithPopularSearch from '../../../_components/SearchBarWithPopularSearch';
import { Doc, ITag } from '../../../_types/types';
import DocsPerPageSelector from './DocsPerPageSelector';
import MobileTagSidebar from './MobileTagSidebar';

const validatePage = (pageParam: string | undefined): number => {
  const page = parseInt(pageParam || '1', 10);
  return isNaN(page) || page < 1 ? 1 : page;
};
const validatePerPage = (perPageParam: string | undefined): number => {
  const perPage = parseInt(perPageParam || '6', 10);
  const validOptions = [6, 6, 12, 24, 48];
  return validOptions.includes(perPage) ? perPage : 6;
};

export default function TagDocsPage({
  params,
  searchParams,
  tags,
  docs,
  paginationData,
}: {
  params: { tagSlug: string };
  searchParams: { page?: string; perPage?: string };
  tags: ITag[];
  docs: Doc[];
  paginationData: any;
}) {
  const { tagSlug } = params;
  //   const currentPage = parseInt(searchParams.page || '1', 10);
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
    redirect(`/docs/tags/${tagSlug}?${params.toString()}`);
  }

  const getId = (id: any): string =>
    typeof id === 'string' ? id : id?.$oid ?? '';

  const currentTag = tags.find((tag) => tag.slug === tagSlug);
  const currentTagName =
    tagSlug === 'all'
      ? 'All Tags'
      : `${currentTag?.name} Tag` || `${tagSlug} Tag`;

  return (
    <div className='wrapper'>
      {/* Mobile Tag Sidebar - Hidden on desktop */}
      <div className='sticky top-14 z-20 md:hidden'>
        <MobileTagSidebar tags={tags} currentTagSlug={tagSlug} />
      </div>

      <div className='flex items-start gap-6 py-4 lg:py-8'>
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className='sticky top-14 hidden max-h-[calc(100vh-4rem)] w-64 flex-none overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:block xl:w-72'>
          <Link
            href='/docs/tags/all?page=1'
            scroll={true}
            title='All Tags'
            className={`flex items-center rounded-lg px-4 py-2 text-xs font-medium shadow transition-all duration-200 md:text-sm ${
              tagSlug === 'all'
                ? 'bg-blue-50 text-primary hover:bg-blue-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            📋 All Tags
          </Link>
          <ul className='mt-2 flex list-none flex-col gap-1 p-0'>
            {tags.map((tag) => (
              <li key={getId(tag._id)}>
                <Link
                  href={`/docs/tags/${tag.slug}?page=1`}
                  scroll={true}
                  title={tag.name}
                  className={`block rounded-lg px-4 py-2 text-xs no-underline transition-all duration-200 md:text-sm ${
                    tagSlug === tag.slug
                      ? 'bg-blue-50 font-medium text-primary shadow-sm hover:bg-blue-100'
                      : 'font-normal text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <span className='font-medium'> 🏷️ {tag.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className='min-w-0 flex-1'>
          {/* Header Section */}
          <div className='z-20 mb-6 rounded-xl border bg-white p-4 shadow-sm md:sticky md:top-14 lg:mb-8'>
            <div className='mb-2 flex items-center gap-1'>
              <h1 className='text-sm font-semibold text-slate-800 md:text-base xl:text-lg'>
                {currentTagName} Documentation
              </h1>
              <p className='m-0 text-base font-bold text-slate-500 lg:text-lg'>
                {/* {paginationData?.total === 1
                  ? '1 document found'
                  : `${paginationData?.total || 0} documents found`} */}
                ({paginationData?.total})
              </p>
            </div>
            <div className='flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
              <div className='mr-auto w-full max-w-2xl'>
                <SearchBarWithPopularSearch showPopularTags={false} />
              </div>
              {/* Docs Per Page Selector */}
              <DocsPerPageSelector
                currentPerPage={docsPerPage}
                tagSlug={tagSlug}
              />
            </div>
          </div>

          {/* Docs Grid */}
          {docs.length === 0 ? (
            <div className='mb-8 rounded-xl border bg-white px-6 py-12 text-center shadow-sm lg:px-8 lg:py-16'>
              <div className='mx-auto max-w-md'>
                <div className='mb-4 text-4xl'>📄</div>
                <p className='m-0 text-lg text-slate-500'>
                  No documents found for this tag.
                </p>
                <p className='mt-2 text-sm text-slate-400'>
                  Try selecting a different tag or check back later.
                </p>
              </div>
            </div>
          ) : (
            <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:mb-12 lg:grid-cols-2 lg:gap-6'>
              {docs.map((doc) => (
                <DocsCard key={getId(doc._id)} doc={doc} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {paginationData && (
            <DocsPagination
              meta={paginationData}
              basePath={`/docs/tags/${tagSlug}`}
              currentPerPage={docsPerPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
