import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import CurrentLeadershipTable from './CurrentLeadershipTable';
const CurrentLeadership = ({
  boardMember,
  executiveTeam,
  individualPromoters,
  className,
}: any) => {
  const tabsTriggerClasses = `rounded-none px-2 py-2 border-b-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-400 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none`;
  return (
    <section className={cn('wrapper', className)}>
      <h2 className='w-10/12 text-base font-semibold md:text-lg'>
        Current Leadership details
      </h2>
      <h6 className='mt-4 text-sm'>
        This section lists the directors who are currently holding positions in
        this company. It includes the Director Identification Number (DIN),
        name, current designation and the date they were appointed to their
        current role.{' '}
      </h6>
      <Tabs defaultValue='board-members' className='mt-4 w-full md:mt-4'>
        <ScrollArea className='h-12'>
          <TabsList className='gap-3 bg-background'>
            <TabsTrigger value='board-members' className={tabsTriggerClasses}>
              Board Members
              <Badge className='ml-2 rounded-full bg-sky-200 px-1.5 text-xs text-gray-900 shadow-none hover:bg-sky-200'>
                {boardMember ? boardMember.length : '-'}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value='executive-team' className={tabsTriggerClasses}>
              Executive Team{' '}
              <Badge className='ml-2 rounded-full bg-sky-200 px-1.5 text-xs text-gray-900 shadow-none hover:bg-sky-200'>
                {executiveTeam ? executiveTeam.length : '-'}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value='individual-promoters'
              className={tabsTriggerClasses}
            >
              Individual Promoters{' '}
              <Badge className='ml-2 rounded-full bg-sky-200 px-1.5 text-xs text-gray-900 shadow-none hover:bg-sky-200'>
                {individualPromoters ? individualPromoters.length : '-'}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <ScrollBar
            orientation='horizontal'
            className='h-2 opacity-50 lg:hidden'
          />
        </ScrollArea>

        <div>
          <TabsContent value='board-members'>
            <CurrentLeadershipTable data={boardMember} />
          </TabsContent>
          <TabsContent value='executive-team'>
            <CurrentLeadershipTable data={executiveTeam} />
          </TabsContent>
          <TabsContent value='individual-promoters'>
            <CurrentLeadershipTable data={individualPromoters} />

            <p className='mt-2 text-xs leading-relaxed tracking-wide text-muted-foreground'>
              * Promoters/First Subscribers information shown above is based on
              the{' '}
              <span className='font-medium'>
                Memorandum of Association (MOA)
              </span>{' '}
              filed at the{' '}
              <span className='font-medium'>time of incorporation</span>. For
              any subsequent changes, please refer to the latest{' '}
              <span className='font-medium'>MGT-7</span> form available under
              the{' '}
              <Link
                href='?tab=public-docs'
                className='font-medium text-primary underline'
              >
                Public Documents
              </Link>{' '}
              tab.
            </p>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
};

export default CurrentLeadership;
