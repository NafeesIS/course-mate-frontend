/* eslint-disable react/no-unescaped-entities */

'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  title: string;
  subItems?: { id: string; title: string }[];
}
interface TableOfContentsProps {
  activeSection: string;
  // eslint-disable-next-line no-unused-vars
  onSectionClick: (sectionId: string) => void;
  // expandedSection: string | null;
  // eslint-disable-next-line no-unused-vars
  onToggleSection: (sectionId: string) => void;
}
// Define table of contents items for reuse
const tocItems: TOCItem[] = [
  {
    id: 'introduction',
    title: '1. Introduction',
    subItems: [
      { id: 'overview', title: '1.1 Overview of the Policy' },
      { id: 'effective-date', title: '1.2 Effective Date' },
      { id: 'definitions', title: '1.3 Definitions' },
    ],
  },
  {
    id: 'identity-contact',
    title: '2. Identity and Contact Details',
    subItems: [
      { id: 'data-fiduciary', title: '2.1 Data Fiduciary' },
      { id: 'data-protection', title: '2.2 Privacy and Data Protection' },
    ],
  },
  {
    id: 'data-collection',
    title: '3. Categories of Personal Data Collected',
    subItems: [
      { id: 'types-of-data', title: '3.1 Types of Personal Data' },
      { id: 'data-sources', title: '3.2 Data Sources' },
    ],
  },
  {
    id: 'data-processing',
    title: '4. Data Processing Purposes',
    subItems: [
      { id: 'mca-data-use', title: '4.1 Use of MCA Data' },
      { id: 'director-data-use', title: '4.2 Use of Director Data' },
      { id: 'user-authentication', title: '4.3 User Authentication' },
      { id: 'security-integrity', title: '4.4 Data Security and Integrity' },
      {
        id: 'compliance-and-legal-obligations',
        title: '4.5 Compliance and Legal Obligations',
      },
    ],
  },
  { id: 'data-accuracy', title: '5. Data Accuracy' },
  {
    id: 'legal-basis',
    title: '6. Legal Basis for Data Processing',
    subItems: [
      { id: 'compliance', title: '6.1 Compliance with Laws' },
      { id: 'legal-bases', title: '6.2 Legal Bases for Processing' },
      {
        id: 'documentation',
        title: '6.3 Documentation and Compliance Records',
      },
      { id: 'user-acknowledgment', title: '6.4 User Acknowledgment' },
    ],
  },
  { id: 'data-retention', title: '7. Data Retention Period' },
  {
    id: 'data-sharing',
    title: '8. Data Sharing and Disclosure',
    subItems: [
      {
        id: 'sharing-circumstances',
        title: '8.1 Circumstances for Sharing Personal Data',
      },
      {
        id: 'third-party-due-diligence',
        title: '8.2 Third-Party Due Diligence',
      },
      { id: 'data-sale-restrictions', title: '8.3 Restrictions on Data Sales' },
      { id: 'security-acknowledgment', title: '8.4 Security Acknowledgment' },
    ],
  },
  {
    id: 'data-security',
    title: '9. Data Security Measures',
    subItems: [
      { id: 'security-implementation', title: '9.1 Security Implementation' },
      { id: 'security-measures', title: '9.2 Security Measures' },
      {
        id: 'third-party-security',
        title: '9.3 Third-Party Security Requirements',
      },
      { id: 'security-disclaimer', title: '9.4 Security Limitations' },
    ],
  },
  {
    id: 'user-rights',
    title: '10. User Rights Under the DPDPA',
    subItems: [
      { id: 'rights-overview', title: '10.1 Available Rights' },
      { id: 'exercising-rights', title: '10.2 Process for Exercising Rights' },
      { id: 'response-timeline', title: '10.3 Response Timeline' },
      { id: 'request-limitations', title: '10.4 Request Limitations' },
      { id: 'rights-limitations', title: '10.5 Legal Limitations' },
    ],
  },
  {
    id: 'grievance-redressal',
    title: '11. Grievance Redressal Mechanism',
    subItems: [
      { id: 'commitment', title: '11.1 Commitment to Addressing Concerns' },
      { id: 'submission-process', title: '11.2 Grievance Submission Process' },
      { id: 'acknowledgment', title: '11.3 Acknowledgment Timeline' },
      { id: 'resolution-timeline', title: '11.4 Resolution Timeline' },
      { id: 'resolution-delay', title: '11.5 Notification of Delays' },
      { id: 'escalation', title: '11.6 Escalation Process' },
      { id: 'record-keeping', title: '11.7 Record Maintenance' },
      { id: 'additional-rights', title: '11.8 Preservation of Legal Rights' },
    ],
  },
  {
    id: 'international-transfers',
    title: '12. International Data Transfers',
    subItems: [
      { id: 'transfer-overview', title: '12.1 Transfer Overview' },
      { id: 'adequate-safeguards', title: '12.2 Adequate Safeguards' },
      { id: 'third-party-obligations', title: '12.3 Third-Party Obligations' },
      { id: 'user-consent', title: '12.4 User Consent' },
      { id: 'protection-measures', title: '12.5 Protection Measures' },
    ],
  },
  {
    id: 'cookies-tracking',
    title: '13. Cookies and Tracking Technologies',
    subItems: [
      { id: 'cookies-purpose', title: '13.1 Purpose and Utilization' },
      { id: 'cookies-definition', title: '13.2 Definition of Cookies' },
      { id: 'cookies-types', title: '13.3 Types of Cookies' },
      { id: 'cookies-categories', title: '13.4 Cookie Categories' },
      { id: 'cookies-notice', title: '13.5 Cookie Notice' },
      { id: 'cookies-controls', title: '13.6 User Controls' },
      { id: 'cookies-compliance', title: '13.7 Legal Compliance' },
    ],
  },
  { id: 'children', title: "14. Children's Privacy" },
  { id: 'changes', title: '15. Changes to This Policy' },
  {
    id: 'contact-info',
    title: '16. Contact Information',
  },
];

