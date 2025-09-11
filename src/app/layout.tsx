"use client";

import Navbar from "@/component/navbar";
import "../config/supertokens";
import { SuperTokensWrapper } from "supertokens-auth-react";
// import Navbar from "../components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SuperTokensWrapper>
          <Navbar />
          {children}
        </SuperTokensWrapper>
      </body>
    </html>
  );
}
