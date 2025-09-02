'use client';
import { Textarea } from '@/components/ui/textarea';
import { useUserSignInDetails } from '@/store/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { postComment } from '../../_services/services';
import AuthModal from './AuthModal';

const CommentForm = ({ docId }: { docId: string }) => {
  const [commentText, setCommentText] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { userSignInDetails } = useUserSignInDetails();
  const currentUserId = userSignInDetails?.data?._id;
  const queryClient = useQueryClient();
  const profilePicture = userSignInDetails?.data.profilePicture;

  const commentMutation = useMutation({
    mutationFn: async (text: string) =>
      postComment(docId, { commentText: text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', docId] });
      toast.success('Comment posted!');
      setCommentText('');
    },
    onError: () => {
      toast.error('Failed to post comment. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!currentUserId) {
      setShowAuthModal(true);
      return;
    }
    const trimmed = commentText.trim();
    if (!trimmed) return;
    commentMutation.mutate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Keep this behavior exactly: Ctrl/Cmd + Enter posts
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
    // Plain Enter = new line (default for textarea) — no change needed
  };

  // Optional: simple auto-resize
  const handleInput: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setCommentText(e.target.value);
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  };

  return (
    <>
      <div
        id='comment-form'
        className='flex scroll-mt-24 gap-3 border-t border-gray-200 p-4'
      >
        <div className='flex-shrink-0'>
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={
                userSignInDetails?.data.meta_data.firstName ||
                userSignInDetails?.data.meta_data.lastName ||
                'user'
              }
              width={32}
              height={32}
              className='h-8 w-8 rounded-full object-cover'
            />
          ) : (
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-300'>
              <User className='h-4 w-4 text-gray-600' />
            </div>
          )}
        </div>

        <div className='flex-1'>
          <div className='flex items-end rounded-3xl bg-gray-100'>
            <Textarea
              value={commentText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder='Write a comment... (Ctrl+Enter to post)'
              aria-label='Write a comment'
              rows={1}
              className='max-h-40 min-h-10 flex-1 resize-none rounded-3xl border-none bg-transparent px-3 py-2 text-sm leading-6 shadow-none placeholder:overflow-hidden placeholder:whitespace-nowrap placeholder:text-[9px] focus:outline-none focus-visible:ring-0 xs:px-4 placeholder:xs:text-[11px] placeholder:sm:text-sm'
            />
            <button
              onClick={handleSubmit}
              disabled={!commentText.trim() || commentMutation.isPending}
              className='p-3 text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
              aria-label='Post comment'
              title='Post comment'
            >
              <Send className='h-3 w-3 xs:h-4 xs:w-4' />
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default CommentForm;
