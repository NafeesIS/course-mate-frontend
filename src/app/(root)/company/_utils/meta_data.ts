/* eslint-disable indent */

import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';

import { formatName, toCamelCase } from '@/lib/formatters';

// COMPANY METADATA GENERATOR
export const generateCompanyMetadataKeywords = (
  companyData: TCompanyMasterData
) => {
  const { company, cin, companyType, status, industry, currentDirectors } =
    companyData.data || {};

  if (!company || !cin) return '';

  const companyName = company ? toCamelCase(company) : '';
  const industryType = industry ? toCamelCase(industry) : '';

  // Get the names of current directors
  const currentDirectorNames = currentDirectors
    ? currentDirectors
        .map((director: any) =>
          director.fullName
            ? `${toCamelCase(formatName(director.fullName))} - Director`
            : ''
        )
        .filter(Boolean)
    : [];

  // Create a set of unique keywords
  const keywordsSet = new Set(
    [
      companyName,
      `CIN-${cin}`,
      `Company Status: ${status || ''}`,
      companyType,
      industryType,
      ...currentDirectorNames,
      'Company Details',
      'Director Details',
      'Directors Contact',
      'Charges Details',
      'Compliance Details',
      'GST Details',
    ].filter(Boolean)
  );

  // Convert the set back to an array and then to a comma-separated string
  const keywordString = Array.from(keywordsSet).join(', ');

  return keywordString;
};
