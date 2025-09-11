// src/app/layout.tsx (Alternative approach)
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { setRouter, frontendConfig } from "@/config/supertokens";
import { UserProvider } from "@/context/userContext";
import Navbar from "@/component/navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize SuperTokens on the client side
    if (typeof window !== 'undefined') {
      try {
        SuperTokens.init(frontendConfig());
        setRouter(router, pathname);
        setInitialized(true);
      } catch (error) {
        console.error('SuperTokens initialization failed:', error);
        // Still set initialized to true to prevent infinite loading
        setInitialized(true);
      }
    }
  }, [router, pathname]);

  if (!initialized) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center min-h-screen">
            <div>Loading...</div>
          </div>
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