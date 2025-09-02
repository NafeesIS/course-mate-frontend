import { FILESURE_SUPPORT_EMAIL } from '@/constants';
import HeroWrapper from '../../../../components/shared/HeroWrapper';
import { Card } from '../../../../components/ui/card';

const DirectorNotFound = () => {
  return (
    <div>
      <HeroWrapper className='overflow-hidden pb-10 pt-32'>
        <h2 className='text-xl font-semibold sm:text-2xl md:text-3xl'>
          Director Not Found!
        </h2>
      </HeroWrapper>
      <div className='wrapper flex-center py-10'>
        <Card className='max-w-3xl space-y-3 rounded-md p-4 text-sm md:p-8 md:text-base'>
          <p className='text-base font-medium md:text-lg'>
            We couldn&apos;t find any information for the director you&apos;re
            looking for. It&apos;s possible that:
          </p>
          <ul className='pl-4 md:pl-6'>
            <li className='list-disc'>
              <strong>The director&apos;s name is misspelled</strong>:
              Double-check the spelling and try again.
            </li>
            <li className='list-disc'>
              <strong>The director isn&apos;t in our database</strong>: Some
              directors may not be listed due to incomplete or outdated records.
            </li>
            <li className='list-disc'>
              <strong>You&apos;re searching for the wrong person</strong>: Make
              sure you have the correct name or details.
            </li>
          </ul>
          <h3 className='text-base font-medium md:text-lg'>
            What You Can Do Next:
          </h3>
          <ul className='pl-4 md:pl-6'>
            <li className='list-disc'>
              <strong>Try a Different Name</strong>: Use variations of the name,
              or try with just a first or last name.
            </li>
            <li className='list-disc'>
              <strong>Search by Company</strong>: If you know the company
              they&apos;re associated with, try searching for the company
              instead.
            </li>
            <li className='list-disc'>
              <strong>Contact Us</strong>: If you&apos;re sure the director
              should be listed, let us know, and we&apos;ll look into it.
            </li>
          </ul>
          <p>
            If you have any questions or need further assistance, please
            don&apos;t hesitate to contact our support team at{' '}
            <a
              href={`mailto:${FILESURE_SUPPORT_EMAIL}`}
              className='text-primary underline'
            >
              {FILESURE_SUPPORT_EMAIL}
            </a>
            . We&apos;re here to help!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DirectorNotFound;
