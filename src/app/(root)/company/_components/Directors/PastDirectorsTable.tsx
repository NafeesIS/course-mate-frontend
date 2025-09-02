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

const groupByDinAndName = (data: any) => {
  const grouped: any = {};

  data.forEach((item: any) => {
    const key = item.din + item.fullName;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
};

const PastDirectorsTable = ({ data }: any) => {
  const groupedData = groupByDinAndName(data);
  function sortGroupedDataByAppointmentDate(groupedData: any): any {
    // Helper function to parse date strings
    const parseDate = (dateString: string): Date => {
      const [month, day, year] = dateString ? dateString.split('/') : [];
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    // Flatten the grouped data into an array of entries
    let entries: { key: string; entry: any }[] = [];
    for (const key in groupedData) {
      entries = entries.concat(
        groupedData[key].map((entry: any) => ({ key, entry }))
      );
    }

    // Sort the entries by appointment date and then by service duration
    entries.sort((a, b) => {
      const dateA = parseDate(a.entry.appointmentDate).getTime();
      const dateB = parseDate(b.entry.appointmentDate).getTime();
      if (dateA === dateB) {
        const durationA = parseDate(a.entry.cessationDate).getTime() - dateA;
        const durationB = parseDate(b.entry.cessationDate).getTime() - dateB;
        return durationA - durationB; // shorter duration first, longer duration last
      }
      return dateA - dateB; // earlier appointment date first
    });

    // Group the sorted entries back into the desired structure
    const sortedGroupedData: any = {};
    for (const { key, entry } of entries) {
      if (!sortedGroupedData[key]) {
        sortedGroupedData[key] = [];
      }
      sortedGroupedData[key].push(entry);
    }

    return sortedGroupedData;
  }

  const sortedGroupedData = sortGroupedDataByAppointmentDate(groupedData);

  return (
    <Card className='overflow-hidden rounded-md'>
      <Table className='text-xs md:text-sm'>
        <TableHeader>
          <TableRow className='divide-x bg-muted'>
            <TableHead className='hidden whitespace-nowrap p-4 font-semibold text-foreground md:table-cell'>
              DIN
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Director Name
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Previous Designation
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Previous Date of Appointment
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Cessation Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(data).length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className='p-4 text-center'>
                No data found
              </TableCell>
            </TableRow>
          )}

          {Object.keys(sortedGroupedData).map((key: string, index: number) => {
            const rows = sortedGroupedData[key];
            const rowspan = rows.length;
            return rows.map((item: any, rowIndex: number) => {
              const directorUrl = `/director/${formatToUrl(item.fullName)}/${item.din}`;
              const dateOfAppointment = new Date(item.appointmentDate);
              const cessationDate = new Date(item.cessationDate);

              return (
                <TableRow
                  key={`${index}-${rowIndex}`}
                  className={`divide-x  ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
                >
                  {rowIndex === 0 && (
                    <TableCell
                      className='hidden whitespace-nowrap p-4 align-middle md:table-cell'
                      rowSpan={rows.length}
                    >
                      {item.din}
                    </TableCell>
                  )}

                  {rowIndex === 0 && (
                    <TableCell
                      rowSpan={rowspan}
                      className='p-4 align-middle md:whitespace-nowrap'
                    >
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
                  )}
                  <TableCell className='border-l-[1px] p-4 align-top md:whitespace-nowrap'>
                    {item.designation}
                  </TableCell>
                  <TableCell className='p-4 align-top md:whitespace-nowrap'>
                    {isValid(dateOfAppointment)
                      ? format(dateOfAppointment, 'dd-MMM-yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell className='flex items-center justify-between gap-8 whitespace-nowrap p-4 align-top'>
                    {isValid(cessationDate)
                      ? format(cessationDate, 'dd-MMM-yyyy')
                      : '-'}

                    <BuyContactDetailsLink
                      din={item.din}
                      className='hidden md:flex'
                    />
                  </TableCell>
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

export default PastDirectorsTable;
