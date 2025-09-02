'use client';
import { createColumnHelper } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
const ChargesTable = dynamic(() => import('./ChargesTable'), {
  ssr: false,
});
const ChargesTableWrapper = ({ data }: any) => {
  const columnHelper: any = createColumnHelper();
  const columns = [
    // ** chargeHolderName **
    columnHelper.accessor('chargeHolderName', {
      name: 'Charge Holder Name',
      header: () => <span>Charge Holder Name</span>,
      cell: (info: any) => (
        <span className='text-foreground'>{info.getValue()}</span>
      ),
    }),
    // ** STATUS **
    columnHelper.accessor('status', {
      name: 'Status',
      header: () => <span>Status</span>,
      cell: (info: any) => (
        <span
          className={`${
            info.getValue() === 'Open' ? 'text-green-500' : 'text-red-700'
          } font-medium`}
        >
          {info.getValue()}
        </span>
      ),
      filterOption: ['Open', 'Closed'],
    }),
    // ** createdOn **
    columnHelper.accessor('createdOn', {
      name: 'Created On',
      header: () => <span>Created On</span>,
      cell: (info: any) => (
        <span className='text-foreground'>{info.getValue()}</span>
      ),
      filterOption: 'date',
    }),
    // ** modifiedOn **
    columnHelper.accessor('modifiedOn', {
      name: 'Modified On',
      header: () => <span>Modified On</span>,
      cell: (info: any) => (
        <span className='text-foreground'>{info.getValue()}</span>
      ),
      filterOption: 'date',
    }),
    // ** closedOn **
    columnHelper.accessor('closedOn', {
      name: 'Closed On',
      header: () => <span>Closed On</span>,
      cell: (info: any) => (
        <span className='text-foreground'>{info.getValue()}</span>
      ),
      filterOption: 'date',
    }),
    // ** amount **
    columnHelper.accessor('amount', {
      name: 'Amount',
      header: () => <span className='block text-end'>Amount</span>,
      cell: (info: any) => (
        <span className='block text-end text-foreground'>
          ₹{info.getValue()}
        </span>
      ),
    }),
  ];
  return <ChargesTable data={data} columns={columns} />;
};

export default ChargesTableWrapper;
