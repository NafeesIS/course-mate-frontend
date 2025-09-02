'use client';

import { BASE_URL_BACKEND } from '@/constants';
import { CreateFeedbackInput, CreateFeedbackResponse } from '../_types/types';

export async function createFeedback(
  payload: CreateFeedbackInput
): Promise<CreateFeedbackResponse> {
  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/feedback/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.message || 'Something went wrong while submitting feedback.'
    );
  }
  return data as CreateFeedbackResponse;
}
