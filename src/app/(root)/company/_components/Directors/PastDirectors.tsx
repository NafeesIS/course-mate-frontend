import { cn } from '@/lib/utils';
import PastDirectorsTable from './PastDirectorsTable';

const PastDirectors = ({ pastDirectors, className }: any) => {
  return (
    <section className={cn('wrapper', className)}>
      {/* <div className='mb-6 mt-8 md:mb-8 md:mt-10 lg:mb-10 lg:mt-12 xl:mb-12 xl:mt-14'>
        <Separator />
      </div> */}
      <h2 className='w-10/12 text-base font-semibold md:text-lg'>
        Past Directors
      </h2>
      <h6 className='mt-4 text-sm'>
        This section provides information about individuals who have previously
        held positions in the company. It includes the Director Identification
        Number (DIN), name, their previous designation, the date they were
        appointed to the role and the date their role ended. This helps track
        the history of leadership changes within the company.{' '}
      </h6>
      <div className='mt-3 w-full md:mt-5'>
        <PastDirectorsTable data={pastDirectors} />
      </div>
    </section>
  );
};

export default PastDirectors;
