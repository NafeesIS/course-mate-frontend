const DisclaimerTexts = ({ companyType }: { companyType: string }) => {
  if (companyType === 'Company') {
    return (
      <div className='mt-8 space-y-3 text-[13px] text-muted-foreground'>
        <div>
          <p className='text-sm font-bold underline'>For Form INC-20A:</p>
          <ul className='mt-2 space-y-2'>
            <li>
              <span className='font-semibold'>Before 2nd November 2018:</span>
              <ul className='mt-1 list-disc space-y-1 pl-8'>
                <li>
                  Under the{' '}
                  <span className='font-semibold'>Companies Act, 1956</span>,
                  private companies could start business immediately upon
                  incorporation.
                </li>
                <li>
                  Under the{' '}
                  <span className='font-semibold'>Companies Act, 2013</span>,
                  until{' '}
                  <span className='font-semibold'>1st November, 2018</span>, No{' '}
                  <span className='font-semibold'>
                    Commencement of Business Certificate
                  </span>{' '}
                  was required.
                </li>
              </ul>
            </li>
            <li>
              <span className='font-semibold'>From 2nd November, 2018:</span>
              <ul className='mt-1 list-disc space-y-1 pl-8'>
                <li>
                  As per The Companies (Amendment) Ordinance, 2018, companies
                  (with share capital) registered after this date must obtain a
                  Commencement of Business Certificate before starting business
                  or borrowing funds.
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className='mt-2'>
          <p className='flex flex-wrap gap-1.5 text-sm font-bold underline'>
            For Form ADT-1:
          </p>
          <ul className='mt-2 list-disc space-y-1 pl-8'>
            <li>
              <span className='font-semibold'>Form ADT-1</span> was introduced
              under the{' '}
              <span className='font-semibold'>Companies Act, 2013</span>, which
              came into force on{' '}
              <span className='font-semibold'>
                1<sup>st</sup> April 2014
              </span>
              . Under this Act, every company must file the intimation of the
              appointment of an auditor with the{' '}
              <span className='font-semibold'>Registrar of Companies</span>.
            </li>
            <li>
              Prior to this, under the{' '}
              <span className='font-semibold'>Companies Act, 1956</span>, the
              compliance of filing was not applicable to companies as the
              appointed auditor was required to file{' '}
              <span className='font-semibold'>Form 23B</span> to intimate their
              acceptance of the appointment.
            </li>
          </ul>
        </div>
      </div>
    );
  }
};

export default DisclaimerTexts;
