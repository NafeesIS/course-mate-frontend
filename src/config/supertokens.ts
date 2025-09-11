"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { SuperTokensConfig } from "supertokens-auth-react";
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
                id: "agreeToTerms",
                label: "",
                optional: false,
                nonOptionalErrorMsg: "Accept our terms and privacy policy to continue",
                validate: async (value) => {
                  if (value !== "true") {
                    return "Accept our terms and privacy policy to continue";
                  }
                  return undefined;
                },
                inputComponent: ({ name, value, onChange }) =>
                  React.createElement(
                    "div",
                    { style: { display: "flex", fontSize: "13px", alignItems: "center" } },
                    React.createElement("input", {
                      type: "checkbox",
                      name,
                      checked: value === "true",
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange(e.target.checked.toString()),
                      style: { cursor: "pointer", marginRight: "8px" },
                    }),
                    React.createElement(
                      "span",
                      {},
                      "I agree to the ",
                      React.createElement(
                        "a",
                        {
                          href: "/terms-and-conditions",
                          target: "_blank",
                          style: { color: "#3b82f6", textDecoration: "underline" },
                        },
                        "Terms"
                      ),
                      " & ",
                      React.createElement(
                        "a",
                        {
                          href: "/privacy-policy",
                          target: "_blank",
                          style: { color: "#3b82f6", textDecoration: "underline" },
                        },
                        "Privacy Policy"
                      )
                    )
                  ),
              },
            ],
          },
        },
      }),

      EmailVerification.init({
        mode: "REQUIRED",
      }),

      Session.init({
        tokenTransferMethod: "header",
      }),
    ],

    getRedirectionURL: async (context) => {
      if (context.action === "SUCCESS" && context.newSessionCreated) {
        if (context.createdNewUser) {
          console.log("User signed up");
          return "/dashboard";
        } else {
          console.log("User signed in");
          return "/dashboard";
        }
      }
      return undefined;
    },

    windowHandler: (original) => ({
      ...original,
      location: {
        ...original.location,
        getPathName: () => routerInfo.pathName || window.location.pathname,
        assign: (url) => {
          if (routerInfo.router) {
            routerInfo.router.push(url.toString());
          } else {
            window.location.assign(url);
          }
        },
        setHref: (url) => {
          if (routerInfo.router) {
            routerInfo.router.push(url.toString());
          } else {
            window.location.href = url.toString();
          }
        },
      },
    }),

    style: `
      [data-supertokens~='superTokensBranding'] {
        display: none !important;
      }
      [data-supertokens~=container] {
        font-family: system-ui, -apple-system, sans-serif;
      }
      [data-supertokens~=inputErrorMessage] {
        font-size: 12px;
      }
      @media (max-width: 480px) {
        [data-supertokens~=container] {
          padding: 16px;
        }
        [data-supertokens~=headerTitle] {
          font-size: 24px;
          font-weight: 600;
        }
      }
    `,
  };
};