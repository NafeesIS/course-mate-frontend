// app/_utils/parseHeadingsFromHtml.ts

export interface Heading {
  id: string;
  text: string;
  level: number;
  element: string;
}

/**
 * Regex-based heading parser and ID injector.
 * - Adds unique IDs to headings (h1-h6)
 * - Returns modified HTML and headings array
 */
export function parseHeadingsFromHtml(html: string): {
  htmlWithIds: string;
  headings: Heading[];
} {
  let headingCount = 0;
  const headings: Heading[] = [];

  // Regex: matches <h1>...</h1> through <h6>...</h6>
  // Captures: 1=tag, 2=attributes, 3=innerHTML, 4=tag
  const headingRegex = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  // Replace headings, inject IDs, and collect heading info
  const htmlWithIds = html.replace(
    headingRegex,
    (match, level, attrs, inner) => {
      const id = `heading-${headingCount++}`;

      // Remove any existing id attribute
      const cleanAttrs = attrs.replace(/\s*id\s*=\s*(['"])[^'"]*\1/, '');

      // Extract plain text (strip tags) for TOC
      const text = inner.replace(/<[^>]+>/g, '').trim();

      headings.push({
        id,
        text,
        level: parseInt(level, 10),
        element: `h${level}`,
      });

      return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`;
    }
  );

  return { htmlWithIds, headings };
}
