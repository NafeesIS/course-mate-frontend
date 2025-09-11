// src/config/supertokens.ts
"use client";

import { useRouter } from "next/navigation";
import React from "react";
import SuperTokens, { SuperTokensConfig } from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";

import { appInfo } from "./appinfo";

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } = {};

export function setRouter(router: ReturnType<typeof useRouter>, pathName: string) {
  routerInfo.router = router;
  routerInfo.pathName = pathName;
}

export const frontendConfig = (): SuperTokensConfig => {
  return {
    appInfo,
    recipeList: [
      // --- Third Party Login ---
      ThirdPartyReact.init({
        signInAndUpFeature: {
          providers: [ThirdPartyReact.Google.init()],
        },
      }),

      // --- Email/Password Login ---
      EmailPassword.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              // {
              //   id: "agreeToTerms",
              //   label: "",
              //   optional: false,
              //   nonOptionalErrorMsg: "Accept our terms and privacy policy to continue",
              //   validate: async (value) => {
              //     if (value !== "true") {
              //       return "Accept our terms and privacy policy to continue";
              //     }
              //   },
              //   inputComponent: ({ name, value, onChange }) =>
              //     React.createElement(
              //       "div",
              //       { style: { display: "flex", fontSize: "13px" } },
              //       React.createElement("input", {
              //         type: "checkbox",
              //         name,
              //         checked: value === "true",
              //         onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              //           onChange(e.target.checked.toString()),
              //         style: { cursor: "pointer" },
              //       }),
              //       React.createElement(
              //         "span",
              //         { style: { marginLeft: 5 } },
              //         "I agree to the",
              //         React.createElement(
              //           "a",
              //           {
              //             href: "/terms-and-conditions",
              //             "data-supertokens": "link",
              //             target: "_blank",
              //             style: { color: "hsl(206,100%,40%)", textDecoration: "underline" },
              //           },
              //           "Terms"
              //         ),
              //         " & ",
              //         React.createElement(
              //           "a",
              //           {
              //             href: "/privacy-policy",
              //             "data-supertokens": "link",
              //             target: "_blank",
              //             style: { color: "hsl(206,100%,40%)", textDecoration: "underline" },
              //           },
              //           "Privacy Policy"
              //         )
              //       )
              //     ),
              // },
            ],
          },
        },
      }),

      // --- Email Verification ---
      EmailVerification.init({
        mode: "REQUIRED",
      }),

      // --- Session Handling ---
      Session.init({
        tokenTransferMethod: "header",
      }),
    ],

    // --- Redirect Logic ---
    getRedirectionURL: async (context) => {
      if (context.action === "SUCCESS" && context.newSessionCreated) {
        if (context.createdNewUser) {
          console.log("user signed up");
          return "/dashboard";
        } else {
          console.log("user signed in");
          return "/dashboard";
        }
      }
      return undefined;
    },

    // --- Router-aware redirects ---
    windowHandler: (original) => ({
      ...original,
      location: {
        ...original.location,
        getPathName: () => routerInfo.pathName!,
        assign: (url) => routerInfo.router!.push(url.toString()),
        setHref: (url) => routerInfo.router!.push(url.toString()),
      },
    }),

    // --- Custom CSS overrides ---
    style: `
      [data-supertokens~='superTokensBranding'] {
        display: none !important;
      }
      [data-supertokens~=container] {
        font-family: var(--font-open-sans), sans-serif;
      }
      [data-supertokens~=inputErrorMessage] {
        font-size: 12px;
      }
      @media (max-width: 480px) {
        [data-supertokens~=container] {
          padding: 0;
        }
        [data-supertokens~=headerTitle] {
          font-size: 24px;
          font-weight: 600;
        }
      }
    `,
  };
};

// Initialize SuperTokens
if (typeof window !== "undefined") {
  // only run on the client side
  SuperTokens.init(frontendConfig());
}