import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info } from 'lucide-react';

interface ZoneInfoTooltipProps {
  zoneName: string;
}

export default function ZoneInfoTooltip({ zoneName }: ZoneInfoTooltipProps) {
  const getZoneInfo = (zoneName: string): React.JSX.Element => {
    switch (zoneName) {
      case 'West':
        return (
          <div className='max-w-80 text-[10px] text-white'>
            <p>
              Maharashtra, Pune, Gujarat, Madhya Pradesh, Goa, Dadra and Nagar
              Haveli, Daman and Diu
            </p>
          </div>
        );
      case 'East':
        return (
          <div className='max-w-80 text-[10px] text-white'>
            <p>
              West Bengal, Bihar, Odisha, Jharkhand, Jharkhand Rural, Assam,
              Assam Guwahati, Chhattisgarh, Manipur, Tripura, Arunachal Pradesh,
              Nagaland, Meghalaya, Andaman and Nicobar Islands, Mizoram, Sikkim
            </p>
          </div>
        );
      case 'North':
        return (
          <div className='max-w-80 text-[10px] text-white'>
            <p>
              Uttar Pradesh, Delhi, Haryana, Rajasthan, Punjab, Uttarakhand,
              Uttarakhand Rural, Jammu and Kashmir, Himachal Pradesh, Chandigarh
            </p>
          </div>
        );
      case 'South':
        return (
          <div className='max-w-80 text-[10px] text-white'>
            <p>
              Karnataka, Telangana, Tamil Nadu, Kerala, Andhra Pradesh,
              Puducherry, Lakshadweep
            </p>
          </div>
        );
      default:
        return (
          <p className='max-w-80 text-[10px] text-white'>
            All zones across India
          </p>
        );
    }
  };

  return (
    <Popover>
      <PopoverTrigger className='mr-2 opacity-50 hover:opacity-90 lg:hidden'>
        <Info className='size-3 text-black' />
      </PopoverTrigger>

      <PopoverContent className='bg-black'>
        {getZoneInfo(zoneName)}
      </PopoverContent>
    </Popover>
  );
}
