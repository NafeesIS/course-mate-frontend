"use client";

import { useEffect, useState } from "react";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig } from "@/config/supertokens";
import { UserProvider } from "@/context/userContext";
import "./globals.css";
import Navbar from "@/component/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      SuperTokens.init(frontendConfig());
      setInitialized(true);
    }
  }, []);

  if (!initialized) {
    return (
      <html lang="en">
        <body>
          <div>Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <SuperTokensWrapper>
          <UserProvider>
            <Navbar />
            {children}
          </UserProvider>
        </SuperTokensWrapper>
      </body>
    </html>
  );
}
