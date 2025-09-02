import { fetchCompanyAndLLPCounts } from '../_services/service';
import StatsSection from './StatsSection';

const DecisionMakers = async () => {
  const companyAndLLPCountsData = await fetchCompanyAndLLPCounts();

  return (
    <StatsSection companyAndLLPCountsData={companyAndLLPCountsData?.data} />
  );
};

export default DecisionMakers;
