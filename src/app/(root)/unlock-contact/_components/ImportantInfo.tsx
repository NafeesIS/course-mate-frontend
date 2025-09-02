// components/_components/ImportantInformation.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  FaBan,
  FaCopy,
  FaEnvelope,
  FaInfo,
  FaInfoCircle,
  FaMoneyBillWave,
} from 'react-icons/fa';

const ImportantInformation = ({ className }: { className?: string }) => {
  return (
    <Card
      className={cn(
        'w-full rounded-lg border-0 border-gray-300 py-0 shadow-none md:px-4',
        className
      )}
    >
      <CardHeader className='flex-row items-center gap-2 p-2 pb-0 text-lg font-bold text-primary md:p-4 md:text-xl'>
        <FaInfoCircle className='text-xl text-primary opacity-90' />
        Important Information
      </CardHeader>
      <Separator className='my-1' />
      <CardContent className='p-2 md:p-4'>
        <ul className='list-none space-y-3 text-sm text-foreground md:text-base'>
          <li className='flex items-center gap-2.5'>
            <FaCopy className='flex-shrink-0 text-blue-500' />
            <span>
              Copy the information before closing the window or refreshing the
              page
            </span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaBan className='flex-shrink-0 text-red-500' />
            <span>Circulation of these details is prohibited</span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaEnvelope className='flex-shrink-0 text-green-500' />
            <span>Details are not to be used for spamming</span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaInfo className='flex-shrink-0 text-yellow-500' />
            <span>The information is the best to our knowledge</span>
          </li>
          <li className='flex items-center gap-2.5'>
            <FaMoneyBillWave className='flex-shrink-0 text-purple-500' />
            <span>
              Amount once paid will not be refunded under any circumstances
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default ImportantInformation;
