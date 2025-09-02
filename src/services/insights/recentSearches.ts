import { BASE_URL_BACKEND } from '@/constants';
import { formatName, formatToUrl } from '@/lib/formatters';
import axios from 'axios';

// SEND RECENT SEARCHES TO DATABASE TO COLLECT STATS
export const sendAndStoreRecentSearches = async (tab: string, data: any) => {
  const name = data?.company || data?.fullName;
  const idNo = data?.cin || data?.din;
  const newSearch = {
    type: tab,
    path: `/${tab}/${formatToUrl(name)}/${idNo}`,
    idNo: idNo,
    name: name,
    count: 1,
  };

  // Check if the current tab, search term, and CIN number are already present
  const recentSearchesFromLS = localStorage.getItem('recentSearches');
  const searches = recentSearchesFromLS ? JSON.parse(recentSearchesFromLS) : [];
  const searchExists = searches.some(
    (search: { tab: string; idNo: string; syncedToDB?: boolean }) =>
      search.tab === newSearch.type &&
      search.idNo === newSearch.idNo &&
      search.syncedToDB
  );

  if (searchExists) {
    return;
  }

  // If not already stored, add them to the recent searches
  if (!searchExists) {
    const updatedSearches = [
      {
        tab: newSearch.type,
        name:
          newSearch.name && newSearch.name.length > 0
            ? formatName(newSearch.name)
            : '-',
        idNo: newSearch.idNo,
        syncedToDB: true,
      },
      ...searches,
    ];
    // Keep only the latest 100 entries
    if (updatedSearches.length > 100) {
      updatedSearches.length = 100;
    }
    // Save recent searches to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  }

  // IMPORTANT: DO NOT SEND RECENT SEARCHES IF IN DEVELOPMENT MODE
  if (
    process.env.NEXT_PUBLIC_SITEMAP_ENV?.includes('development') ||
    process.env.NEXT_PUBLIC_SITEMAP_ENV?.includes('staging')
  ) {
    return;
  }

  // Send recent searches to database
  const result = newSearch;
  try {
    await axios.post(
      `${BASE_URL_BACKEND}/api/v1/insights/recentSearches`,
      result
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error saving recent search:', error);
  }
};
