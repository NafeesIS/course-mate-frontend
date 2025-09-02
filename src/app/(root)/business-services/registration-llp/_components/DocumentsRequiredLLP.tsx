const DocumentsRequiredLLP = () => {
  return (
    <div className='wrapper mb-20 mt-16 text-center'>
      <h2 className='mx-auto mb-10 max-w-2xl px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        <span className='mr-1 italic text-primary'>Documents Required</span> for
        Incorporation of Limited Liability Partnership
      </h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6'>
        <div className='rounded-md border p-4 duration-200 hover:bg-muted'>
          <p className='mb-2 text-start font-semibold'>Partners Details</p>
          <ul className='text-muted-foreground-darker list-inside list-disc text-start text-xs font-normal lg:text-sm'>
            <li>Director Identification Number (DIN)</li>
            <li>PAN</li>
            <li>Aadhar Card</li>
            <li>Latest Bank Statement</li>
            <li>
              Address Proof - Latest Bank statement or utility bill in the name
              of partner <br /> (Required if director do not have DIN)
            </li>
          </ul>
        </div>
        <div className='rounded-md border p-4 duration-200 hover:bg-muted'>
          <p className='mb-2 text-start font-semibold'>
            Registered Office Details
          </p>
          <ul className='text-muted-foreground-darker list-inside list-disc text-start text-xs font-normal lg:text-sm'>
            Latest Electricity Bill
            <li className='mt-2 list-decimal'>
              <span className='font-semibold'>If Rented -</span>
              <ul className='ml-3 list-inside list-disc lg:ml-4'>
                <li>Rent agreement</li>
                <li>NOC from the owner of the property</li>
              </ul>
            </li>
            <li className='mt-2 list-decimal'>
              <span className='font-semibold'>In Ownership</span>
              <ul className='ml-3 list-inside list-disc lg:ml-4'>
                <li>NOC from the respective Owner</li>
                <li>sale deed/property deed</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className='rounded-md border p-4 duration-200 hover:bg-muted'>
          <p className='mb-2 text-start font-semibold'>
            Digital Signature Certificate (DSC)
          </p>
          <ul className='text-muted-foreground-darker list-inside list-disc text-start text-xs font-normal lg:text-sm'>
            Digital Signature of All Partners and Designated Partners for filing
            all the ROC forms.
            <li className='mt-2'>PAN</li>
            <li>
              Aadhar Card <br />
              (Required only for new DSC application)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentsRequiredLLP;
