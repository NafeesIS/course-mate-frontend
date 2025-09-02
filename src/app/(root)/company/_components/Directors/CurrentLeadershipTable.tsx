import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatName, formatToUrl } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';
import Link from 'next/link';
import { BuyContactDetailsLink } from '../About/BuyContactDetails';

const CurrentLeadershipTable = ({ data }: any) => {
  const sortedData = data.sort((a: any, b: any) => {
    const dateA: any = new Date(a.dateOfAppointment);
    const dateB: any = new Date(b.dateOfAppointment);
    const finalData = dateA - dateB;
    return finalData;
  });
  return (
    <Card className='overflow-hidden rounded-md'>
      <Table className='text-xs md:text-sm'>
        <TableHeader>
          <TableRow className='divide-x bg-muted'>
            <TableHead className='hidden whitespace-nowrap p-4 font-semibold text-foreground md:block'>
              DIN
            </TableHead>

            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Name
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Current Designation
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Current Date of Appointment
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className='p-4 text-center'>
                No data found
              </TableCell>
            </TableRow>
          )}

          {sortedData &&
            sortedData.length > 0 &&
            sortedData.map((item: any, index: number) => {
              const directorUrl = `/director/${formatToUrl(item.fullName)}/${item.din}`;
              const date = new Date(item.dateOfAppointment);
              return (
                <TableRow
                  key={index}
                  className={`divide-x  ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
                >
                  {/* DIN */}
                  {item.din ? (
                    <TableCell className='hidden whitespace-nowrap p-4 align-top md:block'>
                      {item.din}
                    </TableCell>
                  ) : (
                    <TableCell className='hidden whitespace-nowrap p-4 align-top md:block'>
                      XXXXXX
                    </TableCell>
                  )}
                  {/* DIRECTOR NAME */}
                  {item.din ? (
                    <TableCell className='p-4 align-top md:whitespace-nowrap'>
                      <div className='flex items-center justify-between gap-2'>
                        <Link
                          href={directorUrl}
                          prefetch={false}
                          className={cn(
                            buttonVariants({ variant: 'link' }),
                            'h-fit whitespace-normal p-0 text-xs md:text-sm'
                          )}
                        >
                          {item.fullName.length > 0
                            ? formatName(item.fullName)
                            : '-'}
                        </Link>

                        <BuyContactDetailsLink
                          din={item.din}
                          className='md:hidden'
                        />
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell className='h-fit p-4 align-top text-xs md:whitespace-nowrap md:text-sm'>
                      {item.fullName.length > 0
                        ? formatName(item.fullName)
                        : '-'}
                    </TableCell>
                  )}

                  {/* DESIGNATION */}
                  <TableCell className='p-4 align-top md:whitespace-nowrap'>
                    {item.designation}
                  </TableCell>
                  {/* DATE OF APPOINTMENT */}
                  <TableCell className='flex flex-row justify-between gap-8 whitespace-nowrap p-4 align-top'>
                    {isValid(date) ? format(date, 'dd-MMM-yyyy') : '-'}{' '}
                    <BuyContactDetailsLink
                      din={item.din}
                      className='hidden md:flex'
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CurrentLeadershipTable;
