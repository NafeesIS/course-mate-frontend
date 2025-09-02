import { cn } from '@/lib/utils';
import Link from 'next/link';
import { RiSearchLine } from 'react-icons/ri';
import { Button } from '../../../../components/ui/button';

const companies = [
  {
    name: 'Reliance Industries Limited',
    link: '/company/reliance-industries-limited/L17110MH1973PLC019786?tab=about',
  },
  {
    name: 'Tata Consultancy Services Limited',
    link: '/company/tata-consultancy-services-limited/L22210MH1995PLC084781?tab=about',
  },
  {
    name: 'Infosys Limited',
    link: '/company/infosys-limited/L85110KA1981PLC013115?tab=about',
  },
  {
    name: 'Hindustan Unilever Limited',
    link: '/company/hindustan-unilever-limited/L15140MH1933PLC002030?tab=about',
  },
  {
    name: 'HDFC Bank Limited',
    link: '/company/hdfc-bank-limited/L65920MH1994PLC080618?tab=about',
  },
];

const PopularSearches = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 whitespace-nowrap text-xs text-gray-200 md:text-sm lg:flex-row',
        className
      )}
    >
      Popular Searches:
      <ul className='flex flex-wrap justify-center gap-2'>
        {companies.map((item, index) => (
          <li
            key={index}
            className={cn(companies.length - 1 === index && 'hidden xl:block')}
          >
            <Button variant='gooeyLeft' title={item.name} asChild>
              <Link
                href={item.link}
                prefetch={false}
                className='flex max-w-32 gap-1.5 bg-sky-600 text-xs font-medium tracking-wide text-gray-200 md:max-w-48'
              >
                <span>
                  <RiSearchLine className='h-4 w-4' />
                </span>
                <span className='truncate'>{item.name}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularSearches;
