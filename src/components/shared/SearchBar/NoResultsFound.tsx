import { Separator } from '@/components/ui/separator';
import { FILESURE_SUPPORT_EMAIL } from '@/constants';
import Image from 'next/image';
import ErrorImg from '../../../../public/assets/search/error.png';

const NoResultsFound = () => {
  return (
    <div className='space-y-4 p-2'>
      <div className='flex flex-col items-center gap-4 md:flex-row md:gap-8'>
        <Image
          src={ErrorImg}
          alt={'Error image'}
          width={120}
          height={120}
          quality={100}
          className='h-auto w-12 object-cover md:w-20'
        />
        <div className='space-y-2'>
          <h1 className='text-base font-bold md:text-xl'>
            Oops! No Results Found
          </h1>
          <p className='text-xs text-muted-foreground md:text-sm'>
            We&apos;re sorry, but it seems like we couldn&apos;t find any
            results matching your search. Don&apos;t worry; we&apos;re here to
            help you discover what you&apos;re looking for.
          </p>
        </div>
      </div>
      <Separator />

      <div className='space-y-1'>
        <h2 className='text-sm font-semibold md:text-base'>
          Let&apos;s Fine-Tune Your Search :
        </h2>
        <ul className='list-disc pl-4 text-xs text-muted-foreground md:pl-8 md:text-sm'>
          <li>Make sure all words are spelled correctly</li>
          <li>
            Use the first three letters of the Company/Director name if
            you&apos;re unsure of the full details.
          </li>
          <li>
            Experiment with broadening or narrowing your search based on your
            needs.
          </li>
          <li>
            Access advanced search options for more control over your search
            parameters.
          </li>
        </ul>
      </div>

      <div className='mt-8 text-center text-xs text-muted-foreground md:text-sm'>
        <p className=''>
          Remember, finding what you&apos;re looking for might be just a refined
          search away. If you need further assistance or have any questions,
          feel free to reach out to our{' '}
          <a
            href={`mailto:${FILESURE_SUPPORT_EMAIL}`}
            className='text-blue-500 underline hover:text-blue-700'
          >
            support team
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default NoResultsFound;
