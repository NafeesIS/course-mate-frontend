import {
  CongratulationsSvg,
  LLPArrowSvg,
  ListSvg,
  SearchSvg,
} from '../../registration-pvt-ltd/_data/PLCSvg';

const WhatsNextLLP = () => {
  return (
    <div className='mb-10 mt-12 text-center'>
      <h2 className='wrapper mx-auto mb-10 px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Did everything!{' '}
        <span className='italic text-primary'>Then what’s Next?</span>
      </h2>
      <div className='bg-muted pb-10 pt-10 md:pt-0'>
        <div className='wrapper'>
          <div className='mx-auto flex max-w-[320px] flex-row gap-2  md:max-w-full md:flex-col'>
            <div className='flex w-[20%] flex-col items-center justify-between gap-6 md:w-full md:flex-row md:pl-24 md:pr-24 lg:pr-32'>
              <SearchSvg />
              <div className='relative flex h-[77%] -translate-y-10 items-center md:h-full md:w-full md:-translate-y-0'>
                <div className='h-[77%] w-0.5 bg-border md:h-0.5 md:w-full'></div>
                <LLPArrowSvg />
              </div>
              <ListSvg />
              <div className='relative flex h-[74%] -translate-y-20 items-center md:h-full md:w-full md:-translate-y-0'>
                <div className='h-[74%] w-0.5 bg-border md:h-0.5 md:w-full'></div>
                <LLPArrowSvg />
              </div>
              <CongratulationsSvg />
            </div>
            <div className='flex w-full flex-col items-start justify-between gap-10 text-start md:flex-row'>
              <div className='max-w-56 md:max-w-60 lg:max-w-72'>
                <p className='text-sm lg:text-base'>
                  Submission of forms to Central Registration Centre (CRC) and
                  Checking of forms by CRC
                </p>
                <ul className='text-muted-foreground-darker mt-4 list-inside list-disc text-xs font-normal lg:text-sm'>
                  <li>
                    After submission of all forms and paying government fees and
                    stamp duty,{' '}
                    <span className='font-semibold'>
                      CRC will check the forms and if any error is found in
                      incorporation forms CRC will guide and this will be
                      subjected to resubmission.
                    </span>{' '}
                  </li>
                  <li>
                    LLP have to make the necessary corrections in resubmissions
                    and re-submit the form.
                  </li>
                </ul>
              </div>
              <div className='max-w-56 md:ml-4 md:max-w-60 lg:ml-14 lg:max-w-72'>
                <p className='text-sm lg:text-base'>
                  Granting of Certificate of Incorporation (COI)
                </p>
                <ul className='text-muted-foreground-darker mt-4 list-inside list-disc text-xs font-normal lg:text-sm'>
                  If CRC is satisfied, it will grant Certificate of
                  Incorporation.
                  <ol className='mt-3 list-inside list-decimal'>
                    <span className='font-semibold'>
                      COI will contain following details:
                    </span>
                    <li>Name of the LLP</li>
                    <li>Date of Incorporation</li>
                    <li>Registered Office Address</li>
                    <li>LLP Identification No</li>
                    <li>PAN</li>
                    <li>TAN</li>
                  </ol>
                </ul>
              </div>
              <div className='max-w-56 md:max-w-60 lg:max-w-72'>
                <p className='text-start text-sm lg:text-base'>
                  Congratulations on Incorporation
                </p>
                <div className='text-muted-foreground-darker mt-4 space-y-3 text-xs font-normal lg:text-sm'>
                  <p>
                    Congratulations on successfully incorporating your business!
                  </p>
                  <p>
                    This achievement marks the start of an exciting journey
                    toward growth and success.{' '}
                  </p>
                  <p>Wishing you a bright future ahead!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsNextLLP;
