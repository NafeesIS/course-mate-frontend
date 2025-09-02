// AuthorMetaCard.tsx
'use client';

import { MetaData } from '@/app/(root)/(dashboard)/dashboard/admin/docs-management/manage-profile/_types/types';
import { User2 } from 'lucide-react';
import Image from 'next/image';
import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';

function initialsFrom(nameA?: string, nameB?: string) {
  const a = (nameA || '').trim();
  const b = (nameB || '').trim();
  const first = a ? a[0] : '';
  const last = b ? b[0] : '';
  const combo = (first + last).toUpperCase();
  return combo || undefined;
}

export default function AuthorMetaCard({
  meta,
  profilePicture,
}: {
  meta?: MetaData;
  profilePicture?: string;
}) {
  const first = meta?.firstName?.trim() || '';
  const last = meta?.lastName?.trim() || '';
  const name = `${first} ${last}`.trim() || 'User';

  const avatar = meta?.avatarUrl?.trim();
  const initials = initialsFrom(first, last);

  const hasBio = !!meta?.bio?.trim();
  const hasLinkedIn = !!meta?.social?.linkedin?.trim();
  const hasFacebook = !!meta?.social?.facebook?.trim();
  const hasGithub = !!meta?.social?.github?.trim();
  const avatarToShow = avatar || profilePicture;
  return (
    <div
      id='author'
      className='mt-8 w-full scroll-mt-20 rounded-lg border border-gray-200 bg-gray-100 p-4 sm:p-5'
    >
      {/* Header */}
      <div className='flex items-start gap-4'>
        <div className='h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200'>
          {avatarToShow ? (
            <Image
              src={avatarToShow}
              alt={name || 'Writer'}
              title={name || 'Writer'}
              width={64}
              height={64}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              {initials ? (
                <span className='text-sm font-semibold text-gray-600'>
                  {initials}
                </span>
              ) : (
                <User2 className='h-6 w-6 text-gray-400' />
              )}
            </div>
          )}
        </div>

        <div className='min-w-0 flex-1'>
          <div className='mb-2 flex flex-wrap items-center justify-start gap-2'>
            <h3 className='truncate text-sm font-semibold text-gray-900 sm:text-base'>
              {name}
            </h3>
            {/* Optional quick info row */}
            <div className='flex flex-wrap items-center gap-2'>
              {hasLinkedIn && (
                <a
                  href={meta!.social?.linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-1.5 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-white'
                >
                  <FaLinkedinIn className='h-3 w-3' />
                </a>
              )}
              {hasFacebook && (
                <a
                  href={meta!.social?.facebook}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-1.5 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-white'
                >
                  <FaFacebookF className='h-3 w-3' />
                </a>
              )}
              {hasGithub && (
                <a
                  href={meta!.social?.github}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-1.5 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-white'
                >
                  <FaGithub className='h-3 w-3' />
                </a>
              )}
            </div>
          </div>
          {/* Optional bio */}
          {hasBio && (
            <p className='mt-1 text-xs leading-relaxed md:text-sm'>
              {meta!.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
