import GoogleMapEmbed from '@/app/(root)/contact-us/_components/GoogleMapEmbed';
import HeroWrapper from '@/components/shared/HeroWrapper';
import FileSureLogo from '../../../../public/assets/filesure-logo.png';

import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';

import ContactDetails from './_components/ContactDetails';
import {
  CONTACT_US_META_DESCRIPTION,
  CONTACT_US_META_KEYWORDS,
  CONTACT_US_META_TITLE,
} from './_utils/meta_data';

export const revalidate = 600; // cache for 1 hour

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/contact-us`),
  title: CONTACT_US_META_TITLE,
  description: CONTACT_US_META_DESCRIPTION,
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: CONTACT_US_META_KEYWORDS,
  // Open Graph metadata for social media
  openGraph: {
    siteName: 'FileSure',
    type: 'website', // Since this represents the site, use 'website'
    locale: 'en_US',
    title: CONTACT_US_META_TITLE,
    description: CONTACT_US_META_DESCRIPTION,
    url: `${BASE_URL_FRONTEND}/contact-us`,
  },
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/contact-us`, // Canonical URL for the home page
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow', // Ensures Googlebot crawls and indexes the site
  },
};

const page = () => {
  return (
    <div>
      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <p className='sr-only'>Contact Us</p>
      </HeroWrapper>

      <section className='wrapper mt-10'>
        <div className='container'>
          <div className='space-y-4'>
            <div className='border-l-[6px] border-primary bg-muted p-6'>
              <h1 className='text-2xl font-bold tracking-tighter md:text-3xl'>
                Get in touch
              </h1>
            </div>
            <p className='text-sm text-muted-foreground md:text-base/relaxed lg:text-base/relaxed xl:text-lg/relaxed'>
              Have questions or need assistance? We&apos;d love to hear from
              you. Here&apos;s how you can reach us...
            </p>
          </div>
        </div>
      </section>

      <section className='mt-8 bg-muted'>
        <div className='wrapper flex flex-col-reverse gap-12 rounded-md px-4 pb-20 pt-10 md:px-16 lg:flex-row lg:items-center lg:gap-6'>
          {/* <ContactForm /> */}
          <div className='w-full overflow-hidden rounded-xl border shadow-sm'>
            <GoogleMapEmbed />
          </div>

          <div className='w-full space-y-8'>
            <div>
              <Image
                src={FileSureLogo}
                alt='FileSure Logo'
                width={300}
                height={200}
                className='mx-auto h-auto w-40 md:w-52'
              />
              <p className='mt-2 text-balance text-center text-sm opacity-90'>
                India&apos;s first platform dedicated to simplifying RoC
                Compliance for company owners and compliance professionals
              </p>

              <div className='mx-auto mt-4 flex max-w-md flex-col items-center gap-4 rounded-md bg-background p-4 shadow md:flex-row'>
                <span className='flex-center size-14 flex-shrink-0 rounded-full shadow-md'>
                  <FaMapMarkerAlt className='size-8 text-primary' />
                </span>
                <p className='flex flex-col gap-1.5 text-center text-sm opacity-90 md:text-left'>
                  <strong className='text-base'>CORPORATE OFFICE:</strong>
                  <strong>FileSure India Private Limited</strong>
                  <span>
                    6th Floor, Rahimtoola House, Homji Street, Near Horniman
                    Circle, Fort, Mumbai, Maharashtra - 400001.
                  </span>
                </p>
              </div>

              <ContactDetails />

              {/* <div className='mt-8 flex flex-col justify-center gap-8 md:flex-row md:gap-20'>
                <div className=''>
                  <div className='mt-2 flex items-center justify-center gap-2 md:justify-start'>
                    <RiPhoneLine className='text-muted-foreground' />
                    <a
                      href='tel:+918104946419'
                      className='text-sm md:text-base'
                    >
                      +918104946419
                    </a>
                  </div>
                  <div className='mt-2 flex items-center justify-center gap-2 md:justify-start'>
                    <RiMailSendLine className='text-muted-foreground' />
                    <a
                      href={`mailto:${FILESURE_SUPPORT_EMAIL}`}
                      className='text-sm md:text-base'
                    >
                      {FILESURE_SUPPORT_EMAIL}
                    </a>
                  </div>
                  <div className='mt-3 flex items-center justify-center gap-2 md:justify-start'>
                    <a
                      href='https://wa.me/918104946419'
                      target='_blank'
                      className='flex items-center gap-2 rounded-full bg-[#24c960] px-4 py-2 text-sm text-white'
                    >
                      <RiWhatsappLine className='flex-shrink-0 text-lg' />
                      Chat with Support
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
