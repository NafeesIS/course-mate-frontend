'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSearchResults from '../_hooks/useDocSearch';
import usePopularTags from '../_hooks/usePopularTags';
import { IRecentSearchTags } from '../_types/types';
import DocSearchBar from './DocSearchBar';
import PopularTagSearch from './PopularTagSearch';

// ---------- helpers ----------
const removeDuplicates = (tags: IRecentSearchTags[]): IRecentSearchTags[] => {
  const seen = new Set<string>();
  return tags.filter((tag) => {
    const slug = tag?.slug?.toLowerCase();
    if (!slug || seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
};

const arraysEqualBySlug = (a: IRecentSearchTags[], b: IRecentSearchTags[]) => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if ((a[i]?.slug || '').toLowerCase() !== (b[i]?.slug || '').toLowerCase()) {
      return false;
    }
  }
  return true;
};

// ---------- component ----------
type Props = { showPopularTags?: boolean };

const SearchBarWithPopularSearch = ({ showPopularTags = true }: Props) => {
  // ui state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);

  // popular searches
  const [popularSearches, setPopularSearches] = useState<IRecentSearchTags[]>(
    []
  );

  // refs
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // hooks
  const { popularTags: rawApiPopularTags, error: popularError } =
    usePopularTags();
  const {
    results,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchResults(debouncedQuery);

  // stabilize apiPopularTags identity (safe no-op if array is already stable)
  const apiPopularTags = useMemo(
    () => (Array.isArray(rawApiPopularTags) ? [...rawApiPopularTags] : []),
    [rawApiPopularTags]
  );

  // ---------- stable setter to avoid unnecessary state churn ----------
  const setPopularSearchesIfChanged = useCallback(
    (next: IRecentSearchTags[]) => {
      setPopularSearches((prev) =>
        arraysEqualBySlug(prev, next) ? prev : next
      );
    },
    []
  );

  // ---------- update recent tags (dedup + persist) ----------
  const updatePopularSearches = useCallback(
    (newTags: IRecentSearchTags[]) => {
      try {
        const existingTagsRaw = localStorage.getItem('recentTagSearch');
        let existing: IRecentSearchTags[] = existingTagsRaw
          ? JSON.parse(existingTagsRaw)
          : [];
        existing = removeDuplicates(existing);

        const existingSlugs = new Set(
          existing.map((t) => t.slug?.toLowerCase()).filter(Boolean) as string[]
        );
        const uniqueNewTags = newTags.filter(
          (t) => t?.slug && !existingSlugs.has(t.slug.toLowerCase())
        );

        const combined = removeDuplicates([
          ...uniqueNewTags,
          ...existing,
        ]).slice(0, 5);

        localStorage.setItem('recentTagSearch', JSON.stringify(combined));
        setPopularSearchesIfChanged(combined);
      } catch (e) {
        console.error('Error updating popular searches:', e);
      }
    },
    [setPopularSearchesIfChanged]
  );

  // ---------- outside click: close suggestions ----------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchResultsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ---------- initialize popularSearches once (localStorage -> API fallback) ----------
  const initDoneRef = useRef(false);
  useEffect(() => {
    if (initDoneRef.current) return;

    try {
      const raw = localStorage.getItem('recentTagSearch');
      if (raw) {
        const parsed: IRecentSearchTags[] = JSON.parse(raw);
        const cleaned = removeDuplicates(parsed).slice(0, 5);
        if (!arraysEqualBySlug(parsed, cleaned)) {
          localStorage.setItem('recentTagSearch', JSON.stringify(cleaned));
        }
        setPopularSearchesIfChanged(cleaned);
        initDoneRef.current = true;
        return;
      }
    } catch (e) {
      console.error('Failed to parse recentTagSearch:', e);
      localStorage.removeItem('recentTagSearch');
    }

    // fallback to API popular tags once when available
    if (apiPopularTags && apiPopularTags.length > 0) {
      const cleaned = removeDuplicates(apiPopularTags).slice(0, 5);
      setPopularSearchesIfChanged(cleaned);
      initDoneRef.current = true;
    }
  }, [apiPopularTags, setPopularSearchesIfChanged]);

  // ---------- debounce ----------
  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedQuery(searchQuery.trim()),
      400
    );
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // ---------- process search results (guarded) ----------
  const lastUpdatedQueryRef = useRef<string>('');
  useEffect(() => {
    if (!debouncedQuery) {
      setIsSearchResultsOpen(false);
      return;
    }

    if (searchError) {
      console.error('Search error:', searchError);
      setIsSearchResultsOpen(false);
      return;
    }
    if (popularError) {
      console.error('Popular tags error:', popularError);
    }

    const hasResults = Array.isArray(results) && results.length > 0;
    setIsSearchResultsOpen(hasResults);

    if (!hasResults) return;
    if (lastUpdatedQueryRef.current === debouncedQuery) return; // avoid re-processing same query
    lastUpdatedQueryRef.current = debouncedQuery;

    const foundTags = results.flatMap((item: any) => item?.tags || []);
    const validTags: IRecentSearchTags[] = foundTags.filter(
      (tag: any) =>
        tag &&
        typeof tag === 'object' &&
        tag.slug &&
        tag.name &&
        tag.slug.trim() !== '' &&
        tag.name.trim() !== ''
    );

    if (validTags.length > 0) updatePopularSearches(validTags);
  }, [
    debouncedQuery,
    results,
    searchError,
    popularError,
    updatePopularSearches,
  ]);

  // ---------- handlers ----------
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchResultsOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleSuggestionsClose = useCallback(() => {
    setIsSearchResultsOpen(false);
    inputRef.current?.focus();
  }, []);

  // ---------- render ----------
  return (
    <div>
      <DocSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        isSearchResultsOpen={isSearchResultsOpen}
        setIsSearchResultsOpen={setIsSearchResultsOpen}
        isSearchLoading={isSearchLoading}
        results={results}
        onClear={clearSearch}
        onSuggestionsClose={handleSuggestionsClose}
        inputRef={inputRef}
        searchRef={searchRef}
        showPopularTags={showPopularTags}
      />

      {popularSearches && (
        <div className={showPopularTags ? 'block' : 'hidden'}>
          <PopularTagSearch
            popularSearches={popularSearches}
            isSearchResultsOpen={isSearchResultsOpen}
            searchQuery={searchQuery}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBarWithPopularSearch;
