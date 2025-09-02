import { Separator } from '@/components/ui/separator';
import BasicInfo from './BasicInfo';
import CapTable from './CapTable';

const Structure = () => {
  return (
    <div>
      <BasicInfo />
      <Separator className='my-8' />

      {/* TODO: MODIFY THIS WITH THE CORRECT DATA */}
      <CapTable />
    </div>
  );
};

export default Structure;
