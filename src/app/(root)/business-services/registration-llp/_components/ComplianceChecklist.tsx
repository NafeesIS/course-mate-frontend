import { complianceChecklistData } from '../_data/data';

const ComplianceChecklist = () => {
  return (
    <div className='wrapper mb-10 mt-16 text-center'>
      <h2 className='wrapper mx-auto mb-10 px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        Post Incorporation{' '}
        <span className='italic text-primary'>Compliance Checklist</span>
      </h2>
      <div className='grid grid-cols-1 gap-4 rounded-md border shadow-lg sm:grid-cols-2 md:grid-cols-4 xl:gap-5'>
        {complianceChecklistData.map((benefit, index) => (
          <div
            key={index}
            className='group relative flex flex-col items-start gap-2 px-4 py-5 text-start duration-200 hover:bg-primary hover:fill-white hover:text-white sm:my-0'
          >
            <div className='flex flex-col items-start justify-start gap-5'>
              {benefit.svg}
              <p className='text-start text-base font-semibold lg:text-lg'>
                {benefit.title}
              </p>
            </div>
            <p className='text-muted-foreground-darker text-start text-xs font-normal group-hover:text-muted lg:text-sm'>
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceChecklist;
