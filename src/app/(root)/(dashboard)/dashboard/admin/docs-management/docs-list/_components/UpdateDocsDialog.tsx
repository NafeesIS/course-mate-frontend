import { Doc } from '@/app/(root)/docs/_types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UpdateDocsForm, { UpdateDocsFormData } from './UpdateDocForm';

interface UpdateDocsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: UpdateDocsFormData) => void;
  isLoading: boolean;
  doc: Doc | null;
}

const UpdateDocsDialog: React.FC<UpdateDocsDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  doc,
}) => {
  if (!doc) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-[95vw] overflow-y-auto md:max-w-[90%]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-medium text-gray-900'>
            Update Docs
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-600'>
            Make changes to the doc information.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <UpdateDocsForm
            initialData={{
              title: doc.title,
              slug: doc.slug,
              content: doc.content,
              headerImageId: doc.headerImageId,
              thumbnailId: doc.thumbnailId,
              isFeatured: doc.isFeatured,
              tagIds: doc.tagIds,
              mediaIds: doc.mediaIds,
              metaDescription: doc.metaDescription,
              metaTitle: doc.metaTitle,
              status: doc.status,
              categoryId: doc.categoryId._id,
              subcategoryId: doc.subcategoryId ? doc.subcategoryId._id : '',
              excerpt: doc.excerpt,
            }}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitText='Update Docs'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDocsDialog;
