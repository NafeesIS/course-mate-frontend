/**
 * The not-found file is used to render UI when the notFound function is thrown within a route segment. Along with serving a custom UI, Next.js will return a 200 HTTP status code for streamed responses, and 404 for non-streamed responses.
 * In addition to catching expected notFound() errors, the root app/not-found.js file also handles any unmatched URLs for your whole application. This means users that visit a URL that is not handled by your app will be shown the UI exported by the app/not-found.js file.
 */

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { FILESURE_SUPPORT_EMAIL } from '@/constants';
import Link from 'next/link';
import { RiAlertLine } from 'react-icons/ri';

const NotFound = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader className='flex flex-col items-center space-y-2'>
          <div className='text-4xl'>
            <RiAlertLine className='h-10 w-10' />
          </div>
          <div className='space-y-2 text-center'>
            <h1 className='text-2xl font-semibold'>404 | Page Not Found</h1>
            <p className='text-base text-muted-foreground'>
              The page you are looking for might have been removed or its name
              changed. Please check the URL and try again.
            </p>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Link
              className='inline-flex items-center rounded-lg border border-gray-200  bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 '
              href='/'
              prefetch={false}
            >
              Go Back to Home
            </Link>
          </div>
          <div className='flex flex-col gap-2'>
            <a
              href={`mailto:${FILESURE_SUPPORT_EMAIL}`}
              className='inline-flex items-center rounded-lg border border-gray-200 bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900'
            >
              Contact Support
            </a>
          </div>
        </CardContent>
        <CardFooter className='flex items-center justify-center gap-4 rounded-b-xl border-t bg-muted p-4 '>
          <p className='text-xs text-muted-foreground'>
            © 2024 FileSure India Private Limited. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
