'use client';
import { Doc } from '@/app/(root)/docs/_types/types';
import { useUserSignInDetails } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { getComments } from '../../_services/services';
import SocialActionsBar from '../SocialSectionSideBar';
import Comment from './Comment';
import CommentForm from './CommentForm';
interface CommentSectionProps {
  docId: string;
  docData: Doc;
}

const CommentSection = ({ docId, docData }: CommentSectionProps) => {
  // const [showAll, setShowAll] = useState(false);
  const [limit, setLimit] = useState(5);
  const { userSignInDetails } = useUserSignInDetails();
  const currentUserId = userSignInDetails?.data?._id;

  const {
    data: commentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['comments', docId, limit],
    queryFn: () => getComments(docId, { page: 1, limit }),
    refetchOnWindowFocus: false,
  });

  const comments = commentsData?.data || [];
  const totalComments = commentsData?.meta?.total || 0;
  // const hasMore = totalComments > limit && !showAll;

  const scrollToCommentForm = () => {
    const el = document.getElementById('comment-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // give the browser a tick to complete scrolling, then focus the input
      setTimeout(() => {
        const input = document.getElementById(
          'comment-input'
        ) as HTMLTextAreaElement | null;
        input?.focus();
      }, 300);
    }
  };

  if (error) {
    return (
      <div className='my-12 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm'>
        <p className='text-gray-500'>
          Failed to load comments. Please try again.
        </p>
        <button
          onClick={() => refetch()} // Assuming `refetch` is a function for fetching data again
          className='mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='my-12 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
      <SocialActionsBar
        totalComments={totalComments}
        docData={docData}
        onCommentClick={scrollToCommentForm}
      />
      {/* Comments List */}
      <div>
        {isLoading ? (
          <div className='space-y-4 p-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='flex animate-pulse gap-3'>
                <div className='h-8 w-8 rounded-full bg-gray-200'></div>
                <div className='flex-1'>
                  <div className='rounded-2xl bg-gray-200 p-3'>
                    <div className='mb-2 h-3 w-1/4 rounded bg-gray-300'></div>
                    <div className='h-3 w-3/4 rounded bg-gray-300'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className='p-8 text-center text-xs md:text-sm'>
            <MessageCircle className='mx-auto mb-3 h-8 w-8 text-gray-400' />
            <p className='text-gray-500'>
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          <div className='space-y-4 p-4'>
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                currentUserId={currentUserId}
              />
            ))}
            <div className='flex items-center justify-start gap-2.5'>
              {commentsData?.meta?.hasMore && (
                <button
                  onClick={() => setLimit((prevLimit) => prevLimit + 5)}
                  title='View more comments'
                  className='flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600'
                >
                  <span>View more</span>
                  <ChevronDown className='h-4 w-4' />
                </button>
              )}
              {limit > 5 && (
                <button
                  onClick={() => setLimit(5)}
                  title='View less comments'
                  className='flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600'
                >
                  <span>View less</span>
                  <ChevronUp className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comment Form */}
      <CommentForm docId={docId} />
    </div>
  );
};

export default CommentSection;
