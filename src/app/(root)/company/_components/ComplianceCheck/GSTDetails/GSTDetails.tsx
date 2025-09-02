'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import GSTDetailsInfo from './GSTDetailsInfo';

const GSTDetails = ({ gstData, address }: any) => {
  const [selectedGstin, setSelectedGstin] = useState(
    gstData[0]?.gstinList[0].stateGstin
  );

  const handleDropdownChange = (value: any) => {
    setSelectedGstin(value);
  };

  // Check if selectedGstin exists in gstinDetails
  const selectedGstinDetails = gstData[0]?.gstinDetails.find(
    (item: any) => item.stateGstin === selectedGstin
  );

  return (
    <div>
      <div className='flex flex-col items-center justify-start bg-muted p-4 md:flex-row'>
        <Select onValueChange={handleDropdownChange}>
          <div className='flex flex-wrap items-center justify-start'>
            <div className='mb-2 mr-2 text-xl font-bold sm:mb-0'>
              Showing GST Details For :
            </div>
            <div>
              <SelectTrigger className='w-full bg-background text-sm'>
                <SelectValue placeholder={selectedGstin} />
              </SelectTrigger>
            </div>
          </div>

          <SelectContent>
            <div className='space-y-1 divide-y'>
              {gstData[0]?.gstinList.map((item: any) => (
                <SelectItem key={item.stateGstin} value={item.stateGstin}>
                  {item.stateGstin}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <div>
        {selectedGstinDetails ? (
          <GSTDetailsInfo address={address} gstDetails={selectedGstinDetails} />
        ) : (
          <div className='mb-28 mt-6 rounded-r-md border-l-4 border-orange-400 bg-muted p-6 text-sm text-orange-800 dark:text-orange-100'>
            <div className='flex items-center'>
              <RiErrorWarningLine className='mr-3 size-10' />
              <h2 className='text-base font-semibold md:text-lg'>
                No GSTIN Details Found
              </h2>
            </div>
            <p className='mt-2'>
              Currently the GSTIN details for this GSTIN are not
              available.Please check back later or contact support if you
              believe this is an error.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GSTDetails;
