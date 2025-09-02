import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api',
          '/api/',
          '/dashboard',
          '/dashboard/',
          '/cart',
          '/cart/',
          '/checkout',
          '/checkout/',
          // '/unlock-contact',
        ],
      },
      {
        userAgent: 'dotbot',
        crawlDelay: 10,
      },
    ],
    sitemap: 'https://www.filesure.in/sitemap.xml',
  };
}
