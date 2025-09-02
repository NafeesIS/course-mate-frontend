/* eslint-disable indent */
import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { formatName, formatToUrl } from '@/lib/formatters';
import { BASE_URL_FRONTEND } from '../../../../constants/index';

export const generateSingleCompanyJsonLd = (
  companyData: TCompanyMasterData
) => {
  const { company, cin, about, dateOfIncorporation, currentDirectors } =
    companyData.data || {};

  const directors = currentDirectors
    ? currentDirectors.map((director: any) => ({
        '@type': 'Person',
        name: director.fullName ? formatName(director.fullName) : '',
        jobTitle: director.designation,
        url: `${BASE_URL_FRONTEND}/director/${formatToUrl(director.fullName)}/${director.din}`,
      }))
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company,
    url: `${BASE_URL_FRONTEND}/company/${formatToUrl(company)}/${cin}`,
    description: about || '',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CIN',
      value: cin,
    },
    foundingDate: convertToISO8601(dateOfIncorporation),
    legalName: company,
    employee: directors,
  };

  return jsonLd;
};

/**
 * Converts a date string from "dd-mmm-yyyy" or "dd-mm-yyyy" format to ISO 8601 format "yyyy-mm-dd".
 * @param dateString - The date string to convert.
 * @returns The date in ISO 8601 format or null if the input is invalid.
 */
export const convertToISO8601 = (dateString: string): string | null => {
  // Check if the date is in the "dd-mmm-yyyy" format
  const datePatternMmm = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/;
  // Check if the date is in the "dd-mm-yyyy" format
  const datePatternNumeric = /^(\d{2})-(\d{2})-(\d{4})$/;

  if (datePatternMmm.test(dateString)) {
    const match = dateString.match(datePatternMmm);
    if (!match) return null;

    const [, day, month, year] = match;
    const months: Record<string, string> = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };

    const formattedMonth = months[month];
    if (!formattedMonth) return null; // Return null if the month is invalid

    // Return the date in ISO 8601 format
    return `${year}-${formattedMonth}-${day.padStart(2, '0')}`;
  } else if (datePatternNumeric.test(dateString)) {
    const match = dateString.match(datePatternNumeric);
    if (!match) return null;

    const [, day, month, year] = match;
    // Return the date in ISO 8601 format
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Return null if the input doesn't match any expected formats
  return null;
};
