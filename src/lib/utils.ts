import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatName } from './formatters';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
};

export function getInitials(name: string): string {
  const nameArray = name.split(' ');
  const initials = nameArray
    .reduce((acc, word) => {
      if (acc.length < 3) {
        acc += word.charAt(0);
      }
      return acc;
    }, '')
    .toUpperCase();

  return initials;
}

// Financial Year: JAN-DEC
export const getCurrentFY = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentFinancialYear = `${currentYear - 1}-${currentYear}`;
  return currentFinancialYear;
};

export const getStatusBadgeColor = (status: string): string => {
  if (!status) return 'bg-sky-300 text-blue-950';

  const positiveColors: Record<string, string> = {
    Active: 'bg-green-300 text-green-950', // Green for Active
  };

  const negativeColors: Record<string, string> = {
    'Strike Off': 'bg-red-400 text-red-950', // Red for Strike Off
  };

  // Default color for other statuses
  const defaultColor = 'bg-sky-300 text-blue-950';

  // Check if status matches positive or negative colors, else return default
  return positiveColors[status] || negativeColors[status] || defaultColor;
};

export const getDirectorStatusColor = (status: string): string => {
  if (!status) return 'bg-sky-300 text-blue-950';

  const statusColors: Record<string, string> = {
    Rejected: 'bg-red-400 text-red-950',
    Deactivated: 'bg-gray-300 text-gray-950',
    Inactive: 'bg-gray-300 text-gray-950',
    Provisional: 'bg-sky-300 text-sky-950',
    Surrendered: 'bg-gray-300 text-gray-950',
    Disabled: 'bg-gray-300 text-gray-950',
    Lapsed: 'bg-sky-300 text-sky-950',
    Approved: 'bg-green-300 text-green-950',
  };

  // Default color for other statuses
  const defaultColor = 'bg-sky-400 text-gray-950';

  // Check if status matches statusColors, else return default
  return statusColors[status] || defaultColor;
};

export const getColumnBadgeClasses = (data: string) => {
  if (!data) return 'text-gray-500';

  const lowerCaseData = data.toLowerCase();
  if (
    lowerCaseData.includes('not filed') ||
    lowerCaseData.includes('delay') ||
    lowerCaseData.includes('overdue')
  ) {
    return 'text-red-700';
  } else if (
    lowerCaseData.includes('open for') ||
    lowerCaseData.includes('days left')
  ) {
    return 'text-sky-500';
  } else {
    return 'text-green-500'; // default class, if none of the conditions match
  }
};

export const isCustomDateFormat = (filingDate: string) => {
  if (!filingDate) return false;

  // Check if filingDate matches the format "dd-mmm-yyyy"
  return /^[0-9]{2}-[A-Za-z]{3}-[0-9]{4}$/.test(filingDate);
};

// utils/storage.js

export const storeRecentSearchToLocalStorage = (
  tab: string,
  name: string,
  idNo?: string
): void => {
  if (!tab || !name)
    return console.error('No tab or name to store recent search');

  const existingSearches = localStorage.getItem('recentSearches');
  const searches: { tab: string; name: string; idNo?: string }[] =
    existingSearches ? JSON.parse(existingSearches) : [];

  // Check if the current tab, search term, and CIN number are already present
  const isAlreadyStored = searches.some(
    (search) => search.tab === tab && search.idNo === idNo
  );

  // If not already stored, add them to the recent searches
  if (!isAlreadyStored) {
    const updatedSearches = [
      {
        tab,
        name: name && name.length > 0 ? formatName(name) : '-',
        idNo,
      },
      ...searches,
    ];
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  }
};

// FOR RECENT SEARCHES BY USERS
// Generate and store user identifier
export const getUserIdentifier = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// Get search history
export const getSearchHistory = () => {
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : [];
};

// Update search history
export const updateSearchHistory = (newSearch: string) => {
  if (!newSearch) return console.error('No search to update');

  const history = getSearchHistory();
  if (!history.includes(newSearch)) {
    history.push(newSearch);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }
};

// add commas to price
export const formatPriceWithCommas = (
  price: number | string | undefined | null,
  decimalPlaces?: boolean
): string => {
  if (price === undefined || price === null) {
    return ''; // Return an empty string if price is undefined or null
  }

  // Convert the price to a float, then apply Math.floor to ensure we round down
  const PriceInNumber = Number(price);

  // Format the floored price with commas
  if (!decimalPlaces) {
    return PriceInNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return PriceInNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

// Check if the GST number is valid
export const validateGst = (gstNumber: string): boolean => {
  if (!gstNumber) return false;

  const regTest = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(
    gstNumber
  );

  if (regTest) {
    const a = 65,
      b = 55,
      c = 36;
    const sum = Array.from(gstNumber).reduce<number>((acc, char, index) => {
      const value =
        (char.charCodeAt(0) < a ? parseInt(char) : char.charCodeAt(0) - b) *
        ((index % 2) + 1);
      const p = value > c ? 1 + (value - c) : value;
      return index < 14 ? acc + p : acc;
    }, 0);

    const checkCode =
      c - (sum % c) < 10
        ? (c - (sum % c)).toString()
        : String.fromCharCode(c - (sum % c) + b);

    // Return the boolean comparison
    return gstNumber[14] === checkCode;
  }

  return false;
};
