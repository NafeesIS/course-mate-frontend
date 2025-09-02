import { format, subDays } from 'date-fns';

const LateAGMDesc = ({
  agmDate,
  periodOfDelay,
}: {
  agmDate: string;
  periodOfDelay: string;
}) => {
  const agmDueDate = format(
    subDays(agmDate, parseInt(periodOfDelay)),
    'dd-MMM-yyyy'
  );

  return (
    <div className='m-4 space-y-2 rounded-md bg-muted p-3 text-xs md:text-sm'>
      <p>
        The last date to hold the AGM, as required under{' '}
        <strong className='font-semibold'>section 96</strong> of the{' '}
        <strong className='font-semibold'>Companies Act, 2013</strong>, was{' '}
        <strong className='font-semibold'>{agmDueDate}</strong>. However, the
        AGM was actually conducted on{' '}
        <strong className='font-semibold'>{agmDate}</strong>, resulting in a
        delay of <strong className='font-semibold'>{periodOfDelay} days</strong>
        .
      </p>
      <p>
        Due to this delay, the following fines are applicable to both the
        company and each director:
      </p>
      <ul className='list-inside list-disc pl-4'>
        <li>
          Fine under <strong className='font-semibold'>Section 99</strong> of
          the <strong className='font-semibold'>Companies Act, 2013</strong>:{' '}
          <strong className='font-semibold'>₹ 1,00,000</strong>.
        </li>
        <li>
          Additional Fine for continuous default: A fine of{' '}
          <strong className='font-semibold'>₹ 5,000 per</strong> day for each
          day delayed, totaling{' '}
          <strong className='font-semibold'>
            ₹ {5000 * parseInt(periodOfDelay)}
          </strong>
          .
        </li>
      </ul>
      <p>
        Total Fine:{' '}
        <strong className='font-semibold'>
          {' '}
          ₹ {100000 + 5000 * parseInt(periodOfDelay)}
        </strong>
      </p>
    </div>
  );
};

export default LateAGMDesc;

{
  /* <div className='m-4 space-y-2 rounded-md bg-muted p-3'>
      <p>
        <strong className='font-medium'>{periodOfDelay} days delay</strong> in
        holding <strong className='font-medium'>AGM</strong> and total penalty =
        Company itself:{' '}
        <strong className='font-medium'>
          {formatCurrencyINR(100000 + parseInt(periodOfDelay) * 5000)}
        </strong>{' '}
        + each Director{' '}
        <strong className='font-medium'>
          {formatCurrencyINR(100000 + parseInt(periodOfDelay) * 5000)}
        </strong>
      </p>
    </div> */
}
