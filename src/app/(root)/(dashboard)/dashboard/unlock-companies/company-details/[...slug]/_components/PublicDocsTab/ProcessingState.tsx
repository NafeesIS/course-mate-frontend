'use client';

import { IPublicDocument } from '@/app/(root)/company/_types/PublicDocsTypes';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const steps = [
  'MCA Challan Payment',
  'Document Download',
  'Zip File Compilation',
] as const;

type StepState = 'pending' | 'in_progress' | 'success' | 'failed';

interface ProcessingStateProps {
  status: IPublicDocument;
  isLoading: boolean;
}

const ProcessingState: React.FC<ProcessingStateProps> = ({ status }) => {
  const [challanState, setChallanState] = useState<StepState>('pending');
  const [documentDownloadState, setDocumentDownloadState] =
    useState<StepState>('pending');
  const [zipFileCompilationState, setZipFileCompilationState] =
    useState<StepState>('pending');

  // Update individual step states based on status
  useEffect(() => {
    // Update challan state
    if (
      status.downloadStatus?.challanPaidAt ||
      status.downloadStatus?.documentDownloadStatus === 'in_progress' ||
      status.downloadStatus?.documentDownloadStatus === 'success'
    ) {
      setChallanState('success');
    } else {
      setChallanState('in_progress');
    }

    // Update document download state
    if (status.downloadStatus?.documentDownloadStatus === 'success') {
      setDocumentDownloadState('success');
    } else if (
      status.downloadStatus?.documentDownloadStatus === 'in_progress' ||
      status.downloadStatus?.jobStatus === 'downloading_docs'
    ) {
      setDocumentDownloadState('in_progress');
    } else {
      setDocumentDownloadState('pending');
    }

    // Update zip file compilation state
    if (status.downloadStatus?.zipCompletedAt) {
      setZipFileCompilationState('success');
    } else if (documentDownloadState === 'success') {
      setZipFileCompilationState('in_progress');
    } else {
      setZipFileCompilationState('pending');
    }
  }, [status.downloadStatus, challanState, documentDownloadState]);

  const getStepState = (index: number): StepState => {
    switch (index) {
      case 0:
        return challanState;
      case 1:
        return documentDownloadState;
      case 2:
        return zipFileCompilationState;
      default:
        return 'pending';
    }
  };

  const getStateColors = (state: StepState) => {
    switch (state) {
      case 'success':
        return {
          border: 'border-green-500',
          bg: 'bg-green-600',
          text: 'text-green-700',
          bgLight: 'bg-green-100',
          textDark: 'text-green-800',
        };
      case 'in_progress':
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-500',
          text: 'text-blue-600',
          bgLight: 'bg-blue-100',
          textDark: 'text-blue-800',
        };
      case 'failed':
        return {
          border: 'border-red-500',
          bg: 'bg-red-500',
          text: 'text-red-600',
          bgLight: 'bg-red-100',
          textDark: 'text-red-800',
        };
      default:
        return {
          border: 'border-gray-300',
          bg: 'bg-gray-300',
          text: 'text-gray-500',
          bgLight: 'bg-gray-100',
          textDark: 'text-gray-800',
        };
    }
  };

  const renderStepContent = (name: string, index: number) => {
    const stepState = getStepState(index);
    const colors = getStateColors(stepState);
    const isCompleted = stepState === 'success';
    const isCurrent = stepState === 'in_progress';
    const isFailed = stepState === 'failed';

    return (
      <div
        key={name}
        className={`relative z-10 flex w-full flex-row items-start gap-4 sm:w-auto sm:flex-col sm:items-center sm:gap-2
          ${index === 0 ? 'sm:ml-0' : 'ml-0'} 
          ${index === steps.length - 1 ? 'sm:mr-0' : ''}`}
      >
        <motion.div
          className={`flex size-6 items-center justify-center rounded-full border-2
            ${
              isCompleted
                ? `${colors.border} ${colors.bg} text-white`
                : isCurrent
                  ? `${colors.border} ${colors.bgLight} ${colors.text}`
                  : isFailed
                    ? `${colors.border} ${colors.bgLight} ${colors.text}`
                    : 'border-gray-300 bg-white text-gray-300'
            }`}
          initial={false}
          animate={{
            scale: isCurrent ? 1.1 : 1,
            transition: { duration: 0.3 },
          }}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={stepState}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isCompleted ? (
                <Check className='size-3' />
              ) : isCurrent ? (
                <Loader2 className='size-3 animate-spin' />
              ) : isFailed ? (
                <AlertCircle className='size-3' />
              ) : (
                <Check className='size-3' />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className='flex flex-1 flex-col items-start sm:items-center'>
          <p
            className={`text-xs font-medium 
              ${
                isCompleted
                  ? colors.text
                  : isCurrent
                    ? colors.text
                    : isFailed
                      ? colors.text
                      : 'text-gray-500'
              }`}
          >
            {name}
          </p>
          <span
            className={`mt-1 rounded-full border border-gray-300 px-3 py-0.5 text-[10px] font-medium 
              ${
                isCompleted
                  ? `${colors.bgLight} ${colors.textDark}`
                  : isCurrent
                    ? `${colors.bgLight} ${colors.textDark}`
                    : isFailed
                      ? `${colors.bgLight} ${colors.textDark}`
                      : 'bg-gray-100 text-gray-800'
              }`}
          >
            {isCompleted
              ? 'Completed'
              : isCurrent
                ? 'In Progress'
                : isFailed
                  ? 'Failed'
                  : 'Pending'}
          </span>

          {index === 0 && status.downloadStatus?.challanPaidAt && (
            <div className='mt-2 text-[10px] font-medium text-muted-foreground'>
              {format(
                status.downloadStatus?.challanPaidAt,
                'dd MMM yyyy hh:mm a'
              )}
            </div>
          )}

          {index === 1 && (
            <>
              {status.downloadStatus?.downloadCompletedAt && (
                <div className='mt-2 text-[10px] font-medium text-muted-foreground'>
                  {format(
                    status.downloadStatus?.downloadCompletedAt,
                    'dd MMM yyyy hh:mm a'
                  )}
                </div>
              )}

              {status.downloadStatus?.documentDownloadStatus ===
                'in_progress' &&
                status.downloadStatus?.totalDocuments && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='mt-4 flex flex-col items-center text-center'
                  >
                    <div className='text-[10px] font-medium text-gray-700'>
                      Processing Documents:{' '}
                      <span className='text-gray-900'>
                        {status.downloadStatus?.downloadedDocuments || 0} /{' '}
                        {status.downloadStatus?.totalDocuments}
                      </span>
                    </div>
                    <div className='mt-2 h-1.5 w-64 rounded-full bg-gray-300'>
                      <motion.div
                        className='h-full rounded-full bg-blue-500'
                        initial={{ width: '0%' }}
                        animate={{
                          width: `${status.downloadStatus?.downloadedDocuments !== undefined ? (status.downloadStatus?.downloadedDocuments / status.downloadStatus?.totalDocuments) * 100 : 0}%`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                )}
            </>
          )}

          {index === 2 && status.downloadStatus?.zipCompletedAt && (
            <div className='mt-2 text-[10px] font-medium text-muted-foreground'>
              {format(
                status.downloadStatus?.zipCompletedAt,
                'dd MMM yyyy hh:mm a'
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='mx-auto w-full max-w-4xl px-4 py-6'>
      <div className='relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:gap-0'>
        {/* Desktop progress line */}
        <div className='absolute left-14 right-14 top-3 hidden h-[2px] bg-gray-200 sm:block'></div>

        {/* Mobile progress line */}
        <div className='absolute bottom-10 left-3 top-0 w-[2px] bg-gray-200 sm:hidden'></div>

        {steps.map(renderStepContent)}
      </div>
    </div>
  );
};

export default ProcessingState;
