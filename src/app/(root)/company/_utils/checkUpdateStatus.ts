type UpdateStatusResult = {
  dataUpdateInitiated: boolean;
  dataUpdateCompleted: boolean;
  dataUpdateFailed: boolean;
};

export const getUpdateStatus = (
  lastUpdatedData: any,
  companyType: any
): UpdateStatusResult => {
  // check if any update has been INITIATED
  const dataUpdateInitiated = [
    'isCompanyDataUpdated',
    // 'isSrnDataUpdated',
    'isVpdV3Updated',
    'isGstUpdated',
    'isLLPVpdUpdated',
  ].some((field) => lastUpdatedData?.[field] === 'initiated');

  // check if any update has been COMPLETED
  const allCompletedForCompany = [
    'isCompanyDataUpdated',
    // 'isSrnDataUpdated',
    'isVpdV3Updated',
    'isGstUpdated',
  ].every((field) => lastUpdatedData?.[field] === 'completed');
  const allCompletedForLLP = [
    'isCompanyDataUpdated',
    'isGstUpdated',
    'isLLPVpdUpdated',
  ].every((field) => lastUpdatedData?.[field] === 'completed');
  const dataUpdateCompleted =
    companyType === 'LLP' ? allCompletedForLLP : allCompletedForCompany;

  // check if any update has been FAILED
  const anyFailedForCompany = [
    'isCompanyDataUpdated',
    // 'isSrnDataUpdated',
    'isVpdV3Updated',
    'isGstUpdated',
    // 'missingCIN',
  ].some((field) => lastUpdatedData?.[field] === 'failed');
  const anyFailedForLLP = [
    'isCompanyDataUpdated',
    'isGstUpdated',
    'isLLPVpdUpdated',
    // 'missingCIN',
  ].some((field) => lastUpdatedData?.[field] === 'failed');
  const dataUpdateFailed =
    !dataUpdateInitiated &&
    (companyType === 'LLP' ? anyFailedForLLP : anyFailedForCompany);

  return {
    dataUpdateInitiated,
    dataUpdateCompleted,
    dataUpdateFailed,
  };
};
