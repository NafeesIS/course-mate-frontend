import Image from 'next/image';
import documents from '../../../../../../public/assets/business-services/annual-compliance-plc/documents.png';
import { DocumentsDotsSvg } from '../_data/data';

const DocumentsRequired = () => {
  return (
    <div className='wrapper relative mb-20 mt-16 text-center'>
      <DocumentsDotsSvg />
      <div className='ml-auto max-w-[98%] translate-y-8 rounded-md bg-muted py-10 sm:max-w-[93%] sm:translate-y-14'>
        <h2 className='mx-auto mb-7 px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
          <span className='mr-1 italic text-primary'>Documents required </span>{' '}
          for annual compliance
        </h2>
        <div className='mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 sm:flex-row md:px-10'>
          <ol className='text-muted-foreground-darker list-inside list-decimal space-y-1.5 pl-2 text-start text-sm sm:pl-5 lg:text-base'>
            <li>Certificate of Incorporation</li>
            <li>MOA and AOA of the company</li>
            <li>Details of the Auditors</li>
            <li>Duly signed Audited Financial Statements and Audit Report</li>
            <li>Director’s Report</li>
            <li>List of Shareholders, Debenture Holders and Directors.</li>
            <li>Minutes of Board Meetings and General Meetings</li>
            <li>DSC of authorised directors</li>
          </ol>
          <Image src={documents} alt='documents' />
        </div>
      </div>
    </div>
  );
};

export default DocumentsRequired;
