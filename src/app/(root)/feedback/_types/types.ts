export type RatingsCategory = 'overall' | 'website' | 'recommend' | 'support';

export interface Ratings {
  overall: number;
  website: number;
  recommend: number;
  support: number;
}

export interface CreateFeedbackInput {
  overall: number;
  website: number;
  recommend: number;
  support: number;
  feedback: string;
  userType: 'registered' | 'guest';
  recaptchaToken: string;
  userEmail?: string | undefined;
}

export interface CreateFeedbackResponse {
  message: string;
}
