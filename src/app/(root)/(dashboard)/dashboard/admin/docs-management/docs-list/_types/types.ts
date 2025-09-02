import { Doc } from '@/app/(root)/docs/_types/types';
import { Editor } from '@tiptap/react';

export interface DeleteDocsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  docs: Doc | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export interface DocsPaginationProps {
  meta: PaginationMeta;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
}

export interface RichTextEditorProps {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
  error?: boolean;
  isFullScreen: boolean;
  setIsFullScreen: any;
}

export interface MenuBarProps {
  editor: Editor;
  disabled?: boolean;
  isPreviewMode: boolean;
  isFullScreen: boolean;
  onTogglePreview: () => void;
  onToggleFullScreen: () => void;
}
export interface PreviewContentProps {
  open?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?: (open: boolean) => void;
  content: string;
}
