/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import { formatName, toCamelCase } from '@/lib/formatters';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import React from 'react';
import { ICompanySuggestion, IDirectorSuggestion } from '../_types/types';

interface CompanySuggestionsProps {
  companySuggestion: ICompanySuggestion;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  handleSelectDirector: (director: IDirectorSuggestion) => void;
  setRefForIndex: (index: number) => (el: HTMLLIElement | null) => void;
}

const CompanySuggestions: React.FC<CompanySuggestionsProps> = ({
  companySuggestion,
  handleSelectDirector,
  setRefForIndex,
}) => {
  return (
    <motion.li
      className='rounded-md bg-gray-50 p-3'
      role='group'
      aria-labelledby={`company-${companySuggestion._id}`}
    >
      {/* Company Info */}
      <div className='mb-2'>
        <p className='text-base font-semibold'>
          {companySuggestion.company && companySuggestion.company.length > 0
            ? toCamelCase(companySuggestion.company)
            : '-'}
        </p>
        <p className='mt-2 text-xs text-gray-600'>
          {companySuggestion.companyType}
        </p>
        <p className='text-xs text-gray-600'>
          Origin: {companySuggestion.companyOrigin}
        </p>
      </div>

      {/* Current Directors */}
      <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
        {companySuggestion.currentDirectors &&
          companySuggestion.currentDirectors.length > 0 && (
            <div>
              <p className='text-sm font-semibold text-gray-800'>
                Current Directors:
              </p>
              <ul className='mt-2 space-y-1'>
                {companySuggestion.currentDirectors.map((director, index) => (
                  <motion.li
                    ref={setRefForIndex(index)}
                    key={director._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-background`}
                    onClick={() => handleSelectDirector(director)}
                    role='option'
                    tabIndex={-1}
                  >
                    <User className='h-6 w-6 flex-shrink-0 text-gray-400' />
                    <div className='space-y-0.5'>
                      <p className='text-sm font-semibold'>
                        {director.fullName && director.fullName.length > 0
                          ? toCamelCase(formatName(director.fullName))
                          : '-'}
                      </p>
                      <p className='text-[10px] text-gray-600 md:text-xs'>
                        DIN: {director.din}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

        {/* Past Directors */}
        {companySuggestion.pastDirectors &&
          companySuggestion.pastDirectors.length > 0 && (
            <div>
              <p className='text-sm font-semibold text-gray-800'>
                Past Directors:
              </p>
              <ul className='mt-2 space-y-1'>
                {companySuggestion.pastDirectors.map((director, index) => (
                  <motion.li
                    ref={setRefForIndex(index)}
                    key={director._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-background`}
                    onClick={() => handleSelectDirector(director)}
                    role='option'
                    tabIndex={-1}
                  >
                    <User className='h-6 w-6 flex-shrink-0 text-gray-400' />
                    <div className='space-y-0.5'>
                      <p className='text-sm font-semibold'>
                        {director.fullName && director.fullName.length > 0
                          ? toCamelCase(formatName(director.fullName))
                          : '-'}
                      </p>
                      <p className='text-[10px] text-gray-600 md:text-xs'>
                        DIN: {director.din}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </motion.li>
  );
};

export default CompanySuggestions;
