// Function to parse a date string into a Date object
export function parseDate(dateString: string | undefined): number {
  if (!dateString) {
    // If dateString is undefined or empty, return a large value (like Infinity) for sorting
    return Infinity;
  }

  const parsedDate = new Date(dateString);

  // If parsedDate is invalid, return Infinity for sorting
  return isNaN(parsedDate.getTime()) ? Infinity : parsedDate.getTime();
}

// Function to get first and latest company based on roleEffectiveDate
export function getFirstAndLatestCompany(companyData: any) {
  if (!Array.isArray(companyData) || companyData.length === 0) {
    return { firstCompany: null, latestCompany: null };
  }

  // Sort the array by roleEffectiveDate (ascending)
  const sortedCompanies = companyData.sort(
    (a, b) =>
      parseDate(a.currentDesignationDate) - parseDate(b.currentDesignationDate)
  );

  // Get the first and latest companies
  const firstCompany = sortedCompanies[0];
  const latestCompany = sortedCompanies[sortedCompanies.length - 1];

  return { firstCompany, latestCompany };
}
