import { formatName } from '@/lib/formatters';
import HeroWrapper from '../../../../components/shared/HeroWrapper';
import UpdateNowButton from './UpdateNowButton';

type Props = {
  directorData: any;
};

// eslint-disable-next-line no-unused-vars
const Hero = async ({ directorData }: Props) => {
  const { fullName, din, updatedAt } = directorData || {};

  return (
    <HeroWrapper className='overflow-hidden pb-6 pt-20 md:pt-20'>
      <div className='text-center'>
        <h1 className='mt-8 text-xl font-medium md:text-3xl'>
          {fullName.length > 0 ? formatName(fullName) : '-'}
        </h1>
        <h4 className='mt-3 text-sm md:mt-4 md:text-lg'>DIN: {din ?? '-'}</h4>

        <UpdateNowButton dinNo={din} lastUpdated={updatedAt} />
      </div>
    </HeroWrapper>
  );
};

export default Hero;