// Extract the title from section ID for display in mobile header
const formatSectionTitle = (sectionId: string) => {
  const section = tocItems.find((item) => item.id === sectionId);
  if (section) {
    return section.title;
  }

  // Check if it's a subsection
  for (const item of tocItems) {
    if (item.subItems) {
      const subItem = item.subItems.find((sub) => sub.id === sectionId);
      if (subItem) {
        return `${item.title} - ${subItem.title}`;
      }
    }
  }

  return sectionId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Table of Contents component for reuse
const TableOfContents: React.FC<TableOfContentsProps> = ({
  activeSection,
  onSectionClick,
  onToggleSection,
}) => {
  return (
    <ul className='space-y-2 text-sm'>
      {tocItems.map((item) => {
        // Check if this item has subitems and one of them is active
        const hasActiveSubItem = item.subItems?.some(
          (sub) => sub.id === activeSection
        );
        const isExpanded = activeSection === item.id || hasActiveSubItem;

        return (
          <li key={item.id}>
            <div className='flex cursor-pointer flex-col'>
              <p
                className={`flex items-center justify-between py-1 transition-colors duration-200 hover:text-primary ${
                  activeSection === item.id
                    ? 'font-medium text-primary'
                    : 'text-gray-600 '
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  onSectionClick(item.id);
                  if (item.subItems) {
                    onToggleSection(item.id);
                  }
                }}
              >
                <span>{item.title}</span>
                {item.subItems && (
                  <span
                    className={`ml-1 transform transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                  >
                    ▸
                  </span>
                )}
              </p>

              {item.subItems && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <ul className='ml-4 mt-1 space-y-1'>
                    {item.subItems.map((subItem) => (
                      <li key={subItem.id}>
                        <p
                          className={`block py-1 text-xs transition-colors duration-200 hover:text-primary ${
                            activeSection === subItem.id
                              ? 'font-medium text-primary'
                              : 'text-gray-500 '
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            onSectionClick(subItem.id);
                          }}
                        >
                          {subItem.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const RefundPolicy = () => {
  // State to track the active section
  const [activeSection, setActiveSection] = useState('introduction');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [tocExpanded, setTocExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const findParentSection = (subSectionId: string): string | null => {
    for (const item of tocItems) {
      if (item.subItems?.some((sub) => sub.id === subSectionId)) {
        return item.id;
      }
    }
    return null;
  };

  // Ensure parent section is expanded when a subsection is active
  const ensureParentSectionExpanded = (sectionId: string) => {
    const parentId = findParentSection(sectionId);
    if (parentId) {
      setExpandedSection(parentId);
    }
  };

  // Toggle the mobile TOC
  const toggleToc = () => {
    setTocExpanded(!tocExpanded);
  };

  // Toggle a section in the TOC - only allow one section to be expanded at a time
  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Scroll to a section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -120; // Additional offset to account for the header
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Update active section
      setActiveSection(sectionId);

      // Ensure parent section is expanded if this is a subitem
      ensureParentSectionExpanded(sectionId);
    }
    setTocExpanded(false); // Close mobile TOC after clicking
  };

  useEffect(() => {
    // Function to determine which section is currently visible
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id], div[id]'); // Also target div elements with IDs
      let currentSection = 'introduction';
      let smallestDistance = Infinity;

      sections.forEach((section) => {
        if (section.id === 'OfferBannerAtTop') return;
        const sectionTop = section.getBoundingClientRect().top;
        // Find the section closest to the top of the viewport but still visible
        const distance = Math.abs(sectionTop - 100);
        if (distance < smallestDistance && sectionTop < 150) {
          smallestDistance = distance;
          currentSection = section.id;
        }
      });

      const bannerHeight =
        document.getElementById('OfferBannerAtTop')?.clientHeight || 0;
      if (window.scrollY > bannerHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Only update if different
      if (activeSection !== currentSection) {
        setActiveSection(currentSection);
        // Auto-expand parent section if a subsection is active
        ensureParentSectionExpanded(currentSection);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initialize on first load
    handleScroll();

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);
  return (
    <div>
      {/* Mobile Header with TOC */}
      <div
        className={`left-0 right-0 ${isScrolled ? 'fixed top-14' : 'top-32'} z-50 border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 md:hidden`}
      >
        <div className='p-4'>
          <div
            className='flex cursor-pointer items-center justify-between'
            onClick={toggleToc}
          >
            <div className='text-sm font-medium'>
              {tocExpanded
                ? 'Table of Contents'
                : `Section: ${formatSectionTitle(activeSection)}`}
            </div>
            <button className='rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800'>
              {tocExpanded ? (
                <ChevronUp className='h-5 w-5' />
              ) : (
                <ChevronDown className='h-5 w-5' />
              )}
            </button>
          </div>

          {tocExpanded && (
            <div className='mt-3 max-h-[50vh] overflow-y-auto'>
              <TableOfContents
                activeSection={activeSection}
                onSectionClick={scrollToSection}
                // expandedSection={expandedSection}
                onToggleSection={toggleSection}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={`wrapper mb-16 mt-6 lg:mt-0 lg:pt-10 ${isScrolled ? 'pt-16' : 'pt-0'}`}
      >
        <h1 className='mb-4 text-xl font-bold text-gray-800 md:text-2xl'>
          Privacy Policy
        </h1>
        <p className='mb-4 text-xs text-gray-600  md:text-sm'>
          Last Updated: May 17, 2025
        </p>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-6 lg:grid-cols-4'>
          {/* Sidebar navigation - Hidden on mobile */}
          <div className='hidden md:col-span-2 md:block lg:col-span-1'>
            <div className='sticky top-20 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
              <h2 className='mb-4 text-sm font-bold text-gray-800 md:text-lg'>
                Table of Contents
              </h2>
              <div className='no-visible-scrollbar max-h-[70vh] overflow-y-auto 2xl:max-h-[80vh]'>
                <TableOfContents
                  activeSection={activeSection}
                  onSectionClick={scrollToSection}
                  // expandedSection={expandedSection}
                  onToggleSection={toggleSection}
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className='md:col-span-4 lg:col-span-3'>
            <section id='introduction' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                1. Introduction
              </h2>

              <div id='overview' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  1.1 Overview of the Policy
                </h3>
                <p className='mb-4 text-xs text-gray-600   md:text-sm'>
                  This Privacy Policy ("Policy") is issued by{' '}
                  <strong>FileSure India Private Limited</strong>, a company
                  duly incorporated under the Companies Act, 2013, bearing
                  Corporate Identification Number (CIN) U62013MH2023PTC411571,
                  having its registered office at Sambhaji Nagar No2, St. Antony
                  Road, Chembur, Mumbai, Maharashtra 400071, India (hereinafter
                  referred to as "Filesure", "we", "us", or "our"). Our
                  corporate office is located at 6th Floor, Rahimtoola House,
                  Homji Street, Near Horniman Circle, Fort, Mumbai, Maharashtra
                  - 400001.
                </p>
                <p className='mb-4 text-xs text-gray-600   md:text-sm'>
                  Filesure acknowledges and respects the importance of
                  safeguarding your privacy and is committed to protecting the
                  confidentiality, integrity, and security of all personal data
                  collected from individuals ("you" or "your") in connection
                  with your use of our website, mobile applications, and other
                  online or offline services (collectively, the "Services").
                </p>
                <p className='text-xs text-gray-600   md:text-sm'>
                  <strong>To Communicate with You:</strong> We may use your
                  information to respond to your inquiries, provide customer
                  service support, send you important information about the
                  services, and send you marketing communications (with your
                  consent) via different channels, including but not limited to
                  SMS, Email, WhatsApp, and Voice. This Privacy Policy provides
                  details about how we collect, use, disclose, and safeguard
                  your information when you access our services.
                </p>
              </div>

              <div id='effective-date' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  1.2 Effective Date
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  This Privacy Policy shall come into effect on{' '}
                  <strong>17 May 2025</strong> ("Effective Date"). Filesure
                  reserves the right to modify, amend, or update this Policy at
                  any time in accordance with applicable laws and regulations.
                  Any such changes shall be effective immediately upon posting
                  the revised Policy on the Filesure website or through other
                  appropriate communication channels.
                </p>
              </div>

              <div id='definitions' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  1.3 Definitions
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  For the purposes of this Privacy Policy, key terms include:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>Personal Data:</strong> means any information
                    relating to an identified or identifiable natural person, as
                    defined under the Digital Personal Data Protection Act,
                    2023, including but not limited to name, contact details,
                    identification numbers, IP address, and any other
                    information that can be used to directly or indirectly
                    identify an individual.
                  </li>
                  <li>
                    <strong>Sensitive Personal Data:</strong> refers to personal
                    data that relates to financial information, health data,
                    sexual orientation, biometric data, or any other category of
                    data deemed sensitive under applicable laws.
                  </li>
                  <li>
                    <strong>Data Fiduciary:</strong> means FileSure India
                    Private Limited, the entity that determines the purpose and
                    means of processing Personal Data in relation to the
                    Services provided.
                  </li>
                  <li>
                    <strong>Data Principal:</strong> means the individual to
                    whom the Personal Data relates and who can be identified,
                    directly or indirectly, from such data.
                  </li>
                  <li>
                    <strong>Processing:</strong> refers to any operation or set
                    of operations performed on Personal Data, including
                    collection, recording, organization, storage, adaptation,
                    alteration, retrieval, consultation, use, disclosure,
                    dissemination, or erasure.
                  </li>
                  <li>
                    <strong>Services:</strong> refers to the website, mobile
                    applications, and any other online or offline platforms or
                    services provided by Filesure that collect or process
                    Personal Data.
                  </li>
                  <li>
                    <strong>Cookies:</strong> means small text files placed on a
                    user's device by websites to store information to enhance
                    user experience and enable certain functionalities.
                  </li>
                  <li>
                    <strong>Companies:</strong> shall mean all types of business
                    entities registered in India, including but not limited to
                    Private Limited Companies, Public Limited Companies, Limited
                    Liability Partnerships (LLPs), Foreign Companies, and any
                    other legal entity types registered under applicable Indian
                    laws.
                  </li>
                  <li>
                    <strong>Data Protection Officer:</strong> means the
                    designated individual responsible for overseeing Filesure's
                    data protection strategy and implementation to ensure
                    compliance with applicable data protection laws.
                  </li>
                  <li>
                    <strong>Digital Personal Data Protection Act, 2023:</strong>{' '}
                    means the Indian legislation titled Digital Personal Data
                    Protection Act, 2023, governing the processing of personal
                    data.
                  </li>
                  <li>
                    <strong>Information Technology Act, 2000:</strong> means the
                    Indian legislation titled the Information Technology Act,
                    2000, relating to cyber activities, electronic governance,
                    and data security.
                  </li>
                  <li>
                    <strong>Effective Date:</strong> means the date on which
                    this Privacy Policy comes into effect, specifically 17 May
                    2025.
                  </li>
                  <li>
                    <strong>User:</strong> means any individual who accesses or
                    uses the Services provided by Filesure.
                  </li>
                  <li>
                    <strong>Consent:</strong> means explicit, informed, and
                    unambiguous agreement by the Data Principal to the
                    processing of their Personal Data for specified purposes.
                  </li>
                  <li>
                    <strong>Contact Information:</strong> means the details
                    provided for communication purposes related to privacy and
                    data protection queries, including email address, telephone
                    number, and postal address of the Data Protection Officer.
                  </li>
                  <li>
                    <strong>Data Protection Inquiry:</strong> means any
                    communication, request, complaint, or concern raised by a
                    Data Principal regarding the processing of their Personal
                    Data.
                  </li>
                  <li>
                    <strong>Business Days:</strong> means any day other than a
                    Saturday, Sunday, or public holiday when Filesure is open
                    for business.
                  </li>
                  <li>
                    <strong>Ministry of Corporate Affairs:</strong> means the
                    governmental authority in India responsible for
                    administering company law and maintaining corporate data,
                    including official portals V2 and V3.
                  </li>
                  <li>
                    <strong>Master Data:</strong> means foundational corporate
                    data such as company registration details, identification
                    numbers, and basic profile information, sourced from MCA
                    portals.
                  </li>
                  <li>
                    <strong>Director Data:</strong> means personal and
                    professional details of company directors obtained from MCA
                    portals and other authorized sources.
                  </li>
                  <li>
                    <strong>Charges Data:</strong> means information relating to
                    charges, mortgages, or securities registered against
                    Companies as recorded with the MCA.
                  </li>
                  <li>
                    <strong>Public Filings:</strong> means documents and
                    disclosures submitted by Companies to the MCA, including
                    financial statements, annual reports, and other statutory
                    filings.
                  </li>
                  <li>
                    <strong>Annual E-filings:</strong> means electronic
                    submissions made by Companies to the MCA on an annual basis
                    as required by law.
                  </li>
                  <li>
                    <strong>Goods and Services Tax:</strong> means the indirect
                    tax system administered by the Government of India, and its
                    associated data portal.
                  </li>
                  <li>
                    <strong>GST Suvidha Provider:</strong> means an authorized
                    intermediary providing APIs and services to access GST data
                    on behalf of entities like Filesure.
                  </li>
                  <li>
                    <strong>Publicly Available Data:</strong> means personal
                    data accessible in the public domain, including data from
                    government portals such as MCA, which may be processed
                    without explicit consent under applicable laws.
                  </li>
                  <li>
                    <strong>User-Provided Data:</strong> means personal
                    information voluntarily submitted by users during
                    registration, login, or interaction with Filesure's
                    Services.
                  </li>
                  <li>
                    <strong>Third-Party Authentication Providers:</strong> means
                    external services (e.g., Google) used to facilitate user
                    login and authentication, which share limited user data with
                    Filesure based on user consent.
                  </li>
                  <li>
                    <strong>Website Interaction Data:</strong> means technical
                    and usage information collected automatically during a
                    user's interaction with Filesure's platform, including IP
                    addresses, browser type, device identifiers, and similar
                    data.
                  </li>
                  <li>
                    <strong>Legitimate Business Purposes:</strong> means
                    activities related to the operation, provision, and
                    improvement of Filesure's Services, including but not
                    limited to due diligence, compliance verification, research,
                    and authorized commercial activities.
                  </li>
                  <li>
                    <strong>Terms and Conditions of MCA Portals:</strong> means
                    the legal agreements and usage policies governing access to
                    and use of data from the Ministry of Corporate Affairs
                    portals (V2 and V3).
                  </li>
                  <li>
                    <strong>Due Diligence:</strong> means the investigation or
                    exercise of care that Filesure performs to verify corporate
                    information and compliance status.
                  </li>
                  <li>
                    <strong>Compliance Verification:</strong> means the
                    processes through which Filesure and its users confirm
                    adherence to applicable laws, regulations, and corporate
                    governance standards.
                  </li>
                  <li>
                    <strong>Commercialization:</strong> means the authorized
                    sale, licensing, or distribution of data for commercial
                    purposes.
                  </li>
                  <li>
                    <strong>Marketing Communications:</strong> means messages or
                    materials sent to individuals for the purpose of promoting
                    products, services, or events.
                  </li>
                  <li>
                    <strong>User Authentication:</strong> means the process of
                    verifying the identity of a user to grant access to
                    Filesure's Services.
                  </li>
                  <li>
                    <strong>Industry-Standard Security Measures:</strong> means
                    accepted technical, organizational, and procedural
                    safeguards widely recognized and adopted in the data
                    protection and cybersecurity field.
                  </li>
                  <li>
                    <strong>Lawful Governmental Requests:</strong> means
                    demands, orders, or inquiries issued by competent
                    governmental or regulatory authorities in accordance with
                    applicable laws.
                  </li>
                  <li>
                    <strong>External Sources:</strong> means third-party data
                    providers, including governmental portals such as the
                    Ministry of Corporate Affairs ("MCA") V2 and V3 portals, and
                    other authorized repositories from which Filesure sources
                    data.
                  </li>
                  <li>
                    <strong>Good Faith Efforts:</strong> means reasonable
                    actions taken by Filesure to ensure data accuracy and
                    timeliness consistent with technical capabilities and legal
                    constraints.
                  </li>
                  <li>
                    <strong>Data Synchronization:</strong> means the process of
                    updating Filesure's database to reflect the most current
                    information available from external sources.
                  </li>
                  <li>
                    <strong>Liability Disclaimer:</strong> means Filesure's
                    explicit statement denying responsibility for any
                    inaccuracies, delays, or errors arising from external
                    factors beyond its control.
                  </li>
                  <li>
                    <strong>User Responsibility:</strong> means the obligation
                    of Users to independently verify critical data and bear
                    risks associated with reliance on Filesure's data.
                  </li>
                  <li>
                    <strong>Warranty Disclaimer:</strong> means Filesure's
                    declaration that it makes no guarantees or representations
                    regarding the completeness or accuracy of the data.
                  </li>
                  <li>
                    <strong>Authoritative Sources:</strong> means official and
                    legally recognized sources of data, including but not
                    limited to MCA portals and other government-maintained
                    registries.
                  </li>
                  <li>
                    <strong>Contractual Necessity:</strong> means processing of
                    Personal Data required to perform or enter into a contract
                    involving the Data Principal.
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> means processing Personal
                    Data to comply with statutory, regulatory, or governmental
                    requirements imposed on Filesure.
                  </li>
                  <li>
                    <strong>Legitimate Interests:</strong> means processing
                    Personal Data based on Filesure's or a third party's lawful
                    interests balanced against the Data Principal's fundamental
                    rights.
                  </li>
                  <li>
                    <strong>Balancing Test:</strong> means an assessment
                    conducted to ensure that Legitimate Interests do not
                    override the rights and freedoms of the Data Principal.
                  </li>
                  <li>
                    <strong>Data Retention Period:</strong> means the duration
                    for which Personal Data is retained by Filesure to fulfill
                    processing purposes or comply with legal requirements.
                  </li>
                  <li>
                    <strong>Data Anonymization:</strong> means the process of
                    removing or modifying Personal Data so that individuals
                    cannot be identified.
                  </li>
                  <li>
                    <strong>Good Faith Implementation:</strong> means adherence
                    to retention and deletion practices consistent with
                    applicable laws and internal policies.
                  </li>
                  <li>
                    <strong>Legal Proceedings:</strong> means any ongoing
                    investigations, disputes, or enforcement actions involving
                    Filesure that necessitate extended data retention.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> means third-party
                    vendors, contractors, or agents engaged by Filesure to
                    perform specific functions or services on its behalf,
                    including but not limited to data hosting, IT support,
                    payment processing, customer service, and marketing.
                  </li>
                  <li>
                    <strong>Business Partners:</strong> means entities with
                    which Filesure collaborates for research, analytics, or
                    service improvement by sharing aggregated, anonymized, or
                    de-identified data.
                  </li>
                  <li>
                    <strong>Aggregated Data:</strong> means data compiled from
                    multiple sources and combined in such a way that it does not
                    identify any individual Data Principal.
                  </li>
                  <li>
                    <strong>Anonymized Data:</strong> means Personal Data that
                    has been processed to irreversibly prevent identification of
                    the individual Data Principal.
                  </li>
                  <li>
                    <strong>De-identified Data:</strong> means data from which
                    personal identifiers have been removed, reducing the
                    possibility of linking data to a specific individual.
                  </li>
                  <li>
                    <strong>Lawful Requests:</strong> means legally valid
                    demands, subpoenas, court orders, or other judicial or
                    governmental directives requiring disclosure of Personal
                    Data.
                  </li>
                  <li>
                    <strong>Explicit Consent:</strong> means a clear, specific,
                    and informed agreement by the Data Principal authorizing
                    Filesure to share Personal Data with third parties.
                  </li>
                  <li>
                    <strong>Unauthorized Third Parties:</strong> means any
                    entities or persons who do not have the legal right or
                    consent to access or use Personal Data.
                  </li>
                  <li>
                    <strong>Data Breach:</strong> means any incident resulting
                    in unauthorized access, disclosure, alteration, or
                    destruction of Personal Data.
                  </li>
                  <li>
                    <strong>Technical Safeguards:</strong> means measures such
                    as encryption, access controls, and intrusion detection
                    systems implemented to protect Personal Data.
                  </li>
                  <li>
                    <strong>Administrative Safeguards:</strong> means policies,
                    procedures, and training programs designed to govern data
                    handling and ensure privacy compliance.
                  </li>
                  <li>
                    <strong>Organizational Safeguards:</strong> means structural
                    and management practices ensuring accountability and privacy
                    governance.
                  </li>
                  <li>
                    <strong>Encryption:</strong> means the process of encoding
                    data to prevent unauthorized access during storage or
                    transmission.
                  </li>
                  <li>
                    <strong>Access Controls:</strong> means mechanisms such as
                    role-based permissions and multi-factor authentication
                    restricting data access to authorized personnel.
                  </li>
                  <li>
                    <strong>Security Audits:</strong> means systematic
                    evaluations of security policies, procedures, and controls.
                  </li>
                  <li>
                    <strong>Incident Response:</strong> means the procedures
                    implemented to detect, investigate, and remediate security
                    breaches.
                  </li>
                  <li>
                    <strong>Data Portability:</strong> means the right to
                    receive Personal Data in a structured, commonly used format
                    and transfer it to another entity.
                  </li>
                  <li>
                    <strong>Withdrawal of Consent:</strong> means the revocation
                    by a Data Principal of previously given consent to process
                    Personal Data.
                  </li>
                  <li>
                    <strong>Restriction of Processing:</strong> means limiting
                    the use of Personal Data in accordance with a Data
                    Principal's request or legal requirement.
                  </li>
                  <li>
                    <strong>Grievance:</strong> means a formal complaint or
                    concern raised by a Data Principal regarding the processing
                    of their Personal Data.
                  </li>
                  <li>
                    <strong>Data Protection Board of India:</strong> means the
                    regulatory authority established under the Digital Personal
                    Data Protection Act, 2023, responsible for oversight and
                    enforcement.
                  </li>
                  <li>
                    <strong>International Data Transfer:</strong> means the
                    transfer of Personal Data to entities or servers located
                    outside India.
                  </li>
                  <li>
                    <strong>Standard Contractual Clauses:</strong> means legally
                    binding data protection clauses approved by regulators to
                    govern international data transfers.
                  </li>
                  <li>
                    <strong>Session Cookies:</strong> means temporary cookies
                    that expire when the browser session ends.
                  </li>
                  <li>
                    <strong>Persistent Cookies:</strong> means cookies that
                    remain on a device for a specified period until deleted.
                  </li>
                  <li>
                    <strong>Children:</strong> means individuals under the age
                    of eighteen (18) years.
                  </li>
                  <li>
                    <strong>Material Changes:</strong> means significant updates
                    or amendments to the Privacy Policy that affect user rights
                    or data processing practices.
                  </li>
                </ul>
              </div>
            </section>

            <section id='identity-contact' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                2. Identity and Contact Details
              </h2>
              <div id='data-fiduciary' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  2.1 Identity of the Data Fiduciary
                </h3>
                <p className='mb-4  text-xs text-gray-600  md:text-sm '>
                  The Data Fiduciary responsible for the collection, processing,
                  and protection of Personal Data is:
                </p>
                <div className='mb-4 rounded-lg bg-gray-50 p-4 text-gray-700 dark:bg-gray-800'>
                  <p className='text-xs md:text-sm'>
                    <strong>FileSure India Private Limited</strong>
                    <br />
                    Corporate Identification Number (CIN): U62013MH2023PTC411571
                    <br />
                    Registered Office: Sambhaji Nagar No2, St. Antony Road,
                    Chembur, Mumbai, Maharashtra 400071, India
                    <br />
                    Corporate Office: 6th Floor, Rahimtoola House, Homji Street,
                    Near Horniman Circle, Fort, Mumbai, Maharashtra - 400001
                  </p>
                </div>
              </div>
              <div id='data-protection' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  2.2 Contact Information for Privacy and Data Protection
                  Queries
                </h3>
                <p className='mb-4 text-xs text-gray-600  md:text-sm'>
                  For any queries, concerns, or requests related to this Privacy
                  Policy or the processing of your Personal Data, you may
                  contact our designated Data Protection Officer ("DPO") at:
                </p>
                <div className='mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
                  <p className='text-xs text-gray-700 md:text-sm'>
                    <strong>Email:</strong> dpo@filesure.in
                    <br />
                    <strong>Phone:</strong> +91 8104946419
                    <br />
                    <strong>Postal Address:</strong> Data Protection Officer,
                    FileSure India Private Limited, Sambhaji Nagar No2, St.
                    Antony Road, Chembur, Mumbai, Maharashtra 400071, India
                  </p>
                </div>
                <p className='text-xs text-gray-600 md:text-sm'>
                  We endeavor to respond to all data protection inquiries,
                  requests, or complaints promptly and in accordance with the
                  timelines prescribed under applicable laws and regulations.
                  Specifically, we commit to acknowledging receipt of your
                  communication within <strong>seven (7) business days</strong>{' '}
                  and providing a substantive response or resolution within{' '}
                  <strong>thirty (30) calendar days</strong> from the date of
                  receipt. Where such timelines cannot be met due to exceptional
                  circumstances, we shall inform you accordingly and provide an
                  estimated timeframe for resolution. Our commitment is to
                  address your concerns regarding your personal data
                  comprehensively, ensuring confidentiality and security
                  throughout the process. Please do not hesitate to contact us
                  using the details provided above for any assistance related to
                  your personal data. All communications will be handled with
                  the utmost professionalism and discretion.
                </p>
              </div>
            </section>

            <section id='data-collection' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                3. Categories of Personal Data Collected
              </h2>

              <div id='types-of-data' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  3.1 Types of Personal Data Collected
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Filesure collects and processes various categories of Personal
                  Data in connection with the provision of its Services. The
                  primary sources and types of data include, but are not limited
                  to, the following:
                </p>

                {/* Detailed breakdown */}

                <ul className='space-y-4 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>
                      Data obtained from the Ministry of Corporate Affairs (MCA)
                      portals:
                    </strong>
                    <ul className='ml-6 mt-2 list-disc space-y-1'>
                      <li>
                        Master data relating to Companies as defined in clause
                        1.3.8.
                      </li>
                      <li>Director data associated with such Companies.</li>
                      <li>Charges data registered against such Companies.</li>
                      <li>Public filings submitted by such Companies.</li>
                      <li>
                        Annual e-filings data accessed from both MCA V2 and V3
                        portals.
                      </li>
                    </ul>
                  </li>

                  <li className='mt-3'>
                    <strong>
                      Data obtained from the Goods and Services Tax (GST)
                      portal:
                    </strong>
                    <ul className='ml-6 mt-2 list-disc space-y-1'>
                      <li>
                        GST registration details and GST filings data accessed
                        via Application Programming Interface (API) provided
                        through an authorized GST Suvidha Provider (GSP).
                      </li>
                    </ul>
                  </li>

                  <li className='mt-3'>
                    <strong>Publicly available data on directors:</strong>
                    <ul className='ml-6 mt-2 list-disc space-y-1'>
                      <li>
                        Contact details such as mobile phone numbers and email
                        addresses sourced from publicly accessible information
                        on the internet, which Filesure processes and may
                        commercialize.
                      </li>
                    </ul>
                  </li>

                  <li className='mt-3'>
                    <strong>User-provided data:</strong>
                    <ul className='ml-6 mt-2 list-disc space-y-1'>
                      <li>
                        Personal data collected when users log into Filesure,
                        including name, photograph, email address, and mobile
                        phone number.
                      </li>
                      <li>Filesure does not collect residential addresses.</li>
                      <li>
                        Users may also log in via third-party providers such as
                        Google, and personal data shared through such
                        third-party authentication mechanisms are collected and
                        processed.
                      </li>
                    </ul>
                  </li>

                  <li className='mt-3'>
                    <strong>Website interaction data:</strong>
                    <ul className='ml-6 mt-2 list-disc space-y-1'>
                      <li>
                        Technical information such as IP addresses, browser
                        details, device identifiers, and usage data
                        automatically collected via cookies and similar tracking
                        technologies during user interaction with Filesure's
                        platform.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div id='data-sources' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  3.2 Data Sources
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm '>
                  <li>
                    Filesure primarily obtains corporate and director-related
                    data from official MCA portals (V2 and V3), covering all
                    Companies as defined in clause 1.3.8, ensuring compliance
                    with applicable legal frameworks governing data access and
                    use.
                  </li>
                  <li>
                    GST registration and filing data is sourced from the GST
                    portal via APIs provided by authorized GST Suvidha Providers
                    (GSPs) in accordance with applicable laws and agreements.
                  </li>
                  <li>
                    Additional contact details of directors, including mobile
                    and email information, are sourced from publicly available
                    data on the internet, which Filesure aggregates and
                    processes.
                  </li>
                  <li>
                    User-related personal data is collected directly from users
                    during account registration, login, or interaction with
                    Filesure’s Services, including through third-party
                    authentication providers.
                  </li>
                </ul>
              </div>
            </section>

            <section id='data-processing' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                4. Purposes of Data Processing
              </h2>

              <div id='mca-data-use' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  4.1 Use of Data Sourced from MCA Portals
                </h3>

                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure processes data obtained from the Ministry of
                    Corporate Affairs (“MCA”) portals (V2 and V3) solely for
                    legitimate business purposes, including but not limited to
                    providing comprehensive corporate information, director
                    details, and statutory filings related to Companies as
                    defined in clause 1.3.8.
                  </li>
                  <li>
                    All MCA data processing activities are conducted in strict
                    compliance with the terms and conditions governing the use
                    of MCA portals, applicable Indian laws, and regulatory
                    guidelines. Filesure does not use MCA data beyond the scope
                    authorized by such terms.
                  </li>
                  <li>
                    Filesure commits to regularly synchronize with MCA portals
                    to ensure that data reflected on its platform is up-to-date
                    and accurate to the extent possible. However, Filesure
                    explicitly disclaims liability for any inaccuracies,
                    omissions, or delays in data updates originating from MCA
                    sources.
                  </li>
                  <li>
                    Filesure restricts the use of MCA data to the provision of
                    services facilitating due diligence, compliance
                    verification, business research, and other authorized
                    purposes. Redistribution, resale, or unauthorized commercial
                    exploitation of MCA data is conducted only within the limits
                    permitted by law and applicable agreements.
                  </li>
                </ul>
              </div>

              <div id='director-data-use' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.2 Use of Publicly Available Director Contact Data
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure collects and commercializes director contact
                    details, including mobile phone numbers and email addresses,
                    sourced from publicly accessible internet resources. Such
                    processing is undertaken in compliance with applicable data
                    protection laws and ethical standards.
                  </li>
                  <li>
                    Filesure ensures that any marketing communications or data
                    commercialization activities are conducted only after
                    obtaining necessary consents where required and provide
                    recipients with mechanisms to opt-out.
                  </li>
                </ul>
              </div>

              <div id='user-authentication' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.3 User Data and Authentication
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure processes user-provided personal data, including
                    login credentials and profile information, to enable user
                    authentication, access management, and customer support.
                  </li>
                  <li>
                    Third-party authentication providers, such as Google, may
                    share limited personal data with Filesure pursuant to user
                    consent during login.
                  </li>
                </ul>
              </div>
              <div id='security-integrity' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.4 Data Security and Integrity
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure employs industry-standard security measures to
                    safeguard the integrity, confidentiality, and availability
                    of data obtained from MCA portals, users, and other sources
                    against unauthorized access, alteration, or disclosure.
                  </li>
                </ul>
              </div>
              <div id='compliance-and-legal-obligations' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.5 Compliance and Legal Obligations
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure processes Personal Data as required to comply with
                    applicable laws, regulations, and lawful governmental
                    requests.
                  </li>
                  <li>
                    Filesure reserves the right to update or modify its data
                    processing purposes consistent with changes in legal or
                    regulatory requirements, providing transparency to users as
                    required.
                  </li>
                </ul>
              </div>
            </section>

            <section id='data-accuracy' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                5. Data Accuracy and Update Limitations
              </h2>
              <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                <li>
                  Filesure obtains personal data from external sources,
                  including the Ministry of Corporate Affairs (“MCA”) portals
                  (V2 and V3) and other authorized repositories, and processes
                  such data in accordance with this Privacy Policy.
                </li>
                <li>
                  Filesure makes reasonable and good faith efforts to ensure
                  that the data displayed on its platform is accurate and
                  current to the best extent technically and legally feasible.
                </li>
                <li>
                  Notwithstanding such efforts, Filesure does not warrant,
                  guarantee, or represent, either expressly or impliedly, that
                  the data provided through its Services is, at all times,
                  accurate, complete, error-free, or up to date.
                </li>
                <li>
                  Users acknowledge and agree that Filesure’s ability to update
                  and synchronize data depends substantially on the
                  availability, performance, and reliability of third-party
                  systems, including but not limited to MCA portals, over which
                  Filesure has no control.
                </li>
                <li>
                  Consequently, Filesure expressly disclaims any liability for
                  any errors, omissions, delays, or inaccuracies in data updates
                  arising from external technical failures, system outages,
                  network issues, or any other circumstances beyond its
                  reasonable control.
                </li>
                <li>
                  Users expressly assume full responsibility and risk for any
                  use of or reliance upon the data provided by Filesure,
                  including but not limited to any decisions or actions taken
                  based on such data.
                </li>
                <li>
                  Filesure does not undertake any obligation to update or
                  correct data continuously and disclaims liability for any
                  damages, losses, or expenses incurred as a result of outdated
                  or incorrect information.
                </li>
                <li>
                  Nothing in this Privacy Policy shall be construed as creating
                  a warranty or representation by Filesure regarding the
                  accuracy, completeness, or timeliness of data, nor as a waiver
                  of any statutory rights or defenses available to Filesure
                  under applicable laws.
                </li>
                <li>
                  Users are strongly advised to verify any critical data or
                  information directly with official MCA portals or other
                  authoritative sources prior to relying on such data for legal,
                  financial, or business decisions.
                </li>
              </ul>
            </section>

            <section id='legal-basis' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                6. Legal Basis for Data Processing
              </h2>

              <div id='compliance' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  6.1 Compliance with Laws
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure processes Personal Data in strict compliance with
                    the Digital Personal Data Protection Act, 2023 ("DPDPA"),
                    the Information Technology Act, 2000, and all other
                    applicable data protection laws in India.
                  </li>
                </ul>
              </div>

              <div id='legal-bases' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.2 Legal Bases for Processing
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Filesure processes Personal Data based on the following legal
                  bases, as applicable:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>Publicly Available Data:</strong> Filesure collects
                    and processes personal data that is lawfully available in
                    the public domain, including data accessible via Ministry of
                    Corporate Affairs ("MCA") portals and other authorized
                    government sources, without requiring explicit consent of
                    the Data Principal, in accordance with applicable laws.
                  </li>
                  <li>
                    <strong>Consent:</strong> Where required by law or contract,
                    Filesure obtains explicit, informed, and unambiguous consent
                    from the Data Principal prior to processing Personal Data
                    for specific purposes, including but not limited to
                    marketing communications and commercialization activities.
                  </li>
                  <li>
                    <strong>Contractual Necessity:</strong> Processing of
                    Personal Data is necessary for the performance of a contract
                    to which the Data Principal is a party, or to take steps at
                    the Data Principal's request before entering into a
                    contract.
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> Processing is necessary
                    to comply with legal or regulatory obligations imposed on
                    Filesure by governmental authorities or applicable laws.
                  </li>
                  <li>
                    <strong>Legitimate Interests:</strong> Processing is
                    necessary for Filesure's legitimate interests or those of
                    third parties, provided that such interests do not override
                    the fundamental rights and freedoms of the Data Principal.
                    Filesure applies a balancing test to ensure proportionality
                    and fairness in such processing.
                  </li>
                </ul>
              </div>

              <div id='documentation' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.3 Documentation and Compliance Records
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure documents its legal bases for processing and
                    maintains records to demonstrate compliance with applicable
                    laws and accountability obligations.
                  </li>
                </ul>
              </div>

              <div id='user-acknowledgment' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.4 User Acknowledgment
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Users acknowledge that the legal basis for processing varies
                    depending on the data category and purpose, and that not all
                    Personal Data processing requires explicit consent under
                    applicable laws.
                  </li>
                </ul>
              </div>
            </section>

            <section id='data-retention' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                7. Data Retention Period
              </h2>
              <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                <li>
                  Filesure shall retain Personal Data only for as long as
                  reasonably necessary to fulfill the purposes for which it was
                  collected, including to comply with legal, regulatory, and
                  contractual obligations.
                </li>
                <li>
                  Retention periods vary depending on the category of Personal
                  Data, the nature of the Services provided, and applicable
                  statutory or regulatory requirements.
                </li>
                <li>
                  Filesure undertakes periodic reviews of stored Personal Data
                  and shall securely delete, anonymize, or otherwise render such
                  data irrecoverable once it is no longer necessary for the
                  purposes stated herein or required by law.
                </li>
                <li>
                  Notwithstanding the foregoing, Filesure may retain Personal
                  Data beyond the applicable retention period where necessary to
                  comply with ongoing legal proceedings, investigations,
                  disputes, or enforcement actions.
                </li>
                <li>
                  Users acknowledge and agree that Filesure’s data retention
                  practices are designed to comply with applicable laws and that
                  Filesure shall not be liable for any damages arising from such
                  retention or deletion policies implemented in good faith.
                </li>
              </ul>
            </section>

            <section id='data-sharing' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                8. Data Sharing and Disclosure
              </h2>

              <div id='sharing-circumstances' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  8.1 Circumstances for Sharing Personal Data
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Filesure may share Personal Data collected in connection with
                  its Services only in the following circumstances and subject
                  to applicable legal and contractual safeguards:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>With Service Providers:</strong> Filesure may
                    disclose Personal Data to trusted third-party service
                    providers, contractors, or agents engaged to perform
                    functions on its behalf, including but not limited to data
                    hosting, IT services, payment processing, customer support,
                    and marketing. Such parties are contractually obligated to
                    process Personal Data solely in accordance with Filesure's
                    instructions and applicable data protection laws.
                  </li>
                  <li>
                    <strong>With Business Partners:</strong> Filesure may share
                    aggregated, anonymized, or de-identified data with business
                    partners for research, analytics, or service improvement
                    purposes, provided that such data does not identify any
                    individual Data Principal.
                  </li>
                  <li>
                    <strong>As Required by Law:</strong> Filesure may disclose
                    Personal Data in response to lawful requests, subpoenas,
                    court orders, or other legal processes issued by competent
                    authorities, or to protect its legal rights, safety, or
                    property.
                  </li>
                  <li>
                    <strong>With Consent:</strong> Filesure may share Personal
                    Data with third parties where the Data Principal has
                    provided explicit consent for such sharing.
                  </li>
                </ul>
              </div>

              <div id='third-party-due-diligence' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.2 Third-Party Due Diligence
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure maintains due diligence procedures to ensure that
                    any third parties receiving Personal Data implement
                    appropriate technical, organizational, and contractual
                    measures to safeguard the data and comply with applicable
                    privacy and security standards.
                  </li>
                </ul>
              </div>

              <div id='data-sale-restrictions' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.3 Restrictions on Data Sales
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure shall not sell, rent, or trade Personal Data to
                    unauthorized third parties.
                  </li>
                </ul>
              </div>

              <div id='security-acknowledgment' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.4 Security Acknowledgment
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Users acknowledge that despite reasonable security measures,
                    Filesure cannot guarantee absolute security of data
                    transmitted to third parties and agrees to hold Filesure
                    harmless for any unauthorized access or data breach
                    occurring beyond its reasonable control.
                  </li>
                </ul>
              </div>
            </section>

            <section id='data-security' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                9. Data Security Measures
              </h2>

              <div id='security-implementation' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  9.1 Security Implementation
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure implements and maintains reasonable technical,
                    administrative, and organizational safeguards designed to
                    protect Personal Data against unauthorized access,
                    disclosure, alteration, destruction, or loss.
                  </li>
                </ul>
              </div>

              <div id='security-measures' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  9.2 Security Measures
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Such security measures include, but are not limited to:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>Encryption:</strong> Encryption of Personal Data
                    both in transit and at rest, where applicable.
                  </li>
                  <li>
                    <strong>Access Controls:</strong> Secure access controls,
                    including role-based permissions and multi-factor
                    authentication.
                  </li>
                  <li>
                    <strong>Security Audits:</strong> Regular security audits,
                    vulnerability assessments, and penetration testing.
                  </li>
                  <li>
                    <strong>Employee Training:</strong> Employee training and
                    awareness programs focused on data privacy and security best
                    practices.
                  </li>
                  <li>
                    <strong>Incident Response:</strong> Incident response
                    procedures to promptly address and mitigate any data
                    security breaches.
                  </li>
                </ul>
              </div>

              <div id='third-party-security' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  9.3 Third-Party Security Requirements
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure requires all third-party service providers and
                    partners who process Personal Data on its behalf to
                    implement adequate security measures consistent with
                    industry standards and applicable laws.
                  </li>
                </ul>
              </div>

              <div id='security-disclaimer' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  9.4 Security Limitations
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Despite these efforts, Filesure cannot guarantee absolute
                    security of Personal Data and disclaims liability for
                    unauthorized access or breaches resulting from factors
                    beyond its reasonable control.
                  </li>
                </ul>
              </div>
            </section>

            <section id='user-rights' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                10. User Rights Under the DPDPA
              </h2>

              <div id='rights-overview' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  10.1 Available Rights
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  In accordance with the Digital Personal Data Protection Act,
                  2023 ("DPDPA") and other applicable laws, Data Principals
                  ("Users") are entitled to exercise the following rights with
                  respect to their Personal Data processed by Filesure:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>Right to Access:</strong> Users have the right to
                    obtain confirmation of whether their Personal Data is being
                    processed and to request access to such data.
                  </li>
                  <li>
                    <strong>Right to Correction:</strong> Users may request
                    correction or rectification of inaccurate, incomplete, or
                    outdated Personal Data.
                  </li>
                  <li>
                    <strong>Right to Erasure:</strong> Users have the right to
                    request deletion or removal of their Personal Data, subject
                    to applicable legal obligations or legitimate grounds for
                    retention.
                  </li>
                  <li>
                    <strong> Right to Data Portability:</strong> Users may
                    request to receive their Personal Data in a structured,
                    commonly used, and machine-readable format for transmission
                    to another Data Fiduciary.
                  </li>
                  <li>
                    <strong>Right to Withdraw Consent:</strong> Where processing
                    is based on consent, Users may withdraw such consent at any
                    time without affecting the lawfulness of processing based on
                    consent before its withdrawal.
                  </li>
                  <li>
                    <strong> Right to Object:</strong> Users may object to the
                    processing of their Personal Data on grounds relating to
                    their particular situation, including for direct marketing
                    purposes.
                  </li>
                  <li>
                    <strong>Right to Restrict Processing:</strong> Users may
                    request limitation of processing of their Personal Data
                    under certain circumstances as prescribed by law.
                  </li>
                </ul>
              </div>

              <div id='exercising-rights' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  10.2 Process for Exercising Rights
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    To exercise any of these rights, Users may contact
                    Filesure's Data Protection Officer using the contact details
                    provided in Section 2 of this Policy.
                  </li>
                </ul>
              </div>

              <div id='response-timeline' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  10.3 Response Timeline
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure shall respond to such requests promptly and within
                    the timelines prescribed under applicable laws, subject to
                    verification of identity and the applicability of exemptions
                    or restrictions under the law.
                  </li>
                </ul>
              </div>

              <div id='request-limitations' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  10.4 Request Limitations
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure reserves the right to refuse or limit requests that
                    are manifestly unfounded, excessive, or repetitive, in
                    accordance with applicable legal provisions.
                  </li>
                </ul>
              </div>

              <div id='rights-limitations' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  10.5 Legal Limitations
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Users acknowledge that certain rights may be subject to
                    limitations or exceptions under law, including where
                    retention or processing is necessary for compliance with
                    legal obligations or the establishment, exercise, or defense
                    of legal claims.
                  </li>
                </ul>
              </div>
            </section>

            <section id='grievance-redressal' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                11. Grievance Redressal Mechanism
              </h2>

              <div id='commitment' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  11.1 Commitment to Addressing Concerns
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure is committed to addressing all concerns,
                    complaints, or grievances raised by Data Principals
                    ("Users") relating to the processing of their Personal Data
                    in a fair, transparent, and timely manner.
                  </li>
                </ul>
              </div>

              <div id='submission-process' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.2 Grievance Submission Process
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Users may submit grievances or complaints by contacting
                    Filesure's designated Data Protection Officer ("DPO") at the
                    contact details provided in Section 2 of this Policy.
                  </li>
                </ul>
              </div>

              <div id='acknowledgment' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.3 Acknowledgment Timeline
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Upon receipt of a grievance, Filesure shall acknowledge the
                    complaint within seven (7) business days and undertake a
                    thorough investigation to address the issue.
                  </li>
                </ul>
              </div>

              <div id='resolution-timeline' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.4 Resolution Timeline
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure aims to resolve grievances expeditiously and,
                    wherever possible, within thirty (30) calendar days of
                    receipt, subject to the nature and complexity of the
                    complaint.
                  </li>
                </ul>
              </div>

              <div id='resolution-delay' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.5 Notification of Delays
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    In cases where resolution within thirty (30) calendar days
                    is not feasible, Filesure shall notify the User of the
                    delay, the reasons thereof, and the expected timeframe for
                    resolution.
                  </li>
                </ul>
              </div>

              <div id='escalation' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.6 Escalation Process
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    If a User is dissatisfied with Filesure's resolution, they
                    may escalate the grievance to the Data Protection Board of
                    India or any other competent regulatory authority as
                    provided under the Digital Personal Data Protection Act,
                    2023 ("DPDPA").
                  </li>
                </ul>
              </div>

              <div id='record-keeping' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.7 Record Maintenance
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure maintains records of all grievances and the actions
                    taken in response, demonstrating accountability and
                    compliance with applicable legal requirements.
                  </li>
                </ul>
              </div>

              <div id='additional-rights' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.8 Preservation of Legal Rights
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Nothing in this section shall limit any other legal rights
                    or remedies available to Users under applicable law.
                  </li>
                </ul>
              </div>
            </section>

            <section id='international-transfers' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                12. International Data Transfers
              </h2>

              <div id='transfer-overview' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  12.1 Transfer Overview
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure may transfer Personal Data to countries outside
                    India ("International Transfers") for purposes consistent
                    with this Privacy Policy and in compliance with applicable
                    data protection laws, including the Digital Personal Data
                    Protection Act, 2023 ("DPDPA").
                  </li>
                </ul>
              </div>

              <div id='adequate-safeguards' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  12.2 Adequate Safeguards
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  International Transfers shall only occur where adequate
                  safeguards are in place to protect Personal Data, such as:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>Adequate Jurisdictions:</strong> Transfer to
                    countries or entities recognized by Indian regulators as
                    providing an adequate level of data protection.
                  </li>
                  <li>
                    <strong>Contractual Safeguards:</strong> Implementation of
                    legally binding agreements, including Standard Contractual
                    Clauses (SCCs), to ensure compliance with data protection
                    standards.
                  </li>
                  <li>
                    <strong>Other Safeguards:</strong> Other appropriate
                    safeguards approved under applicable law.
                  </li>
                </ul>
              </div>

              <div id='third-party-obligations' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  12.3 Third-Party Obligations
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure shall ensure that any third parties receiving
                    Personal Data abroad agree to uphold confidentiality and
                    security obligations consistent with this Policy and Indian
                    data protection requirements.
                  </li>
                </ul>
              </div>

              <div id='user-consent' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  12.4 User Consent
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Users acknowledge and consent to such International
                    Transfers in accordance with this Policy and applicable law.
                  </li>
                </ul>
              </div>

              <div id='protection-measures' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  12.5 Protection Measures
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure shall implement reasonable measures to protect
                    Personal Data during transfer and storage in foreign
                    jurisdictions.
                  </li>
                </ul>
              </div>
            </section>

            <section id='cookies-tracking' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                13. Cookies and Tracking Technologies
              </h2>

              <div id='cookies-purpose' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  13.1 Purpose and Utilization
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure utilizes cookies and similar tracking technologies
                    ("Cookies") on its website and Services to enhance user
                    experience, analyze usage patterns, and deliver personalized
                    content and advertisements.
                  </li>
                </ul>
              </div>

              <div id='cookies-definition' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  13.2 Definition of Cookies
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Cookies are small data files placed on a user's device that
                    store information related to browsing behavior, preferences,
                    and session details.
                  </li>
                </ul>
              </div>

              <div id='cookies-types' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  13.3 Types of Cookies
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure employs both session cookies, which expire when the
                    browser is closed, and persistent cookies, which remain on
                    the device for a defined period.
                  </li>
                </ul>
              </div>

              <div id='cookies-categories' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  13.4 Cookie Categories
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Cookies used may include:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>Essential Cookies:</strong> necessary for the
                    operation and security of the website.
                  </li>
                  <li>
                    <strong>Analytical and Performance Cookies:</strong> to
                    collect anonymous data on website usage and improve
                    functionality.
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> to remember user
                    preferences and settings.
                  </li>
                  <li>
                    <strong>Advertising and Targeting Cookies:</strong> to
                    deliver relevant marketing content and track advertising
                    effectiveness.
                  </li>
                </ul>
              </div>

              <div id='cookies-notice' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  13.5 Cookie Notice
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Users are informed at the point of first visit about the use
                    of Cookies and are provided with options to manage or
                    disable Cookies through a consent banner or settings
                    interface.
                  </li>
                </ul>
              </div>

              <div id='cookies-controls' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  13.6 User Controls
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Users may control or disable Cookies via browser settings,
                    though such actions may affect the functionality and user
                    experience of the Services.
                  </li>
                </ul>
              </div>

              <div id='cookies-compliance' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  13.7 Legal Compliance
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure ensures compliance with applicable laws governing
                    Cookies and online tracking, including obtaining consent
                    where required.
                  </li>
                </ul>
              </div>
            </section>
            <section id='children' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                14. Children's Privacy
              </h2>
              <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                <li>
                  Filesure’s Services are not directed to, nor intended for use
                  by, individuals under the age of eighteen (18) years
                  (“Children”).
                </li>
                <li>
                  Filesure does not knowingly collect, store, or process
                  Personal Data of Children without verifiable parental or
                  guardian consent, as required under applicable laws.
                </li>
                <li>
                  If Filesure becomes aware that it has inadvertently collected
                  Personal Data of a Child without such consent, it shall take
                  prompt measures to delete or anonymize such data in accordance
                  with applicable legal requirements.
                </li>
                <li>
                  Parents or guardians who believe that Filesure has collected
                  Personal Data of a Child without appropriate consent may
                  contact Filesure’s Data Protection Officer as specified in
                  Section 2 to request deletion or exercise other applicable
                  rights.
                </li>
                <li>
                  Users affirm that they are not Children or have obtained
                  necessary parental or guardian consent to use Filesure’s
                  Services.
                </li>
              </ul>
            </section>
            <section id='changes' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                15. Changes to This Policy
              </h2>
              <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                <li>
                  Filesure reserves the right to modify, amend, or update this
                  Privacy Policy at any time in its sole discretion to reflect
                  changes in legal, regulatory, operational, or technological
                  developments.
                </li>
                <li>
                  Material changes to this Privacy Policy will be communicated
                  to Users via prominent notices on Filesure’s website, email
                  notifications, or other effective communication channels prior
                  to the implementation of such changes, where feasible.
                </li>
                <li>
                  Continued use of Filesure’s Services following the posting or
                  notification of any updated Privacy Policy constitutes
                  acceptance of the changes.
                </li>
                <li>
                  Users are encouraged to review this Privacy Policy
                  periodically to stay informed about how Filesure collects,
                  uses, and protects Personal Data.
                </li>
                <li>
                  If Users do not agree to the updated Privacy Policy, they
                  should discontinue use of the Services and may contact
                  Filesure’s Data Protection Officer to address any concerns.
                </li>
              </ul>
            </section>

            <section id='contact-info' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                16. Contact Information
              </h2>

              <div id='dpo-contact' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold md:text-lg'>
                  16.1 Data Protection Officer Contact Details
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  For any questions, concerns, or requests regarding this
                  Privacy Policy or Filesure's data processing practices, Data
                  Principals ("Users") may contact the designated Data
                  Protection Officer ("DPO") at:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>Email:</strong> dpo@filesure.in
                  </li>
                  <li>
                    <strong>Phone:</strong> +91 8104946419
                  </li>
                  <li>
                    <strong>Postal Address:</strong> Data Protection Officer,
                    FileSure India Private Limited, 6th Floor, Rahimtoola House,
                    Homji Street, Near Horniman Circle, Fort, Mumbai,
                    Maharashtra - 400001, India
                  </li>
                </ul>
              </div>

              <div id='response-commitment' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  16.2 Response Commitment
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Filesure is committed to addressing all communications
                    promptly, professionally, and in accordance with applicable
                    data protection laws.
                  </li>
                </ul>
              </div>

              <div id='encouragement' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  16.3 Encouragement to Contact
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Users are encouraged to use these contact channels to
                    exercise their data protection rights, report concerns, or
                    seek further information about their Personal Data.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
