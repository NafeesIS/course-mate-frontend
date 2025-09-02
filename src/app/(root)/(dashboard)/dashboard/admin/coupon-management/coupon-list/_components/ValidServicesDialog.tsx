'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TService } from '../_types/types';

const ValidServicesDialog = ({
  validServices,
}: {
  validServices: TService[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='h-7 px-2'>
          View Services
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:w-[640px] lg:w-[800px] lg:min-w-[800px]'>
        <DialogHeader>
          <DialogTitle className='text-center'>
            Applicable Services Information
          </DialogTitle>
        </DialogHeader>
        <Card className='no-scrollbar mx-auto w-full max-w-full overflow-scroll rounded-md sm:w-[96%] sm:max-w-6xl'>
          {Array.isArray(validServices) && validServices.length > 0 ? (
            <Table className='min-w-4xl text-xs lg:text-sm'>
              <TableHeader>
                <TableRow className='divide-x bg-muted'>
                  <TableHead className='w-auto p-4 text-center font-semibold text-foreground sm:w-36 lg:w-56'>
                    Name
                  </TableHead>
                  <TableHead className='p-4 text-center font-semibold text-foreground sm:whitespace-nowrap'>
                    Service Type
                  </TableHead>
                  <TableHead className='p-4 text-center font-semibold text-foreground sm:w-52 lg:w-80'>
                    Description
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validServices.map((item, index: number) => (
                  <TableRow
                    key={item._id}
                    className={`divide-x text-center ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
                  >
                    <TableCell className='p-4'>{item.name}</TableCell>
                    <TableCell className='p-4'>{item.serviceType}</TableCell>
                    <TableCell className='p-4'>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className='p-4 text-center text-muted-foreground'>
              No data available
            </p>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ValidServicesDialog;
