const ConveningAnnualMeeting = () => {
  return (
    <div className='wrapper mt-16 text-center'>
      <h2 className='mx-auto mb-8 max-w-2xl px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Due date for{' '}
        <span className='italic text-primary'>
          Convening Annual General Meeting for FY 23-24
        </span>
      </h2>
      <div className='mb-4 pl-4'>
        <ul className='text-muted-foreground-darker list-disc space-y-2 text-start text-xs lg:text-sm'>
          <li>
            The Annual General Meeting (AGM) must be held within 6 months from
            the end of the financial year, i.e., by 30th September 2024,{' '}
            <span className='font-semibold'>OR</span> within 15 months from the
            date of the last AGM, whichever is{' '}
            <span className='font-semibold'>EARLIER.</span>
          </li>
          <li>
            The first AGM, however, must be held within 9 months from the end of
            the financial year. Therefore, the first AGM should be conducted on
            or before 31st December 2023.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConveningAnnualMeeting;
