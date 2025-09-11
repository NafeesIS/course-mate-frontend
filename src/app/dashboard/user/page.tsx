"use client";

import { SessionAuth } from "supertokens-auth-react/recipe/session";

export default function UserDashboard() {
  return (
    <SessionAuth>
      <div className="p-6">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <p>Welcome back, student!</p>
      </div>
    </SessionAuth>
  );
}
