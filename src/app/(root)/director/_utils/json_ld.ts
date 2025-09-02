/* eslint-disable indent */
import { formatToUrl } from '@/lib/formatters';
import { BASE_URL_FRONTEND } from '../../../../constants/index';
import { generateDirectorMetadataDescription } from './meta_data';

export const generateSingleDirectorJsonLd = (directorData: any) => {
  const { fullName, din, gender, nationality, companyData } =
    directorData.data || {};

  const directorUrl = `${BASE_URL_FRONTEND}/director/${formatToUrl(fullName)}/${din}`;
  const description = generateDirectorMetadataDescription(directorData.data);

  const companies = companyData
    ? companyData.map((company: any) => ({
        '@type': 'Organization',
        name: company.nameOfTheCompany,
        url: `${BASE_URL_FRONTEND}/company/${formatToUrl(company.nameOfTheCompany)}/${company.cin_LLPIN}`,
        jobTitle: company.role,
      }))
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    url: directorUrl,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'DIN',
      value: din,
    },
    // birthDate: dob,
    gender: gender,
    nationality: nationality,
    description: description,
    affiliation: companies,
  };

  return jsonLd;
};
