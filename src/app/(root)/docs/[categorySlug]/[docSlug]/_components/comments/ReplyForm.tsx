'use client';
import { Input } from '@/components/ui/input';
import { useUserSignInDetails } from '@/store/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { postReply } from '../../_services/services';

const ReplyForm = ({
  commentId,
  //   currentUserId,
  onSuccess,
}: {
  commentId: string;
  currentUserId?: string;
  onSuccess: () => void;
}) => {
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();
  const { userSignInDetails } = useUserSignInDetails();
  const profilePicture = userSignInDetails?.data.profilePicture;
  const replyMutation = useMutation({
    mutationFn: async (data: { replyText: string; commentId: string }) => {
      return postReply(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies', commentId] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Reply posted!');
      setReplyText('');
      onSuccess();
    },
    onError: () => {
      toast.error('Failed to post reply. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!replyText.trim()) return;
    replyMutation.mutate({ replyText: replyText.trim(), commentId });
  };

  return (
    <div className='flex gap-2'>
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
      <div className='w-full'>
        <div className='flex w-full min-w-0 rounded-2xl bg-gray-100'>
          <Input
            type='text'
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder='Write a reply...'
            className='h-20 flex-1 rounded-2xl border-none bg-transparent px-3 py-2 text-sm shadow-none focus:outline-none focus-visible:ring-0'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!replyText.trim() || replyMutation.isPending}
            className='p-2 text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Send className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyForm;
