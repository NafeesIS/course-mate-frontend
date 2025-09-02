import { Card } from '../../../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
import ComingSoonDialog from './ComingSoonDialog';

// eslint-disable-next-line no-unused-vars
const ShareholdingTable = ({ data }: { data?: any }) => {
  return (
    <Card className='overflow-hidden rounded-md'>
      <Table className='text-xs md:text-sm'>
        <TableHeader>
          <TableRow className='divide-x bg-muted'>
            <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
              Company Name
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Designation
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              No. of Shares
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              % Stake
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Year
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='relative'>
          <TableRow className='divide-x blur'>
            {/* COMPANY NAME */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Company Name
            </TableCell>

            {/* DESIGNATION */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Designation
            </TableCell>

            {/* NO. OF SHARES */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              No. of Shares
            </TableCell>

            {/* % STAKE */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              %
            </TableCell>

            {/* YEAR */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Year
            </TableCell>
          </TableRow>
          <TableRow className='divide-x blur'>
            {/* COMPANY NAME */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Company Name
            </TableCell>

            {/* DESIGNATION */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Designation
            </TableCell>

            {/* NO. OF SHARES */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              No. of Shares
            </TableCell>

            {/* % STAKE */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              %
            </TableCell>

            {/* YEAR */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Year
            </TableCell>
          </TableRow>

          <ComingSoonDialog featureName={'Shareholding'} />
        </TableBody>
      </Table>
    </Card>
  );
};

export default ShareholdingTable;
