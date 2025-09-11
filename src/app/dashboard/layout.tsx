"use client";

import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const session= useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!session.loading && !session.doesSessionExist) {
      router.push("/auth");
    }
  }, [session, router]);

  if (session.loading) return <p>Loading...</p>;

  return <h1>Welcome to the Dashboard 🚀</h1>;
}
