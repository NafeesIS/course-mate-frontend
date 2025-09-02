/* eslint-disable no-unused-vars */
'use client';

import { formatName, toCamelCase } from '@/lib/formatters';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface DirectorSuggestionProps {
  suggestion: {
    _id: string;
    fullName: string;
    din: string;
    companies: string[];
  };
  index: number;
  focusedIndex: number;
  handleSelectDirector: (suggestion: any) => void;
  setRefForIndex: (index: number) => (el: HTMLLIElement | null) => void;
  setFocusedIndex: (index: number) => void;
}

const DirectorSuggestions = ({
  suggestion,
  index,
  focusedIndex,
  handleSelectDirector,
  setRefForIndex,
  setFocusedIndex,
}: DirectorSuggestionProps) => {
  return (
    <motion.li
      ref={setRefForIndex(index)}
      key={suggestion._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`cursor-pointer rounded-md p-2 ${
        index === focusedIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
      }`}
      onClick={() => handleSelectDirector(suggestion)}
      onMouseEnter={() => setFocusedIndex(index)}
      role='option'
      aria-selected={index === focusedIndex}
      tabIndex={-1}
    >
      <div className='flex items-center gap-3'>
        <User className='h-6 w-6 flex-shrink-0 text-gray-400' />
        <div className='space-y-0.5'>
          <p className='text-sm font-semibold'>
            {suggestion.fullName && suggestion.fullName.length > 0
              ? toCamelCase(formatName(suggestion.fullName))
              : '-'}
          </p>
          <p className='text-[10px] text-gray-600 md:text-xs'>
            DIN: {suggestion.din}
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-xs'>
            {suggestion.companies && suggestion.companies.length > 0 ? (
              <>
                {toCamelCase(suggestion.companies[0])}{' '}
                {/* Display the first company */}
                {suggestion.companies.length > 1 && (
                  <> , ..{suggestion.companies.length - 1} more </>
                )}
              </>
            ) : (
              'No company information'
            )}
          </p>
        </div>
      </div>
    </motion.li>
  );
};

export default DirectorSuggestions;
