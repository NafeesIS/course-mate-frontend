import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ExternalLink, FileText, Search, Tag } from 'lucide-react';
import Link from 'next/link';

interface DocSuggestionsBoxProps {
  results: any[];
  isLoading?: boolean;
  onClose?: () => void;
  searchQuery?: string; // Add searchQuery prop
}

const DocSuggestionsBox = ({
  results = [],
  isLoading = false,
  onClose,
  searchQuery = '',
}: DocSuggestionsBoxProps) => {
  // Helper function to highlight matching text
  const highlightText = (text: string, query: string): React.JSX.Element => {
    if (!query.trim() || !text) {
      return <span>{text}</span>;
    }

    // Split query into individual words and filter out empty strings
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (queryWords.length === 0) {
      return <span>{text}</span>;
    }

    // Create a regex pattern that matches any of the query words
    const pattern = new RegExp(
      `(${queryWords
        .map(
          (word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
        )
        .join('|')})`,
      'gi'
    );

    const parts = text.split(pattern);

    return (
      <span>
        {parts.map((part, index) => {
          const isMatch = queryWords.some(
            (word) => part.toLowerCase() === word.toLowerCase()
          );

          return isMatch ? (
            <mark
              key={index}
              className='rounded bg-yellow-200 px-0.5 font-semibold text-yellow-900'
            >
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          );
        })}
      </span>
    );
  };

  // Helper function to highlight text in tags
  const highlightTag = (tagName: string, query: string): React.JSX.Element => {
    if (!query.trim() || !tagName) {
      return <span>{tagName}</span>;
    }

    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const isTagMatch = queryWords.some((word) =>
      tagName.toLowerCase().includes(word.toLowerCase())
    );

    if (isTagMatch) {
      return highlightText(tagName, query);
    }

    return <span>{tagName}</span>;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl'
      >
        <div className='p-4'>
          <div className='flex items-center justify-center space-x-2'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent' />
            <span className='text-sm text-slate-500'>Searching...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!results.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl'
      >
        <div className='p-6 text-center'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100'>
            <Search className='h-5 w-5 text-slate-400' />
          </div>
          <h3 className='text-sm font-medium text-slate-900'>
            No results found
          </h3>
          <p className='mt-1 text-xs text-slate-500'>
            Try adjusting your search terms or browse our categories
          </p>
        </div>
      </motion.div>
    );
  }
  const sortedResults = results.sort((a, b) => b.score - a.score);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl backdrop-blur-sm'
      >
        {/* Header */}
        <div className='border-b border-slate-100 px-4 py-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-slate-700'>
              {sortedResults.length} result
              {sortedResults.length !== 1 ? 's' : ''} found
              {searchQuery && (
                <span className='ml-2 text-slate-500'>
                  for {`"${searchQuery}"`}
                </span>
              )}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className='text-slate-400 transition-colors hover:text-slate-600'
              >
                <span className='sr-only'>Close</span>×
              </button>
            )}
          </div>
        </div>

        {/* sortedResults */}
        <ul className='max-h-96 overflow-y-auto py-2'>
          {sortedResults.map((doc: any, index: number) => (
            <motion.li
              key={doc._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className='border-b border-slate-50 last:border-none'
            >
              <Link
                href={`/docs/${doc.category?.slug}/${doc.slug}`}
                className='group block px-4 py-3 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                onClick={onClose}
              >
                <div className='flex items-start space-x-3'>
                  {/* Icon */}
                  <div className='mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary transition-colors group-hover:bg-blue-200'>
                    <FileText className='h-4 w-4' />
                  </div>

                  {/* Content */}
                  <div className='min-w-0 flex-1'>
                    {/* Title with highlighting */}
                    <div className='flex items-center justify-between'>
                      <h4 className='truncate text-sm font-semibold text-slate-900 group-hover:text-primary'>
                        {highlightText(doc.title, searchQuery)}
                      </h4>
                      <ExternalLink className='ml-2 h-3 w-3 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100' />
                    </div>

                    {/* Excerpt with highlighting */}
                    <div className='mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 group-hover:text-slate-700'>
                      {highlightText(
                        doc.excerpt || 'No description available',
                        searchQuery
                      )}
                    </div>

                    {/* Meta information */}
                    <div className='mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500'>
                      {/* Category with highlighting */}
                      {doc.category?.name && (
                        <div className='flex items-center space-x-1'>
                          <Tag className='h-3 w-3' />
                          <span className='rounded-full bg-slate-100 px-2 py-0.5 font-medium'>
                            {highlightText(doc.category.name, searchQuery)}
                          </span>
                        </div>
                      )}

                      {/* Date */}
                      {doc.createdAt && (
                        <div className='flex items-center space-x-1'>
                          <Calendar className='h-3 w-3' />
                          <span>
                            {format(new Date(doc.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}

                      {/* Reading time estimate */}
                      {doc.content && (
                        <span className='text-slate-400'>
                          {Math.ceil(doc.content.split(' ').length / 200)} min
                          read
                        </span>
                      )}
                    </div>

                    {/* Tags with highlighting */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className='mt-2 flex flex-wrap gap-1'>
                        {doc.tags
                          .slice(0, 3)
                          .map((tag: any, tagIndex: number) => {
                            const tagName = tag.name || tag;
                            const queryWords = searchQuery
                              .toLowerCase()
                              .split(/\s+/)
                              .filter((word) => word.length > 0);
                            const isTagMatch = queryWords.some((word) =>
                              tagName.toLowerCase().includes(word.toLowerCase())
                            );

                            return (
                              <span
                                key={tag.slug || tagIndex}
                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${
                                  isTagMatch
                                    ? 'bg-yellow-50 text-yellow-800 ring-yellow-200'
                                    : 'bg-blue-50 text-primary ring-blue-200'
                                }`}
                              >
                                {highlightTag(tagName, searchQuery)}
                              </span>
                            );
                          })}
                        {doc.tags.length > 3 && (
                          <span className='inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500'>
                            +{doc.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Footer */}
        {/* {sortedResults.length > 0 && (
          <div className='border-t border-slate-100 px-4 py-3'>
            <div className='flex items-center justify-between text-xs text-slate-500'>
              <span>Press Enter to search all results</span>
              <div className='flex items-center space-x-1'>
                <kbd className='rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-xs'>
                  ↑
                </kbd>
                <kbd className='rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-xs'>
                  ↓
                </kbd>
                <span className='ml-1'>to navigate</span>
              </div>
            </div>
          </div>
        )} */}
      </motion.div>
    </AnimatePresence>
  );
};

export default DocSuggestionsBox;
