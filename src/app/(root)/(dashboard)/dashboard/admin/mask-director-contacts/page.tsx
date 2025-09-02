'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { DirectorInfoCard } from './_components/DirectorInfoCard';
import { ErrorAlert } from './_components/ErrorAlert';
import { InstructionsCard } from './_components/InstructionsCard';
import { LoadingCard } from './_components/LoadingCard';
import { SearchSection } from './_components/SearchSection';
import { useDirectorContact } from './_hooks/useDirectorContact';

export default function MaskDirectorContactsPage() {
  const [din, setDin] = useState('');
  const [searchDin, setSearchDin] = useState('');
  const queryClient = useQueryClient();

  const {
    directorInfo,
    isLoading,
    error,
    toggleMutation,
    handleToggleContact,
  } = useDirectorContact(searchDin);

  const handleSearch = () => {
    if (!din.trim()) {
      toast.error('Please enter a valid DIN number');
      return;
    }
    setSearchDin(din.trim());
  };

  const resetSearch = () => {
    setDin('');
    setSearchDin('');
    queryClient.removeQueries({ queryKey: ['directorContactStatus'] });
  };

  return (
    <div className='wrapper'>
      <h1 className='mb-2 text-xl font-bold text-gray-900'>
        Mask Director Contacts
      </h1>
      <p className='text-sm text-gray-600'>
        Search directors by DIN and manage their contact information visibility
      </p>

      {/* Search Section */}
      <SearchSection
        din={din}
        setDin={setDin}
        onSearch={handleSearch}
        onReset={resetSearch}
        isLoading={isLoading}
        hasResults={!!directorInfo}
        className='mt-6'
      />

      {/* Error Display */}
      <ErrorAlert error={error} className='mt-6' />

      {/* Loading State */}
      {isLoading && <LoadingCard className='mt-6' />}

      {/* Director Information */}
      {directorInfo && !isLoading && (
        <DirectorInfoCard
          directorInfo={directorInfo}
          onToggleContact={handleToggleContact}
          isUpdating={toggleMutation.isPending}
          className='mt-6'
        />
      )}

      {/* Instructions */}
      {!directorInfo && !isLoading && !error && (
        <InstructionsCard className='mt-6' />
      )}
    </div>
  );
}
