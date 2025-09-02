/* eslint-disable indent */
import { BASE_URL_FRONTEND } from '../../../../constants/index';

export const generateAboutJsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FileSure',
    url: `${BASE_URL_FRONTEND}/about`,
    description:
      "India's first website dedicated to simplifying RoC Compliance for company owners and compliance professionals.",
    logo: `${BASE_URL_FRONTEND}/opengraph-image-12nfft.png?68b67394ffb2baef`,
    sameAs: ['https://in.linkedin.com/company/filesure-in'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+918104946419',
      contactType: 'Customer Service',
    },
  };

  return jsonLd;
};
