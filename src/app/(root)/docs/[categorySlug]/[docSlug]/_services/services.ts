import { BASE_URL_BACKEND } from '@/constants';
import { IBookmarks, IComment } from '../../../_types/types';

export const getSingleDocDetails = async (id: string) => {
  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  if (!data.success) {
    return null;
  }

  return data.data;
};

export const getBookmarks = async (
  docId: string,
  userId?: string
): Promise<IBookmarks | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/bookmarks/${docId}?userId=${userId}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  if (!data.success) {
    return null;
  }

  return data.data;
};

export const postBookmarks = async (
  docId: string
): Promise<IBookmarks | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/create-bookmark/${docId}`,
    {
      method: 'POST',
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to create: ${res.status}`);
  }

  const data = await res.json();
  return data.success ? data.data : null;
};

export const DeleteBookmarks = async (
  docId: string
): Promise<IBookmarks | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/delete-bookmark/${docId}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to create: ${res.status}`);
  }

  const data = await res.json();
  return data.success ? data.data : null;
};

export interface CommentFormData {
  commentText: string;
}
export interface replyFormData {
  replyText: string;
  commentId: string;
}
export interface UpdateCommentPayload {
  commentText: string;
}
export interface DeleteCommentResponse {
  deleted: boolean;
}
interface CommentFilters {
  page?: number;
  limit?: number;
  sort?: string;
}
const buildQueryString = (filters: CommentFilters): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return params.toString() ? `?${params.toString()}` : '';
};

export const getComments = async (
  docId: string,
  filters: CommentFilters = {}
): Promise<{ data: IComment[]; meta: any }> => {
  const queryString = buildQueryString(filters);
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/comments/${docId}${queryString}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch comments: ${res.status}`);
  }
  const commentsData = await res.json();
  const { data, meta } = commentsData.data;
  return { data, meta };
};

export const postComment = async (
  docId: string,
  commentData: CommentFormData
): Promise<IComment | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/create-comment/${docId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to post comment: ${res.status}`);
  }

  const data = await res.json();
  return data.success ? data.data : null;
};

export const updateComment = async (
  commentId: string,
  payload: UpdateCommentPayload
): Promise<IComment | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/update-comment/${commentId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update comment: ${res.status}`);
  }

  const data = await res.json();
  return data.success ? data.data : null;
};

export const deleteComment = async (
  commentId: string
): Promise<DeleteCommentResponse | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/delete-comment/${commentId}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete comment: ${res.status}`);
  }

  const data = await res.json();
  return data.success ? data.data : null;
};

// Replies API
export const getRepliesByComment = async (
  commentId: string,
  filters: CommentFilters = {}
): Promise<{ data: IComment[]; meta: any }> => {
  const queryString = buildQueryString(filters);
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/replies/${commentId}${queryString}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch replies: ${res.status}`);
  }
  const replyData = await res.json();
  const { data, meta } = replyData.data;
  return { data, meta };
};

export const postReply = async (
  replyData: replyFormData
): Promise<IComment | null> => {
  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/create-reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(replyData),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to post comment: ${res.status}`);
  }

  const data = await res.json();
  return data.success ? data.data : null;
};

export const updateReply = async (
  replyId: string,
  newText: string
): Promise<IComment | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/update-reply/${replyId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ replyText: newText }),
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update comment: ${res.status}`);
  }

  const data = await res.json();
  return data.success ? data.data : null;
};

export const deleteReply = async (
  replyId: string
): Promise<DeleteCommentResponse | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/delete-reply/${replyId}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete comment: ${res.status}`);
  }

  const data = await res.json();
  return data.success ? data.data : null;
};
