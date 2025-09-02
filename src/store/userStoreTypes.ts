export interface IUserSignInDetails {
  success: boolean;
  message: string;
  data: IUserData;
}

export interface IBillingDetails {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address?: string;
  city?: string;
  zipCode: string;
  country: string;
  state: string;
  isDefault: boolean;
  billingType: string;
}

export interface IUserData {
  _id: string;
  uId: string;
  __v: number;
  credits: any[]; // Could be defined further if details are known
  emailVerified: boolean;
  emails: string[];
  isPrimaryUser: boolean;
  lastLogin: string; // ISO date string format
  loginMethods: ILoginMethod[]; // Defined below
  meta_data: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    bio?: string;
    avatarUrl?: string;
    _id: string;
    social?: {
      linkedin?: string;
      facebook?: string;
      github?: string;
    };
  };
  orders: string[]; // Array of order IDs
  phoneNumbers: string[];
  profilePicture: string; // URL to profile picture
  roles: string[]; // User roles (if any)
  subscriptions: string[]; // Array of subscription IDs
  billingDetails: IBillingDetails[]; // Define IBillingInfo if necessary
  gstNumber: string[];
  tenantIds: string[];
  thirdParty: IThirdParty[]; // Defined below
  timeJoined: number; // UNIX timestamp
  bulk_unlock_credits: IBulkUnlockCredits[]; // Defined below
}

export interface ILoginMethod {
  recipeId: string; // e.g., "thirdparty" or "emailpassword"
  tenantIds: string[]; // Array of tenant IDs
  timeJoined: number; // UNIX timestamp
  recipeUserId: string; // Unique ID for the recipe user
  verified: boolean; // Whether the method is verified
  email: string; // Email associated with this login method
  thirdParty?: IThirdParty; // Optional, only exists for third-party logins
}

export interface IThirdParty {
  id: string; // e.g., "google", "facebook"
  userId: string; // Third-party user ID
}

export interface IBulkUnlockCredits {
  availableCredits: number;
  creditType: 'directorUnlock' | 'companyUnlock';
  expiryDate: string; // ISO date string format
}
