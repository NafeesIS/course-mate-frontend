'use client';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Reply } from 'lucide-react';
import { useState } from 'react';
import { getRepliesByComment } from '../../_services/services';
import Comment from './Comment';

interface ReplyListProps {
  commentId: string;
  currentUserId?: string;
  replyCount: number;
  // eslint-disable-next-line no-unused-vars
  onReplyCountChange?: (count: number) => void;
}

const ReplyList = ({
  commentId,
  currentUserId,
  replyCount,
  onReplyCountChange,
}: ReplyListProps) => {
  const [limit, setLimit] = useState(1);

  const { data: repliesData, isLoading } = useQuery({
    queryKey: ['replies', commentId, limit],
    queryFn: () =>
      getRepliesByComment(commentId, {
        page: 1,
        limit,
        sort: 'asc',
      }),
    enabled: replyCount > 0,
  });

  const replies = repliesData?.data || [];
  const hasMore = replyCount > limit;

  if (isLoading) {
    return (
      <div className='space-y-2'>
        {[1, 2].map((i) => (
          <div key={i} className='flex animate-pulse gap-2'>
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
    );
  }

  return (
    <div className='space-y-2'>
      {/* Show initial "View replies" button when no replies are shown */}
      {limit === 1 && replyCount > 0 && replies.length === 0 && (
        <button
          onClick={() => setLimit(2)}
          className='flex items-center gap-1.5 px-3 text-sm font-semibold text-gray-600 transition-colors hover:text-blue-600'
        >
          <Reply className='h-4 w-4' />
          <span>
            View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </span>
          <ChevronDown className='h-4 w-4' />
        </button>
      )}

      {/* Replies */}
      {replies.map((reply) => (
        <Comment
          key={reply._id}
          comment={reply}
          currentUserId={currentUserId}
          isReply={true}
          onReplySuccess={() => {
            if (onReplyCountChange) {
              onReplyCountChange(replyCount - 1);
            }
          }}
        />
      ))}

      {/* View More/Less Buttons */}
      {replies.length > 0 && (hasMore || limit > 1) && (
        <div className='flex items-center justify-start gap-2.5 px-3'>
          {hasMore && (
            <button
              onClick={() => setLimit((prevLimit) => prevLimit + 2)}
              className='flex items-center gap-1.5 text-sm font-semibold text-gray-600 transition-colors hover:text-blue-600'
            >
              <span>View more {replyCount === 1 ? 'reply' : 'replies'}</span>
              <ChevronDown className='h-4 w-4' />
            </button>
          )}
          {limit > 1 && (
            <button
              onClick={() => setLimit(1)}
              className='flex items-center gap-1.5 text-sm font-semibold text-gray-600 transition-colors hover:text-blue-600'
            >
              <span>View less Replies</span>
              <ChevronUp className='h-4 w-4' />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyList;
