/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";

export const frontendConfig = () => {
  return {
    appInfo: {
      appName: "Course Mate",
      apiDomain: "http://localhost:4000",
      websiteDomain: "http://localhost:3000",
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init(),
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [
            ThirdParty.Google.init()
          ],
        },
      }),
      Session.init(),
    ],
    getRedirectionURL: async (context: any) => {
      if (context.action === "SUCCESS") {
        return "/dashboard";
      }
    },
  };
};

if (typeof window !== "undefined") {
  SuperTokens.init(frontendConfig());
}