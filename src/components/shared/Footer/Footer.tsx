'use client';

import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaLinkedinIn } from 'react-icons/fa6';
import { RiFacebookCircleLine, RiInstagramLine } from 'react-icons/ri';

const footerContent = {
  logo: {
    imageSrc: '/assets/filesure-logo-light.png',
    alt: 'FileSure Academy Logo - Simplifying RoC Compliance',
    width: 400,
    height: 320,
    description1: 'Instant access to Business Intelligence',
    description2:
      "DISCLAIMER: FileSure provides information and data from trusted sources, but we don't guarantee its accuracy or take responsibility for any consequences. It's important to note that any information accessed through FileSure cannot be sold, licensed, rented, or redistributed by any individual or entity in any form without explicit permission from FileSure India Private Limited. By using FileSure, you agree to these terms and conditions. If you do not agree with any part of this disclaimer, please refrain from using our services.",
    cin: 'U62013MH2023PTC411571',
  },
  product: {
    title: 'DATA SERVICES',
    links: [
      { text: 'New Company Alert', href: '/new-company-alert' },
      { text: 'Director Contact', href: '/unlock-contact/bulk-unlock' },
      { text: 'Company Search', href: '/search/company' },
      { text: 'Director Search', href: '/search/director' },
      { text: 'ROI Calculator', href: '/tools/roi-calculator' },
    ],
  },
  businessServices: {
    title: 'BUSINESS SERVICES',
    links: [
      {
        text: 'Registration Pvt Ltd',
        href: '/business-services/registration-pvt-ltd',
      },
      { text: 'Registration LLP', href: '/business-services/registration-llp' },
      {
        text: 'Annual Compliance Pvt Ltd',
        href: '/business-services/annual-compliance-pvt-ltd',
      },
      {
        text: 'Annual Compliance LLP',
        href: '/business-services/annual-compliance-llp',
      },
    ],
  },
  company: {
    title: 'COMPANY',
    links: [
      { text: 'About', href: '/about' },
      { text: 'Contact Us', href: '/contact-us' },
      { text: 'Meet Our Team', href: '/meet-our-team' },
      { text: 'FAQ', href: '/faq' },
      { text: 'Filesure Docs', href: '/docs' },
    ],
  },
  legal: {
    title: 'LEGAL',
    links: [
      { text: 'Privacy Policy', href: '/privacy-policy' },
      { text: 'Terms & Conditions', href: '/terms-and-conditions' },
      { text: 'Refund Policy', href: '/refund-policy' },
      { text: 'Cancellation Policy', href: '/cancellation-policy' },
    ],
  },
  socialLinks: {
    socialMedia: [
      {
        icon: <RiFacebookCircleLine />,
        href: 'https://www.facebook.com/filesure',
        label: 'Visit our Facebook page',
      },
      {
        icon: <RiInstagramLine />,
        href: 'https://www.instagram.com/filesure.in/',
        label: 'Visit our Instagram page',
      },
      {
        icon: <FaLinkedinIn />,
        href: 'https://www.linkedin.com/company/filesure-in/',
        label: 'Visit our LinkedIn page',
      },
    ],
  },
  copyright: {
    text: 'Copyright © 2025 FileSure India Private Limited. All rights reserved.',
  },
};

const Footer = () => {
  const pathname = usePathname();
  const isDashboardRoute = pathname.includes('/dashboard');

  if (isDashboardRoute) {
    return null;
  }

  return (
    <footer className='bg-gradient-to-br from-midnight-blue to-navy-blue text-white'>
      <div className='wrapper'>
        {/* Main Footer Content */}
        <div className='py-12 lg:py-16'>
          {/* Logo and Description Section */}
          <div className='mb-12 text-center'>
            <Link href='/' prefetch={false} className='inline-block'>
              <Image
                src={footerContent.logo.imageSrc || '/placeholder.svg'}
                alt={footerContent.logo.alt}
                width={footerContent.logo.width}
                height={footerContent.logo.height}
                className='mx-auto h-auto w-auto max-w-32 transition-opacity hover:opacity-80 sm:max-w-36 lg:max-w-40'
              />
            </Link>
            <p className='mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed text-slate-100 sm:text-base'>
              {footerContent.logo.description1}
            </p>
          </div>

          {/* Links Grid */}
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {/* Data Services */}
            <div>
              <h3 className='mb-6 text-xs font-semibold uppercase tracking-wider text-white md:text-sm'>
                {footerContent.product.title}
              </h3>
              <ul className='space-y-3'>
                {footerContent.product.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className='text-xs text-slate-100 transition-colors hover:text-white hover:underline hover:underline-offset-2 md:text-sm'
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Services */}
            <div>
              <h3 className='mb-6 text-xs font-semibold uppercase tracking-wider text-white md:text-sm'>
                {footerContent.businessServices.title}
              </h3>
              <ul className='space-y-3'>
                {footerContent.businessServices.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className='text-xs text-slate-100 transition-colors hover:text-white hover:underline hover:underline-offset-2 md:text-sm'
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className='mb-6 text-xs font-semibold uppercase tracking-wider text-white md:text-sm'>
                {footerContent.company.title}
              </h3>
              <ul className='space-y-3'>
                {footerContent.company.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className='text-xs text-slate-100 transition-colors hover:text-white hover:underline hover:underline-offset-2 md:text-sm'
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className='mb-6 text-xs font-semibold uppercase tracking-wider text-white md:text-sm'>
                {footerContent.legal.title}
              </h3>
              <ul className='space-y-3'>
                {footerContent.legal.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className='text-xs text-slate-100 transition-colors hover:text-white hover:underline hover:underline-offset-2 md:text-sm'
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer Section */}
          <div className='mt-12 rounded-lg border border-slate-500 bg-dark-blue bg-opacity-30 p-6'>
            <p className='text-xs leading-relaxed text-slate-100 sm:text-sm'>
              {footerContent.logo.description2}
            </p>
          </div>
        </div>

        <Separator className='bg-slate-700' />

        {/* Bottom Section */}
        <div className='flex flex-col items-center justify-between gap-6 py-8 sm:flex-row'>
          {/* Copyright and CIN */}
          <div className='text-center sm:text-left'>
            <p className='text-balance text-xs text-slate-200 md:text-sm'>
              {footerContent.copyright.text}
            </p>
            <p className='mt-1 text-xs text-slate-200 md:text-sm'>
              <span className='font-medium'>CIN:</span> {footerContent.logo.cin}
            </p>
          </div>

          {/* Social Media Links */}
          <div className='flex items-center space-x-4'>
            {footerContent.socialLinks.socialMedia.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                prefetch={false}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={social.label}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-midnight-blue text-xl text-slate-300 transition-all hover:bg-primary hover:text-white'
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
