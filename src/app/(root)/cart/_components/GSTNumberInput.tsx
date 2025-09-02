import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, validateGst } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { useBillingStore } from '../_store/billingStore';

// TODO: This is a temporary component to add GST number input to the cart page (Not implemented yet)
const GSTNumberInput = () => {
  const { gstInfo, updateGstInfo } = useBillingStore();
  const [gstError, setGstError] = useState<string | null>(null);

  const handleGstInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const gstNumber = e.target.value.trim();
      updateGstInfo({ gstNumber });

      if (!validateGst(gstNumber)) {
        setGstError('Invalid GST number');
      } else {
        setGstError(null);
      }
    },
    [updateGstInfo]
  );

  return (
    <div>
      <div className='space-y-4'>
        <div className='flex items-center gap-2.5'>
          <Checkbox
            id='addGst'
            checked={gstInfo.addGst}
            onCheckedChange={(checked) =>
              updateGstInfo({ addGst: checked as boolean })
            }
            className='size-4'
          />
          <Label
            htmlFor='addGst'
            className='cursor-pointer text-[10px] text-foreground/70 md:text-xs'
          >
            Add GST Number
          </Label>
        </div>

        {gstInfo.addGst && (
          <>
            <Input
              id='gstNumber'
              value={gstInfo.gstNumber}
              onChange={handleGstInputChange}
              placeholder='Enter your GST number'
              className={cn(
                'w-full transition-all duration-300',
                gstError
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
              )}
            />
            {gstError && <p className='text-xs text-red-500'>{gstError}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default GSTNumberInput;
