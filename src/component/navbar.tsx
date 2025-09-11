"use client";

import { useUser } from "@/context/userContext";
import Link from "next/link";
import { signOut } from "supertokens-auth-react/recipe/session";

export default function Navbar() {
  const { user, loading } = useUser();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <Link href="/" className="text-xl font-bold">
        Course Mate 🎓
      </Link>
      <div className="flex gap-4">
        {loading ? null : !user ? (
          <Link href="/auth" className="text-blue-600 font-medium">
            Login / Signup
          </Link>
        ) : (
          <>
            <Link href="/dashboard" className="text-green-600 font-medium">
              Dashboard
            </Link>
            <button
              onClick={async () => await signOut()}
              className="text-red-600 font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
