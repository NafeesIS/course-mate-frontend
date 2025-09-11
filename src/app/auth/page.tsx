'use client';

import { useEffect, useState } from 'react';
import { redirectToAuth } from 'supertokens-auth-react';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import { EmailVerificationPreBuiltUI } from 'supertokens-auth-react/recipe/emailverification/prebuiltui';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import SuperTokens from 'supertokens-auth-react/ui';

export default function Auth() {
  // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (
      SuperTokens.canHandleRoute([
        ThirdPartyPreBuiltUI,
        EmailPasswordPreBuiltUI,
        EmailVerificationPreBuiltUI,
      ]) === false
    ) {
      redirectToAuth({ redirectBack: true, show: 'signin' });
    } else {
      setLoaded(true);
    }
  }, []);

  if (loaded) {
    return SuperTokens.getRoutingComponent([
      ThirdPartyPreBuiltUI,
      EmailPasswordPreBuiltUI,
      EmailVerificationPreBuiltUI,
    ]);
  }

  return null;
}
