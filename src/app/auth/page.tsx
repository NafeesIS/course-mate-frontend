"use client";

import { useEffect, useState } from 'react';
import SuperTokens from 'supertokens-auth-react/ui';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';

export default function Auth() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  if (SuperTokens.canHandleRoute([EmailPasswordPreBuiltUI, ThirdPartyPreBuiltUI]) === false) {
    return <div>Something went wrong</div>;
  }

  return SuperTokens.getRoutingComponent([EmailPasswordPreBuiltUI, ThirdPartyPreBuiltUI]);
}