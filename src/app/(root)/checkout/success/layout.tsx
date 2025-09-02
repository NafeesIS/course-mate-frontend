import { SessionAuthForNextJS } from '@/app/(root)/(auth)/_components/sessionAuthForNextJS';
import HeroWrapper from '@/components/shared/HeroWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success | FileSure',
  description: 'Order confirmation',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionAuthForNextJS doRedirection>
      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>

      {children}
    </SessionAuthForNextJS>
  );
}
