import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CapTable = () => {
  return (
    <div>
      {/* ROUND ONE */}
      <Card className='rounded'>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>Name</TableHead>
              <TableHead colSpan={4}>
                CAPITAL STRUCTURE BEFORE THIS ROUND
              </TableHead>
              <TableHead colSpan={3}>
                CAPITAL STRUCTURE AFTER THIS ROUND
              </TableHead>
              <TableHead rowSpan={2} className='text-right'>
                Amount Invested
              </TableHead>
              <TableHead rowSpan={2} className='text-right'>
                % Return
              </TableHead>
            </TableRow>
            <TableRow>
              {/* before round */}
              <TableHead>Date</TableHead>
              <TableHead>Nos</TableHead>
              <TableHead>% Stake Pre</TableHead>
              <TableHead>Last valuation</TableHead>
              {/* after round */}
              <TableHead>Nos</TableHead>
              <TableHead>% Stake Post</TableHead>
              <TableHead>Post Valuation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className='text-right'>$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* ROUND TWO */}

      {/* ROUND THREE */}
    </div>
  );
};

export default CapTable;
