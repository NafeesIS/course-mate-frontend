'use client';

import { useUserSignInDetails } from '@/store/userStore';
import { Heart } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  DeleteBookmarks,
  getBookmarks,
  postBookmarks,
} from '../_services/services';

interface UserBookmarksProps {
  docId: string;
  initialCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  // eslint-disable-next-line no-unused-vars
  onChange?: (payload: { isBookmarked: boolean; count: number }) => void;
}

const UserBookmarks = ({
  docId,
  initialCount = 0,
  onChange,
}: UserBookmarksProps) => {
  const { userSignInDetails } = useUserSignInDetails();
  const userId = userSignInDetails?.data?._id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(initialCount);

  const fetchBookmarkStatus = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getBookmarks(docId, userId);
      const nextIsBookmarked = !!data?.isUserBookmarked;
      const nextCount =
        typeof data?.count === 'number' ? data.count : likeCount;

      setIsBookmarked(nextIsBookmarked);
      setLikeCount(nextCount);
      onChange?.({ isBookmarked: nextIsBookmarked, count: nextCount });
    } catch (error) {
      console.error('Error fetching bookmark status:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId, userId]);

  const handleBookmarkToggle = async () => {
    if (!userId) {
      toast.error('Please sign in to like & save this document');
      return;
    }
    if (isLoading) return;

    setIsLoading(true);

    const prevState = isBookmarked;
    const prevCount = likeCount;

    // Optimistic update
    const optimisticIsBookmarked = !prevState;
    const optimisticCount = prevCount + (optimisticIsBookmarked ? 1 : -1);

    setIsBookmarked(optimisticIsBookmarked);
    setLikeCount(optimisticCount);
    onChange?.({
      isBookmarked: optimisticIsBookmarked,
      count: optimisticCount,
    });

    try {
      if (optimisticIsBookmarked) {
        await postBookmarks(docId);
        toast.success('Thanks for the love!');
      } else {
        await DeleteBookmarks(docId);
        toast.info('Removed reaction');
      }

      // Re-sync with server (in case of race conditions)
      await fetchBookmarkStatus();
    } catch (error) {
      // Revert on failure
      setIsBookmarked(prevState);
      setLikeCount(prevCount);
      onChange?.({ isBookmarked: prevState, count: prevCount });

      const action = optimisticIsBookmarked ? 'add' : 'remove';
      toast.error(`Failed to ${action} like. Please try again.`);
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkStatus();
  }, [fetchBookmarkStatus]);

  return (
    <button
      onClick={handleBookmarkToggle}
      className={`flex items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 lg:hover:bg-gray-100 ${
        isBookmarked ? 'text-red-600' : 'text-gray-600 lg:hover:text-red-600'
      }`}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-200 ${
          isBookmarked ? 'fill-red-600 text-red-600' : 'text-gray-600'
        }`}
      />
      <span className='hidden sm:inline'>
        {' '}
        {isBookmarked ? 'Liked' : 'Like'}
      </span>
    </button>
  );
};

export default UserBookmarks;
