'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { createDocs } from '../../docs-list/_services/services';
import { CreateDocsFormData } from '../_types/types';
import CreateDocsForm from './CreateDocsForm';

const CreateDoc = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const router = useRouter();
  const handleCreateDocs = async (formData: CreateDocsFormData) => {
    setIsCreating(true);

    try {
      await createDocs(formData);
      toast.success('Docs created successfully!');
      setResetSignal(true);
      router.push('/dashboard/admin/docs-management/docs-list');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create doc. Please try again.';
      toast.error(message, { duration: 10000 });
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <div className='rounded-lg border bg-white p-4 shadow md:p-6'>
      <CreateDocsForm
        onSubmit={handleCreateDocs}
        isLoading={isCreating}
        submitText='Publish Docs'
        resetSignal={resetSignal}
      />
    </div>
  );
};

export default CreateDoc;
