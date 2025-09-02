import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const HeroBreadcrumb = ({ className }: { className?: string }) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className='text-white/80'>
        <BreadcrumbItem>
          <BreadcrumbLink
            href='/'
            className='hover:text-white/90 hover:underline'
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className='font-medium text-white'>
            Search Results
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default HeroBreadcrumb;
