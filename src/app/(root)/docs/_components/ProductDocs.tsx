'use client';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useProductDocs from '../_hooks/useProductDocs';
import useSubcategories from '../_hooks/useSubcategories';
import { ISubcategory } from '../_types/types';
import { AnimatedDiv } from './AnimatedDiv';
import DocsCard from './DocsCard';

const ProductDocs = () => {
  const [selectedCategory, setSelectedCategory] = useState<ISubcategory | null>(
    null
  );

  // Filter out help documentation from product categories
  const OUR_PRODUCT_CATEGORY_ID = '687df2029da08450ab8b8e61';

  const {
    allSubcategories,
    refetch: refetchCategories,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
    error: categoriesError,
  } = useSubcategories({ categoryId: OUR_PRODUCT_CATEGORY_ID });

  const {
    productDocs,
    refetch: refetchDocs,
    isLoading: docsLoading,
    isFetching: docsFetching,
    error: docsError,
  } = useProductDocs({
    subcategoryId: selectedCategory?._id || '',
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };
  const filteredSubcategories = allSubcategories
    .filter((subcategory: ISubcategory) => subcategory.isHomepage)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  useEffect(() => {
    if (filteredSubcategories.length > 0 && !selectedCategory) {
      setSelectedCategory(filteredSubcategories[0]);
    }
  }, [filteredSubcategories, selectedCategory]);

  if (categoriesLoading) return <LoadingWithSpinner />;

  if (categoriesError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex min-h-[400px] items-center justify-center'
      >
        <div className='rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-sm'>
          <div className='mb-4 text-red-500'>
            <svg
              className='mx-auto h-12 w-12'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
              />
            </svg>
          </div>
          <p className='mb-6 text-sm font-medium text-red-700'>
            {categoriesError.message}
          </p>
          <button
            onClick={() => refetchCategories()}
            disabled={categoriesFetching}
            className='rounded-xl bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg disabled:opacity-50'
          >
            {categoriesFetching ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <section className='relative overflow-hidden py-20'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-[0.02]'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className=' relative '>
        {/* Enhanced Header */}
        <AnimatedDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-6 text-center'
        >
          <h2 className='mb-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl xl:leading-snug'>
            Our
            <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              {' '}
              Product{' '}
            </span>
            Documentation
          </h2>
          <p className='mx-auto max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm'>
            Explore in-depth documentation for our products and services,
            designed to help you succeed.
          </p>
        </AnimatedDiv>

        {/* Modern Category Tabs */}
        <AnimatedDiv
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='mb-12 flex justify-center'
        >
          <div className='no-scrollbar inline-flex overflow-x-auto rounded-2xl border border-white/20 bg-white/60 p-1.5 shadow-lg backdrop-blur-sm'>
            {filteredSubcategories.map(
              (category: ISubcategory, index: number) => (
                <motion.button
                  key={category._id}
                  variants={itemVariants}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-300 md:px-5 md:py-2.5 md:text-sm ${
                    selectedCategory?._id === category._id
                      ? 'text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type='button'
                >
                  {selectedCategory?._id === category._id && (
                    <motion.div
                      layoutId='activeTab'
                      className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600'
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className='relative z-10'>{category.name}</span>
                </motion.button>
              )
            )}
          </div>
        </AnimatedDiv>

        {/* Content Area */}
        <AnimatePresence mode='wait'>
          {docsLoading ? (
            <AnimatedDiv
              key='loading'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex min-h-[400px] items-center justify-center'
            >
              <LoadingWithSpinner />
            </AnimatedDiv>
          ) : docsError ? (
            <AnimatedDiv
              key='error'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className='flex min-h-[400px] items-center justify-center'
            >
              <div className='rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-sm'>
                <div className='mb-4 text-red-500'>
                  <svg
                    className='mx-auto h-12 w-12'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
                    />
                  </svg>
                </div>
                <p className='mb-6 text-sm font-medium text-red-700'>
                  {docsError.message}
                </p>
                <button
                  onClick={() => refetchDocs()}
                  disabled={docsFetching}
                  className='rounded-xl bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg disabled:opacity-50'
                >
                  {docsFetching ? 'Retrying...' : 'Try Again'}
                </button>
              </div>
            </AnimatedDiv>
          ) : productDocs.length > 0 ? (
            <AnimatedDiv
              key={`docs-${selectedCategory?._id}`}
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'
            >
              {productDocs.slice(0, 6).map((doc, index) => (
                <AnimatedDiv
                  key={doc._id}
                  variants={itemVariants}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <DocsCard doc={doc} />
                </AnimatedDiv>
              ))}
            </AnimatedDiv>
          ) : (
            <AnimatedDiv
              key='empty'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className='flex min-h-[400px] items-center justify-center'
            >
              <div className='text-center'>
                <div className='mb-6 text-slate-300'>
                  <svg
                    className='mx-auto h-20 w-20'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>
                <h3 className='mb-2 text-xl font-semibold text-slate-900'>
                  No documentation available
                </h3>
                <p className='text-slate-500'>
                  We are working on adding content for{' '}
                  <strong>{selectedCategory?.name}</strong>
                </p>
              </div>
            </AnimatedDiv>
          )}
        </AnimatePresence>

        {/* View More Section */}
        {productDocs.length > 6 && (
          <AnimatedDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className='mt-12 text-center'
          >
            <button
              className='group inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl'
              type='button'
            >
              View All {selectedCategory?.name} Docs
              <svg
                className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </svg>
            </button>
          </AnimatedDiv>
        )}
        <div className='mt-12 flex justify-center'>
          {' '}
          <Button
            variant={'outline'}
            className='mx-auto max-w-80 bg-primary text-white hover:bg-blue-900 hover:text-white'
          >
            <Link
              href='/docs/categories/our-products'
              className='flex items-center justify-center'
            >
              <BookOpen className='mr-2 h-4 w-4' />
              Explore Our Product Docs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductDocs;
