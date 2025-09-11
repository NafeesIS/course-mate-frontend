"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export default function DashboardRoot() {
  const session = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!session.loading) {
      if (!session.doesSessionExist) {
        router.push("/auth");
      } else {
        fetch("http://localhost:4000/users/me", { credentials: "include" })
          .then((res) => res.json())
          .then((user) => {
            if (user.role === "admin") {
              router.push("/dashboard/admin");
            } else {
              router.push("/dashboard/user");
            }
          });
      }
    }
  }, [session, router]);

  return <p>Redirecting...</p>;
}
