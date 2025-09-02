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
import { UsersDialogProps } from '../_types/types';

const UsersDialog = ({ validUser, title }: UsersDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='h-7 px-2'>
          View User
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:w-[640px] lg:w-[800px] lg:min-w-[800px]'>
        <DialogHeader>
          <DialogTitle className='text-center'>{title}</DialogTitle>
        </DialogHeader>
        <Card className='no-scrollbar mx-auto w-full overflow-scroll rounded-md sm:w-[96%] sm:max-w-6xl'>
          {validUser && validUser.meta_data ? (
            <Table className='min-w-4xl text-xs lg:text-sm'>
              <TableHeader>
                <TableRow className='divide-x bg-muted'>
                  <TableHead className='p-4 text-center font-semibold text-foreground'>
                    Name
                  </TableHead>
                  <TableHead className='p-4 text-center font-semibold text-foreground'>
                    Email
                  </TableHead>
                  <TableHead className='p-4 text-center font-semibold text-foreground'>
                    Phone Number
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className='divide-x text-center hover:bg-card'>
                  <TableCell className='p-4'>
                    {validUser.meta_data.firstName ||
                    validUser.meta_data.lastName
                      ? `${validUser.meta_data.firstName ?? ''} ${validUser.meta_data.lastName ?? ''}`.trim()
                      : '-'}
                  </TableCell>
                  <TableCell className='p-4'>
                    {validUser.emails && validUser.emails.length > 0
                      ? validUser.emails[0]
                      : '-'}
                  </TableCell>
                  <TableCell className='p-4'>
                    {validUser.meta_data.mobileNumber || '-'}
                  </TableCell>
                </TableRow>
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

export default UsersDialog;
