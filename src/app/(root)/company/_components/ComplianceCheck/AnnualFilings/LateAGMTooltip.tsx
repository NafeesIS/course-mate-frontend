import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { formatCurrencyINR } from '@/lib/formatters';
import { RiInformationLine } from 'react-icons/ri';

const LateAGMTooltip = ({
  agmDate,
  periodOfDelay,
}: {
  agmDate: string;
  periodOfDelay: string;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger className='flex items-center gap-1.5 hover:text-primary'>
        {agmDate} <RiInformationLine className='text-red-500' />
      </HoverCardTrigger>
      <HoverCardContent className='block whitespace-normal leading-relaxed tracking-wide md:w-80'>
        <strong className='font-medium'>{periodOfDelay} days delay</strong> in
        holding <strong className='font-medium'>AGM</strong> and total penalty =
        Company itself:{' '}
        <strong className='font-medium'>
          {formatCurrencyINR(100000 + parseInt(periodOfDelay) * 5000)}
        </strong>{' '}
        + each Director{' '}
        <strong className='font-medium'>
          {formatCurrencyINR(100000 + parseInt(periodOfDelay) * 5000)}
        </strong>
      </HoverCardContent>
    </HoverCard>
  );
};

export default LateAGMTooltip;
