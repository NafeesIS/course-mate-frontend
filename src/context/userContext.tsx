"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

type User = {
  _id: string;
  email: string;
  supertokensId: string;
  role: string;
  firstName?: string;
  lastName?: string;
};

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const session = useSessionContext();

  useEffect(() => {
    if (session.loading) return;

    if (!session.doesSessionExist) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Fetch user data
    fetch("http://localhost:4000/auth/me", {
      credentials: "include",
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setUser(data.data);
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));

  }, [session]);

  return (
    <UserContext.Provider value={{ user, loading: loading || session.loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);