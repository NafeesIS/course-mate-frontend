import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SearchTabs = ({
  tab,
  setTab,
}: {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value)}
      className='w-full sm:w-96'
    >
      <TabsList className='grid h-12 w-full grid-cols-2 drop-shadow'>
        <TabsTrigger
          value='company'
          title='Search for Company Name/CIN'
          className='h-full text-sm data-[state=active]:border data-[state=active]:border-muted-foreground/30 md:text-base'
        >
          Company
        </TabsTrigger>
        <TabsTrigger
          value='director'
          title='Search for Director Name/DIN'
          className='h-full text-sm text-foreground/70 data-[state=active]:border data-[state=active]:border-muted-foreground/30 md:text-base'
        >
          Director
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SearchTabs;
