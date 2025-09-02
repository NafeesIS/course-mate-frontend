'use client';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { RiArrowRightLine } from 'react-icons/ri';

const ViewAllDirectorsBtn = () => {
  const router = useRouter();
  const pathName = usePathname();
  const handleViewAllDirectors = () => {
    router.replace(`${pathName}?tab=directors`);
  };

  return (
    <Button variant='link' className='gap-2' onClick={handleViewAllDirectors}>
      View all Directors <RiArrowRightLine className='text-lg' />
    </Button>
  );
};

export default ViewAllDirectorsBtn;
