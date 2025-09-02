/* eslint-disable indent */
import FilingTable from './FilingTable';
// import FilingFrequencyTable from './FilingFrequencyTable';
// import FilingTable from './FilingTable';
// import GoodServicesTable from './GoodServicesTable';
// import TurnoverTable from './TurnoverTable';

const GSTDetailsInfo = ({ gstDetails }: any) => {
  // const principleAddress = gstDetails?.GeoCodePlace?.gcppbzdtls?.adr;
  const jsonDataGSTRIFF =
    gstDetails.filings.length > 0
      ? gstDetails.filings.filter((filing: any) => filing?.rtntype === 'GSTR1')
      : [];

  const jsonDataGSTR3B =
    gstDetails.filings.length > 0
      ? gstDetails.filings.filter((filing: any) => filing?.rtntype === 'GSTR3B')
      : [];

  // Initialize an array to store formatted data

  // Check if aggTurnoverInfoList is not empty
  // if (gstDetails.turnoverDetails && gstDetails.turnoverDetails.length > 0) {
  //   // Loop through turnoverDetails
  //   gstDetails.turnoverDetails.forEach((turnoverInfo: any) => {
  //     // Extract relevant information

  //     if (
  //       turnoverInfo.aggTurnoverInfoList &&
  //       turnoverInfo.aggTurnoverInfoList.length > 0
  //     ) {
  //       turnoverInfo.aggTurnoverInfoList.forEach((aggTurnoverInfo: any) => {
  //         const financialYear = turnoverInfo?.finYear;
  //         const estimated = aggTurnoverInfo?.gstinEstTo || 'N/A';
  //         const basedOnReturnsFiled = aggTurnoverInfo?.gstinSysTo || 'N/A';
  //         const panBasedEstimated = aggTurnoverInfo?.panEstTo || 'N/A';
  //         const panBasedOnReturnsFiled = aggTurnoverInfo?.panSysTo || 'N/A';

  //         // Push formatted data into array
  //         formattedData.push({
  //           financialYear,
  //           estimated,
  //           basedOnReturnsFiled,
  //           panBasedEstimated,
  //           panBasedOnReturnsFiled,
  //         });
  //       });
  //     } // Loop through aggTurnoverInfoList
  //   });
  // }

  //   const tabsTriggerClasses = `rounded-none px-2 py-2 border-b-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-400 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none`;

  //   const jsonDataServices = [
  //     {
  //       hsn: '998222',
  //       description: 'Accounting and bookkeeping services',
  //     },
  //     {
  //       hsn: '998232',
  //       description: 'Individual tax preparation and planning services',
  //     },
  //     {
  //       hsn: '9982',
  //       description: 'Legal and accounting services',
  //     },
  //   ];
  // const taxpayerInfo = gstDetails?.TaxpayerInfo;
  // Function to render jurisdiction details dynamically
  // const renderJurisdictionDetails = (details: any) => {
  //   return details
  //     .split(',')
  //     .map((detail: any, index: any) => <p key={index}>{detail.trim()}</p>);
  // };
  // const filingFrequencyData = gstDetails?.filingFrequency?.data || [];

  // function formatDate(dateString: any): string {
  //   const months: { [key: string]: string } = {
  //     '01': 'Jan',
  //     '02': 'Feb',
  //     '03': 'Mar',
  //     '04': 'Apr',
  //     '05': 'May',
  //     '06': 'Jun',
  //     '07': 'Jul',
  //     '08': 'Aug',
  //     '09': 'Sep',
  //     '10': 'Oct',
  //     '11': 'Nov',
  //     '12': 'Dec',
  //   };

  //   const parts = dateString?.split('/');
  //   if (parts?.length !== 3) {
  //     return '(Date is not available)';
  //   }

  //   const day = parts[0];
  //   const month = months[parts[1]];
  //   const year = parts[2];

  //   return `${day} ${month} ${year}`;
  // }

  return (
    <div>
      <div className='mb-8 flex items-center justify-start'></div>
      {/* <div className='grid grid-cols-1 gap-4 text-base sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
        <div>
          <p className='text-sm font-semibold lg:text-base'>
            Legal Name of Business
          </p>
          <p className='text-sm lg:text-base'>{taxpayerInfo?.lgnm}</p>
        </div>
        <div>
          <p className='text-sm font-semibold lg:text-base'>Trade Name</p>
          <p className='text-sm lg:text-base'>{taxpayerInfo?.tradeNam}</p>
        </div>
        <div>
          <p className='text-sm font-semibold lg:text-base'>
            Effective Date of Registration
          </p>
          <p className='text-sm lg:text-base'>
            {formatDate(taxpayerInfo?.rgdt)}
          </p>
        </div>
        <div>
          <p className='text-sm font-semibold lg:text-base'>
            Constitution of Business
          </p>
          <p>{taxpayerInfo?.ctb}</p>
        </div>
        <div>
          <p className='text-sm font-semibold lg:text-base'>
            GSTIN / UIN Status
          </p>
          <p className='text-sm lg:text-base'>{taxpayerInfo?.sts}</p>
        </div>
        <div>
          <p className='text-sm font-semibold lg:text-base'>Taxpayer Type</p>
          <p className='text-sm lg:text-base'>{taxpayerInfo?.dty}</p>
        </div>
        <div>
          <p className='text-sm font-semibold lg:text-base'>
            Administrative Office
          </p>
          <div>
            <p className='text-sm lg:text-base'>(JURISDICTION - CENTER)</p>
            {renderJurisdictionDetails(taxpayerInfo?.ctj)}
          </div>
        </div>
        <div>
          <p className='text-sm font-semibold lg:text-base'>Other Office</p>
          <div>
            <p className='text-sm lg:text-base'>(JURISDICTION - STATE)</p>
            {renderJurisdictionDetails(taxpayerInfo?.stj)}
          </div>
        </div>
        <div>
          <p className='text-sm font-semibold lg:text-base'>
            Principal Place of Business
          </p>
          <div className='text-sm lg:text-base'>
            {principleAddress
              ? toCamelCase(principleAddress)
              : address?.registeredAddress
                ? toCamelCase(address.registeredAddress)
                : '-'}
          </div>
        </div>
        <div className='flex flex-col justify-start'>
          <p className='text-sm font-semibold lg:text-base'>
            Whether Aadhaar Authenticated?
          </p>
          <p className='text-sm lg:text-base'>{taxpayerInfo?.adhrVFlag}</p>
          <p className='text-sm lg:text-base'>
            (On {formatDate(taxpayerInfo?.adhrVdt)})
          </p>
        </div>
        <div>
          <p className='text-sm font-semibold lg:text-base'>
            Whether e-KYC Verified?
          </p>
          <p className='text-sm lg:text-base'>{taxpayerInfo?.ekycVFlag}</p>
        </div>
      </div> */}
      {/* <div className='mb-6 mt-8 md:mb-8 md:mt-10 lg:mb-10 lg:mt-12 xl:mb-12 xl:mt-14'>
        <Separator />
      </div> */}
      {/* <div className='mt-4 w-full md:mt-6'>
        <GoodServicesTable jsonData={taxpayerInfo?.nba} />
      </div> */}
      {/* <div className='mb-6 mt-8 md:mb-8 md:mt-10 lg:mb-10 lg:mt-12 xl:mb-12 xl:mt-14'>
        <Separator />
      </div> */}
      <div className='mt-4 flex w-full flex-col items-center justify-between gap-8 md:mt-6 md:gap-4 lg:gap-12'>
        <div className='w-full'>
          <p className='mb-4 text-lg font-semibold'>
            Return Filing Details For GSTR-1
          </p>
          <p className='mb-6 text-sm'>
            Goods and Services Tax Return 1, is a monthly or quarterly return
            filed by registered dealers in India. It details all outward
            supplies (sales) of goods and services made during the tax period.
          </p>
          <FilingTable jsonData={jsonDataGSTRIFF} />
        </div>
        <div className='w-full'>
          <p className='mb-3 text-lg font-semibold'>
            Return Filing Details For GSTR-3B
          </p>
          <p className='mb-6 text-sm'>
            Goods and Services Tax Return 3B, is a self-declared summary return
            filed by registered dealers in India. It details all sales and
            purchases along with tax liabilities, helping calculate the net tax
            liability after input tax credit adjustment.
          </p>
          <FilingTable jsonData={jsonDataGSTR3B} />
        </div>
      </div>
      {/* <div className='mt-6 w-full md:mt-8 lg:mt-10'>
        <p className='mb-2 text-base font-semibold md:text-lg'>
          Last 12 Month Filing Frequency
        </p>
        <FilingFrequencyTable filingFrequencyData={filingFrequencyData} />
      </div> */}
      {/* <div className='mt-6 w-full md:mt-8 lg:mt-10'>
        <p className='mb-2 text-base font-semibold md:text-lg'>
          Turnover Details (Amount in ₹)
        </p>
        <TurnoverTable jsonData={formattedData} />
      </div> */}
    </div>
  );
};

export default GSTDetailsInfo;
