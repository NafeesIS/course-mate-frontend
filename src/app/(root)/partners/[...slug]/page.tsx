/* eslint-disable indent */
import { getSinglePartnerData } from '@/app/(root)/partners/_services/getSinglePartnerData';
import HeroWrapper from '@/components/shared/HeroWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { BASE_URL_FRONTEND } from '@/constants';
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import { getInitials } from '@/lib/utils';
import { Metadata } from 'next';

export const revalidate = 600; // cache for 1 hour

type Props = {
  params: {
    slug: string[];
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [name, id] = params.slug;
  const partnerData = await getSinglePartnerData(id);
  const { copDetails, firmDetails, practiceDetails } = partnerData.data || {};
  const partnerName = copDetails?.name
    ? copDetails.name
    : name.split('-').join(' ');
  const title = `${
    partnerName.length > 0 ? toCamelCase(partnerName) : '-'
  } | FileSure - Partners`;
  const about = practiceDetails?.about || '';
  const keywords = [
    ...firmDetails.firmName,
    ...(practiceDetails?.clientsHandled?.map(
      (client: { label: string }) => client.label
    ) || []),
    ...(practiceDetails?.areaOfSpecialization?.map(
      (specialization: { label: string }) => specialization.label
    ) || []),
  ];

  // Open Graph Metadata for Social Media
  const openGraph = {
    title,
    description: about,
    type: 'profile',
    url: `${BASE_URL_FRONTEND}/partners/${formatToUrl(partnerName)}/${id}`,
    images: [
      {
        url: copDetails?.profileImg || 'default-image-url', // Default image if profile image is missing
        width: 1200,
        height: 630,
        alt: `${partnerName} profile image`,
      },
    ],
  };

  // Additional SEO elements like canonical URL and Twitter metadata
  const canonical = `${BASE_URL_FRONTEND}/partners/${formatToUrl(partnerName)}/${id}`;

  return {
    title,
    description: about,
    keywords,
    openGraph,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: 'index, follow', // Ensures Googlebot crawls and indexes the site
    },
  };
}

const page = async ({ params }: { params: { slug: string[] } }) => {
  // eslint-disable-next-line no-unused-vars
  const [name, id] = params.slug;
  const partnerData = await getSinglePartnerData(id);
  const { copDetails, firmDetails, practiceDetails } = partnerData.data || {};

  return (
    <div className='pb-10'>
      <HeroWrapper className='overflow-hidden py-20 md:py-24 lg:py-28'>
        <div></div>
      </HeroWrapper>

      <section className='wrapper -mt-10 md:-mt-12 lg:-mt-14'>
        <Card className='rounded-md p-4 pt-0'>
          <Avatar className='mx-auto -mt-10 h-20 w-20 border-4 border-background bg-muted md:-mt-12 md:h-24 md:w-24 lg:-mt-14 lg:h-28 lg:w-28'>
            <AvatarImage
              src={copDetails?.profileImg}
              alt='Partner Image'
              className='object-contain object-center'
            />
            <AvatarFallback className='bg-muted-foreground text-background'>
              {copDetails.name && getInitials(copDetails.name)}
            </AvatarFallback>
          </Avatar>

          {/* title */}
          <h1 className='mt-1 text-center text-sm font-bold md:mt-3 md:text-base lg:mt-5 lg:text-lg'>
            {copDetails.name || '-'}
          </h1>
          {/* designation */}
          <h2 className='mt-1 text-center text-xs font-semibold text-muted-foreground md:mt-2 md:text-sm lg:mt-3 lg:text-base'>
            {copDetails.designation || '-'}
          </h2>

          <h3 className='mt-2 text-xs text-muted-foreground md:mt-4 md:text-sm lg:mt-6 lg:text-base'>
            {practiceDetails.about || ''}
          </h3>

          <Table className='mt-2 text-xs md:mt-4 md:text-sm lg:mt-6 lg:text-base'>
            <TableBody>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>CP No.</TableHead>
                <TableCell className='font-medium'>
                  {copDetails.cpNumber || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>
                  Membership No.
                </TableHead>
                <TableCell className='font-medium'>
                  {copDetails.membershipNumber || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>Firm Name</TableHead>
                <TableCell className='font-medium'>
                  {firmDetails.firmName
                    ? toCamelCase(firmDetails.firmName)
                    : '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>Firm Type</TableHead>
                <TableCell className='font-medium'>
                  {firmDetails.firmType || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>Contact No.</TableHead>
                <TableCell className='font-medium'>
                  {firmDetails.firmMobileNumber || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>Email</TableHead>
                <TableCell className='font-medium lowercase'>
                  {firmDetails.firmEmail || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>
                  Number of Employees
                </TableHead>
                <TableCell className='font-medium'>
                  {firmDetails.numberOfEmployees || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>Address</TableHead>
                <TableCell className='font-medium'>
                  <address className='not-italic'>
                    {firmDetails.firmName && toCamelCase(firmDetails.firmName)},{' '}
                    {firmDetails.firmAddress.street &&
                      toCamelCase(firmDetails.firmAddress.street)}
                    ,{' '}
                    {firmDetails.firmAddress.pincode &&
                      firmDetails.firmAddress.pincode}{' '}
                    -{' '}
                    {firmDetails.firmAddress.city &&
                      toCamelCase(firmDetails.firmAddress.city)}
                    ,{' '}
                    {firmDetails.firmAddress.state &&
                      toCamelCase(firmDetails.firmAddress.state)}
                  </address>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>
                  Area of Specialization
                </TableHead>
                <TableCell className='font-medium'>
                  <ul>
                    {practiceDetails.areaOfSpecialization
                      ? practiceDetails.areaOfSpecialization.map(
                          (item: { label: string }, index: number) => (
                            <li key={index} className='list-inside list-disc'>
                              {item.label}
                            </li>
                          )
                        )
                      : '-'}
                  </ul>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>
                  Clients Handled
                </TableHead>
                <TableCell className='font-medium'>
                  <ul>
                    {practiceDetails.clientsHandled
                      ? practiceDetails.clientsHandled.map(
                          (item: { label: string }, index: number) => (
                            <li
                              key={index}
                              className='list list-inside list-disc'
                            >
                              {item.label}
                            </li>
                          )
                        )
                      : '-'}
                  </ul>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>Website</TableHead>
                <TableCell className='font-medium'>
                  {practiceDetails.socialMediaLinks.website.link || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>LinkedIn</TableHead>
                <TableCell className='font-medium'>
                  {practiceDetails.socialMediaLinks.linkedin.link || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>Twitter</TableHead>
                <TableCell className='font-medium'>
                  {practiceDetails.socialMediaLinks.twitter.link || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>Facebook</TableHead>
                <TableCell className='font-medium'>
                  {practiceDetails.socialMediaLinks.facebook.link || '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>
                  Business Platform
                </TableHead>
                <TableCell className='font-medium'>
                  {practiceDetails.socialMediaLinks.businessPlatform.link ||
                    '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[100px] md:w-60'>Blog Site</TableHead>
                <TableCell className='font-medium'>
                  {practiceDetails.socialMediaLinks.blogSite.link || '-'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>
      {/* 
      <GoogleAdUnit>
        <AdsBanner />
      </GoogleAdUnit> */}
    </div>
  );
};

export default page;
