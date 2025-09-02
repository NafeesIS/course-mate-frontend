'use client';
import { formatDate } from 'date-fns';
import { ExternalLink, Folder, Heart, Share2, Tag } from 'lucide-react';
import { Doc } from '../../../_types/types';

interface DocSidebarProps {
  docData: Doc;
}

const DocSidebar = ({ docData }: DocSidebarProps) => {
  return (
    <div className='lg:col-span-3'>
      <div className='sticky top-8 space-y-6'>
        {/* Document Info */}
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900'>
            Document Details
          </h3>

          <div className='space-y-4 text-sm'>
            <div className='flex items-start gap-3'>
              <Folder className='mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400' />
              <div>
                <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                  Category
                </p>
                <p className='mt-1 text-gray-900'>{docData.categoryId.name}</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Folder className='mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400' />
              <div>
                <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                  Subcategory
                </p>
                <p className='mt-1 text-gray-900'>
                  {docData.subcategoryId.name}
                </p>
              </div>
            </div>

            <div className='border-t border-gray-100 pt-3'>
              <p className='mb-2 text-xs font-medium uppercase tracking-wide text-gray-500'>
                Status
              </p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  docData.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {docData.status.charAt(0).toUpperCase() +
                  docData.status.slice(1)}
              </span>
            </div>

            <div className='border-t border-gray-100 pt-3'>
              <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                Last Updated
              </p>
              <p className='mt-1 text-gray-900'>
                {formatDate(docData.updatedAt, 'dd-MMM-yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {docData.tagIds && docData.tagIds.length > 0 && (
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-900'>
              <Tag className='h-4 w-4' />
              Tags
            </h3>
            <div className='flex flex-wrap gap-2'>
              {docData.tagIds.map((tag) => (
                <span
                  key={tag._id}
                  className='inline-flex cursor-pointer rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors duration-200 hover:bg-blue-100'
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900'>
            Actions
          </h3>
          <div className='space-y-3'>
            <button className='flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-blue-700'>
              <Heart className='h-4 w-4' />
              Like ({docData.likeCount})
            </button>

            <button className='flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50'>
              <Share2 className='h-4 w-4' />
              Share
            </button>

            <button className='flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50'>
              <ExternalLink className='h-4 w-4' />
              View Original
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocSidebar;
