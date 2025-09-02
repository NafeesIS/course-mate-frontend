'use client';
import { useTimeAgo } from '@/app/(root)/docs/_hooks/useTimeAgo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit3, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { IComment } from '../../../../_types/types';
import {
  deleteComment,
  deleteReply,
  updateComment,
  updateReply,
} from '../../_services/services';
import AuthModal from './AuthModal';
import DeleteCommentDialog from './DeleteCommentDialog';
import ReplyForm from './ReplyForm';
import ReplyList from './ReplyList';

// Types
interface CommentProps {
  comment: IComment;
  currentUserId?: string;
  isReply?: boolean;
  onReplySuccess?: () => void;
}

// Individual Comment Component
const Comment = ({
  comment,
  currentUserId,
  isReply = false,
  onReplySuccess,
}: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editText, setEditText] = useState(
    isReply ? comment.replyText || '' : comment.commentText || ''
  );
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [replyCount, setReplyCount] = useState(comment.replyCount || 0);

  const queryClient = useQueryClient();

  const isOwnComment = isReply
    ? comment.repliedBy?._id === currentUserId
    : comment.commentedBy?._id === currentUserId;

  const author = isReply ? comment.repliedBy : comment.commentedBy;
  const profilePicture = author?.profilePicture;
  const meta = author?.meta_data || {};
  const userName =
    `${meta.firstName || ''} ${meta.lastName || ''}`.trim() || 'Anonymous';
  const commentText = isReply ? comment.replyText : comment.commentText;

  const timeAgo = useTimeAgo(comment.createdAt);

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      if (isReply) {
        return updateReply(id, text);
      } else {
        return updateComment(id, { commentText: text });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      toast.success(isReply ? 'Reply updated!' : 'Comment updated!');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update. Please try again.');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isReply) {
        return deleteReply(id);
      } else {
        return deleteComment(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      toast.success(isReply ? 'Reply deleted!' : 'Comment deleted!');
      if (isReply && onReplySuccess) {
        onReplySuccess();
      }
    },
    onError: () => {
      toast.error('Failed to delete. Please try again.');
    },
  });

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== commentText) {
      editMutation.mutate({ id: comment._id, text: editText.trim() });
    } else {
      setIsEditing(false);
    }
  };

  const handleReply = () => {
    if (!currentUserId) {
      setShowAuthModal(true);
      return;
    }
    setShowReplyForm(!showReplyForm);
  };
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    deleteMutation.mutate(comment._id);
    setShowDeleteDialog(false);
  };
  return (
    <>
      <div className='space-y-2'>
        <div className='flex gap-2'>
          {/* Avatar */}
          <div className='flex-shrink-0'>
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt={userName}
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

          {/* Comment Content */}
          <div className='min-w-0 flex-1'>
            <div className='rounded-2xl bg-gray-100 px-3 py-2'>
              <div className='text-sm font-semibold text-gray-900'>
                {userName}
              </div>

              {isEditing ? (
                <div className='mt-1'>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className='w-full resize-none rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    rows={2}
                    autoFocus
                  />
                  <div className='mt-2 flex gap-2'>
                    <button
                      onClick={handleSaveEdit}
                      disabled={editMutation.isPending}
                      className='rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50'
                    >
                      {editMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditText(commentText || '');
                        setIsEditing(false);
                      }}
                      className='rounded-md bg-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-400'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className='mt-1 whitespace-pre-wrap break-words text-sm text-gray-900'>
                  {commentText}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='mt-1 flex items-center gap-2 whitespace-nowrap px-3 xs:gap-4'>
              <span className='text-xs font-semibold text-gray-600'>
                {timeAgo}
              </span>

              {!isReply && (
                <button
                  onClick={handleReply}
                  className='text-xs font-semibold text-gray-600 transition-colors hover:text-primary'
                >
                  Reply
                </button>
              )}

              {isOwnComment && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className='flex items-center gap-1 text-xs font-semibold text-gray-600 transition-colors hover:text-primary'
                  >
                    <Edit3 className='h-3 w-3' />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className='flex items-center gap-1 text-xs font-semibold text-gray-600 transition-colors hover:text-red-600'
                  >
                    <Trash2 className='h-3 w-3' />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && !isReply && (
          <div className='ml-10'>
            <ReplyForm
              commentId={comment._id}
              currentUserId={currentUserId}
              onSuccess={() => {
                setShowReplyForm(false);
                setReplyCount((prev) => prev + 1);
              }}
            />
          </div>
        )}

        {/* Replies */}
        {!isReply && replyCount > 0 && (
          <div className='ml-10'>
            <ReplyList
              commentId={comment._id}
              currentUserId={currentUserId}
              replyCount={replyCount}
              onReplyCountChange={setReplyCount}
            />
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <DeleteCommentDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        isReply={isReply}
      />
    </>
  );
};

export default Comment;
