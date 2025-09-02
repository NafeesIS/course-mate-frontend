import { ISessionObject } from '@/app/(root)/(auth)/_utils/types';
import { useEffect, useState } from 'react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

export const usePageVisitTracker = (
  pathname: string,
  reqPath: string,
  key: string,
  total: number,
  expiry: number
) => {
  const [tooManyRequests, setTooManyRequests] = useState(false);
  const session: ISessionObject = useSessionContext();

  useEffect(() => {
    if (
      typeof window === 'undefined' || // Check if window is undefined
      session.doesSessionExist || // check if user is logged in
      !pathname.includes(reqPath) // check if pathname is the required one
    ) {
      setTooManyRequests(false);
      return;
    }

    // Check if the user is a bot (basic check)
    // console.log('isBot', navigator.userAgent);
    const isBot = /bot|crawl|slurp|spider/i.test(navigator.userAgent);
    if (isBot) {
      setTooManyRequests(false);
      return;
    }

    const pageVisitCount = localStorage.getItem(key);
    const currentTime = new Date();
    const expiryTime = currentTime.getTime() + expiry;

    if (!pageVisitCount) {
      localStorage.setItem(
        key,
        JSON.stringify({ count: 1, expiryTime: expiryTime })
      );
      setTooManyRequests(false);
      return;
    }

    const parsedPageVisitCount = JSON.parse(pageVisitCount);

    if (currentTime.getTime() > parsedPageVisitCount.expiryTime) {
      localStorage.removeItem(key);
      setTooManyRequests(false);
      return;
    }

    if (parsedPageVisitCount.count >= total) {
      setTooManyRequests(true);
      return;
    }

    parsedPageVisitCount.count++;
    localStorage.setItem(key, JSON.stringify(parsedPageVisitCount));
    setTooManyRequests(false);
  }, [pathname, reqPath, key, total, expiry, session.doesSessionExist]);

  return { tooManyRequests };
};
