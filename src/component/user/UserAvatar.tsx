"use client";

import { useUser } from "@/context/userContext";


export default function UserAvatar() {
  const { user } = useUser();

  if (!user) return null;

  const initials = user.firstName
    ? user.firstName[0] + (user.lastName?.[0] || "")
    : user.email[0].toUpperCase();

  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
        {initials}
      </div>
      <span className="text-sm">{user.firstName || user.email}</span>
    </div>
  );
}
