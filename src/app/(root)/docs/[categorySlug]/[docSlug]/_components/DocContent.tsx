import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, Clock, Info, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedDiv } from '../../../_components/AnimatedDiv';
import { Doc } from '../../../_types/types';
import { parseHeadingsFromHtml } from '../_utils/parseHeadingsFromHtml';
import AuthorMetaCard from './AuthorMetaCard';
import TableOfContents from './TOC';

interface DocContentProps {
  docData: Doc;
}

const DocContent = ({ docData }: DocContentProps) => {
  // Server-side parsing: inject IDs + build TOC headings
  const { htmlWithIds, headings } = parseHeadingsFromHtml(
    docData.content || ''
  );
  const hasBio = !!docData?.authorId?.meta_data?.bio?.trim();
  const baseAvatar =
    docData?.authorId?.meta_data.avatarUrl ||
    docData?.authorId?.profilePicture ||
    undefined;
  // Server-side table wrapping for responsiveness
  // const htmlReady = wrapTablesForScroll(htmlWithIds);
  const readTime = Math.max(
    1,
    Math.ceil((docData.content?.length || 0) / 1000)
  );
  return (
    <div>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-8'>
        {/* TOC (Desktop) */}
        <div className='hidden lg:col-span-2 lg:block'>
          <AnimatedDiv
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className='sticky top-14'
          >
            <TableOfContents headings={headings} />
          </AnimatedDiv>
        </div>

        {/* TOC (Mobile) */}
        <div className='sticky top-14 lg:hidden'>
          <TableOfContents headings={headings} />
        </div>

        {/* Article Content */}
        <div className='lg:col-span-6'>
          <header className='mb-3 max-w-4xl sm:mb-6 xl:mb-8'>
            <h1 className='mb-2 text-xl font-semibold leading-relaxed text-gray-900 md:mb-3 md:text-2xl xl:text-3xl'>
              {docData.title}
            </h1>
            <p className='text-xs text-gray-600 md:text-sm'>
              {docData.description || docData.metaDescription}
            </p>
          </header>
          {docData.headerImageId && (
            <div className='mb-3 overflow-hidden sm:mb-6 xl:mb-8'>
              <Image
                src={docData.headerImageId.url}
                alt={docData.headerImageId.title}
                width={1200}
                height={600}
                quality={100}
                className='mx-auto h-auto max-h-64 w-full rounded-3xl sm:max-h-96 lg:object-fill xl:max-h-[450px]'
                priority
              />
            </div>
          )}
          <section className='flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-8'>
            {/* Author Info */}
            <div className='flex items-center gap-4'>
              {baseAvatar && (
                <Image
                  src={baseAvatar}
                  alt={`${docData.authorId.meta_data.firstName || ''} ${docData.authorId.meta_data.lastName || ''}`}
                  width={64}
                  height={64}
                  className='h-12 w-12 rounded-full border-4 border-white object-cover shadow ring-1 ring-gray-100 md:h-14 md:w-14'
                />
              )}
              <div>
                <div className='mt-1 flex items-center gap-2 text-xs text-gray-500 md:text-sm'>
                  Written By{' '}
                  {hasBio && (
                    <a href='#author'>
                      {' '}
                      <Info className='h-4 w-4 hover:text-primary' />
                    </a>
                  )}
                </div>
                <h3 className='text-sm font-medium text-gray-900 md:text-base'>
                  {docData.authorId.meta_data.firstName || ''}{' '}
                  {docData.authorId.meta_data.lastName || ''}
                </h3>
              </div>
            </div>

            {/* Metadata Stats */}
            <div className='flex flex-wrap items-center gap-2 sm:flex-col sm:items-end lg:gap-4'>
              <div className='flex flex-wrap gap-2 text-gray-600 sm:gap-4'>
                <div className='flex items-center gap-2 text-xs md:text-sm'>
                  <Calendar className='h-4 w-4 text-gray-400' />
                  <span>
                    {format(new Date(docData.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className='flex items-center gap-2 text-xs md:text-sm'>
                  <Clock className='h-4 w-4 text-gray-400' />
                  <span>{readTime} min read</span>
                </div>
              </div>

              {/* Tags */}
              {docData.tagIds && docData.tagIds.length > 0 && (
                <div className='flex flex-wrap items-center gap-2 text-xs text-gray-700 md:text-sm'>
                  <div className='flex items-center gap-1 font-medium'>
                    <Tag className='h-4 w-4 text-gray-400' />
                    Tags:
                  </div>
                  {docData.tagIds.slice(0, 5).map((tag, index) => (
                    <Link
                      key={`${tag.slug}-${index}`}
                      href={`/docs/tags/${tag.slug}?page=1`}
                      className=' rounded-full bg-slate-50 px-2 py-1 text-[10px] font-medium text-primary backdrop-blur-sm transition-all duration-300 hover:bg-slate-100 hover:text-blue-900 hover:shadow sm:px-3 sm:py-1 sm:text-xs'
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
          <AnimatedDiv
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className='no-visible-scrollbar mt-4 overflow-x-auto'
          >
            <div className='no-visible-scrollbar overflow-x-auto rounded-lg bg-white shadow-sm'>
              <div
                className={cn(
                  // base spacing & focus
                  'focus:outline-none',

                  // fluid type via responsive prose scale
                  'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none',

                  // Headings
                  '[&_h1]:mb-4  [&_h1]:mt-6  [&_h1]:font-semibold  [&_h1]:leading-relaxed',
                  '[&_h1]:text-xl   sm:[&_h1]:text-2xl   md:[&_h1]:text-2xl   xl:[&_h1]:text-3xl',

                  '[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:font-semibold [&_h2]:leading-normal',
                  '[&_h2]:text-lg  md:[&_h2]:text-2xl',

                  '[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-medium [&_h3]:leading-normal',
                  '[&_h3]:text-lg    sm:[&_h3]:text-xl   md:[&_h3]:text-2xl',

                  // Paragraphs
                  '[&_p]:my-3  [&_p]:leading-normal',
                  '[&_p]:text-sm md:[&_p]:text-base',

                  // Lists
                  '[&_ul]:my-3  [&_ul]:list-disc  [&_ul]:pl-6',
                  '[&_ol]:my-3  [&_ol]:list-decimal  [&_ol]:pl-6',
                  '[&_li]:my-1  [&_li]:leading-relaxed',

                  // Blockquote
                  '[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700',
                  'sm:[&_blockquote]:text-base md:[&_blockquote]:text-lg',

                  // Inline code & pre
                  '[&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono',
                  '[&_code]:text-[0.85rem] sm:[&_code]:text-[0.9rem]',
                  '[&_pre]:my-4 [&_pre]:rounded [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:font-mono',
                  '[&_pre]:text-[0.85rem] sm:[&_pre]:text-sm md:[&_pre]:text-base',

                  // HR
                  '[&_hr]:my-6 [&_hr]:border-t-2 [&_hr]:border-gray-300',

                  // Links
                  '[&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-700',

                  // Sub/Sup
                  '[&_sub]:align-sub [&_sub]:text-xs',
                  '[&_sup]:align-super [&_sup]:text-xs',
                  // ⬇️ Make <strong> (and <b>) semibold
                  '[&_.ProseMirror_strong]:font-semibold',
                  '[&_.ProseMirror_b]:font-semibold',
                  '[&_strong]:font-semibold',
                  '[&_b]:font-semibold',
                  // Tables (base look & responsive paddings)
                  '[&_table]:block [&_table]:w-full [&_table]:min-w-[640px] [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-none',
                  // Visuals & borders
                  '[&_table]:my-4 [&_table]:border-collapse',
                  // Spacing scales
                  '[&_td]:px-3 [&_td]:py-1 [&_th]:px-3 [&_th]:py-1',
                  '[&_td]:min-w-[120px]',
                  // Keep text from blowing up layout
                  '[&_td]:break-words [&_th]:break-words',

                  // Highlight mark
                  '[&_.highlight]:rounded [&_.highlight]:px-0.5 [&_.highlight]:py-0.5',

                  // Minimum height for empty docs
                  '[&_div]:min-h-20'
                )}
                dangerouslySetInnerHTML={{ __html: htmlWithIds }}
              />
            </div>
          </AnimatedDiv>
        </div>
      </div>
      {hasBio && (
        <AuthorMetaCard
          meta={docData.authorId.meta_data}
          profilePicture={docData.authorId.profilePicture}
        />
      )}
    </div>
  );
};

export default DocContent;
