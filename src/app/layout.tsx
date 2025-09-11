"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/component/navbar";
import { UserProvider } from "@/context/userContext";
import { setRouter } from "@/config/supertokens";
import { SuperTokensWrapper } from "supertokens-auth-react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setRouter(router, pathname);
  }, [router, pathname]);

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