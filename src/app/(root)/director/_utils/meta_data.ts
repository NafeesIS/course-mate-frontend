import { getFirstAndLatestCompany } from '@/app/(root)/director/_utils/helperFunctions';

import { formatName, toCamelCase } from '@/lib/formatters';

// DIRECTOR METADATA
export const DIRECTOR_META_TITLE =
  'List of directors of FileSure | FileSure - India&apos;s first platform for simplifying Registrar of Companies compliance';

export const generateDirectorMetadataDescription = (directorData: any) => {
  const {
    fullName,
    din,
    companyData,
    status,
    mcaSignatoryCessationMasterHistory,
  } = directorData || {};

  if (!fullName || !din) return;

  const directorName = (fullName && toCamelCase(formatName(fullName))) || '-';

  // Create a set of unique company names to ensure each company is counted only once
  const uniqueCompanyNames = new Set(
    companyData?.map((company: any) => company.nameOfTheCompany)
  );
  const totalCompanies = uniqueCompanyNames.size;

  // Get the first and latest company
  const { firstCompany, latestCompany } =
    (companyData && getFirstAndLatestCompany(companyData)) || {};
  const firstCompanyName = firstCompany?.nameOfTheCompany || '-';
  const latestCompanyName = latestCompany?.nameOfTheCompany || '-';

  // Get the unique and total designations
  const directorDesignations = companyData
    .map((company: any) => company.designation)
    .filter((designation: any) => designation);
  const uniqueDesignations = Array.from(new Set(directorDesignations));
  const totalDesignations = uniqueDesignations && uniqueDesignations.length;

  // Determine the role description
  let roleDescription = uniqueDesignations.join(', ');
  if (uniqueDesignations && uniqueDesignations.length > 1) {
    roleDescription = `${uniqueDesignations.slice(0, -1).join(', ')} and ${uniqueDesignations.slice(-1)}`;
  }

  // Determine the specific role in the latest company
  const latestRole =
    companyData.find(
      (company: any) => company.nameOfTheCompany === latestCompanyName
    )?.designation || '-';

  // Determine the status message
  let statusMessage = '';
  if (status === 'Approved') {
    statusMessage = `${directorName} is not disqualified by the Registrar of Companies under Section 164(2), and their DIN has not been deactivated due to failure to file the DIR-3 KYC Form.`;
  } else {
    statusMessage = `${directorName} has a status of ${status}. Please verify the details for any specific requirements or conditions.`;
  }

  // Create a set of unique past company names
  const uniquePastCompanyNames = new Set(
    mcaSignatoryCessationMasterHistory?.map(
      (company: any) => company.accountName
    )
  );
  const totalPastCompanies = uniquePastCompanyNames.size;

  // Get the unique and total past designations
  const pastDesignations = mcaSignatoryCessationMasterHistory
    ?.map((company: any) => company.designation)
    .filter((designation: any) => designation);
  const uniquePastDesignations = Array.from(new Set(pastDesignations));

  // Determine the past role description
  let pastRoleDescription = uniquePastDesignations.join(', ');
  if (uniquePastDesignations && uniquePastDesignations.length > 1) {
    pastRoleDescription = `${uniquePastDesignations.slice(0, -1).join(', ')} and ${uniquePastDesignations.slice(-1)}`;
  }

  let summary = '';

  if (totalCompanies > 0 || totalPastCompanies > 0) {
    if (totalCompanies > 0) {
      summary += `${directorName} is currently associated with ${totalCompanies} compan${totalCompanies > 1 ? 'ies' : 'y'}`;
      summary += `${totalDesignations > 1 ? ` in various capacities such as ${roleDescription}` : ` as ${roleDescription}`}.`;
      if (totalCompanies > 1) {
        summary += ` They serve as a Director at ${firstCompanyName} and have other roles in different companies.`;
      }
      summary += ` They are registered with the Ministry of Corporate Affairs (MCA) of India and hold a DIN of ${din || '-'}. `;
    }
    if (totalPastCompanies > 0) {
      summary += `${directorName} has previously been associated with ${totalPastCompanies} compan${totalPastCompanies > 1 ? 'ies' : 'y'} in roles such as ${pastRoleDescription}. `;
    }
    if (totalCompanies > 0) {
      summary += `${directorName} is currently involved in ${totalDesignations} different role${totalDesignations > 1 ? 's' : ''}. `;
      summary += `Their most recent position is with ${latestCompanyName} as a ${latestRole}. The first company ${directorName} was appointed to ${uniqueDesignations.includes('Director') ? 'as a director' : ''} was ${firstCompanyName}. `;
      summary += statusMessage;
    }
  } else {
    summary += `${directorName} is not currently associated with any companies as a director or in any other roles. They hold a DIN of ${din || '-'}. `;
    summary +=
      'For more information or inquiries, please contact us or the relevant authorities.';
  }

  // Ensure the summary does not exceed 320 characters
  if (summary.length > 320) {
    summary = summary.slice(0, 317) + '...';
  }

  return summary;
};

export const generateDirectorMetadataKeywords = (directorData: any) => {
  const {
    fullName,
    din,
    companyData,
    status,
    mcaSignatoryCessationMasterHistory,
  } = directorData || {};

  if (!fullName || !din) return;

  const directorName = (fullName && toCamelCase(formatName(fullName))) || '-';

  // Create a set of unique company names
  const uniqueCompanyNames = new Set(
    companyData?.map((company: any) => company.nameOfTheCompany)
  );

  // Get the first and latest company
  const { firstCompany, latestCompany } =
    (companyData && getFirstAndLatestCompany(companyData)) || {};
  const firstCompanyName = firstCompany?.nameOfTheCompany || '';
  const latestCompanyName = latestCompany?.nameOfTheCompany || '';

  // Get the unique and total designations
  const directorDesignations = companyData
    .map((company: any) => company.designation)
    .filter((designation: any) => designation);
  const uniqueDesignations = Array.from(new Set(directorDesignations));

  // Create a set of unique past company names
  const uniquePastCompanyNames = new Set(
    mcaSignatoryCessationMasterHistory?.map(
      (company: any) => company.accountName
    )
  );

  // Get the unique past designations
  const pastDesignations = mcaSignatoryCessationMasterHistory
    ?.map((company: any) => company.designation)
    .filter((designation: any) => designation);
  const uniquePastDesignations = Array.from(new Set(pastDesignations));

  // Combine all relevant keywords into a single array and remove duplicates
  const keywordsSet = new Set(
    [
      directorName,
      `DIN-${din || ''}`,
      ...Array.from(uniqueCompanyNames),
      ...uniqueDesignations,
      ...Array.from(uniquePastCompanyNames),
      ...uniquePastDesignations,
      `Director Status: ${status || ''}`,
      `${directorName} contact details`,
      `${directorName} email address`,
      `${directorName} mobile number`,
      firstCompanyName,
      latestCompanyName,
    ].filter(Boolean)
  ); // Remove any undefined or empty values

  // Convert the set back to an array and then to a comma-separated string
  const keywordString = Array.from(keywordsSet).join(', ');

  return keywordString;
};
