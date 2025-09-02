import HeroWrapper from '@/components/shared/HeroWrapper';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BASE_URL_FRONTEND } from '@/constants';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import { FaCheckCircle, FaLightbulb, FaThumbsUp } from 'react-icons/fa';
import bannerImg from '../../../../public/assets/about/business-decision.svg';
import { generateAboutJsonLd } from './_utils/json_ld';
import {
  ABOUT_META_DESCRIPTION,
  ABOUT_META_KEYWORDS,
  ABOUT_META_TITLE,
} from './_utils/meta_data';

export const revalidate = 600; // cache for 1 hour

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/about`),
  title: ABOUT_META_TITLE,
  description: ABOUT_META_DESCRIPTION,
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: ABOUT_META_KEYWORDS,
  // Open Graph metadata for social media
  openGraph: {
    siteName: 'FileSure',
    type: 'website', // Since this represents the site, use 'website'
    locale: 'en_US',
    title: ABOUT_META_TITLE,
    description: ABOUT_META_DESCRIPTION,
    url: `${BASE_URL_FRONTEND}/about`,
  },
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/about`, // Canonical URL for the home page
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
  const jsonLd = generateAboutJsonLd();

  return (
    <div className='mb-16'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>
      <section className='wrapper flex min-h-44 flex-col justify-between gap-8 rounded-lg bg-muted p-2 sm:flex-row md:mt-10 md:gap-16'>
        <div className='pt-10 sm:pt-5 lg:pt-10'>
          <h1 className='text-2xl font-bold sm:whitespace-nowrap lg:text-3xl xl:text-4xl'>
            Get <span className='text-primary'>Everything</span> Your Business
            Needs
          </h1>
          <p className='mt-4 text-sm lg:mt-6 lg:text-base'>
            One place for tracking, understanding, and solving Registrar of
            Companies compliance
          </p>
        </div>

        <div className='mx-auto w-full max-w-56 md:max-w-60 lg:max-w-80'>
          <Image
            src={bannerImg}
            alt={'Picture of a person making a business decision'}
            width={400}
            height={400}
            priority
            className='h-auto w-auto object-cover'
          />
        </div>
      </section>

      <section className='wrapper -mt-10'>
        <div
          className={cn(
            "relative rounded-lg border-l-8 border-l-gray-700 bg-background py-5 pl-16 pr-5 font-sans text-sm italic leading-relaxed text-gray-500 shadow before:absolute before:left-3 before:top-3 before:font-serif before:text-6xl before:text-gray-700 before:content-['“'] md:text-base lg:text-lg"
          )}
        >
          Ignoring compliance is like driving blind. Stay informed
        </div>
      </section>

      <section className='wrapper mt-10'>
        <div>
          <h2 className='md:ext-2xl text-xl font-bold lg:text-3xl'>
            How We <span className='text-primary'>Started</span>
          </h2>

          <p className='mt-4 flex flex-col gap-4 text-sm md:mt-6 lg:text-base'>
            <span>
              Our journey began with a simple yet powerful realization, the
              world of compliance is complex. We&apos;re India&apos;s first
              website dedicated to simplifying RoC Compliance for company owners
              and compliance professionals. We are here to assist you every step
              of the way.
            </span>
            <span>
              Starting a company takes 15 days with various steps and
              requirements. Compliance is a crucial part of this journey, from
              reserving your company&apos;s name to filing essential forms.
            </span>

            <span>
              As your company grows, new responsibilities arise. Shockingly,
              around 90% of companies are unaware of these crucial compliance
              requirements due to information gaps. We&apos;re here to bridge
              that gap. Whether you&apos;re starting or managing your company,
              our goal is to make compliance easy and accessible.
            </span>
          </p>
        </div>
      </section>

      <section className='wrapper'>
        <Separator className='my-8 md:my-10' />
        <div className='flex flex-col items-center'>
          <h3 className='md:ext-2xl text-xl font-bold lg:text-3xl'>
            Our Values
          </h3>

          <div className='mt-6 flex flex-col gap-6 md:mt-10 md:flex-row md:gap-8'>
            <Card className='flex flex-col items-center p-6'>
              <FaCheckCircle className='text-3xl text-green-500' />
              <h3 className='mt-3 text-base font-semibold md:text-lg lg:text-xl'>
                Accuracy
              </h3>
              <p className='mt-2 text-center text-sm md:text-base'>
                We understand that accuracy is at the core of trust. We keep our
                content up-to-date to reflect any changes in compliance
                regulations, forms, or requirements.
              </p>
            </Card>

            <Card className='flex flex-col items-center p-6'>
              <FaLightbulb className='text-3xl text-yellow-500' />
              <h3 className='mt-3 text-base font-semibold md:text-lg lg:text-xl'>
                Simplicity
              </h3>
              <p className='mt-2 text-center text-sm md:text-base'>
                Compliance should be accessible to everyone, regardless of their
                level of expertise. Our interface is intuitive, with plain and
                clear language, avoiding unnecessary technical terms.
              </p>
            </Card>

            <Card className='flex flex-col items-center p-6'>
              <FaThumbsUp className='text-3xl text-blue-500' />
              <h3 className='mt-3 text-base font-semibold md:text-lg lg:text-xl'>
                Reliability
              </h3>
              <p className='mt-2 text-center text-sm md:text-base'>
                We are reliable partners in your compliance journey. We keep you
                informed about changes and updates, and we are here to assist
                you promptly and effectively.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
