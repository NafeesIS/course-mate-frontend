// src/components/SuperTokensInit.tsx
"use client";

import { useEffect, useState } from 'react';
import SuperTokens from 'supertokens-auth-react';
import { frontendConfig } from '@/config/supertokens';

export default function SuperTokensInit({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        SuperTokens.init(frontendConfig());
        setInitialized(true);
      } catch (error) {
        console.error('SuperTokens initialization failed:', error);
      }
    }
  }, []);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}