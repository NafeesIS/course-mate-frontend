'use client';

import ErrorResponse from '@/app/error/_components/ErrorResponse';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An error occurred';
  const status = searchParams.get('status') || '500';

  return <ErrorResponse message={message} status={parseInt(status)} />;
}
