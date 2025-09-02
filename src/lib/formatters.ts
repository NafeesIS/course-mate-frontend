// Utility function to convert string to URL-friendly format
// export const formatToUrl = (text: string) => {
//   return text.toLowerCase().replace(/\s+/g, '-');
// };

// export const formatToUrl = (text: string) => {
//   // Basic normalization and conversion to lowercase
//   let formattedText = text.trim().toLowerCase();

//   // Replace '&' with '&amp;'
//   formattedText = formattedText.replace(/&/g, '&amp;');

//   // Replace spaces with hyphens
//   formattedText = formattedText.replace(/\s+/g, '-');

//   // Handle any other URL-unsafe characters (optional)
//   formattedText = encodeURIComponent(formattedText);

//   return formattedText;
// };

export const formatName = (text: string) => {
  if (text.length === 0) return '-';
  // Remove any leading spaces
  let formattedText = text.trim();

  // Remove any leading special characters
  formattedText = text.replace(/^[^a-zA-Z0-9\s]+/, '');

  return formattedText;
};

export const formatToUrl = (text: string) => {
  if (text.length === 0) return '-';
  // Basic normalization and conversion to lowercase
  let formattedText = text.trim().toLowerCase();

  // Replace '&' with 'and'
  formattedText = formattedText.replace(/&/g, 'and');

  // Replace spaces with hyphens
  formattedText = formattedText.replace(/\s+/g, '-');

  // Replace all special characters with hyphens
  formattedText = formattedText.replace(/[^a-zA-Z0-9&\s-]/g, '-');

  // Replace multiple consecutive hyphens with a single hyphen
  formattedText = formattedText.replace(/-+/g, '-');

  // Remove leading and trailing hyphens
  formattedText = formattedText.replace(/^-+|-+$/g, '');

  return formattedText;
};

export function formatCompanyAge(
  totalMonths: number,
  dateOfIncorporation: string // DD-MMM-YYYY
): string {
  if (totalMonths === 0 || dateOfIncorporation.length === 0) return '-';

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let formattedAge = '';

  // If both years and months are 0, calculate days
  if (years === 0 && months === 0) {
    // Parse the dateOfIncorporation
    const [day, month, year] = dateOfIncorporation.split('-');
    const incorporationDate = new Date(`${month} ${day}, ${year}`);
    const today = new Date();

    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - incorporationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    formattedAge = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else {
    // Original logic for years and months
    if (years > 0) formattedAge += `${years} year${years !== 1 ? 's' : ''}`;
    if (years > 0 && months > 0) formattedAge += ' ';
    if (months > 0) formattedAge += `${months} month${months !== 1 ? 's' : ''}`;
  }

  return formattedAge;
}

export function formatCompanyAgeCompact(totalMonths: number): string {
  if (totalMonths === 0) return '-';

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let formattedAge = '';

  if (years > 0) formattedAge += `${years}y`;
  if (years > 0 && months > 0) formattedAge += ' ';
  if (months > 0 || years === 0) formattedAge += `${months}m`;

  return formattedAge;
}

export const parseQueryString = (
  queryString: string
): Record<string, string> => {
  if (queryString.length === 0) return {};

  const params: Record<string, string> = {};
  queryString
    .substring(1)
    .split('&')
    .forEach((param) => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value.replace(/\+/g, ' '));
      }
    });
  return params;
};

export function convertQueryStringToObject(
  queryString: string
): Record<string, string> {
  if (queryString.length === 0) return {};

  const params = new URLSearchParams(queryString);
  const queryObject: Record<string, string> = {};

  params.forEach((value, key) => {
    queryObject[key] = value;
  });

  return queryObject;
}

export function toCamelCase(str: string): string {
  if (str.length === 0) return '-';
  return str?.replace(/\w\S*/g, function (txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

interface Age {
  years: number;
  months: number;
}

export function calculateAge(birthDateString: string): Age {
  if (birthDateString.length === 0) return { years: 0, months: 0 };
  // Split the date string into month, day, and year
  const [birthMonth, birthDay, birthYear] = birthDateString
    .split('/')
    .map(Number);

  // Create a Date object representing the birth date
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in years and months between the current date and the birth date
  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();

  // Adjust years and months if the current date has not reached the birth date this year
  if (currentDate.getDate() < birthDate.getDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months };
}

export function formatCurrency(amount: number, currency: string): string {
  if (amount === 0) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyINR(value: string | number) {
  if (value === 0 || value === '' || value === null) return '-';
  const amount = typeof value === 'string' ? parseInt(value, 10) : value; // Ensure the value is an integer
  if (isNaN(amount)) return value; // Return empty string if value is not a number

  // Directly return for amounts less than 1 lakh
  if (amount < 100000) {
    return `₹${amount}`;
  }
  // Format for lakhs
  else if (amount >= 100000 && amount < 10000000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  // Format for crores
  else {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
}

export const formatLastUpdatedTime = (lastUpdatedOn: string) => {
  if (lastUpdatedOn.length === 0 || lastUpdatedOn === '0') return '-';
  const now = new Date();
  const updatedTime = new Date(lastUpdatedOn);

  const timeDiff = now.getTime() - updatedTime.getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `Last updated ${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `Last updated ${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `Last updated ${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `Last updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `Last updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `Last updated just now`;
  }
};
