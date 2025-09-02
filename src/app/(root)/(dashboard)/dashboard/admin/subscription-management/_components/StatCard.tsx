import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ISubscriptionStatCardProps } from '../_types/types';

export const StatCard: React.FC<ISubscriptionStatCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass,
  onClick,
  isSelected,
}) => {
  // Extract the text color class (assumes one class starts with 'text-')
  const textColorClass = colorClass
    .split(' ')
    .find((cls) => cls.startsWith('text-'));
  // Convert it to a border color class (e.g., "text-red-600" -> "border-red-600")
  const borderColorClass = textColorClass
    ? textColorClass.replace('text-', 'border-')
    : '';

  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer shadow-sm',
        isSelected && borderColorClass && `border-2 ${borderColorClass}`
      )}
    >
      <CardContent className='flex items-center p-3 sm:p-4'>
        <div className={cn('rounded-lg p-2', colorClass)}>
          <Icon className='h-4 w-4 sm:h-5 sm:w-5' />
        </div>
        <div className='ml-2 sm:ml-4'>
          <p className='text-xs font-medium text-gray-500 sm:text-sm'>
            {title}
          </p>
          <p className='mt-1 text-xl font-semibold sm:text-2xl'>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};
