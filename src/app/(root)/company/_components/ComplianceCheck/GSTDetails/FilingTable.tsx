import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';

const FilingTable = ({ jsonData }: any) => {
  return (
    <Card className='overflow-hidden rounded-md'>
      <Table className='text-sm'>
        <TableHeader>
          <TableRow className='divide-x bg-muted'>
            <TableHead className='whitespace-nowrap p-4 text-center font-semibold text-foreground'>
              Financial Year
            </TableHead>
            <TableHead className='whitespace-nowrap p-4 text-center font-semibold text-foreground'>
              Filing Frequency
            </TableHead>
            <TableHead className='p-4 text-center font-semibold text-foreground md:whitespace-nowrap'>
              Tax Period
            </TableHead>
            <TableHead className='p-4 text-center font-semibold text-foreground md:whitespace-nowrap'>
              Return Due On
            </TableHead>
            <TableHead className='p-4 text-center font-semibold text-foreground md:whitespace-nowrap'>
              Return Filed On
            </TableHead>
            <TableHead className='p-4 text-center font-semibold text-foreground md:whitespace-nowrap'>
              Filing Status
            </TableHead>
            <TableHead className='bg-light-silver p-4 text-right font-semibold text-foreground md:whitespace-nowrap'>
              Late Fee
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jsonData.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className='p-4 text-center'>
                No data found
              </TableCell>
            </TableRow>
          )}
          {jsonData.length > 0 &&
            jsonData.map((item: any, index: number) => {
              const getStatus = (filingDate: any, status: any) => {
                if (!filingDate) {
                  return status !== 'Filed' ? 'Not Filed' : status;
                }

                const delay = item.periodOfDelay;
                if (delay === 0) {
                  return 'Return Filed On Time';
                } else {
                  if (status === 'Filed') {
                    return delay === 1
                      ? `${delay} Day Delay In Filing`
                      : `${delay} Days Delay In Filing`;
                  } else {
                    return delay === 1
                      ? `${delay} Day Overdue`
                      : `${delay} Days Overdue`;
                  }
                }
              };

              const status = getStatus(item.filingDate, item.status);
              const statusClass =
                status === 'Return Filed On Time' || status === 'Filed'
                  ? 'text-green-500'
                  : 'text-red-700';

              return (
                <TableRow key={index} className='divide-x'>
                  <TableCell className=' whitespace-nowrap p-4 text-center align-top'>
                    {item.fy}
                  </TableCell>
                  <TableCell className=' whitespace-nowrap p-4 text-center align-top'>
                    {item.filingFreq}
                  </TableCell>
                  <TableCell className=' whitespace-nowrap p-4 text-center align-top'>
                    {item.taxPeriod}
                  </TableCell>
                  <TableCell className='whitespace-nowrap p-4 text-center align-top'>
                    {item.dueDate}
                  </TableCell>
                  <TableCell className='whitespace-nowrap p-4 text-center align-top'>
                    {item.status === 'Filed' ? (
                      item.filingDate
                    ) : (
                      <span className='flex items-center justify-center gap-1.5'>
                        <RiCheckboxBlankCircleFill
                          className={`${statusClass} text-xs`}
                        />{' '}
                        {item.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className='flex items-center justify-center gap-1.5 whitespace-nowrap p-4 align-top'>
                    <RiCheckboxBlankCircleFill
                      className={`${statusClass} text-xs`}
                    />{' '}
                    {status}
                  </TableCell>
                  <TableCell className='whitespace-nowrap p-4 text-right align-top text-destructive'>
                    ₹ {item.lateFee}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Card>
  );
};

export default FilingTable;
