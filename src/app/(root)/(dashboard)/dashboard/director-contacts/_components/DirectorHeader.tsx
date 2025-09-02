import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardTitle } from '@/components/ui/card';
import { formatName, toCamelCase } from '@/lib/formatters';
import { IDirector } from '../_types/types';

interface DirectorHeaderProps {
  director: IDirector;
}

export function DirectorHeader({ director }: DirectorHeaderProps) {
  return (
    <div className='flex items-center space-x-4'>
      <Avatar className='size-10 border-2 border-muted md:size-12'>
        <AvatarImage
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${director.fullName}`}
          alt={director.fullName}
        />
        <AvatarFallback>{director.fullName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className='text-sm font-bold md:text-base'>
          {director.fullName && director.fullName.length > 0
            ? toCamelCase(formatName(director.fullName))
            : '-'}
        </CardTitle>
        <p className='mt-1 text-xs opacity-80 md:text-sm'>
          DIN: {director.din}
        </p>
      </div>
    </div>
  );
}
