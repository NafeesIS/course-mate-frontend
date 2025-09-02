// app/_components/SectionHeader.tsx
import { FC, ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  children?: ReactNode;
}

const SectionHeader: FC<SectionHeaderProps> = ({ title, children }) => {
  return (
    <div className='mb-8 text-center'>
      <h2 className='text-3xl font-bold text-blue-800'>{title}</h2>
      {children && <p className='mt-4 text-gray-600'>{children}</p>}
    </div>
  );
};

export default SectionHeader;
