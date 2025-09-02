'use client';
import { Doc } from '../../../_types/types';
import DocContent from './DocContent';
import DocHeader from './DocHeader';
// import DocHeader from './DocHeader';

interface DocDetailPageProps {
  docData: Doc;
}

const DocDetailPage = ({ docData }: DocDetailPageProps) => {
  return (
    <div className='mt-16'>
      <DocHeader docData={docData} />
      <div>
        <DocContent docData={docData} />
      </div>
    </div>
  );
};

export default DocDetailPage;
