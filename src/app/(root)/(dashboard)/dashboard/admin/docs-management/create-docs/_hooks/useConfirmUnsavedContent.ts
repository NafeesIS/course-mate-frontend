// app/hooks/useConfirmUnsavedContent.ts
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Options = {
  shouldPrompt: boolean;
  message?: string;
};

export function useConfirmUnsavedContent({
  shouldPrompt,
  message = 'You have unsaved changes. Leave this page?',
}: Options) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const allowNextNavRef = useRef(false);

  // 1) Block window/tab close or refresh
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!shouldPrompt) return;
      e.preventDefault();
      e.returnValue = message; // Required for Chrome
      return message;
    };
    if (shouldPrompt) window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [shouldPrompt, message]);

  // 2) Intercept internal link clicks (<a href="/...">)
  useEffect(() => {
    if (!shouldPrompt) return;

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      // find nearest anchor
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body && !(el instanceof HTMLAnchorElement)) {
        el = el.parentElement;
      }
      const a = el as HTMLAnchorElement | null;
      if (!a || !a.href) return;

      // same origin internal link only
      const url = new URL(a.href);
      if (url.origin !== window.location.origin) return;

      // same page (hash change)
      if (
        url.pathname === pathname &&
        url.search === window.location.search &&
        url.hash === window.location.hash
      )
        return;

      // open-in-new-tab
      if (a.target && a.target !== '' && a.target !== '_self') return;

      // Guard navigation
      e.preventDefault();
      setPendingHref(url.pathname + url.search + url.hash);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [shouldPrompt, pathname]);

  // 3) Intercept back/forward
  useEffect(() => {
    if (!shouldPrompt) return;

    const onPopState = (e: PopStateEvent) => {
      if (allowNextNavRef.current) {
        allowNextNavRef.current = false;
        return;
      }
      e.preventDefault?.();
      history.pushState(null, '', window.location.href);
      setPendingHref('POPSTATE::BACK_OR_FORWARD');
    };

    history.replaceState({ __guard__: true }, '');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [shouldPrompt]);

  const confirmLeave = () => {
    if (!pendingHref) return;
    if (pendingHref === 'POPSTATE::BACK_OR_FORWARD') {
      allowNextNavRef.current = true;
      history.back();
    } else {
      router.push(pendingHref);
    }
    setPendingHref(null);
  };

  const cancelLeave = () => setPendingHref(null);

  const guardedPush = (href: string) => {
    if (shouldPrompt) setPendingHref(href);
    else router.push(href);
  };

  return {
    pendingHref,
    confirmLeave,
    cancelLeave,
    guardedPush,
  };
}
