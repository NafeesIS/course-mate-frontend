/* eslint-disable no-console */
/* eslint-disable camelcase */
import { BASE_URL_FRONTEND } from '@/constants';
import { getLocalStorage, setLocalStorage } from '@/lib/localStorage';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SuperTokensConfig } from 'supertokens-auth-react/lib/build/types';
import { default as EmailPassword } from 'supertokens-auth-react/recipe/emailpassword';
import EmailVerification from 'supertokens-auth-react/recipe/emailverification';
import Session from 'supertokens-auth-react/recipe/session';
import ThirdPartyReact from 'supertokens-auth-react/recipe/thirdparty';
import { getUserInfo } from '../_services/services';
import { getUtmParamsFromUrl } from '../_utils/utils';
import { appInfo } from './appInfo';

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } =
  {};

export function setRouter(
  router: ReturnType<typeof useRouter>,
  pathName: string
) {
  routerInfo.router = router;
  routerInfo.pathName = pathName;

  // store paths before auth page
  if (!pathName.includes('/auth')) setLocalStorage('urlHistory', pathName);
}

export const frontendConfig = (): SuperTokensConfig => {
  return {
    appInfo,
    // privacyPolicyLink: `${BASE_URL_FRONTEND}/privacy-policy`,
    // termsOfServiceLink: `${BASE_URL_FRONTEND}/terms-and-conditions`,
    recipeList: [
      ThirdPartyReact.init({
        signInAndUpFeature: {
          providers: [ThirdPartyReact.Google.init()],
        },
      }),
      EmailPassword.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: 'agreeToTerms',
                label: '',
                optional: false,
                nonOptionalErrorMsg:
                  'Accept our terms and privacy policy to continue',
                validate: async (value) => {
                  if (value !== 'true') {
                    return 'Accept our terms and privacy policy to continue';
                  }
                },
                inputComponent: ({ name, value, onChange }) =>
                  React.createElement(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        alignItems: 'left',
                        justifyItems: 'left',
                        justifyContent: 'left',
                        text: 'left',
                        fontSize: '13px',
                      },
                    },
                    React.createElement('input', {
                      type: 'checkbox',
                      name: name,
                      checked: value === 'true',
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange(e.target.checked.toString()),
                      style: {
                        cursor: 'pointer',
                      },
                    }),
                    React.createElement(
                      'span',
                      { style: { marginLeft: 5 } },
                      'I agree to the',
                      React.createElement(
                        'a',
                        {
                          href: `${BASE_URL_FRONTEND}/terms-and-conditions`,
                          'data-supertokens': 'link',
                          target: '_blank',
                          style: {
                            color: 'hsl(206, 100%, 40%)',
                            textDecoration: 'underline',
                            fontSize: '13px',
                          },
                        },
                        'Terms'
                      ),
                      '&',
                      React.createElement(
                        'a',
                        {
                          href: `${BASE_URL_FRONTEND}/privacy-policy`,
                          'data-supertokens': 'link',
                          target: '_blank',
                          style: {
                            color: 'hsl(206, 100%, 40%)',
                            textDecoration: 'underline',
                            fontSize: '13px',
                          },
                        },
                        'Privacy Policy'
                      )
                    )
                  ),
              },
            ],
          },
        },
      }),
      EmailVerification.init({
        mode: 'REQUIRED', // or "OPTIONAL"
      }),
      Session.init({
        tokenTransferMethod: 'header',
      }),
    ],
    getRedirectionURL: async (context) => {
      if (context.action === 'SUCCESS' && context.newSessionCreated) {
        // Determine the URL to redirect to
        let urlHistory;
        if (urlHistory && typeof urlHistory === 'string') {
          // If there's a stored URL, use it for redirection
          urlHistory = getLocalStorage('urlHistory');
        } else if (!routerInfo.pathName?.includes('/auth')) {
          // If the current path is not an auth page, use it for redirection
          urlHistory = routerInfo.pathName;
        } else {
          // Default redirection to dashboard / home
          urlHistory = '/';
        }

        // Get user details
        const userInfo = await getUserInfo();
        const userId = userInfo._id;
        const userEmail = userInfo.emails[0] || '';
        const userName = `${userInfo.meta_data.firstName || ''} ${userInfo.meta_data.lastName || ''}`;

        // Get UTM parameters
        const utmParams = getUtmParamsFromUrl();

        // If the user is new, track the signup event
        if (context.createdNewUser) {
          console.log('user signed up');

          // THRIVESTACK: SIGNUP TRACKING CODE
          if (typeof window !== 'undefined' && window.thriveStack) {
            window.thriveStack.track([
              {
                event_name: 'signed_up',
                properties: {
                  user_email: userEmail,
                  user_name: userName,
                  utm_campaign: utmParams.utm_campaign || '',
                  utm_medium: utmParams.utm_medium || '',
                  utm_source: utmParams.utm_source || '',
                  utm_term: utmParams.utm_term || '',
                },
                user_id: userId,
                timestamp: new Date().toISOString(),
              },
            ]);
          }

          return `/auth/complete-profile?redirectTo=${urlHistory}`;
        } else {
          console.log('user signed in');

          // THRIVESTACK: USER SIGNED-IN CODE
          if (typeof window !== 'undefined' && window.thriveStack) {
            window.thriveStack.track([
              {
                event_name: 'signed_in',
                properties: {
                  user_email: userEmail,
                  user_name: userName,
                },
                user_id: userId,
                timestamp: new Date().toISOString(),
                context: {
                  group_id: userId, // TODO: temporary solution
                },
              },
            ]);
          }

          return urlHistory;
        }
      }
      return undefined;
    },
    windowHandler: (original) => ({
      ...original,
      location: {
        ...original.location,
        getPathName: () => routerInfo.pathName!,
        assign: (url) => routerInfo.router!.push(url.toString()),
        setHref: (url) => routerInfo.router!.push(url.toString()),
      },
    }),
    // other config options
    style: `
      [data-supertokens~='superTokensBranding'] {
        display: none !important;
      }
      [data-supertokens~=container] {
        font-family: var(--font-open-sans), sans-serif;
      }
      [data-supertokens~="link"] {
        padding-left: 5px;
      }
        [data-supertokens~=inputErrorMessage] {
           font-size: 12px;
        }
        [data-supertokens~=row] {
           width: 290px;
        }
      /* Mobile Responsiveness */
      @media (max-width: 480px) {
        [data-supertokens~=container] {
          padding: 0px;
            margin-top: 0px;
            margin-bottom: 0px;
        }
        [data-supertokens~=inputErrorMessage] {
           font-size: 11px;
        }
        [data-supertokens~=headerTitle] {
          font-size: 24px;
          font-weight: 600;
        }
        [data-supertokens~=headerSubtitle] {
          font-size: 14px;
        }
        [data-supertokens~=input]{
         marginBottom: '3px';
        },
        [data-supertokens~=button],
        [data-supertokens~=providerButton] {
          font-size: 14px;
          padding: 10px;
        }
        [data-supertokens~="divider"] {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          padding-bottom: 0px;
        }
      }
      @media (max-width: 340px) {
            [data-supertokens~=row] {
           width: 280px;
        }
           [data-supertokens~=inputErrorMessage] {
           font-size: 10px;
        }
      }
    `,
  };
};
