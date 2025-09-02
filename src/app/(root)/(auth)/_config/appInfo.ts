import { BASE_URL_BACKEND, BASE_URL_FRONTEND } from '@/constants';

export const appInfo = {
  // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
  appName: 'FileSure',
  apiDomain: BASE_URL_BACKEND,
  websiteDomain: BASE_URL_FRONTEND,
  apiBasePath: '/api/v1/auth',
  websiteBasePath: '/auth',
};
