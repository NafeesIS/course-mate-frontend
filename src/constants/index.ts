export const BASE_URL_FRONTEND =
  process.env.NEXT_PUBLIC_SITEMAP_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITEMAP_ENV === 'staging'
      ? 'https://staging.filesure.in'
      : 'https://www.filesure.in';

export const BASE_URL_BACKEND =
  process.env.NEXT_PUBLIC_SITEMAP_ENV === 'development'
    ? 'http://localhost:4000'
    : process.env.NEXT_PUBLIC_SITEMAP_ENV === 'staging'
      ? 'https://development.filesure.in'
      : 'https://production.filesure.in';

export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_SITEMAP_ENV === 'development'
    ? 'rzp_test_Rj7XtPPSAdqCJF' // test key id
    : process.env.NEXT_PUBLIC_SITEMAP_ENV === 'staging'
      ? 'rzp_test_Rj7XtPPSAdqCJF' // test key id
      : 'rzp_live_fL2csbGrfZxLos'; // live key id

export const CASHFREE_INSTANCE_MODE =
  process.env.NEXT_PUBLIC_SITEMAP_ENV === 'development'
    ? 'sandbox' // test
    : process.env.NEXT_PUBLIC_SITEMAP_ENV === 'staging'
      ? 'sandbox' // test
      : 'production'; // live

export const FILESURE_SUPPORT_EMAIL = 'helpdesk@filesure.in';

// *** NEW COMPANY ALERT Campaign configuration ***
// export const NCA_CAMPAIGN_START_DATE = '2025-06-01T00:00:00'; // 'YYYY-MM-DDTHH:mm:ss'
// export const NCA_CAMPAIGN_END_DATE = '2025-06-30T23:59:59'; // 'YYYY-MM-DDTHH:mm:ss'
// export const NCA_DISCOUNT_PERCENTAGE = 60; // discount percentage
// export const NCA_DISCOUNT_PERCENTAGE_EMAIL_MOBILE = 80; // discount percentage
export const MAINTENANCE_MODE = false;
