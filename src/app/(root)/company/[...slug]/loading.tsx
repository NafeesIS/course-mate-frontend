/**
 * A loading file can create instant loading states built on Suspense.
 * By default, this file is a Server Component - but can also be used as a Client Component through the "use client" directive.
 */

import { SearchResultsSkeleton } from '../../search/loading';

export default function Loading() {
  return (
    <div className='min-h-screen w-full'>
      <section className='wrapper mb-8 gap-8 space-y-8 overflow-hidden pt-8 md:pt-12'>
        <SearchResultsSkeleton />
      </section>
    </div>
  );
}
