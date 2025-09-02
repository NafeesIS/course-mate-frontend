import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FileText } from 'lucide-react';
import Link from 'next/link';
import { getDocsByCategorySubcategory } from '../categories/[...categorySlug]/_services/services';
import DocsCard from './DocsCard';

const HelpDocs = async () => {
  const HELP_CATEGORY_ID = '687df2029da08450ab8b8e60';

  const AllHelpDocs = await getDocsByCategorySubcategory({
    categoryId: HELP_CATEGORY_ID,
    isHomepage: true,
    limit: 3,
  });

  const helpDocs = (AllHelpDocs.data || []).slice(0, 3);

  return (
    <section className='py-8 sm:py-12 lg:py-16'>
      <div>
        <div className='mb-6 text-center'>
          <h2 className='mb-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl xl:leading-snug'>
            <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              {' '}
              Help{' '}
            </span>
            Documentation
          </h2>
          <p className='mx-auto max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm'>
            Get help with FileSure features, troubleshooting, and best practices
          </p>
        </div>

        {helpDocs.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:gap-10'>
            {helpDocs.map((doc, idx) => (
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
                Help Documentation is not currently available. We are working on
                adding <strong>Help Documentation</strong>. Please check back
                later.
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
            href='/docs/categories/help-documentation'
            className='flex items-center justify-center'
          >
            <BookOpen className='mr-2 h-4 w-4' />
            Explore more Help docs
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default HelpDocs;
