module.exports = {
  // Type check TypeScript files
  'src/**/*.(ts|tsx)': () => 'npx tsc --noEmit',

  // Lint & Prettify TS and JS files
  'src/**/*.(ts|tsx|js|jsx)': (filenames) => [
    `npx prettier --write ${filenames.join(' ')}`,
    `npx eslint ${filenames.join(' ')}`,
  ],

  // Prettify only Markdown and JSON files
  'src/**/*.(md|json)': (filenames) =>
    `npx prettier --write ${filenames.join(' ')}`,
};
