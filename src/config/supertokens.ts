/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import { config } from "./index";

/**
 * SuperTokens Frontend Configuration
 * Handles authentication setup for both development and production
 */

export const frontendConfig = () => {
  const appInfo = {
    appName: config.APP_NAME,
    apiDomain: config.SUPERTOKENS_CONNECTION_URI || "http://localhost:4000", // Default to localhost
    websiteDomain: config.WEBSITE_URL || "http://localhost:3000", // Default to localhost
    apiBasePath: "api/v1/auth",
    websiteBasePath: "/auth",
  };

  return {
    appInfo,
    recipeList: [
      // Email/Password Authentication
      EmailPassword.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "email",
                label: "Email Address",
                placeholder: "Enter your email",
              },
              {
                id: "password",
                label: "Password",
                placeholder: "Enter your password",
              },
            ],
          },
        },
        // Custom styling for auth forms
        style: `
          [data-supertokens~=container] {
            --palette-background: 255, 255, 255;
            --palette-inputBackground: 250, 250, 250;
            --palette-inputBorder: 224, 224, 224;
            --palette-primary: 59, 130, 246;
            --palette-primaryBorder: 59, 130, 246;
            --palette-success: 34, 197, 94;
            --palette-successBackground: 240, 253, 244;
            --palette-error: 239, 68, 68;
            --palette-errorBackground: 254, 242, 242;
            --palette-textTitle: 17, 24, 39;
            --palette-textLabel: 55, 65, 81;
            --palette-textInput: 17, 24, 39;
            --palette-textPrimary: 59, 130, 246;
            --palette-textLink: 59, 130, 246;
            --palette-buttonText: 255, 255, 255;
            --palette-textGray: 156, 163, 175;
            --palette-superTokensBrandingBackground: 242, 245, 247;
            --palette-superTokensBrandingText: 173, 189, 196;
            
            --font-size-0: 12px;
            --font-size-1: 14px;
            --font-size-2: 16px;
            --font-size-3: 19px;
            --font-size-4: 24px;
            
            --border-radius-1: 6px;
            --border-radius-2: 8px;
            
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          
          [data-supertokens~=headerTitle] {
            font-size: var(--font-size-4);
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          [data-supertokens~=headerSubtitle] {
            color: rgb(var(--palette-textGray));
            margin-bottom: 24px;
          }
          
          [data-supertokens~=inputWrapper] {
            margin-bottom: 20px;
          }
          
          [data-supertokens~=input] {
            padding: 12px 16px;
            border-radius: var(--border-radius-2);
            border: 1px solid rgb(var(--palette-inputBorder));
            background: rgb(var(--palette-inputBackground));
            transition: all 0.2s ease;
          }
          
          [data-supertokens~=input]:focus {
            outline: none;
            border-color: rgb(var(--palette-primary));
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          [data-supertokens~=button] {
            padding: 12px 24px;
            border-radius: var(--border-radius-2);
            font-weight: 600;
            transition: all 0.2s ease;
          }
          
          [data-supertokens~=button]:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
          }
          
          [data-supertokens~=divider] {
            margin: 32px 0;
          }
          
          [data-supertokens~=providerGoogle] {
            border: 1px solid rgb(var(--palette-inputBorder));
            background: white;
            color: rgb(var(--palette-textTitle));
          }
          
          [data-supertokens~=providerGoogle]:hover {
            background: rgb(var(--palette-inputBackground));
          }
        `,
      }),

      // Third-party Authentication (Google)
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [ThirdParty.Google.init()],
        },
      }),

      // Session Management
      Session.init({
        tokenTransferMethod: "cookie",
      }),
      EmailVerification.init({
        mode: "OPTIONAL", // or "OPTIONAL"
      }),
    ],

    // Custom redirection logic
    getRedirectionURL: async (context: any) => {
      if (context.action === "SUCCESS") {
        // Redirect to dashboard after successful authentication
        if (context.newSessionCreated) {
          return "/dashboard";
        }
        return "/dashboard";
      }

      if (context.action === "TO_AUTH") {
        return "/auth";
      }

      return undefined;
    },

    // Window handler for popup-based social login
    windowHandler: (oI: any) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          getHostname: () => window.location.hostname,
          setHref: (href: string) => {
            window.location.href = href;
          },
        },
      };
    },
  };
};

// Initialize SuperTokens only on client side
if (typeof window !== "undefined") {
  try {
    SuperTokens.init(frontendConfig());
    console.log("✅ SuperTokens initialized successfully");
  } catch (error) {
    console.error("❌ SuperTokens initialization failed:", error);
  }
}
