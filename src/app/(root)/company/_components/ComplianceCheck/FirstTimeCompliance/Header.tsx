type Props = {
  companyType: string;
};

const Header = ({ companyType }: Props) => {
  return (
    <div className='space-y-3'>
      <h2 className='text-lg font-semibold'>First Time Compliance</h2>

      {companyType === 'Company' ? (
        // for Company
        <p className='text-sm'>
          First-time compliance for a Company includes filing Form INC-20A and
          Form ADT-1. Form INC-20A is a declaration for the commencement of
          business, while Form ADT-1 is used to inform the Registrar of
          Companies about the appointment of a practicing Chartered Accountant
          (CA) as the auditor.
        </p>
      ) : (
        // for LLP
        <p className='text-sm'>
          First time compliance for an LLP includes filing Form 3, which records
          the LLP Agreement. This form ensures legal and financial transparency
          and helps maintain the LLP&apos;s good standing with statutory
          requirements.
        </p>
      )}
    </div>
  );
};

export default Header;
