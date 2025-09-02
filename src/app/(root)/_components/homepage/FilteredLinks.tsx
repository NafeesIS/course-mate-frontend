import { cn } from '@/lib/utils';
import Link from 'next/link';
import { RiArrowRightLine } from 'react-icons/ri';
import { Button } from '../../../../components/ui/button';

const filters = [
  {
    name: 'Active Companies',
    link: '/search/company?page=1&llpStatus=Active',
  },
  {
    name: 'Listed Companies',
    link: '/search/company?page=1&whetherListedOrNot=Y',
  },
  {
    name: 'Limited Liability Partnership (LLP)',
    link: '/search/company?page=1&companyType=LLP',
  },
  {
    name: 'Strike Off',
    link: '/search/company?page=1&llpStatus=Strike+Off',
  },
  {
    name: 'Inactive',
    link: '/search/company?page=1&llpStatus=Inactive',
  },
];

const FilteredLinks = ({ className }: { className?: string }) => {
  return (
    <ul className={cn('flex-center flex-wrap gap-4', className)}>
      {filters.map((filter, index) => (
        <li
          key={index}
          className={cn(
            filters.length - 1 === index && 'hidden lg:block',
            filters.length - 2 === index && 'hidden md:block'
          )}
        >
          <Button variant='outline' className='border-gray-100' asChild>
            <Link
              href={filter.link}
              prefetch={false}
              target='_blank'
              className='group flex items-center gap-1 border-gray-300/80 bg-transparent text-xs text-gray-300/90 transition-all duration-300 hover:border-gray-50 hover:bg-transparent hover:text-gray-50 md:text-sm'
            >
              <span>{filter.name}</span>
              <span>
                <RiArrowRightLine className='h-4 w-4 transition-all duration-100 group-hover:-rotate-45 group-hover:scale-105' />
              </span>
            </Link>
          </Button>
        </li>
      ))}

      <li>
        <Button
          variant='link'
          className='duration-300/80 text-gray-200 transition-all hover:text-gray-50'
          asChild
        >
          <Link
            href='/search/company?page=1'
            prefetch={false}
            target='_blank'
            className='group flex items-center gap-1 text-xs  md:text-sm'
          >
            <span>View All</span>
            <span>
              <RiArrowRightLine className='h-4 w-4 transition-all duration-100 group-hover:-rotate-45 group-hover:scale-105' />
            </span>
          </Link>
        </Button>
      </li>
    </ul>
  );
};

export default FilteredLinks;
