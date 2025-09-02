import type { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatName, formatToUrl } from '@/lib/formatters';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import noDirectorImg from '../../../../../../public/assets/company/no-directors.jpg';
import { BuyContactDetailsButton } from './BuyContactDetails';
import ViewAllDirectorsBtn from './ViewAllDirectorsBtn';

type Props = {
  companyData: TCompanyMasterData;
};

const Directors = ({ companyData }: Props) => {
  const { currentDirectors } = companyData.data || {};

  return (
    <Card className='overflow-hidden rounded-md shadow-sm'>
      <CardHeader className='font- flex flex-row bg-green-100 p-4 text-base'>
        Directors {currentDirectors && `(${currentDirectors?.length})`}
      </CardHeader>
      {currentDirectors && currentDirectors?.length > 0 ? (
        <CardContent className='p-4'>
          <div className='divide-y'>
            {currentDirectors?.slice(0, 4)?.map((item, index) => (
              <div key={index} className='py-4 first:pt-0 hover:bg-muted/50'>
                <div className='flex gap-3'>
                  <Avatar className='mt-1 size-10 flex-shrink-0 border bg-sky-300'>
                    <AvatarFallback className='text-xs text-black'>
                      {item.fullName.length > 0
                        ? getInitials(formatName(item.fullName))
                        : ''}
                    </AvatarFallback>
                  </Avatar>

                  <div className='flex flex-1 flex-col items-start space-y-1 md:flex-row md:items-center md:justify-between md:space-y-0'>
                    <div>
                      {item.din && item.din !== '-' ? (
                        <Link
                          href={`/director/${formatToUrl(item.fullName)}/${item.din}`}
                          prefetch={false}
                          target='_blank'
                          className='block text-sm font-medium text-primary hover:underline'
                        >
                          {item.fullName.length > 0
                            ? formatName(item.fullName)
                            : '-'}
                        </Link>
                      ) : (
                        <p className='block text-sm font-medium'>
                          {item.fullName.length > 0
                            ? formatName(item.fullName)
                            : '-'}
                        </p>
                      )}
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {item.designation}
                      </p>
                    </div>

                    <BuyContactDetailsButton
                      din={item.din}
                      className='h-7 bg-primary pl-2.5 pr-3 text-xs text-white drop-shadow hover:bg-primary'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentDirectors && currentDirectors?.length > 4 && (
            <div className='border-t pt-4 text-end'>
              <ViewAllDirectorsBtn />
            </div>
          )}

          {/* <Separator /> */}

          {/* <div className='p-4'>
            <BuyContactDetailsCTA />
          </div> */}
        </CardContent>
      ) : (
        <CardContent className='py-8'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <Image
              src={noDirectorImg || '/placeholder.svg'}
              alt='No Records Found'
              width={140}
              height={140}
              className='h-24 w-auto opacity-30'
            />
            <p className='rounded-md border bg-muted px-4 py-2 text-center text-sm'>
              There are no current Directors in this CIN/LLP as per our records.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default Directors;
