import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatName, toCamelCase } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Badge } from '../../../../components/ui/badge';
import { ScrollArea, ScrollBar } from '../../../../components/ui/scroll-area';
import CompanyProfileTables from './CompanyProfileTables';
import RemunerationTable from './RemunerationTable';
import ShareholdingTable from './ShareholdingTable';

const ProfileDetails = ({
  directorData,
  className,
}: {
  directorData: any;
  className?: string;
}) => {
  // eslint-disable-next-line no-unused-vars
  const { fullName, companyData, mcaSignatoryCessationMasterHistory } =
    directorData || {};
  const directorName = (fullName && toCamelCase(formatName(fullName))) || '-';
  const associatedCompanies =
    companyData.filter((company: any) => company.accountType === 'Company') ||
    [];
  const associatedLLPs =
    companyData.filter((company: any) => company.accountType === 'LLP') || [];
  const pastCompanies = mcaSignatoryCessationMasterHistory.sort() || [];

  // Create a set of unique company names to ensure each company is counted only once
  const uniqueAssociatedCompanyNames = new Set(
    associatedCompanies?.map((company: any) => company.nameOfTheCompany)
  );
  const totalCurrentAssociatedCompanies = uniqueAssociatedCompanyNames.size;

  const uniqueAssociatedLLPNames = new Set(
    associatedLLPs?.map((company: any) => company.nameOfTheCompany)
  );
  const totalCurrentAssociatedLLPs = uniqueAssociatedLLPNames.size;

  // Create a set of unique past company names
  const uniquePastCompanyNames = new Set(
    mcaSignatoryCessationMasterHistory?.map(
      (company: any) => company.accountName
    )
  );
  const totalPastCompanies = uniquePastCompanyNames.size;

  const tabsTriggerClasses = `rounded-none px-2 py-2 border-b-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-400 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none`;

  return (
    <section className={cn('wrapper', className)}>
      <h2 className='w-10/12 text-base font-semibold md:text-lg'>
        {directorName}&apos;s Profile and Shareholding Details
      </h2>

      <Tabs defaultValue='associated-companies' className='mt-3 w-full md:mt-4'>
        <ScrollArea className='h-12'>
          <TabsList className='gap-3 bg-background'>
            <TabsTrigger
              value='associated-companies'
              className={tabsTriggerClasses}
            >
              Associated Companies{' '}
              <Badge className='ml-2 rounded-full bg-sky-200 px-1.5 text-xs text-gray-900 shadow-none hover:bg-sky-200'>
                {totalCurrentAssociatedCompanies}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value='associated-llps' className={tabsTriggerClasses}>
              Associated LLP&apos;s{' '}
              <Badge className='ml-2 rounded-full bg-sky-200 px-1.5 text-xs text-gray-900 shadow-none hover:bg-sky-200'>
                {totalCurrentAssociatedLLPs}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value='past-companies' className={tabsTriggerClasses}>
              Past Companies{' '}
              <Badge className='ml-2 rounded-full bg-sky-200 px-1.5 text-xs text-gray-900 shadow-none hover:bg-sky-200'>
                {totalPastCompanies}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value='shareholding' className={tabsTriggerClasses}>
              Shareholding
            </TabsTrigger>
            <TabsTrigger value='remuneration' className={tabsTriggerClasses}>
              Remuneration
            </TabsTrigger>
          </TabsList>
          <ScrollBar
            orientation='horizontal'
            className='h-2 opacity-50 lg:hidden'
          />
        </ScrollArea>

        <div>
          <TabsContent value='associated-companies'>
            <CompanyProfileTables type='company' data={associatedCompanies} />
          </TabsContent>
          <TabsContent value='associated-llps'>
            <CompanyProfileTables type='llp' data={associatedLLPs} />
          </TabsContent>
          <TabsContent value='past-companies'>
            <CompanyProfileTables type='past' data={pastCompanies} />
          </TabsContent>
          <TabsContent value='shareholding'>
            <ShareholdingTable />
          </TabsContent>
          <TabsContent value='remuneration'>
            <RemunerationTable />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
};

export default ProfileDetails;
