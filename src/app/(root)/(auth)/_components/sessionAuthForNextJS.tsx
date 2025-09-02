// This is a client component that renders just its children on the server side and renders the children wrapped with SessionAuth on the client side. This way, the server side returns the page content, and on the client, the same page content is wrapper with SessionAuth which will handle session related events on the frontend - for example, if the user's session expires whilst they are on this page, then SessionAuth will auto redirect them to the login page.

/**
 * SessionAuthForNextJS will handle proper redirection for the user based on the different session states.
 * It will redirect to the login page if the session does not exist etc.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

type Props = Parameters<typeof SessionAuth>[0] & {
  children?: React.ReactNode | undefined;
};

export const SessionAuthForNextJS = (props: Props) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!loaded) {
    return props.children;
  }
  return <SessionAuth {...props}>{props.children}</SessionAuth>;
};
