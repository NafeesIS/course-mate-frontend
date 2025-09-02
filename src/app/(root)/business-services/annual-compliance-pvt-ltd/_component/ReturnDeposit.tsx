const ReturnDeposit = () => {
  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto mb-6 px-4 pt-14 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Due date for{' '}
        <span className='italic text-primary'>
          Return of Deposits for FY 23-24
        </span>
      </h2>
      <div className='pl-4'>
        <ul className='text-muted-foreground-darker list-disc text-start text-xs lg:text-sm'>
          <li>
            Every company (other than a government company) that has outstanding
            receipt of money or loans, whether classified as deposit or not
            under the Companies (Acceptance of Deposits) Rules, 2014 must file
            Form DPT-3 annually.
          </li>
        </ul>
      </div>
      <p className='mb-4 mt-5 text-start text-sm font-semibold sm:text-center lg:mt-4 lg:text-base'>
        Due dates for companies Incorporated on or before 31st December, 2023
      </p>
      <div className='no-scrollbar w-full overflow-scroll'>
        <div className='mx-auto flex w-full min-w-[450px] max-w-5xl items-center justify-between text-start'>
          <div className='w-[30%] border'>
            <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
              Compliance
            </p>
            <p className='w-full p-2 text-xs lg:text-sm'>Return of Deposits</p>
          </div>
          <div className='w-[25%] border'>
            <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
              Form
            </p>
            <p className='w-full p-2 text-xs lg:text-sm'>DPT-3</p>
          </div>
          <div className='w-[45%] border'>
            <p className='w-full bg-[#094E9E] p-2 text-sm font-semibold italic text-white lg:text-base'>
              Due Date of Form Filing
            </p>
            <p className='w-full p-2 text-xs lg:text-sm'>30th June, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnDeposit;
