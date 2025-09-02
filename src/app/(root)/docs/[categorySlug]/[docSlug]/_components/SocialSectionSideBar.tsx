'use client';

import {
  Facebook,
  Heart,
  Linkedin,
  MessageCircle,
  MessageSquare,
  Send,
  Share2,
  Twitter,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Doc } from '../../../_types/types';
import UserBookmarks from './UserBookmarks';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Share Modal Component
const ShareModal = ({
  isOpen,
  onClose,
  title = 'Share this document',
}: ShareModalProps) => {
  if (!isOpen) return null;

  const url = window.location.href;
  const text = 'Check out this amazing document!';

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600 hover:bg-blue-50',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-sky-500 hover:bg-sky-50',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700 hover:bg-blue-50',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'text-green-600 hover:bg-green-50',
      url: `https://wa.me/?text=${encodeURIComponent(`${text}: ${url}`)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'text-blue-500 hover:bg-blue-50',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      name: 'Messenger',
      icon: MessageCircle,
      color: 'text-blue-600 hover:bg-blue-50',
      url: `fb-messenger://share/?link=${encodeURIComponent(url)}`,
      fallbackUrl: `https://www.messenger.com/t/?link=${encodeURIComponent(url)}`,
    },
    {
      name: 'Slack',
      icon: MessageSquare,
      color: 'text-purple-600 hover:bg-purple-50',
      url: `slack://sharing/share?text=${encodeURIComponent(`${text}: ${url}`)}`,
      fallbackUrl: `https://slack.com/intl/en-gb/`,
    },
  ];

  const handleShare = (shareUrl: string) => {
    window.open(
      shareUrl,
      '_blank',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
    onClose();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={onClose}
    >
      <div
        className='mx-4 w-full max-w-sm rounded-lg bg-white shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b p-4'>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          <button
            onClick={onClose}
            className='text-gray-400 transition-colors hover:text-gray-600'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='p-4'>
          <div className='space-y-2'>
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.name}
                  onClick={() => handleShare(option.url)}
                  className={`flex w-full items-center space-x-3 rounded-lg border px-4 py-3 transition-all duration-200 ${option.color} hover:shadow-sm`}
                >
                  <IconComponent className='h-5 w-5' />
                  <span className='font-medium'>Share on {option.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// If you already have Doc type, keep your import instead.
interface SocialActionBarProps {
  totalComments: number;
  docData: Doc;
  onCommentClick?: () => void;
}

const SocialActionsBar = ({
  totalComments,
  docData,
  onCommentClick,
}: SocialActionBarProps) => {
  const [likeCount, setLikeCount] = useState<number>(docData?.likeCount ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState(false);
  // const [copied, setCopied] = useState(false);

  const commentLabel = useMemo(
    () => `${totalComments} ${totalComments === 1 ? 'Comment' : 'Comments'}`,
    [totalComments]
  );

  // const handleCopyLink = async () => {
  //   try {
  //     await navigator.clipboard.writeText(
  //       `${BASE_URL_FRONTEND}/docs/${docData.categoryId.slug}/${docData.slug}`
  //     );
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.error('Failed to copy: ', err);
  //   }
  // };

  const handleShareClick = () => {
    const url = window.location.href;

    if (navigator.share) {
      // Use Web Share API if available (mainly on mobile devices)
      navigator
        .share({
          title: 'Check out this document!',
          text: 'I thought you might find this interesting.',
          url,
        })
        .then(() => console.log('Shared successfully!')) //TODO : Update Share Count next update
        .catch((error) => {
          console.error('Error sharing:', error);
          // Fallback to modal if Web Share API fails
          setShowShareModal(true);
        });
    } else {
      // Show custom modal for desktop and devices without Web Share API
      setShowShareModal(true);
    }
  };

  const shares = docData?.shareCount ?? 0;

  return (
    <>
      <div className='mx-auto w-full border-b'>
        {/* Top: counts */}
        <div className='border-b px-4 py-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4 text-sm text-gray-600'>
              <span className='flex items-center'>
                <Heart
                  className={`mr-1 h-4 w-4 ${
                    isLiked ? 'fill-red-600 text-red-600' : 'text-gray-500'
                  }`}
                />
                {likeCount}
              </span>
              <span></span>
            </div>

            {/* Show shares only if provided */}
            {typeof shares === 'number' && (
              <div className='text-sm text-gray-600'>{commentLabel}</div>
            )}
          </div>
        </div>

        {/* Bottom: action buttons */}
        <div className='px-2 py-1'>
          <div className='grid grid-cols-3 gap-1'>
            {/* Like / Bookmark */}
            <UserBookmarks
              docId={docData._id}
              onChange={({ isBookmarked, count }) => {
                setIsLiked(isBookmarked);
                setLikeCount(count);
              }}
            />

            {/* Comment */}
            <button
              onClick={onCommentClick}
              className='flex items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 lg:hover:bg-gray-100 lg:hover:text-blue-600'
            >
              <MessageCircle className='h-5 w-5' />
              <span className='hidden sm:inline'>Comment</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShareClick}
              className='flex items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 lg:hover:bg-gray-100 lg:hover:text-green-600'
            >
              <Share2 className='h-5 w-5' />
              <span className='hidden sm:inline'>Share</span>
            </button>
            {/* <button
              onClick={handleCopyLink}
              className='flex items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 lg:hover:bg-gray-100 lg:hover:text-primary'
            >
              <FaCopy className='hidden h-5 w-5 sm:inline' />{' '}
              <span>
                {' '}
                {copied ? (
                  <span className='whitespace-nowrap text-[10px] xs:text-xs sm:hidden'>
                    Link Copied!
                  </span>
                ) : (
                  <FaCopy className='inline h-5 w-5 sm:hidden' />
                )}
              </span>
              <span className='hidden sm:inline'>
                {' '}
                {copied ? 'Link Copied!' : 'Copy Link'}
              </span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
};

export default SocialActionsBar;
