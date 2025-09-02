import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

interface AboutSectionProps {
  about: string;
  companyType: string;
  status: string;
  dateOfIncorporation: string;
  industry: string;
  website: string;
}

export function AboutSection({
  about,
  companyType,
  status,
  dateOfIncorporation,
  industry,
  website,
}: AboutSectionProps) {
  return (
    <div className='mt-8 grid gap-4 md:grid-cols-2'>
      <Card>
        <CardHeader className='p-4 md:p-6'>
          <CardTitle className='text-sm md:text-base'>About</CardTitle>
        </CardHeader>
        <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
          <p className='text-balance text-xs tracking-wide md:text-sm'>
            {about}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='p-4 md:p-6'>
          <CardTitle className='text-sm md:text-base'>
            Key Information
          </CardTitle>
        </CardHeader>
        <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
          <Table className='text-xs md:text-sm'>
            <TableBody>
              <TableRow>
                <TableCell className='font-medium'>Company Type</TableCell>
                <TableCell>{companyType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Status</TableCell>
                <TableCell>{status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>
                  Date of Incorporation
                </TableCell>
                <TableCell>{dateOfIncorporation}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Industry</TableCell>
                <TableCell>{industry}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Website</TableCell>
                <TableCell>{website}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
