import { formatToUrl } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';
import Link from 'next/link';
import { buttonVariants } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';

const CompanyProfileTables = ({
  type,
  data,
}: {
  type: 'company' | 'llp' | 'past' | 'shareholding' | 'remuneration';
  data: any;
}) => {
  const groupByCinAndName = (data: any) => {
    const grouped: any = {};

    data.forEach((item: any) => {
      const key = item.cin + item.accountName;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    return grouped;
  };
  let groupedData;
  if (type === 'past') {
    groupedData = groupByCinAndName(data);
  }

  function sortGroupedDataByAppointmentDate(groupedData: any): any {
    // Helper function to parse date strings
    const parseDate = (dateString: string): Date => {
      const [month, day, year] = dateString.split('/');
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
            <TableHead className='hidden whitespace-nowrap p-4 font-semibold text-foreground md:block'>
              CIN/FCRN
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              {type === 'llp' ? 'LLP Name' : 'Company Name'}
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Designation
            </TableHead>
            <TableHead className='p-4 font-semibold text-foreground md:whitespace-nowrap'>
              Date of Appointment
            </TableHead>
            {type === 'past' && (
              <TableHead className='whitespace-nowrap p-4 font-semibold text-foreground'>
                Date of Cessation
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className='p-4 text-center'>
                No data found
              </TableCell>
            </TableRow>
          )}
          {data.length > 0 &&
            type === 'past' &&
            Object.keys(sortedGroupedData).map((key: string, index: number) => {
              const rows = sortedGroupedData[key];
              // const rowspan = rows.length;
              return rows.map((item: any, rowIndex: number) => {
                const companyUrl = `/company/${formatToUrl(type === 'past' ? item.accountName : item.nameOfTheCompany)}/${type === 'past' ? item.cin : item.cin_LLPIN}?tab=about`;
                const dateOfAppointment = new Date(item.appointmentDate);
                const cessationDate = new Date(item.cessationDate);

                return (
                  <TableRow
                    key={`${index}-${rowIndex}`}
                    className={`divide-x  ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
                  >
                    {rowIndex === 0 && (
                      <TableCell
                        className='p-4 align-middle md:whitespace-nowrap'
                        rowSpan={rows.length}
                      >
                        {item.cin}
                      </TableCell>
                    )}

                    {rowIndex === 0 && (
                      <TableCell
                        rowSpan={rows.length}
                        className='p-4 align-middle md:whitespace-nowrap'
                      >
                        <Link
                          href={companyUrl}
                          prefetch={false}
                          className={cn(
                            buttonVariants({ variant: 'link' }),
                            'h-fit whitespace-normal p-0 text-xs md:text-sm'
                          )}
                        >
                          {type === 'past'
                            ? item.accountName || '-'
                            : item.nameOfTheCompany || '-'}
                        </Link>
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
                    <TableCell className='p-4 align-top md:whitespace-nowrap'>
                      {isValid(cessationDate)
                        ? format(cessationDate, 'dd-MMM-yyyy')
                        : '-'}
                    </TableCell>
                  </TableRow>
                );
              });
            })}
          {data.length > 0 &&
            type !== 'past' &&
            data.map((item: any, index: number) => {
              const companyUrl = `/company/${formatToUrl(item.nameOfTheCompany)}/${item.cin_LLPIN}?tab=about`;

              return (
                <TableRow
                  key={index}
                  className={`divide-x  ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
                >
                  {/* CIN/FCRN */}
                  <TableCell className='hidden whitespace-nowrap p-4 align-top md:block'>
                    {item.cin_LLPIN || '-'}
                  </TableCell>
                  {/* COMPANY NAME */}
                  <TableCell className='p-4 align-top md:whitespace-nowrap'>
                    <Link
                      href={companyUrl}
                      prefetch={false}
                      className={cn(
                        buttonVariants({ variant: 'link' }),
                        'h-fit whitespace-normal p-0 text-xs md:text-sm'
                      )}
                    >
                      {item.nameOfTheCompany || '-'}
                    </Link>
                  </TableCell>
                  {/* DESIGNATION */}
                  <TableCell className='p-4 align-top md:whitespace-nowrap'>
                    {item.designation || '-'}
                  </TableCell>
                  {/* DATE OF APPOINTMENT */}
                  <TableCell className='p-4 align-top md:whitespace-nowrap'>
                    {item.currentDesignationDate
                      ? format(item.currentDesignationDate, 'dd-MMM-yyyy')
                      : '-'}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CompanyProfileTables;
