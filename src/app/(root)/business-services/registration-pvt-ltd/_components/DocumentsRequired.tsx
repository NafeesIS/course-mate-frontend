'use client';
import { useState } from 'react';

const DocumentsRequired = () => {
  const [openSection, setOpenSection] = useState('subscriber');

  const toggleSection = (section: any) => {
    setOpenSection(section);
  };

  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto mb-10 max-w-2xl px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        <span className='mr-1 italic text-primary'>Documents Required</span> for
        Incorporation of Private Limited Company
      </h2>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6'>
        {/* Subscriber Details Section */}
        <div>
          <p
            className='mb-2 cursor-pointer rounded-md bg-muted p-2 font-semibold'
            onClick={() => toggleSection('subscriber')}
          >
            Subscriber Details
          </p>

          <ul
            className={`text-muted-foreground-darker list-inside list-disc space-y-2 text-start text-xs font-normal lg:text-sm ${openSection === 'subscriber' ? 'block' : 'hidden sm:block'}`}
          >
            <li className='rounded-md border p-2 shadow-sm'>Photograph</li>
            <li className='rounded-md border p-2 shadow-sm'>PAN</li>
            <li className='rounded-md border p-2 shadow-sm'>Aadhar Card</li>
            <li className='rounded-md border p-2 shadow-sm'>Passport</li>
          </ul>
        </div>

        {/* Director Details Section */}
        <div>
          <p
            className='mb-2 cursor-pointer rounded-md bg-muted p-2 font-semibold'
            onClick={() => toggleSection('director')}
          >
            Director Details
          </p>

          <ul
            className={`text-muted-foreground-darker list-inside list-disc space-y-2 text-start text-xs font-normal lg:text-sm ${openSection === 'director' ? 'block' : 'hidden sm:block'}`}
          >
            <li className='rounded-md border p-2 shadow-sm'>
              Director Identification Number (DIN)
            </li>
            <li className='rounded-md border p-2 shadow-sm'>PAN</li>
            <li className='rounded-md border p-2 shadow-sm'>Aadhar Card</li>
            <li className='rounded-md border p-2 shadow-sm'>Photograph</li>
            <li className='rounded-md border p-2 shadow-sm'>
              Address Proof - Latest Bank statement or utility bill in the name
              of director (Required if director does not have DIN)
            </li>
          </ul>
        </div>

        {/* Registered Office Details Section */}
        <div>
          <p
            className='mb-2 cursor-pointer rounded-md bg-muted p-2 font-semibold'
            onClick={() => toggleSection('office')}
          >
            Registered Office Details
          </p>

          <ul
            className={`text-muted-foreground-darker list-inside list-disc space-y-2 text-start text-xs font-normal   lg:text-sm ${openSection === 'office' ? 'block' : 'hidden sm:block'}`}
          >
            <li className='rounded-md border p-2 shadow-sm'>
              Latest Electricity Bill
            </li>
            <li className='rounded-md border p-2 shadow-sm'>
              <span className='font-semibold'>If Rented -</span>
              <ol className='ml-4 list-inside list-decimal lg:ml-5'>
                <li>Rent agreement</li>
                <li>NOC from the owner of the property</li>
              </ol>
            </li>
            <li className='rounded-md border p-2 shadow-sm'>
              <span className='font-semibold'>In Ownership</span>
              <ol className='ml-4 list-inside list-decimal lg:ml-5'>
                <li>NOC from the respective Owner</li>
              </ol>
            </li>
          </ul>
        </div>

        {/* Digital Signature Certificate Section */}
        <div>
          <p
            className='mb-2 cursor-pointer rounded-md bg-muted p-2 font-semibold'
            onClick={() => toggleSection('dsc')}
          >
            Digital Signature Certificate
          </p>

          <ul
            className={`text-muted-foreground-darker list-inside list-disc space-y-2 text-start text-xs font-normal   lg:text-sm ${openSection === 'dsc' ? 'block' : 'hidden sm:block'}`}
          >
            <p className='rounded-md border p-2 shadow-sm'>
              Digital Signature of all subscribers and directors for filing all
              ROC forms.
            </p>
            <ul className='list-inside list-disc rounded-md border p-2 shadow-sm'>
              <li>PAN</li>
              <li>Aadhar Card (Required only for new DSC application)</li>
            </ul>
          </ul>
        </div>
      </div>
      <p className='text-muted-foreground-darker mt-6 text-center text-[10px] sm:text-xs'>
        <span className='font-semibold'>Note:</span> In case of NRI or Foreign
        National documents of Directors and Subscribers must be notarized or
        apostilled.
      </p>
    </div>
  );
};

export default DocumentsRequired;
