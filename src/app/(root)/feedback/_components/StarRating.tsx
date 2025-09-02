'use client';

import { RatingsCategory } from '../_types/types';

type Props = {
  category: RatingsCategory;
  currentRating: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (category: RatingsCategory, rating: number) => void;
};

export default function StarRating({
  category,
  currentRating,
  onChange,
}: Props) {
  return (
    <div className='flex gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          onClick={() => onChange(category, star)}
          className='ml-2 text-2xl transition-colors duration-200 focus:outline-none'
          aria-label={`Rate ${category} ${star} star`}
        >
          <span
            className={
              star <= currentRating ? 'text-amber-400' : 'text-gray-300'
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
