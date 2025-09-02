export function highlightText(text: string, searchTerm: string) {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={index} className='bg-yellow-200 dark:bg-yellow-800'>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
