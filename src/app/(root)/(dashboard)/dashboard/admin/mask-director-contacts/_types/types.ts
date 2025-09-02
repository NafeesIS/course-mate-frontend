export interface DirectorContactStatus {
  din: string;
  fullName: string;
  status: string;
  personType: string;
  totalDirectorshipCount: number;
  companies: string[];
  hideContactInfo: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: DirectorContactStatus;
}

export interface ToggleContactParams {
  action: 'hide' | 'show';
  din: string;
}
