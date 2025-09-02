import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { AnimatedDiv } from '../../../_components/AnimatedDiv';
import { Doc } from '../../../_types/types';

interface DocHeaderProps {
  docData: Doc;
}

const DocHeader = ({ docData }: DocHeaderProps) => {
  return (
    <AnimatedDiv
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Breadcrumb Navigation */}
      <nav
        className='sticky top-14 z-20 mb-6 border-b bg-white px-1 pb-4 pt-4 text-sm text-gray-600'
        aria-label='Breadcrumb'
      >
        <ol className='flex flex-wrap items-center gap-1 text-xs md:text-sm'>
          <li>
            <Link
              href={'/docs'}
              className='flex items-center hover:text-gray-900'
            >
              <Home className='mr-1 h-4 w-4' />
              <span className='hidden sm:inline'>Documentation</span>
            </Link>
          </li>
          <ChevronRight className='mx-2 h-4 w-4 text-gray-300' />
          <li>
            <Link
              href={`/docs/categories/${docData.categoryId.slug}`}
              className='hover:text-gray-900'
            >
              <span className='inline'>{docData.categoryId.name}</span>
            </Link>
          </li>
          {docData.subcategoryId && (
            <ChevronRight className='mx-2 h-4 w-4 text-gray-300' />
          )}

          {docData.subcategoryId && (
            <li>
              <Link
                href={`/docs/categories/${docData.categoryId.slug}/${docData.subcategoryId.slug}`}
                className='hover:text-gray-900'
              >
                <span className='inline'>{docData.subcategoryId.name}</span>
              </Link>
            </li>
          )}
          <ChevronRight className='mx-2 h-4 w-4 text-gray-300' />
          <li className='truncate font-semibold text-gray-900'>
            {docData.title}
          </li>
        </ol>
      </nav>

      {/* Author & Metadata */}
    </AnimatedDiv>
  );
};

export default DocHeader;
