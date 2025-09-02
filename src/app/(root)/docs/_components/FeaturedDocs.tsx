import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FileText } from 'lucide-react';
import Link from 'next/link';
import { getDocsByCategorySubcategory } from '../categories/[...categorySlug]/_services/services';
import DocsCard from './DocsCard';

const FeaturedDocs = async () => {
  const allFeaturedDocs = await getDocsByCategorySubcategory({
    isFeatured: true,
    isHomepage: true,
    limit: 3,
  });

  const featuredDocs = allFeaturedDocs.data || [];

  return (
    <section className='py-8 sm:py-12 lg:py-16'>
      <div>
        <div className='mb-6 text-center'>
          <h2 className='mb-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl xl:leading-snug'>
            <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              {' '}
              Featured{' '}
            </span>
            Documentation
          </h2>
          <p className='mx-auto max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm'>
            Discover our most popular and essential guides to get you started
            quickly
          </p>
        </div>

        {featuredDocs.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:gap-10'>
            {featuredDocs.map((doc, idx) => (
              <div
                key={doc._id}
                className={`
        ${idx > 1 ? 'hidden lg:block' : ''} 
      `}
              >
                <DocsCard doc={doc} />
              </div>
            ))}
          </div>
        ) : (
          <Card className='mx-auto w-full max-w-3xl'>
            <CardContent className='flex flex-col items-center p-8 text-center'>
              <FileText className='mb-4 h-12 w-12 text-gray-400' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                No Documentation Available
              </h3>
              <p className='text-sm text-gray-500'>
                Documentation is not currently available. We are working on
                adding content for <strong>Featured Documents</strong>. Please
                check back later.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <div className='mt-12 flex justify-center'>
        {' '}
        <Button
          variant={'outline'}
          className='mx-auto max-w-80 bg-primary text-white hover:bg-blue-900 hover:text-white'
        >
          <Link
            href='/docs/categories/all/featured'
            className='flex items-center justify-center'
          >
            <BookOpen className='mr-2 h-4 w-4' />
            Explore more Featured docs
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedDocs;
