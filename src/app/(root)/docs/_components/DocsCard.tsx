// DocsCard.tsx
import { formatDate } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaHashtag } from 'react-icons/fa';
import { Doc } from '../_types/types';
import { AnimatedDiv } from './AnimatedDiv';

interface DocsCardProps {
  doc: Doc;
  className?: string;
}

const DocsCard: React.FC<DocsCardProps> = ({ doc }) => {
  const {
    title,
    slug,
    excerpt,
    thumbnailId,
    headerImageId,
    tagIds,
    categoryId,
    subcategoryId,
    likeCount,
    viewCount,
    createdAt,
    isFeatured,
  } = doc;

  const displayViewCount = viewCount || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <AnimatedDiv
      className='group relative h-full overflow-hidden rounded-2xl border border-white/20 bg-white/60 shadow-lg backdrop-blur-sm'
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      // ✅ Viewport animation will be handled by AnimatedDiv
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Gradient Overlay on Hover */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

      {/* Thumbnail */}
      {thumbnailId && (
        <div className='relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200'>
          <Image
            src={thumbnailId.url || headerImageId.url}
            alt={thumbnailId.title || title}
            title={title}
            fill
            className='object-cover transition-all duration-700 group-hover:scale-110'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            // priority={variant === 'featured'}
          />

          {/* Overlay Gradient */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

          {/* Featured Badge */}
          {isFeatured && (
            <AnimatedDiv
              variants={itemVariants} // ✅ Use variants instead of individual props
              className='absolute right-4 top-4 z-10'
            >
              <div className='flex items-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg'>
                <svg
                  className='mr-1 h-3 w-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
                Featured
              </div>
            </AnimatedDiv>
          )}

          {/* Category Name */}
          <AnimatedDiv
            variants={itemVariants}
            className='absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-black/35 px-2 py-1'
          >
            <h4 className='max-w-36 text-xs font-medium text-white drop-shadow-lg md:text-sm'>
              {subcategoryId ? subcategoryId.name : categoryId?.name || ''}
            </h4>
          </AnimatedDiv>
        </div>
      )}

      {/* Content */}
      <div className='relative px-4 py-6 md:px-6'>
        {/* Tags Indicator */}
        <AnimatedDiv variants={itemVariants} className='mb-3'>
          <div className='flex flex-wrap gap-2'>
            {tagIds?.map((tag) => (
              <span
                key={tag._id}
                className='inline-flex items-center rounded-lg bg-blue-100 px-2 py-[3px] text-[10px] font-medium text-primary'
              >
                <FaHashtag className='size-2' />
                {tag.name}
              </span>
            ))}
          </div>
        </AnimatedDiv>

        {/* Title */}
        <AnimatedDiv
          variants={itemVariants}
          className='mb-3'
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <Link href={`/docs/${categoryId.slug}/${slug}`} className='block'>
            <h3 className='line-clamp-2 text-sm font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-900 md:text-base'>
              {title}
            </h3>
          </Link>
        </AnimatedDiv>

        {/* Excerpt */}
        {excerpt && (
          <AnimatedDiv variants={itemVariants}>
            <p className='mb-4 line-clamp-1 text-xs leading-relaxed text-slate-600 md:text-sm'>
              {excerpt}
            </p>
          </AnimatedDiv>
        )}

        {/* Stats and Date */}
        <AnimatedDiv
          variants={itemVariants}
          className='flex items-center justify-between'
        >
          <div className='flex items-center space-x-4'>
            {/* Views */}
            <div className='flex items-center text-slate-500'>
              <svg
                className='mr-1.5 h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
              <span className='text-sm font-medium'>
                {displayViewCount > 999
                  ? `${(displayViewCount / 1000).toFixed(1)}k`
                  : displayViewCount}
              </span>
            </div>

            {/* Likes */}
            <div className='flex items-center text-slate-500'>
              <svg
                className='mr-1.5 h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
                />
              </svg>
              <span className='text-sm font-medium'>
                {(likeCount || 0) > 999
                  ? `${((likeCount || 0) / 1000).toFixed(1)}k`
                  : likeCount || 0}
              </span>
            </div>
          </div>

          {/* Date */}
          <time
            dateTime={createdAt}
            className='text-xs font-medium text-slate-400'
          >
            {formatDate(createdAt, 'MMM dd, yyyy')}
          </time>
        </AnimatedDiv>

        {/* Read More Link */}
        <AnimatedDiv variants={itemVariants} className='mt-4'>
          <Link
            href={`/docs/${categoryId.slug}/${slug}`}
            className='group/link inline-flex items-center rounded-md text-sm font-semibold text-primary transition-colors duration-200 hover:text-blue-900 group-hover:text-blue-900'
          >
            Read Documentation
            <svg
              className='ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1'
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
          </Link>
        </AnimatedDiv>
      </div>

      {/* Bottom Gradient Line */}
      <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
    </AnimatedDiv>
  );
};

export default DocsCard;
