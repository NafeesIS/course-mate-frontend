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
const RemunerationTable = ({ data }: { data?: any }) => {
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
              Gross Salary
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Commission
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Stock Option
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Other
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Total Amount
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

            {/* GROSS SALARY */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Gross Salary
            </TableCell>

            {/* COMMISSION */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Commission
            </TableCell>

            {/* STOCK OPTION */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Stock Option
            </TableCell>
            {/* OTHER */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Other
            </TableCell>
            {/* TOTAL AMOUNT */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Total Amount
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

            {/* GROSS SALARY */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Gross Salary
            </TableCell>

            {/* COMMISSION */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Commission
            </TableCell>

            {/* STOCK OPTION */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Stock Option
            </TableCell>
            {/* OTHER */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Other
            </TableCell>
            {/* TOTAL AMOUNT */}
            <TableCell className='p-4 align-top md:whitespace-nowrap'>
              Total Amount
            </TableCell>
          </TableRow>

          <ComingSoonDialog featureName={'Remuneration'} />
        </TableBody>
      </Table>
    </Card>
  );
};

export default RemunerationTable;
