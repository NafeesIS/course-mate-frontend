/* eslint-disable indent */
import { BASE_URL_FRONTEND } from '../../../constants/index';
import { HOME_META_DESCRIPTION, HOME_META_TITLE } from './meta_data';

export const homepageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: `${HOME_META_TITLE}`,
  description: `${HOME_META_DESCRIPTION}`,
  url: BASE_URL_FRONTEND,
  sameAs: [
    'https://www.linkedin.com/company/filesure-in',
    'https://www.facebook.com/filesure',
    'https://www.filesure.in/unlock-contact',
    'https://www.filesure.in/new-company-alert',
  ],
  logo: 'https://www.filesure.in/assets/filesure-icon.png',
  email: 'hello@marketing.filesure.in',
  telephone: '+918104946419',
  address: {
    '@type': 'PostalAddress',
    streetAddress:
      '6th Floor, Rahimtoola House, Homji Street, Near Horniman Circle, Fort',
    addressLocality: 'Mumbai',
    addressCountry: 'IND',
    addressRegion: 'Maharashtra',
    postalCode: '400001',
  },
  contactPoint: {
    contactType: 'Customer Service',
    email: 'helpdesk@filesure.in',
    telephone: '+918104946419',
  },
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'New Company Alerts | Daily Updates on Newly Incorporated Companies | FileSure',
      item: 'https://www.filesure.in/new-company-alert',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Unlock Director Contact Details | FileSure',
      item: 'https://www.filesure.in/unlock-contact',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Company Secretary Directory | FileSure - Partners',
      item: 'https://www.filesure.in/partners',
    },
  ],
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': BASE_URL_FRONTEND,
    name: HOME_META_TITLE,
    description: HOME_META_DESCRIPTION,
  },
};
