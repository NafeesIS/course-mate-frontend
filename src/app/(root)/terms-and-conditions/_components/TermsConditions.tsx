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
      { id: 'overview', title: '1.1 Overview' },
      { id: 'acceptance-of-terms', title: '1.2 Acceptance of Terms' },
      { id: 'modification-of-terms', title: '1.3 Modification of Terms' },
    ],
  },
  { id: 'definitions', title: '2. Definitions' },
  {
    id: 'eligibility',
    title: '3. Eligibility',
    subItems: [
      { id: 'user-eligibility', title: '3.1 User Eligibility' },
      { id: 'account-registration', title: '3.2 Account Registration' },
    ],
  },
  {
    id: 'user-accounts',
    title: '4. User Accounts',
    subItems: [
      { id: 'account-security', title: '4.1 Account Security' },
      { id: 'user-responsibilities', title: '4.2 User Responsibilities' },
      { id: 'account-termination', title: '4.3 Account Termination' },
    ],
  },
  {
    id: 'use-of-services',
    title: '5. Use of Services',
    subItems: [
      { id: 'permitted-use', title: '5.1 Permitted Use' },
      { id: 'prohibited-conduct', title: '5.2 Prohibited Conduct' },
      {
        id: 'intellectual-property-rights',
        title: '5.3 Intellectual Property Rights',
      },
      { id: 'user-content', title: '5.4 User Content' },
    ],
  },
  {
    id: 'access-and-availability',
    title: '6. Access and Availability',
    subItems: [
      { id: 'service-availability', title: '6.1 Service Availability' },
      {
        id: 'interruptions-and-maintenance',
        title: '6.2 Interruptions and Maintenance',
      },
      {
        id: 'third-party-links',
        title: '6.3 Third-Party Links and Services',
      },
    ],
  },
  {
    id: 'data-accuracy-and-updates',
    title: '7. Data Accuracy and Updates',
    subItems: [
      { id: 'source-of-data', title: '7.1 Source of Data' },
      { id: 'no-warranty-on-accuracy', title: '7.2 No Warranty on Accuracy' },
      {
        id: 'user-responsibility-for-verification',
        title: '7.3 User Responsibility for Verification',
      },
    ],
  },
  {
    id: 'payment-terms',
    title: '8. Payment Terms',
    subItems: [
      { id: 'fees-and-charges', title: '8.1 Fees and Charges' },
      { id: 'payment-methods', title: '8.2 Payment Methods' },
      { id: 'refunds', title: '8.3 Refunds' },
      {
        id: 'suspension-for-non-payment',
        title: '8.4 Suspension for Non-Payment',
      },
    ],
  },
  {
    id: 'intellectual-property',
    title: '9. Intellectual Property',
    subItems: [
      { id: 'ownership', title: '9.1 Ownership' },
      { id: 'license-grant-to-users', title: '9.2 License Grant to Users' },
      { id: 'restrictions', title: '9.3 Restrictions' },
    ],
  },
  {
    id: 'privacy-and-data-protection',
    title: '10. Privacy and Data Protection',
    subItems: [
      {
        id: 'reference-to-privacy-policy',
        title: '10.1 Reference to Privacy Policy',
      },
      {
        id: 'user-consent-for-data-processing',
        title: '10.2 User Consent for Data Processing',
      },
      { id: 'compliance-with-laws', title: '10.3 Compliance with Laws' },
    ],
  },
  {
    id: 'disclaimers-and-limitation-of-liability',
    title: '11. Disclaimers and Limitation of Liability',
    subItems: [
      { id: 'no-warranty', title: '11.1 No Warranty' },
      { id: 'limitation-of-liability', title: '11.2 Limitation of Liability' },
      { id: 'indemnification', title: '11.3 Indemnification' },
    ],
  },
  {
    id: 'termination-and-suspension',
    title: '12. Termination and Suspension',
    subItems: [
      { id: 'grounds-for-termination', title: '12.1 Grounds for Termination' },
      { id: 'effects-of-termination', title: '12.2 Effects of Termination' },
    ],
  },
  {
    id: 'governing-law-and-dispute-resolution',
    title: '13. Governing Law and Dispute Resolution',
    subItems: [
      { id: 'governing-law', title: '13.1 Governing Law' },
      { id: 'dispute-resolution', title: '13.2 Dispute Resolution' },
      { id: 'arbitration-mediation', title: '13.3 Arbitration/Mediation' },
    ],
  },
  {
    id: 'miscellaneous',
    title: '14. Miscellaneous',
    subItems: [
      { id: 'force-majeure', title: '14.1 Force Majeure' },
      { id: 'entire-agreement', title: '14.2 Entire Agreement' },
      { id: 'severability', title: '14.3 Severability' },
      { id: 'waiver', title: '14.4 Waiver' },
      { id: 'assignment', title: '14.5 Assignment' },
    ],
  },
  { id: 'contact-information', title: '15. Contact Information' },
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
                    className={`ml-1 transform transition-transform duration-300 ${isExpanded ? 'rotate-[90deg]' : ''}`}
                  >
                    ▸
                  </span>
                )}
              </p>

              {item.subItems && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
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

const TermsConditions = () => {
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
        className={`left-0 right-0 ${isScrolled ? 'fixed top-14' : 'top-32'} z-50 border-b bg-white shadow-sm md:hidden`}
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
          Terms & Conditions
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
                  1.1 Overview
                </h3>
                <div className='mb-4 text-xs text-gray-600  md:text-sm'>
                  These Terms of Use ("Terms") constitute a legally binding
                  agreement between you ("User," "you," or "your") and FileSure
                  India Private Limited ("Filesure," "we," "us," or "our"),
                  governing your access to and use of Filesure's website, mobile
                  applications, and the suite of services we provide, including
                  but not limited to:
                  <ul className='my-2 ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                    <li>
                      Business services facilitated through our network of
                      partner Chartered Accountants (CAs) and Company
                      Secretaries (CSs), such as company incorporation and
                      annual compliance;
                    </li>
                    <li>
                      Data services, including single and bulk unlocks providing
                      contact information of company directors, and delivery of
                      daily alerts with data on newly registered companies;
                    </li>
                    <li>
                      Public documents services, offering automated access to
                      Ministry of Corporate Affairs (MCA) V2 and V3 portal
                      documents, financial statements, LLP filings, GST filings,
                      and compliance data, sold on a per-company basis.
                    </li>
                  </ul>
                  By accessing or using any part of the Services, you expressly
                  agree to be bound by these Terms, our Privacy Policy, and any
                  other relevant policies incorporated herein by reference.
                </div>
              </div>

              <div id='acceptance-of-terms' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  1.2 Acceptance of Terms
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Your use of the Services signifies your acknowledgment that
                  you have read, understood, and consented to comply with these
                  Terms in their entirety. If you do not agree with any part of
                  these Terms, you must immediately discontinue use of the
                  Services.
                </p>
              </div>

              <div id='modification-of-terms' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  1.3 Modification of Terms
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure reserves the right to amend, modify, or update these
                  Terms at any time and without prior notice. Material changes
                  shall be communicated to Users via conspicuous notice on the
                  Services or by direct communication where feasible. Continued
                  use of the Services following notification of such changes
                  constitutes your acceptance of the updated Terms. It is your
                  responsibility to review these Terms periodically to stay
                  informed of any changes.
                </p>
              </div>
            </section>

            <section id='definitions' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                2. Definitions
              </h2>
              <div className='space-y-3'>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.1 "User"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means any individual or entity who accesses or uses the
                    Services provided by Filesure and agrees to be bound by
                    these Terms.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.2 "Services"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means the suite of offerings provided by Filesure, including
                    but not limited to Business Services facilitated by partner
                    Chartered Accountants (CAs) and Company Secretaries (CSs),
                    Data Services such as single and bulk unlocks and new
                    company alerts, and Public Document Services providing
                    access to MCA and GST filings and related corporate data.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.3 "Business Services"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means compliance and incorporation-related services
                    delivered exclusively through Filesure's authorized partners
                    (CAs and CSs).
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.4 "Data Services"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means digital products and services involving access to
                    director contact information, bulk data unlocks, new company
                    alerts, and similar offerings.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.5 "Public Document Services"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means automated access, download, and sale of official
                    documents from Ministry of Corporate Affairs portals (V2 and
                    V3), GST filings, compliance data, and related information.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.6 "Account"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means a registered user profile created on Filesure's
                    platform allowing access to certain Services.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.7 "Partner"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means any authorized third party, including Chartered
                    Accountants, Company Secretaries, or other service
                    providers, who deliver Business Services via Filesure's
                    platform.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.8 "Payment"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means any fees, charges, or other monetary consideration
                    paid by the User for accessing paid Services.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.9 "Terms"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means these Terms of Use, including any amendments or
                    related policies incorporated by reference.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.10 "Privacy Policy"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means Filesure's policy governing the collection, use, and
                    protection of Personal Data.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.11 "Personal Data"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means any information relating to an identified or
                    identifiable natural person as defined under applicable data
                    protection laws, including but not limited to names, contact
                    information, identification numbers, and online identifiers.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.12 "Intellectual Property Rights" or "IPR"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means all copyrights, trademarks, patents, trade secrets,
                    database rights, and other proprietary rights in any content
                    or technology provided through the Services.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.13 "Third-Party Services"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means websites, portals, or services owned or operated by
                    entities other than Filesure, including MCA, GST portals,
                    and partner platforms.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.14 "Force Majeure"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means events beyond Filesure's reasonable control, including
                    natural disasters, war, terrorism, government actions, labor
                    disputes, or technical failures impacting service delivery.
                  </p>
                </div>
              </div>
            </section>

            <section id='eligibility' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                3. Eligibility
              </h2>
              <div id='user-eligibility' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  3.1 User Eligibility
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  The Services are intended solely for individuals or entities
                  who are legally competent to enter into binding contracts
                  under applicable law and who satisfy the eligibility criteria
                  established by Filesure.
                </p>
                <div className='text-xs text-gray-600 md:text-sm'>
                  By accessing or using the Services, you represent and warrant
                  that you:
                  <ul className='ml-6 mt-2 list-disc space-y-2 text-xs text-gray-600 md:text-sm'>
                    <li>
                      Are at least eighteen (18) years of age or have reached
                      the age of majority in your jurisdiction;
                    </li>
                    <li>
                      Have the legal capacity and authority to enter into and be
                      bound by these Terms;
                    </li>
                    <li>
                      Are not prohibited or restricted by any applicable law,
                      regulation, or order from using the Services; and
                    </li>
                    <li>
                      If accessing Business Services through Filesure's
                      platform, acknowledge that such services are provided
                      exclusively by our registered partners (such as Chartered
                      Accountants and Company Secretaries), and you will engage
                      with such partners in accordance with applicable
                      professional and regulatory standards.
                    </li>
                  </ul>
                </div>
              </div>

              <div id='account-registration' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  3.2 Account Registration
                </h3>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Certain features or services, including access to Data
                    Services like single and bulk unlocks or new company alerts,
                    require you to register or create an account with Filesure.
                  </li>
                  <li>
                    When registering, you agree to provide true, accurate,
                    current, and complete information about yourself as
                    required, and to maintain and promptly update this
                    information to keep it accurate and complete.
                  </li>
                  <li>
                    Filesure reserves the right, at its sole discretion, to
                    refuse registration, terminate accounts, or restrict access
                    to the Services where eligibility criteria are not met,
                    information provided is false or misleading, or for any
                    violation of these Terms.
                  </li>
                </ul>
              </div>
            </section>

            <section id='user-accounts' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                4. User Accounts
              </h2>
              <div id='account-security' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.1 Account Security
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  You are solely responsible for maintaining the confidentiality
                  and security of your account credentials, including usernames,
                  passwords, and any multi-factor authentication methods. You
                  agree to immediately notify Filesure of any unauthorized use,
                  suspected breach, or loss of your account information.
                  Filesure shall not be liable for any damages or losses arising
                  from your failure to safeguard your account.
                </p>
              </div>

              <div id='user-responsibilities' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.2 User Responsibilities
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  You shall not share your account credentials or permit others
                  to access or use your account. You agree to use your account
                  solely in compliance with applicable laws, these Terms, and
                  any applicable professional standards when accessing Business
                  Services via Filesure's partner network. You are responsible
                  for all activities conducted under your account.
                </p>
              </div>

              <div id='account-termination' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.3 Account Termination
                </h3>
                <div className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Filesure reserves the right to suspend, restrict, or terminate
                  your account and access to the Services at its sole
                  discretion, including but not limited to instances of:
                  <ul className='ml-6 mt-2 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                    <li>Violation of these Terms;</li>
                    <li>Fraudulent, abusive, or unlawful conduct;</li>
                    <li>Non-payment of fees for paid services;</li>
                    <li>Prolonged inactivity or security concerns.</li>
                  </ul>
                </div>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Upon termination or suspension, your right to access the
                  Services will cease immediately. Filesure may retain or delete
                  data associated with your account consistent with its data
                  retention and privacy policies.
                </p>
              </div>
            </section>

            <section id='use-of-services' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                5. Use of Services
              </h2>
              <div id='permitted-use' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  5.1 Permitted Use
                </h3>
                <div className='mb-3 text-xs text-gray-600  md:text-sm'>
                  You agree to use the Services solely for lawful purposes and
                  in accordance with these Terms. You shall not use the Services
                  to:
                  <ul className='ml-6 mt-2 list-disc space-y-2 text-xs text-gray-600 md:text-sm'>
                    <li>
                      Violate any applicable laws, regulations, or third-party
                      rights;
                    </li>
                    <li>
                      Engage in any fraudulent, deceptive, or unlawful conduct;
                    </li>
                    <li>
                      Transmit any material that is defamatory, obscene,
                      offensive, or otherwise objectionable;
                    </li>
                    <li>
                      Interfere with or disrupt the integrity, availability, or
                      performance of the Services, including automated data
                      downloads or extraction processes;
                    </li>
                    <li>
                      Attempt to gain unauthorized access to any portion of the
                      Services, other accounts, computer systems, or networks
                      connected to the Services.
                    </li>
                  </ul>
                </div>
              </div>

              <div id='prohibited-conduct' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  5.2 Prohibited Conduct
                </h3>
                <div className='mb-3 text-xs text-gray-600  md:text-sm'>
                  You shall not:
                  <ul className='ml-6 mt-2 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                    <li>
                      Use automated means, such as bots, scrapers, or crawlers,
                      to extract data from Filesure's platform or its MCA
                      document download processes without prior written
                      authorization;
                    </li>
                    <li>
                      Reproduce, duplicate, copy, sell, trade, resell,
                      sublicense, or otherwise commercially exploit any portion
                      of the Services, including director contact information,
                      compliance data, or public documents, without express
                      authorization;
                    </li>
                    <li>
                      Use the Services to transmit viruses, malware, or other
                      harmful code;
                    </li>
                    <li>
                      Engage in any conduct that could harm Filesure, its users,
                      partners (such as CA/CS professionals), or third parties.
                    </li>
                  </ul>
                </div>
              </div>

              <div id='intellectual-property-rights' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  5.3 Intellectual Property Rights
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  All content, trademarks, logos, software, databases, and
                  materials provided through the Services, including data
                  extracted from MCA portals, GST filings, and compliance
                  information, are owned by or licensed to Filesure and
                  protected by applicable intellectual property laws. Your use
                  of the Services does not grant you any ownership rights in
                  such materials.
                </p>
              </div>

              <div id='user-content' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  5.4 User Content
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  If you submit or post any content through the Services (such
                  as reviews, feedback, or communications), you grant Filesure a
                  non-exclusive, worldwide, royalty-free, sublicensable license
                  to use, reproduce, modify, adapt, publish, translate,
                  distribute, and display such content for purposes of
                  operating, promoting, and improving the Services. You
                  represent and warrant that you have all necessary rights to
                  grant this license and that your content does not infringe any
                  third-party rights.
                </p>
              </div>
            </section>

            <section id='access-and-availability' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                6. Access and Availability
              </h2>
              <div id='service-availability' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.1 Service Availability
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure strives to ensure continuous availability of the
                  Services, including access to data services such as single and
                  bulk unlocks, automated MCA V2/V3 document downloads, GST
                  filings, and business service coordination via partner CAs and
                  CSs. However, Filesure does not guarantee uninterrupted or
                  error-free access. Access may be suspended, restricted, or
                  temporarily unavailable due to scheduled maintenance,
                  technical upgrades, system failures, MCA portal outages,
                  third-party service disruptions, or other events beyond
                  Filesure's reasonable control.
                </p>
              </div>

              <div id='interruptions-and-maintenance' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.2 Interruptions and Maintenance
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure may perform scheduled or unscheduled maintenance,
                  including updates to data extraction tools and partner service
                  integrations, which could temporarily disrupt access. Whenever
                  reasonably practicable, Filesure will provide advance notice
                  of planned maintenance or interruptions via the website,
                  email, or other communication channels.
                </p>
              </div>

              <div id='third-party-links' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.3 Third-Party Links and Services
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  The Services may contain links to third-party websites,
                  including government portals like MCA and GST, or partner
                  platforms. Filesure does not own, control, or endorse these
                  third-party sites and is not responsible for their
                  availability, content, policies, or practices. Your use of
                  third-party sites is subject to their own terms and privacy
                  policies.
                </p>
              </div>
            </section>

            <section id='data-accuracy-and-updates' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                7. Data Accuracy and Updates
              </h2>
              <div id='source-of-data' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  7.1 Source of Data
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure sources its data from official government
                  repositories including, but not limited to, the Ministry of
                  Corporate Affairs ("MCA") V2 and V3 portals, Goods and
                  Services Tax (GST) portal via authorized GST Suvidha Providers
                  (GSPs), and other authorized third-party providers. The
                  Services also include data extracted and processed from
                  publicly available sources and partner contributions. While
                  Filesure endeavors to ensure that all data, including director
                  contact information, compliance status, company filings, and
                  GST data, is accurate and as current as possible, it does not
                  guarantee the completeness, accuracy, or timeliness of such
                  data due to dependencies on third-party sources and technical
                  limitations.
                </p>
              </div>

              <div id='no-warranty-on-accuracy' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  7.2 No Warranty on Accuracy
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  The Services are provided "as is," without warranties, express
                  or implied, including but not limited to warranties of
                  accuracy, reliability, completeness, or fitness for any
                  particular purpose. Filesure expressly disclaims any liability
                  for any errors, omissions, inaccuracies, or delays in updating
                  data, including compliance and GST filings, arising from the
                  original sources or technical constraints.
                </p>
              </div>

              <div id='user-responsibility-for-verification' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  7.3 User Responsibility for Verification
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  You acknowledge and agree that all information obtained
                  through the Services should be independently verified before
                  use in any legal, financial, or business decisions. Filesure
                  shall not be held responsible or liable for any damages,
                  losses, or consequences resulting from reliance on inaccurate,
                  incomplete, or outdated information.
                </p>
              </div>
            </section>

            <section id='payment-terms' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                8. Payment Terms
              </h2>
              <div id='fees-and-charges' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.1 Fees and Charges
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Certain Services or features offered by Filesure, including
                  but not limited to Data Services such as single and bulk
                  unlocks, new company alerts, and Public Documents downloads,
                  may require payment of fees as specified on Filesure's
                  platform. All fees are exclusive of applicable taxes unless
                  otherwise stated. Filesure reserves the right to modify fees
                  or introduce new charges upon providing prior notice through
                  the platform or other communication channels.
                </p>
              </div>

              <div id='payment-methods' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.2 Payment Methods
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Payments for paid Services shall be made via authorized
                  payment gateways or methods offered on Filesure's platform.
                  You agree to provide accurate, complete, and current payment
                  information and authorize Filesure to charge the applicable
                  fees in accordance with your selections.
                </p>
              </div>

              <div id='refunds' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.3 Refunds
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Refunds, if any, shall be governed exclusively by Filesure's
                  separate Refund Policy. Users are encouraged to review the
                  Refund Policy carefully before purchasing any paid Services.
                  Any payment disputes, refund requests, or chargebacks must be
                  handled in accordance with the Refund Policy.
                </p>
              </div>

              <div id='suspension-for-non-payment' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.4 Suspension for Non-Payment
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure reserves the right to suspend, restrict, or terminate
                  access to paid Services, including data unlocks and document
                  downloads, for users who fail to make timely payments in
                  accordance with these Terms.
                </p>
              </div>
            </section>
            <section id='intellectual-property' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                9. Intellectual Property
              </h2>

              <div id='ownership' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  9.1 Ownership
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  All content, materials, trademarks, logos, software,
                  databases, and other intellectual property rights (“IPR”)
                  accessible through the Services—including but not limited to
                  director contact information, MCA and GST data extracts,
                  compliance tables, business alerts, and document downloads—are
                  owned by or licensed to Filesure. These rights are protected
                  under applicable intellectual property laws and international
                  treaties.
                </p>
              </div>

              <div id='license-grant-to-users' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  9.2 License Grant to Users
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Subject to your full compliance with these Terms, Filesure
                  grants you a limited, non-exclusive, non-transferable,
                  revocable license to access and use the Services solely for
                  your personal or internal business purposes and in accordance
                  with these Terms.
                </p>
              </div>

              <div id='restrictions' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  9.3 Restrictions
                </h3>
                <div className='text-xs text-gray-600  md:text-sm'>
                  You shall not, without Filesure’s prior written consent:
                  <ul className='ml-6 mt-2 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                    <li>
                      Reproduce, distribute, modify, create derivative works of,
                      publicly display, or commercially exploit any part of the
                      Services or content, including director contact data and
                      MCA documents;
                    </li>
                    <li>
                      Reverse engineer, decompile, disassemble, or attempt to
                      derive the source code or underlying technology of
                      Filesure’s software or automated extraction tools;
                    </li>
                    <li>
                      Remove, alter, or obscure any proprietary notices,
                      trademarks, or labels included in the Services;
                    </li>
                    <li>
                      Use the Services in any manner that infringes upon
                      third-party rights or violates applicable laws or
                      regulations.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section id='privacy-and-data-protection' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                10. Privacy and Data Protection
              </h2>

              <div id='reference-to-privacy-policy' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  10.1 Reference to Privacy Policy
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Your use of the Services is also governed by Filesure’s
                  Privacy Policy, which outlines how we collect, use, process,
                  and protect your Personal Data. By using the Services, you
                  acknowledge that you have read and understood the Privacy
                  Policy.
                </p>
              </div>

              <div id='user-consent-for-data-processing' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  10.2 User Consent for Data Processing
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  By accessing or using the Services, you expressly consent to
                  the collection, use, and processing of your Personal Data in
                  accordance with the Privacy Policy and applicable laws. You
                  agree to provide accurate information and to update it as
                  necessary to maintain its correctness.
                </p>
              </div>

              <div id='compliance-with-laws' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  10.3 Compliance with Laws
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure undertakes to comply with all applicable data
                  protection laws, including the Digital Personal Data
                  Protection Act, 2023, and related regulations. We implement
                  appropriate technical and organizational measures to safeguard
                  your Personal Data.
                </p>
              </div>
            </section>

            <section
              id='disclaimers-and-limitation-of-liability'
              className='mb-8'
            >
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                11. Disclaimers and Limitation of Liability
              </h2>

              <div id='no-warranty' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.1 No Warranty
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  The Services, including access to corporate data, director
                  contact information, public documents, and partner-facilitated
                  business services, are provided on an “as is” and “as
                  available” basis. Filesure expressly disclaims all warranties,
                  whether express or implied, including but not limited to
                  warranties of accuracy, completeness, merchantability, fitness
                  for a particular purpose, or non-infringement.
                </p>
              </div>

              <div id='limitation-of-liability' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.2 Limitation of Liability
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  To the fullest extent permitted by applicable law, Filesure,
                  its affiliates, officers, directors, employees, agents, and
                  licensors shall not be liable for any indirect, incidental,
                  consequential, special, punitive, or exemplary damages,
                  including but not limited to loss of profits, data, goodwill,
                  or business interruption, arising from or related to your use
                  of or inability to use the Services, including any errors or
                  delays in the data provided or any disruption of business
                  services.
                </p>
              </div>

              <div id='indemnification' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  11.3 Indemnification
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  You agree to indemnify, defend, and hold harmless Filesure and
                  its affiliates, officers, directors, employees, agents, and
                  licensors from and against any claims, damages, liabilities,
                  losses, costs, or expenses (including reasonable attorneys’
                  fees) arising out of or related to your breach of these Terms,
                  violation of applicable laws, or misuse of the Services.
                </p>
              </div>
            </section>
            <section id='termination-and-suspension' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                12. Termination and Suspension
              </h2>

              <div id='grounds-for-termination' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  12.1 Grounds for Termination
                </h3>
                <div className='text-xs text-gray-600  md:text-sm'>
                  Filesure reserves the right, at its sole discretion, to
                  suspend, restrict, or terminate your access to the Services,
                  including your user account, without prior notice or
                  liability, for any reason including but not limited to:
                  <ul className='ml-6 mt-2 list-disc space-y-2'>
                    <li>
                      Violation of these Terms, Privacy Policy, or any
                      applicable laws and regulations;
                    </li>
                    <li>
                      Fraudulent, abusive, or harmful conduct affecting
                      Filesure, its partners (including CA/CS professionals),
                      users, or third parties;
                    </li>
                    <li>
                      Failure to pay fees or breach of any payment obligations
                      for paid Services;
                    </li>
                    <li>
                      Security concerns, including suspected unauthorized access
                      or threats to the integrity and availability of the
                      Services;
                    </li>
                    <li>
                      Prolonged inactivity or other reasons Filesure deems
                      necessary to maintain service quality and compliance.
                    </li>
                  </ul>
                </div>
              </div>

              <div id='effects-of-termination' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  12.2 Effects of Termination
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Upon suspension or termination, your right to access and use
                  the Services shall immediately cease. Filesure may, in
                  accordance with applicable laws and its data retention
                  policies, delete, archive, or restrict access to your account
                  and any related data. Termination shall not relieve you of any
                  obligations, liabilities, or fees accrued prior to
                  termination, nor limit Filesure’s rights or remedies under law
                  or contract.
                </p>
              </div>
            </section>

            <section id='governing-law-and-dispute-resolution' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                13. Governing Law and Dispute Resolution
              </h2>

              <div id='governing-law' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  13.1 Governing Law
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  These Terms shall be governed by and construed in accordance
                  with the laws of India, without regard to its conflict of law
                  principles. The courts located in Mumbai, Maharashtra, India
                  shall have exclusive jurisdiction to adjudicate any disputes
                  arising out of or relating to these Terms or your use of the
                  Services.
                </p>
              </div>

              <div id='dispute-resolution' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  13.2 Dispute Resolution
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  In the event of any dispute, controversy, or claim arising out
                  of or relating to these Terms or the Services, the parties
                  agree to first attempt to resolve the matter amicably through
                  good faith negotiations within a reasonable period.
                </p>
              </div>

              <div id='arbitration-mediation' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  13.3 Arbitration/Mediation
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  If the dispute cannot be resolved through negotiation within
                  thirty (30) days, either party may submit the dispute to
                  binding arbitration or mediation in Mumbai, Maharashtra,
                  pursuant to the Arbitration and Conciliation Act, 1996 or any
                  successor legislation. The arbitration or mediation
                  proceedings shall be conducted in English, and any arbitral
                  award or settlement agreement shall be final, binding, and
                  enforceable on the parties.
                </p>
              </div>
            </section>

            <section id='miscellaneous' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                14. Miscellaneous
              </h2>

              <div id='force-majeure' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  14.1 Force Majeure
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure shall not be liable for any failure or delay in
                  performing its obligations under these Terms due to causes
                  beyond its reasonable control, including but not limited to
                  natural disasters, acts of government, terrorism, strikes, or
                  technical failures.
                </p>
              </div>

              <div id='entire-agreement' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  14.2 Entire Agreement
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  These Terms, together with the Privacy Policy and any other
                  policies referenced herein, constitute the entire agreement
                  between you and Filesure regarding your use of the Services,
                  superseding all prior agreements or understandings.
                </p>
              </div>

              <div id='severability' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  14.3 Severability
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  If any provision of these Terms is found to be invalid,
                  illegal, or unenforceable by a court of competent
                  jurisdiction, the remaining provisions shall remain in full
                  force and effect.
                </p>
              </div>

              <div id='waiver' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  14.4 Waiver
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  No waiver of any breach or default under these Terms shall be
                  deemed a waiver of any subsequent breach or default. Any
                  waiver must be in writing and signed by an authorized
                  representative of Filesure.
                </p>
              </div>

              <div id='assignment' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  14.5 Assignment
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  You may not assign or transfer your rights or obligations
                  under these Terms without prior written consent from Filesure.
                  Filesure may assign or transfer its rights and obligations at
                  its discretion without notice to you.
                </p>
              </div>
            </section>

            <section id='contact-information' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                15. Contact Information
              </h2>
              <div className='text-xs text-gray-600 md:text-sm'>
                If you have any questions, concerns, or requests regarding these
                Terms or your use of Filesure’s Services, please contact our
                authorized representative:
                <div className='my-2 rounded-lg bg-gray-50 p-4'>
                  <strong>Principal Officer</strong>
                  <br />
                  FileSure India Private Limited
                  <br />
                  6th Floor, Rahimtoola House, Homji Street,
                  <br />
                  Near Horniman Circle, Fort, Mumbai, Maharashtra – 400001,
                  India
                  <br />
                  Email: helpdesk@filesure.in
                  <br />
                  Phone: +91 8104946419
                </div>
                Filesure is committed to addressing all communications promptly,
                professionally, and in accordance with applicable laws and
                regulations.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
