import { formatName, toCamelCase } from '@/lib/formatters';
import { getFirstAndLatestCompany } from '../_utils/helperFunctions';

const DirectorSummary = ({ directorData }: { directorData: any }) => {
  const {
    fullName,
    din,
    companyData,
    status,
    mcaSignatoryCessationMasterHistory,
  } = directorData || {};
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
  if (uniqueDesignations && uniquePastDesignations.length > 1) {
    pastRoleDescription = `${uniquePastDesignations.slice(0, -1).join(', ')} and ${uniquePastDesignations.slice(-1)}`;
  }

  return (
    <>
      {totalCompanies > 0 || totalPastCompanies > 0 ? (
        <div>
          <p className='flex flex-col gap-2 text-sm leading-relaxed'>
            {totalCompanies > 0 && (
              <span>
                {directorName} is currently associated with{' '}
                <strong className='font-semibold'>{totalCompanies}</strong>{' '}
                compan{totalCompanies > 1 ? 'ies' : 'y'}
                {totalDesignations > 1
                  ? ` in various capacities such as ${roleDescription}`
                  : ` as ${roleDescription}`}
                .{' '}
                {totalCompanies > 1 &&
                  `They serve as a Director at ${firstCompanyName} and have other roles in different companies.`}{' '}
                They are registered with the Ministry of Corporate Affairs (MCA)
                of India and hold a DIN of{' '}
                <strong className='font-semibold'>{din || '-'}</strong>.
              </span>
            )}
            {totalPastCompanies > 0 && (
              <span>
                {directorName} has previously been associated with{' '}
                <strong className='font-semibold'>{totalPastCompanies}</strong>{' '}
                compan
                {totalPastCompanies > 1 ? 'ies' : 'y'} in roles such as{' '}
                {pastRoleDescription}.
              </span>
            )}
            {totalCompanies > 0 && (
              <span>
                {directorName} is currently involved in{' '}
                <strong className='font-semibold'>{totalDesignations}</strong>{' '}
                different role
                {totalDesignations > 1 ? 's' : ''}. Their most recent position
                is with {latestCompanyName} as a {latestRole}. The first company{' '}
                {directorName} was appointed to{' '}
                {uniqueDesignations.includes('Director') && 'as a director'} was{' '}
                {firstCompanyName}. {statusMessage}
              </span>
            )}
          </p>
        </div>
      ) : (
        <div className='w-full'>
          <p className='flex flex-col gap-2 text-sm leading-relaxed'>
            <span>
              {directorName} is not currently associated with any companies as a
              director or in any other roles. They hold a DIN of{' '}
              <strong className='font-semibold'>{din || '-'}</strong>.
            </span>
            <span>
              For more information or inquiries, please contact us or the
              relevant authorities.
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default DirectorSummary;
