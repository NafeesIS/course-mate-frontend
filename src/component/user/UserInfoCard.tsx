"use client";

import { useUser } from "@/context/userContext";


export default function UserInfoCard() {
  const { user, loading } = useUser();

  if (loading) return <p>Loading user info...</p>;
  if (!user) return <p>No user info available.</p>;

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-bold">User Info</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Role:</strong> {user.role || "User"}</p>
    </div>
  );
}
