'use client';
import Image from 'next/image';
import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import light from '../../../../../../public/assets/business-services/plc-registration/light.png';

const ProcessIncorporationLLP = () => {
  const [openSection, setOpenSection] = useState('formRunLLP');

  const toggleSection = (section: any) => {
    setOpenSection(section);
  };

  return (
    <div className='wrapper mb-8 mt-16 text-center'>
      <h2 className='mx-auto mb-6 max-w-lg px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        <span className='mr-1 italic text-primary'>Process</span> for
        Incorporation of Limited Liability Partnership
      </h2>
      <div
        className={`h-full overflow-hidden pt-6 ${
          openSection === 'FiLLiP'
            ? 'sm:pb-16 md:pb-12 lg:pb-20 xl:pb-12'
            : openSection === 'LLPFormNine' || openSection === 'paymentFee'
              ? `sm:pb-2 md:pb-2 ${openSection === 'paymentFee' ? 'max-h-[1800px] min-h-max sm:max-h-[220px] md:max-h-[220px]' : 'max-h-[1800px] min-h-max sm:max-h-[290px] md:max-h-[400px]'}`
              : 'max-h-[1800px] min-h-max sm:max-h-[460px] sm:pb-20 md:max-h-[400px] md:pb-8'
        }`}
      >
        <div className='flex h-full max-h-[1800px] flex-col justify-between gap-4 sm:justify-start'>
          <div
            className={`flex h-full w-full flex-col items-start justify-start gap-4 overflow-hidden duration-300 sm:flex-row sm:overflow-visible sm:duration-200 ${openSection === 'formRunLLP' ? 'xl:[220px] max-h-[600px] sm:max-h-[260px] md:max-h-[220px] lg:max-h-[260px] xl:max-h-[220px]' : 'max-h-9'}`}
            onClick={() => toggleSection('formRunLLP')}
          >
            <div className='flex h-full w-full flex-col items-center justify-center gap-2 sm:max-w-48 md:max-w-56'>
              <div
                className={`text-muted-foreground-darker flex h-9 w-full cursor-pointer items-center justify-between gap-1.5 rounded-full border px-4 py-1.5 text-xs font-normal duration-300 hover:bg-primary hover:text-white sm:max-w-48 sm:shadow-md sm:duration-200 md:max-w-56 lg:text-sm ${openSection === 'formRunLLP' ? 'bg-primary text-white' : ''}`}
              >
                <p className='flex items-center justify-start gap-2'>
                  <span className='rounded-full border px-2 py-0.5 text-[10px] lg:text-xs'>
                    1
                  </span>
                  <span> Form RUN LLP</span>
                </p>
                <MdKeyboardArrowDown className='block rounded-full border text-xl sm:hidden ' />
              </div>
              <div
                className={`hidden bg-[#C0BFBF] duration-300 sm:block sm:duration-200 ${openSection === 'formRunLLP' ? 'h-56 w-0.5 md:h-44 lg:h-56 xl:h-44' : 'h-0 w-0.5'}`}
              ></div>
            </div>
            <div
              className={`pl-2 text-start duration-300 sm:pl-0 sm:duration-200 ${openSection === 'formRunLLP' ? 'max-h-full bg-background sm:-translate-y-0' : 'max-h-0 sm:-translate-y-[650px]'}`}
            >
              <p className='mb-2 text-lg font-semibold md:text-2xl'>
                Submission of Form RUN LLP
              </p>
              <ul className='text-muted-foreground-darker ml-5 list-disc space-y-3 text-start text-xs font-normal lg:text-sm'>
                <li>
                  The first step is to reserve the name of the LLP by filing RUN
                  LLP form. In the form the LLP has to propose:
                  <ol className='mb-3 mt-2 list-decimal space-y-2'>
                    <li>Purpose of filing</li>
                    <li>Main Industrial activity and sub-category</li>
                    <li>
                      Two unique names (which are not the same as the existing
                      company or LLP name and the name proposed does not contain
                      any prohibitory words)
                    </li>
                  </ol>
                  <div className='-ml-4 flex items-start justify-start gap-1'>
                    <Image className='size-6' src={light} alt='light' />
                    <span>
                      If the name of the LLP is too similar to the name of the
                      existing LLP or company or is the same as the name of any
                      registered trademark, then NOC is required from the LLP or
                      company or the trademark holder.
                    </span>
                  </div>
                </li>
                <li>The form is filed by paying Rs.200/- Government fees.</li>
                <li>
                  CRC if satisfied with the name will approve one name. This
                  name shall be kept reserved for{' '}
                  <span className='font-semibold'>
                    20 days from the date of approval
                  </span>
                  .
                </li>
                <li>
                  After the approval of name, the LLP can proceed to file FiLLiP
                  and LLP Form 9.
                </li>
              </ul>
              <p className='text-muted-foreground-darker mt-4 rounded-md bg-muted p-2 text-start text-xs italic lg:text-sm'>
                LLP has an option to directly file FiLLiP and Form 9 along with
                Form RUN LLP. In this case LLP is exempted from paying
                government fees.
              </p>
            </div>
          </div>
          <div
            className={`flex h-full w-full flex-col items-start justify-start gap-4 overflow-hidden duration-300 sm:flex-row sm:overflow-visible sm:duration-200 ${openSection === 'FiLLiP' ? 'max-h-[740px] sm:max-h-[200px]' : 'max-h-9'}`}
            onClick={() => toggleSection('FiLLiP')}
          >
            <div className='flex h-full w-full flex-col items-center justify-center gap-2 sm:max-w-48 md:max-w-56'>
              <div
                className={`text-muted-foreground-darker flex h-9 w-full cursor-pointer items-center justify-between gap-1.5 rounded-full border px-4 py-1.5 text-xs font-normal duration-300 hover:bg-primary hover:text-white sm:max-w-48 sm:shadow-md sm:duration-200 md:max-w-56 lg:text-sm ${openSection === 'FiLLiP' ? 'bg-primary text-white' : ''}`}
              >
                <p className='flex items-center justify-start gap-2'>
                  <span className='rounded-full border px-2 py-0.5 text-[10px] lg:text-xs'>
                    2
                  </span>
                  <span> FiLLiP</span>
                </p>
                <MdKeyboardArrowDown className='block rounded-full border text-xl sm:hidden ' />
              </div>
              <div
                className={`hidden bg-[#C0BFBF] duration-300 sm:block sm:duration-200 ${openSection === 'FiLLiP' ? 'h-40 w-0.5' : 'h-0 w-0.5'}`}
              ></div>
            </div>
            <div
              className={`pl-2 text-start duration-300 sm:pl-0 sm:duration-200 ${openSection === 'FiLLiP' ? ' bg-background sm:-translate-y-14' : 'max-h-0 sm:-translate-y-[750px]'}`}
            >
              <p className='mb-2 text-lg font-semibold md:text-2xl'>
                Submission of FiLLiP
              </p>
              <ul className='text-muted-foreground-darker ml-5 list-disc space-y-2 text-start text-xs font-normal lg:text-sm'>
                <li>
                  After the approval of one name or incase where the user has
                  opted to incorporate a LLP without approval of name from CRC,
                  has to file FiLLiP.
                </li>
                <li>
                  In this form various details of the LLPs are provided like:
                  <ol className='mb-3 mt-2 list-decimal space-y-1.5'>
                    <li>Details of registered office</li>
                    <li>Contact details of LLP</li>
                    <li>
                      Particulars of the total no of Designated partner and
                      partner
                    </li>
                    <li>Total contribution of partners in LLP</li>
                    <li>Information for allotment of PAN and TAN to the LLP</li>
                    <li>Declaration by the Designated Partner or Partner</li>
                    <li>Declaration and Certification by Professional</li>
                  </ol>
                  <span>
                    If the name of the LLP is too similar to the name of the
                    existing LLP or company or is the same as the name of any
                    registered trademark, then NOC is required from the LLP or
                    company or the trademark holder.
                  </span>
                </li>
                <li>
                  In the FiLLiP subscriber sheet shall be attached which is
                  signed by all the Designated Partners, Partners and
                  Professional.
                </li>
                <li className='font-semibold'>
                  This form shall be signed by partners and by a professional
                  who has given declaration.
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`flex h-full w-full flex-col items-start justify-start gap-4 overflow-hidden duration-300 sm:flex-row sm:overflow-visible sm:duration-200 ${openSection === 'LLPFormNine' ? 'max-h-72 sm:max-h-[100px]' : 'max-h-9'}`}
            onClick={() => toggleSection('LLPFormNine')}
          >
            <div className='flex h-full w-full flex-col items-center justify-center gap-2 sm:max-w-48 md:max-w-56'>
              <div
                className={`text-muted-foreground-darker flex h-9 w-full cursor-pointer items-center justify-between gap-1.5 rounded-full border px-4 py-1.5 text-xs font-normal duration-300 hover:bg-primary hover:text-white sm:max-w-48 sm:shadow-md sm:duration-200 md:max-w-56 lg:text-sm ${openSection === 'LLPFormNine' ? 'bg-primary text-white' : ''}`}
              >
                <p className='flex items-center justify-start gap-2'>
                  <span className='rounded-full border px-2 py-0.5 text-[10px] lg:text-xs'>
                    3
                  </span>
                  <span> LLP Form - 9</span>
                </p>
                <MdKeyboardArrowDown className='block rounded-full border text-xl sm:hidden ' />
              </div>
              <div
                className={`hidden bg-[#C0BFBF]  duration-300 sm:block sm:duration-200 ${openSection === 'LLPFormNine' ? 'h-16 w-0.5' : 'h-0 w-0.5'}`}
              ></div>
            </div>
            <div
              className={`pl-2 text-start duration-300 sm:pl-0 sm:duration-200 ${openSection === 'LLPFormNine' ? 'bg-background sm:-translate-y-[105px]' : 'max-h-0 sm:-translate-y-[580px]'}`}
            >
              <p className='mb-2 text-lg font-semibold md:text-2xl'>
                Submission of LLP Form - 9:
              </p>
              <ul className='text-muted-foreground-darker ml-5 list-disc space-y-3 text-start text-xs font-normal lg:text-sm'>
                <li>
                  LLP Form - 9 is a “Consent to Act as Designated Partner” in a
                  LLP.
                </li>
                <li>
                  Every designated partner must agree to take on the legal and
                  managerial responsibilities of the LLP by providing their
                  consent in Form 9. This form shall be uploaded along with the
                  FiLLiP form.
                </li>
                <li className='font-semibold'>
                  This form shall be signed by all the Designated Partners by
                  using their DSC.
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`flex h-full w-full flex-col items-start justify-start gap-4 overflow-hidden duration-300 sm:flex-row sm:overflow-visible sm:duration-200 ${openSection === 'paymentFee' ? 'max-h-40 sm:max-h-[150px]' : 'max-h-9'}`}
            onClick={() => toggleSection('paymentFee')}
          >
            <div className='flex h-full w-full flex-col items-center justify-center gap-2 sm:max-w-48 md:max-w-56'>
              <div
                className={`text-muted-foreground-darker flex h-9 w-full cursor-pointer items-center justify-between gap-1.5 rounded-full border px-4 py-1.5 text-xs font-normal duration-300 hover:bg-primary hover:text-white sm:max-w-48 sm:shadow-md sm:duration-200 md:max-w-56 lg:text-sm ${openSection === 'paymentFee' ? 'bg-primary text-white' : ''}`}
              >
                <p className='flex items-center justify-start gap-2'>
                  <span className='rounded-full border px-2 py-0.5 text-[10px] lg:text-xs'>
                    4
                  </span>
                  <span> Forms & Fee Payment</span>
                </p>
                <MdKeyboardArrowDown className='block rounded-full border text-xl sm:hidden ' />
              </div>
              {/* <div className='h-28 w-0.5 bg-green-500'></div> */}
            </div>
            <div
              className={`pl-2 text-start duration-300 sm:pl-0 sm:duration-200 ${openSection === 'paymentFee' ? ' bg-background sm:-translate-y-40' : 'max-h-0 sm:-translate-y-[660px]'}`}
            >
              <p className='mb-2 text-lg font-semibold md:text-2xl'>
                Signed forms and payment of Government fees
              </p>
              <ul className='text-muted-foreground-darker ml-5 list-disc space-y-3 text-start text-xs font-normal lg:text-sm'>
                <li>
                  The duly signed forms with all the necessary attachments shall
                  be filed and the company has to pay Government fees.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* <p className='mt-4 rounded-md bg-muted p-4 text-start text-xs italic text-muted-foreground-darker lg:text-base'>
        LLP has an option to directly file FiLLiP and Form 9 along with Form RUN
        LLP. In this case LLP is exempted from paying government fees.
      </p> */}
    </div>
  );
};

export default ProcessIncorporationLLP;
