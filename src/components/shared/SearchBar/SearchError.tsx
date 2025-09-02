const SearchError = () => {
  return (
    <div className='flex-col-center w-full gap-2 text-center md:gap-4'>
      <p className='text-2xl md:text-3xl'>
        <span aria-label='Wrench' role='img'>
          🛠️
        </span>
      </p>
      <div className='space-y-2'>
        <p className='text-base font-semibold md:text-2xl'>
          Oops! Technical difficulties.
        </p>
        <p className='text-sm text-muted-foreground md:text-base'>
          We&apos;re fixing it now. Feel free to explore other parts of our site
          while we sort this out!
        </p>
      </div>
    </div>
  );
};

export default SearchError;
