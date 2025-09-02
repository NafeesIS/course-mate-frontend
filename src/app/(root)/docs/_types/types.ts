export interface IRecentSearchTags {
  name: string;
  slug: string;
}
export interface TUserMetaData {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  bio?: string;
  avatarUrl?: string;
  social?: {
    linkedin?: string;
    facebook?: string;
    github?: string;
  };
}
export interface ITag {
  _id: string;
  name: string;
  slug: string;
  createdBy: {
    _id: string;
    profilePicture: string;
    meta_data: TUserMetaData;
    emails: string[];
  };
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedia {
  _id: string;
  url: string;
  title: string;
  type: 'image' | 'jpeg' | 'video' | 'mp4';
  isDeleted: boolean;
}

export interface Doc {
  _id: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  headerImageId: IMedia;
  mediaIds: IMedia[];
  content: string;
  categoryId: ICategory;
  subcategoryId: ISubcategory;
  tagIds: ITag[];
  isFeatured: boolean;
  authorId: {
    _id: string;
    profilePicture: string;
    meta_data: TUserMetaData;
    emails: string[];
  };
  createdAt: string;
  updatedAt: string;
  slug: string;
  readTime: number;
  status: 'draft' | 'published' | 'archived';
  isHomepage?: boolean;
  shareCount?: number;
  viewCount?: number;
  likeCount?: number;
  excerpt: string;
  thumbnailId?: IMedia;
}

export interface FetchOptions {
  limit?: number;
  page?: number;
  sort?: 'asc' | 'desc';
}

export interface IBookmarks {
  count: number;
  isUserBookmarked: boolean;
}

export interface HelpDocsOptions {
  categoryId: string;
  limit?: number;
  page?: number;
  sort?: 'asc' | 'desc';
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  status: 'active' | 'archived';
  createdBy: string;
  score?: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubcategory extends ICategory {
  isHomepage?: boolean;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
}

export interface ProductDocsOptions {
  subcategoryId: string;
  limit?: number;
  page?: number;
  sort?: 'asc' | 'desc';
}

export interface CategoriesOptions {
  categoryId: string;
}

export interface RecentDocsOptions {
  limit?: number;
  page?: number;
  sort?: 'asc' | 'desc';
}
export interface TagOptions {
  tagId: string;
  page?: number;
  limit?: number;
}

export interface ICommentedBy {
  _id: string;
  emails: string[];
  meta_data: TUserMetaData;
  profilePicture: string;
}

export interface IComment {
  _id: string;
  commentedBy: ICommentedBy;
  repliedBy: ICommentedBy;
  docId: string;
  commentText: string;
  replyText: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
}
