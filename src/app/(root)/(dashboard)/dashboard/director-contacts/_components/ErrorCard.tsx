import { Card, CardContent } from '@/components/ui/card';

interface ErrorCardProps {
  message: string;
}

export function ErrorCard({ message }: ErrorCardProps) {
  return (
    <Card className='mt-6 overflow-hidden'>
      <CardContent className='p-4 md:p-6'>
        <div className='flex h-40 items-center justify-center'>
          <p className='text-center text-sm text-red-500'>{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
