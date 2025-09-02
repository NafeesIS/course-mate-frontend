// app/(root)/docs/_services/wrapTablesForScroll.ts

/**
 * Server-safe: wraps every <table>...</table> block with a horizontal scroll container.
 * Uses a simple regex; assumes well-formed HTML from your editor.
 */
export function wrapTablesForScroll(html: string): string {
  if (!html) return html;

  // Match each complete table block
  const tableRegex = /<table\b[\s\S]*?<\/table>/gi;

  return html.replace(tableRegex, (tableHtml) => {
    // Avoid double-wrapping if already wrapped upstream (cheap heuristic)
    if (tableHtml.includes('rt-table-wrap')) return tableHtml;

    return `
<div class="rt-table-wrap min-w-[640px] w-full overflow-x-auto scrollbar-thin border scrollbar-thumb-gray-300 scrollbar-track-transparent">

    ${tableHtml}

</div>`.trim();
  });
}
