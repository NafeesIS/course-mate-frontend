/* eslint-disable indent */
import { RiErrorWarningLine } from 'react-icons/ri';
import GSTDetails from './GSTDetails';

const GST = ({ gstData }: any) => {
  return (
    <div className='mt-16'>
      {gstData === null || gstData.data[0]?.isFirstTimeFetch === false ? (
        <div>
          <h2 className='my-4 text-lg font-semibold'>Gst Details</h2>
          <div className='mb-8 mt-6 rounded-r-md border-l-4 border-primary/80 bg-muted p-6 text-sm text-primary'>
            <div className='flex items-center'>
              <RiErrorWarningLine className='mr-3 size-10' />
              <h2 className='text-base font-semibold md:text-lg'>
                Click on Update Now to get the GST details
              </h2>
            </div>
            <p className='mt-2'>
              To obtain the GST details, please click on the Update Now button.
              This action will ensure that you have the most current information
              available. Its essential to keep your GST records up to date for
              accurate and efficient financial management. Click on Update Now
              to proceed.
            </p>
          </div>
        </div>
      ) : gstData.data[0]?.message === 'This Company Does Not Have GSTIN' ||
        gstData.data[0]?.message ===
          'No company found with the provided CIN.' ||
        gstData.data[0]?.message === 'Missing Pan Number' ? (
        <div>
          <h2 className='my-4 text-lg font-semibold'>Gst Details</h2>
          <div className='mb-8 mt-6 rounded-r-md border-l-4 border-orange-400 bg-muted p-6 text-sm text-orange-800 dark:text-orange-100'>
            <div className='flex items-center'>
              <RiErrorWarningLine className='mr-3 size-10' />
              <h2 className='text-base font-semibold md:text-lg'>
                No Gstin Found
              </h2>
            </div>
            <p className='mt-2'>
              Currently The Gstin Details For This Company Is Not
              Available.Please check back later or contact support if you
              believe this is an error.
            </p>
          </div>
        </div>
      ) : (
        <GSTDetails gstData={gstData?.data} />
      )}
    </div>
  );
};

export default GST;
