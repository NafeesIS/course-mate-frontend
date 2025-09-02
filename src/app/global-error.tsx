// global-error.js

'use client';

import ErrorUI from '@/components/shared/ErrorUI';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // eslint-disable-next-line no-console
  console.error(error);

  return (
    <html>
      <body>
        <ErrorUI error={error} reset={reset} />
      </body>
    </html>
  );
}
