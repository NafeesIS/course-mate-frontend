import { InfoCircledIcon } from '@radix-ui/react-icons';
import { RiErrorWarningLine, RiInformationLine } from 'react-icons/ri';
import { TCompanyMasterData } from '../../(dashboard)/dashboard/admin/unlocked-companies/company-details/[...slug]/_types/CompanyDetails';
import CTAUnlockCompanyData from './CTA/CTAUnlockCompanyData';
type Props = {
  component:
    | 'directors'
    | 'charges'
    | 'compliance'
    | 'gst'
    | 'epfo'
    | 'structure';
  companyData?: TCompanyMasterData;
};

const NoDataFound = ({ component, companyData }: Props) => {
  if (component === 'directors') {
    return (
      <>
        <div className='mb-10 mt-10 rounded-r-md border-l-4 border-orange-400 bg-muted p-6 text-sm text-orange-800 dark:text-orange-100'>
          <div className='flex items-center'>
            <RiErrorWarningLine className='mr-3 size-10' />
            <h2 className='text-base font-semibold md:text-lg'>
              No Directors Found
            </h2>
          </div>
          <p className='mt-2'>
            There are no directors registered against this CIN/LLP as per our
            records. Please check back later or contact support if you believe
            this is an error.
          </p>
        </div>
        {/* <GoogleAdUnit>
          <AdsBanner />
        </GoogleAdUnit> */}
      </>
    );
  }

  if (component === 'charges') {
    return (
      <>
        <div className='mb-10 mt-10 rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-6 shadow-sm dark:from-gray-900 dark:to-gray-800'>
          <div className='mb-4 flex items-center'>
            <div className='mr-4 flex items-center justify-center rounded-full bg-sky-100 p-3 text-sky-600 dark:bg-sky-900 dark:text-sky-300'>
              <RiInformationLine className='size-6' />
            </div>
            <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
              Charges Information
            </h2>
          </div>

          <div className='text-gray-700 dark:text-gray-300'>
            <p>
              As our records indicate, this company has no registered loans or
              charges against it. We encourage you to explore other crucial
              aspects related to the company for a holistic view.
            </p>

            <div className='mt-4 grid gap-6 md:grid-cols-2'>
              <div className='rounded-lg border border-sky-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                <div className='mb-2 flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-2 size-5 text-sky-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    What are Charges?
                  </h3>
                </div>
                <p className='text-sm'>
                  In Indian corporate law, charges refer to security interests
                  created by a company on its assets to secure loans or other
                  financial facilities. As per Section 2(16) of the Companies
                  Act, 2013, a charge is &quot;an interest or lien created on
                  the property or assets of a company or any of its undertakings
                  or both as security.&quot; These charges must be registered
                  with the Registrar of Companies (ROC).
                </p>
              </div>

              <div className='rounded-lg border border-sky-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                <div className='mb-2 flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-2 size-5 text-sky-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    Why Are Charges Important?
                  </h3>
                </div>
                <p className='text-sm'>
                  Charges indicate a company&apos;s debt obligations and secured
                  assets. No registered charges may suggest financial stability
                  or limited access to secured credit. For investors and
                  creditors, this information helps assess financial health and
                  risk. Registered charges also determine priority of claims
                  during liquidation proceedings.
                </p>
              </div>

              <div className='rounded-lg border border-sky-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                <div className='mb-2 flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-2 size-5 text-sky-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                    />
                  </svg>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    Types of Charges
                  </h3>
                </div>
                <p className='text-sm'>
                  Companies typically register different types of charges,
                  including fixed charges (on specific assets like property),
                  floating charges (on all assets or a class of assets), and
                  assignment of receivables or intellectual property rights.
                  Each type has different implications for the company and its
                  creditors.
                </p>
              </div>

              <div className='rounded-lg border border-sky-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                <div className='mb-2 flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-2 size-5 text-sky-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    Registration Timeline
                  </h3>
                </div>
                <p className='text-sm'>
                  Under Section 77 of the Companies Act, 2013, companies must
                  register charges within 30 days of creation. The Registrar may
                  allow registration within 300 days with additional fees, and
                  beyond that with Central Government approval. Registration is
                  done electronically through Form CHG-1 or CHG-9 (for
                  debentures).
                </p>
              </div>

              <div className='rounded-lg border border-sky-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                <div className='mb-2 flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-2 size-5 text-sky-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    Certificate of Registration
                  </h3>
                </div>
                <p className='text-sm'>
                  Upon registration, the Registrar issues a certificate of
                  registration under Section 77(2), which serves as conclusive
                  evidence that the requirements for registration have been
                  complied with. This certificate is important for both the
                  company and the charge-holder.
                </p>
              </div>

              <div className='rounded-lg border border-sky-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                <div className='mb-2 flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-2 size-5 text-sky-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    Modification & Satisfaction
                  </h3>
                </div>
                <p className='text-sm'>
                  Companies must register any modification to existing charges
                  under Section 79. When a debt is fully repaid, companies must
                  file for satisfaction of charge under Sections 82-83 within 30
                  days. This ensures the register accurately reflects the
                  current encumbrances on company assets.
                </p>
              </div>
            </div>

            <div className='mt-6 rounded-lg border border-amber-100 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20'>
              <div className='flex'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mr-2 mt-1 size-5 flex-shrink-0 text-amber-600 dark:text-amber-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <div>
                  <h3 className='mb-1 font-medium text-amber-800 dark:text-amber-400'>
                    Data Accuracy Commitment
                  </h3>
                  <p className='text-sm text-amber-700 dark:text-amber-300'>
                    We want to ensure that you have the most accurate and
                    up-to-date information at your fingertips. That&apos;s why
                    we regularly update our data to reflect the latest
                    developments and changes. If you believe this information is
                    incomplete or requires updating, please use the &quot;Update
                    Now&quot; option on the top right corner of the company
                    page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {companyData && <CTAUnlockCompanyData companyData={companyData} />}
      </>
    );
  }

  if (component === 'compliance') {
    return (
      <>
        <div className='mb-10 mt-10 rounded-r-md border-l-4 border-sky-400 bg-muted p-6 text-sm text-sky-800 dark:text-sky-100'>
          <div className='flex items-center'>
            <InfoCircledIcon className='mr-3 size-10 md:size-6' />
            <h2 className='text-base font-semibold md:text-lg'>
              Compliance Check for LLPs - Coming Soon
            </h2>
          </div>
          <p className='mt-2'>
            We&apos;re currently working on bringing the Compliance Check
            feature to Limited Liability Partnerships (LLPs). Stay tuned for
            updates as we work to provide you with a comprehensive compliance
            checking system. We appreciate your patience and look forward to
            delivering this feature soon.
          </p>
        </div>

        {/* <GoogleAdUnit>
          <AdsBanner />
        </GoogleAdUnit> */}
      </>
    );
  }
};

export default NoDataFound;
