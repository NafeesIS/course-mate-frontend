"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

export default function DashboardRoot() {
  const { user, loading } = useUser();
  const sessionContext = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!sessionContext.loading && !loading) {
      if (!sessionContext.doesSessionExist) {
        router.push("/auth");
      } else if (user) {
        if (user?.roles?.includes("admin")) {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/user");
        }
      }
    }
  }, [sessionContext, user, loading, router]);

  if (loading || sessionContext.loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <SessionAuth>
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Redirecting...</div>
      </div>
    </SessionAuth>
  );
}
