'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useTransition } from 'react';
import { Doc, ICategory } from '../_types/types';
import DocsCard from './DocsCard';

interface CategoryTabsProps {
  categories: ICategory[];
  initialDocs: Doc[];
  initialCategoryId: string;
  // eslint-disable-next-line no-unused-vars
  getDocsBySubcategory: (options: {
    subcategoryId: string;
    limit?: number;
  }) => Promise<Doc[]>;
}

const CategoryTabs = ({
  categories,
  initialDocs,
  initialCategoryId,
  getDocsBySubcategory,
}: CategoryTabsProps) => {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId);
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleTabClick = (categoryId: string) => {
    if (categoryId === selectedCategoryId) return;

    setSelectedCategoryId(categoryId);
    setError(null);

    // If it's the initial category, use initial docs
    if (categoryId === initialCategoryId) {
      setDocs(initialDocs);
      return;
    }

    // Fetch new docs for other categories
    startTransition(async () => {
      try {
        const newDocs = await getDocsBySubcategory({
          subcategoryId: categoryId,
          limit: 6,
        });
        setDocs(newDocs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch docs');
        setDocs([]);
      }
    });
  };

  const retryFetch = () => {
    handleTabClick(selectedCategoryId);
  };

  return (
    <>
      {/* Tab Navigation */}
      <div className='flex justify-center'>
        <div className='inline-flex items-center rounded-xl border border-white/20 bg-white/60 p-1 shadow-lg backdrop-blur-sm'>
          {categories.map((category) => {
            const isSelected = category._id === selectedCategoryId;

            return (
              <motion.button
                key={category._id}
                onClick={() => handleTabClick(category._id)}
                className={`
                  relative rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200
                  ${
                    isSelected
                      ? 'text-white'
                      : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                  }
                  ${isPending ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                `}
                whileHover={!isPending ? { scale: 1.02 } : {}}
                whileTap={!isPending ? { scale: 0.98 } : {}}
                disabled={isPending}
              >
                <span className='relative z-10'>{category.name}</span>

                {/* Animated background for selected state */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      layoutId='activeTab'
                      className='absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className='mt-8'>
        <AnimatePresence mode='wait'>
          {isPending ? (
            <motion.div
              key='loading'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='flex min-h-[300px] items-center justify-center'
            >
              <LoadingWithSpinner />
            </motion.div>
          ) : error ? (
            <motion.div
              key='error'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='flex min-h-[300px] items-center justify-center'
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
                <p className='mb-6 text-sm font-medium text-red-700'>{error}</p>
                <button
                  onClick={retryFetch}
                  className='rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200'
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategoryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'
            >
              {docs.length > 0 ? (
                docs.map((doc, index) => (
                  <motion.div
                    key={doc._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <DocsCard doc={doc} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='col-span-full py-12 text-center'
                >
                  <div className='mb-4 text-slate-400'>
                    <svg
                      className='mx-auto h-16 w-16'
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
                    We are working on adding content for this category
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CategoryTabs;
