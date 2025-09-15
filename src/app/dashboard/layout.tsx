"use client";

import { SessionAuth } from "supertokens-auth-react/recipe/session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionAuth
      requireAuth={true}
      onSessionExpired={() => {
        // optional: handle expired session
        window.location.href = "/auth?error=unauthorized";
      }}
    >
      {children}
    </SessionAuth>
  );
}
