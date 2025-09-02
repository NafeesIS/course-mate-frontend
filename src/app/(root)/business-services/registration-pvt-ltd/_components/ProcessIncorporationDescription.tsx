import Image from 'next/image';
import light from '../../../../../../public/assets/business-services/plc-registration/light.png';

const ProcessIncorporationDescription = () => {
  return (
    <div>
      <div className='scroll-margin-top my-5 text-start' id='step-1'>
        <p className='mb-3 text-base font-semibold lg:text-lg'>
          <span className='text-primary'>Step- 1: </span>
          <span className=''> Submission of Part A of SPICe + Form :</span>
        </p>
        <ul className='text-muted-foreground-darker list-inside list-disc space-y-2 text-sm font-normal lg:text-base'>
          <li>
            The first step is{' '}
            <span className='font-semibold'>
              to reserve the name of the proposed company by filing Part A of
              SPICe + Form.
            </span>{' '}
          </li>
          <li>In this form the company has to propose:</li>
          <ol className='ml-5 list-inside list-decimal space-y-1 md:ml-7'>
            <li>
              Two unique names (ensuring the name is distinct from any existing
              company or LLP and does not include any prohibited words).
            </li>
            <li>Type of company.</li>
            <li>Class of company.</li>
            <li>Category and sub-category of company.</li>
            <li>Main Industrial activity and sub-category of the company. </li>
          </ol>
          <div className='flex items-start justify-start gap-1'>
            <Image src={light} alt='light' />
            <span>
              If the name of the proposed company is too similar to the name of
              the existing company or is the same as the name of any registered
              trademark, then NOC is required from the company or the trademark
              holder.
            </span>
          </div>
          <li>
            The form is filed by paying{' '}
            <span className='font-semibold'>Rs.1000/- Government fees.</span>
          </li>
          <li>
            CRC if satisfied with the name will approve one name. This name
            shall be kept reserved for{' '}
            <span className='font-semibold'>
              20 days from the date of approval.
            </span>{' '}
            The proposed company will also have an option to extend the reserved
            name validity beyond 20 days by paying additional government fees.
          </li>
          <li>
            After the approval of name, the proposed company can proceed to file
            Part B of SPICe + form, INC-33, INC-34, INC-35 and INC-9.
          </li>
        </ul>
      </div>
      <p className='text-muted-foreground-darker rounded-md bg-muted p-2 text-start text-sm font-normal italic lg:text-base'>
        The company has the option to file the Part B of SPICe + form, INC-33,
        INC-34, INC-35 and INC-9 along with the Part A of SPICe + form. In this
        case the company is exempted from paying government fees of Part A of
        SPICe +.
      </p>
      <div className='scroll-margin-top my-5 text-start' id='step-2'>
        <p className='mb-3 text-base font-semibold lg:text-lg'>
          <span className='text-primary'>Step- 2:</span> Submission of Part B of
          SPICe + Form:
        </p>
        <ul className='text-muted-foreground-darker list-inside list-disc space-y-2 text-sm font-normal lg:text-base'>
          <li>
            After the approval of one name or incase where the user has opted to
            incorporate a company without approval of name from CRC, has to file
            Part B of SPICe +.
          </li>
          <li>
            In this form various details of the companies are provided like:
          </li>
          <ol className='ml-5 list-inside list-decimal space-y-1 md:ml-7'>
            <li>Details of registered office.</li>
            <li>Contact details of the company.</li>
            <li>
              Capital structure of the company which includes Authorized and
              Paid Up share capital, class of shares, etc.
            </li>
            <li>Name of the subscriber and their subscribed amount.</li>
            <li>
              Details of Directors. (If any person desire’s to become a director
              in a prospective company and DIN is not allotted to him then in
              such case only 3 DIN applications can be made in Part B + Form).{' '}
            </li>
            <li>Director’s Consent in Form DIR-2. </li>
            <li>
              The information for allotment of PAN and TAN to the company.
            </li>
            <li>
              Details of the stamp duty to be paid on form, MOA, AOA and Others.{' '}
            </li>
            <li>Declaration by professional. </li>
          </ol>
          <li className='font-semibold'>
            This form shall be signed by 1 director and professional who has
            given declaration.
          </li>
        </ul>
      </div>
      <div className='scroll-margin-top my-5 text-start' id='step-3'>
        <p className='mb-3 text-base font-semibold lg:text-lg'>
          <span className='text-primary'>Step- 3:</span> Submission of INC-33
          Memorandum of Association (MOA):
        </p>
        <ul className='text-muted-foreground-darker list-inside list-disc space-y-2 text-sm font-normal lg:text-base'>
          <li>
            INC-33 is linked to Part B of SPICe + form. After filling all the
            information in Part B of SPICe + form, the user is directed to the
            linked form INC-33 in which various clauses are prescribed.
          </li>
          <li>The Clause in MOA are:</li>
          <ol className='ml-5 list-inside list-decimal space-y-1 md:ml-7'>
            <li>Name clause.</li>
            <li>Registered office.</li>
            <li>Main and Ancillary object clause.</li>
            <li>Liability clause.</li>
            <li>Capital clause.</li>
          </ol>
          <li>
            In this form the company has to meticulously frame the main and
            ancillary object clause of the company.
          </li>
          <li>
            MOA outlines the company’s fundamental objectives, its scope of
            operations and the powers it possesses to achieve those objectives.
          </li>
          <li>
            It defines the company’s relationship with its shareholders and
            external stakeholders such as creditors and investors
          </li>
          <li className='font-semibold'>
            This form shall be signed by all subscribers and 1 professional.
          </li>
        </ul>
      </div>
      <div className='scroll-margin-top my-5 text-start' id='step-4'>
        <p className='mb-3 text-base font-semibold lg:text-lg'>
          <span className='text-primary'>Step- 4:</span> Submission of INC-34
          Article of Association (AOA):
        </p>
        <ul className='text-muted-foreground-darker list-inside list-disc space-y-2 text-sm font-normal lg:text-base'>
          <li>INC-34 is linked to Part B of SPICe + form and INC-33 form.</li>
          <li>
            AOA on the other hand provides the rules and regulations for the
            internal management and administration of the company.
          </li>
          <li>
            The AOA acts as a guidebook for the company’s day-to-day operations,
            ensuring smooth functioning and preventing conflicts among
            stakeholders.
          </li>
          <li className='font-semibold'>
            This form shall be signed by all subscribers and 1 professional.
          </li>
        </ul>
      </div>
      <div className='scroll-margin-top my-5 text-start' id='step-5'>
        <p className='mb-3 text-base font-semibold lg:text-lg'>
          <span className='text-primary'>Step- 5:</span> Submission of INC-35
          Agile Pro:
        </p>
        <ul className='text-muted-foreground-darker list-inside list-disc space-y-2 text-sm font-normal lg:text-base'>
          <li>INC-35 AGILE-PRO-S is an Application for registration of:</li>
          <ol className='ml-5 list-inside list-decimal space-y-1 md:ml-7'>
            <li>Goods and Service Tax Identification Number (GSTIN).</li>
            <li>Employee State Insurance Corporation (ESIC).</li>
            <li>Employees Provident Fund Organisation (EPFO).</li>
            <li>
              Professional Tax (in Maharashtra, Karnataka and West Bengal).
            </li>
            <li>Shops and Establishment Registration Number.</li>
          </ol>
          <li className='font-semibold'>
            This form shall be duly signed by 1 director.
          </li>
        </ul>
      </div>
      <div className='scroll-margin-top my-5 text-start' id='step-6'>
        <p className='mb-3 text-base font-semibold lg:text-lg'>
          <span className='text-primary'>Step- 6:</span> Submission of INC-9
          Declaration by all Subscribers and first Directors:
        </p>
        <ul className='text-muted-foreground-darker list-inside list-disc space-y-2 text-sm font-normal lg:text-base'>
          <li>
            In this form declaration is given by all the subscribers and first
            directors of the company. This form shall be signed by all the
            directors and subscribers of the company.
          </li>
        </ul>
      </div>
      <div className='scroll-margin-top mt-5 text-start' id='step-7'>
        <p className='mb-3 text-base font-semibold lg:text-lg'>
          <span className='text-primary'>Step- 7:</span> Signed forms and
          payment of Government fees
        </p>
        <ul className='text-muted-foreground-darker list-inside list-disc space-y-2 text-sm font-normal lg:text-base'>
          <li>
            The duly signed forms with all the necessary attachments shall be
            filed and the company has to pay:
          </li>
          <ol className='ml-5 list-inside list-decimal space-y-1 md:ml-7'>
            <li>Government fees for Part B of SPICe+</li>
            <li>
              Stamp duty on the basis of the authorized share capital and state.
            </li>
          </ol>
        </ul>
      </div>
    </div>
  );
};

export default ProcessIncorporationDescription;
