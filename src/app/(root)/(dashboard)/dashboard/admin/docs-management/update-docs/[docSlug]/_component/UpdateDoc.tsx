'use client';

import { Doc } from '@/app/(root)/docs/_types/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { UpdateDocsFormData } from '../../../docs-list/_components/UpdateDocForm';
import { updateDoc } from '../../../docs-list/_services/services';
import NewUpdateDocsForm from './NewUpdateDocsForm';

// import DocHeader from './DocHeader';

interface UpdateDocPageProps {
  docData: Doc;
}

const UpdateDoc = ({ docData }: UpdateDocPageProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const handleUpdateDocs = async (data: UpdateDocsFormData) => {
    if (!docData) return;
    setIsUpdating(true);
    try {
      await updateDoc(docData._id, data);
      toast.success('Docs updated successfully!');
      router.push('/dashboard/admin/docs-management/docs-list');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update doc. Please try again.';
      toast.error(message, { duration: 10000 });
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className='rounded-lg border bg-white p-4 shadow md:p-6'>
      <NewUpdateDocsForm
        onSubmit={handleUpdateDocs}
        isLoading={isUpdating}
        submitText='Update & Publish Docs'
        // resetSignal={resetSignal}
        initialData={{
          title: docData.title,
          slug: docData.slug,
          content: docData.content,
          headerImageId: docData.headerImageId,
          thumbnailId: docData.thumbnailId,
          isFeatured: docData.isFeatured,
          tagIds: docData.tagIds,
          mediaIds: docData.mediaIds,
          metaDescription: docData.metaDescription,
          metaTitle: docData.metaTitle,
          status: docData.status,
          categoryId: docData.categoryId._id,
          subcategoryId: docData.subcategoryId ? docData.subcategoryId._id : '',
          excerpt: docData.excerpt,
        }}
      />
    </div>
  );
};

export default UpdateDoc;
