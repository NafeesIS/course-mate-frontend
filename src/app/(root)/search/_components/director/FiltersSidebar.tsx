import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  TDirectorSearchFacets,
  TDirectorSearchParams,
} from '@/types/DirectorSearchTypes';
import { RiFilter2Fill } from 'react-icons/ri';
import FilterBadges from './FilterBadges';
import Filters from './Filters';

const FiltersSidebar = ({
  searchFacets,
  searchParams,
  className,
}: {
  searchFacets: TDirectorSearchFacets;
  searchParams: TDirectorSearchParams;
  className?: string;
}) => {
  return (
    <div className={cn(className)}>
      <Drawer direction='left'>
        <DrawerTrigger className='ml-auto' asChild>
          <Button variant='outline' className='flex items-center gap-1'>
            Filter <RiFilter2Fill />
          </Button>
        </DrawerTrigger>
        <DrawerContent className='max-w-80 overflow-y-hidden rounded-none'>
          <DrawerHeader className='p-0'>
            <FilterBadges searchParams={searchParams} className='p-4 pb-0' />
          </DrawerHeader>

          <ScrollArea>
            <Filters
              searchParams={searchParams}
              searchFacets={searchFacets}
              className='p-4'
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FiltersSidebar;
