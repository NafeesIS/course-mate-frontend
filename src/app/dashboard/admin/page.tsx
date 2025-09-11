"use client";

import { SessionAuth } from "supertokens-auth-react/recipe/session";

export default function AdminDashboard() {
  return (
    <SessionAuth>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Manage courses, users, and reports here.</p>
      </div>
    </SessionAuth>
  );
}
