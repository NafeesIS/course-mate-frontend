import { Card, CardContent } from '@/components/ui/card';

const BasicInfo = () => {
  return (
    <div>
      <Card className='mt-6 rounded'>
        <CardContent className='grid grid-cols-1 gap-4 divide-y p-4 text-center text-sm md:grid-cols-5 md:divide-x md:divide-y-0'>
          <div className='space-y-3'>
            <h4 className='font-semibold text-primary'>Promoter Shares (%)</h4>
            <p className='font-medium'>2500000.00 (74.50)</p>
          </div>
          <div className='space-y-3 pt-3 md:pt-0'>
            <h4 className='font-semibold text-primary'>Public Shares (%)</h4>
            <p className='font-medium'>2500000.00 (74.50)</p>
          </div>
          <div className='space-y-3 pt-3 md:pt-0'>
            <h4 className='font-semibold text-primary'>No. of Shareholders</h4>
            <p className='font-medium'>9</p>
          </div>
          <div className='space-y-3 pt-3 md:pt-0'>
            <h4 className='font-semibold text-primary'>Total Equity Shares</h4>
            <p className='font-medium'>530000.00</p>
          </div>
          <div className='space-y-3 pt-3 md:pt-0'>
            <h4 className='font-semibold text-primary'>
              Total Preference Shares
            </h4>
            <p className='font-medium'>28000.00</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfo;
