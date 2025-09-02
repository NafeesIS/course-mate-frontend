import { Mail, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/assets/filesure-logo.png';
// Add metadata specifically for the maintenance page
export const metadata: Metadata = {
  title: 'Site Maintenance | FileSure',
  description:
    'We are currently performing scheduled maintenance to improve your experience.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  const phoneNumber = '+918104946419';
  const email = 'helpdesk@filesure.in';

  // Format phone number for display
  const formattedPhone = '+91 8104 946 419';

  return (
    <div className='wrapper flex min-h-screen flex-col items-center py-8'>
      <Image
        src={logo}
        alt='FileSure Logo'
        width={200}
        height={100}
        className='h-12 w-auto'
      />

      <div className='my-auto flex h-full flex-col items-center'>
        <h1 className='mt-6 max-w-sm text-center text-2xl font-extrabold text-gray-600 md:text-3xl'>
          This site is currently down for maintenance
        </h1>
        <p className='mt-4 max-w-sm text-center text-xs font-medium text-gray-500 md:text-sm'>
          We are currently performing scheduled maintenance to improve your
          experience.
        </p>
        <Image
          src='https://filesurestorage.blob.core.windows.net/filesure-frontend-assets/electric-plug-socket-unplugged.avif'
          alt='Site Maintenance'
          width={300}
          height={100}
          className='mt-8 h-56 w-96'
        />

        <div className='mt-8 flex flex-col items-center sm:mt-10'>
          <p className='text-center text-xs text-gray-500 sm:text-sm'>
            For any urgent queries, please contact us at:
          </p>

          <div className='mt-4 flex flex-col items-center gap-4 sm:flex-row sm:gap-6'>
            <Link
              href={`tel:${phoneNumber}`}
              className='flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs text-blue-700 transition-colors hover:bg-blue-200'
            >
              <Phone className='h-4 w-4' />
              <span>{formattedPhone}</span>
            </Link>

            <Link
              href={`mailto:${email}`}
              className='flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs text-green-700 transition-colors hover:bg-green-200'
            >
              <Mail className='h-4 w-4' />
              <span>{email}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='mt-auto pb-4 pt-8 text-center text-xs text-gray-400'>
        © {new Date().getFullYear()} FileSure. All rights reserved.
      </footer>
    </div>
  );
}
