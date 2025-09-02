'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { DirectorContactStatus } from '../_types/types';

interface ContactVisibilityControlProps {
  directorInfo: DirectorContactStatus;
  onToggleContact: (_action: 'hide' | 'show') => void;
  isUpdating: boolean;
  className?: string;
}

export const ContactVisibilityControl = ({
  directorInfo,
  onToggleContact,
  isUpdating,
  className,
}: ContactVisibilityControlProps) => {
  return (
    <div className={cn('rounded-lg border bg-white p-4', className)}>
      <div className='mb-2 flex items-center gap-2'>
        <Shield className='size-4 text-gray-600' />
        <h3 className='text-sm font-medium text-gray-900'>
          Contact Information Visibility
        </h3>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <p className='text-xs font-medium text-gray-600'>
            Current Status:
            <span
              className={`ml-1 font-medium ${
                directorInfo.hideContactInfo ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {directorInfo.hideContactInfo
                ? 'Hidden from public view'
                : 'Visible to public'}
            </span>
          </p>
          <p className='text-xs text-gray-600'>
            {directorInfo.hideContactInfo
              ? 'Contact information is currently hidden and not accessible to users'
              : 'Contact information is currently visible and accessible to users'}
          </p>
        </div>

        <div className='flex gap-3'>
          {directorInfo.hideContactInfo ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isUpdating}
                  className='w-full bg-green-600 text-white hover:bg-green-700'
                >
                  {isUpdating ? (
                    'Updating...'
                  ) : (
                    <>
                      <Eye className='mr-2 h-4 w-4' />
                      Show Contact
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className='flex items-center gap-2'>
                    <Eye className='h-5 w-5 text-green-600' />
                    Show Contact Information
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-left'>
                    Are you sure you want to show contact information for{' '}
                    <span className='font-semibold'>
                      {directorInfo.fullName}
                    </span>
                    ?
                    <br />
                    This will allow users to access their contact details.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onToggleContact('show')}
                    className='bg-green-600 hover:bg-green-700'
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Show Contact'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isUpdating}
                  variant='destructive'
                  className='w-full'
                >
                  {isUpdating ? (
                    'Updating...'
                  ) : (
                    <>
                      <EyeOff className='mr-2 h-4 w-4' />
                      Hide Contact
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className='flex items-center gap-2'>
                    <EyeOff className='h-5 w-5 text-red-600' />
                    Hide Contact Information
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-left'>
                    Are you sure you want to hide contact information for{' '}
                    <span className='font-semibold'>
                      {directorInfo.fullName}
                    </span>
                    ?
                    <br />
                    This will prevent users from accessing their contact
                    details.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onToggleContact('hide')}
                    className='bg-red-600 hover:bg-red-700'
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Hide Contact'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};
