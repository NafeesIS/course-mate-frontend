/* eslint-disable camelcase */
/**
 * Extracts UTM parameters from the current URL (window.location.search)
 * Returns an object with utm_source, utm_medium, utm_campaign, utm_term, utm_content if present
 */
export function getUtmParamsFromUrl(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
} {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ['utm_campaign', 'utm_medium', 'utm_source', 'utm_term']) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

/**
 * Extracts account domain and name from an email address using regex.
 * @param email - The email address to parse.
 * @returns { account_domain: string, account_name: string }
 */
export function getAccountDomainAndNameFromEmail(email: string): {
  account_domain: string;
  account_name: string;
} {
  if (typeof email !== 'string')
    return { account_domain: '', account_name: '' };

  const match = /^([\w.-]+)@([\w.-]+)$/.exec(email);
  if (!match) return { account_domain: '', account_name: '' };

  const [, namePart, domainPart] = match;
  const account_name = namePart
    .replace(/[._]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
  return {
    account_domain: domainPart,
    account_name,
  };
}
