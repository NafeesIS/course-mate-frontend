/* eslint-disable react/no-unescaped-entities */

'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

// Replace with your actual constant
const FILESURE_HELPDESK_EMAIL = 'helpdesk@filesure.in';

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
      { id: 'purpose', title: '1.1 Purpose' },
      { id: 'scope', title: '1.2 Scope' },
      { id: 'legal-binding', title: '1.3 Legal Binding' },
    ],
  },
  { id: 'definitions', title: '2. Definitions' },
  { id: 'applicability', title: '3. Applicability' },
  {
    id: 'refund-eligibility',
    title: '4. Refund Eligibility',
    subItems: [
      { id: 'non-refundable', title: '4.1 Non-Refundable Services' },
      { id: 'refundable', title: '4.2 Refundable Services' },
      { id: 'refund-conditions', title: '4.3 Conditions for Refund' },
      { id: 'discretionary', title: '4.4 Discretionary Nature' },
      {
        id: 'accuracy-disclaimer',
        title: '4.5 Accuracy Disclaimer for Contact Data',
      },
    ],
  },
  {
    id: 'cancellation-policy',
    title: '5. Cancellation Policy',
    subItems: [
      { id: 'user-cancellation', title: '5.1 User-Initiated Cancellation' },
      {
        id: 'filesure-cancellation',
        title: '5.2 Filesure-Initiated Cancellation',
      },
      {
        id: 'cancellation-notice',
        title: '5.3 Cancellation Notice and Effects',
      },
    ],
  },
  {
    id: 'refund-process',
    title: '6. Refund Process',
    subItems: [
      { id: 'request-procedure', title: '6.1 Request Procedure' },
      { id: 'acknowledgement', title: '6.2 Acknowledgement and Verification' },
      { id: 'resolution', title: '6.3 Resolution and Processing' },
      { id: 'refund-mode', title: '6.4 Mode of Refund' },
      { id: 'rejection', title: '6.5 Rejection of Refund Requests' },
    ],
  },
  {
    id: 'limitations',
    title: '7. Limitations and Exceptions',
    subItems: [
      {
        id: 'data-delivery',
        title: '7.1 No Refund for Data Already Delivered',
      },
      {
        id: 'disruptions',
        title: '7.2 Service Disruptions Due to Third Parties',
      },
      { id: 'force-majeure', title: '7.3 Force Majeure' },
      { id: 'user-actions', title: '7.4 No Liability for User Actions' },
    ],
  },
  {
    id: 'dispute-resolution',
    title: '8. Dispute Resolution Regarding Refunds',
    subItems: [
      { id: 'good-faith', title: '8.1 Good Faith Negotiations' },
      {
        id: 'escalation',
        title: '8.2 Escalation to Dispute Resolution Mechanism',
      },
      { id: 'finality', title: '8.3 Finality of Resolution' },
      { id: 'continued-obligations', title: '8.4 Continued Obligations' },
    ],
  },
  { id: 'contact-information', title: '9. Contact Information' },
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
          Refund and Cancellation Policy
        </h1>
        <p className='mb-4 text-xs text-gray-600  md:text-sm'>
          Last Updated: May 17, 2025
        </p>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-6 lg:grid-cols-4'>
          {/* Sidebar navigation - Hidden on mobile */}
          <div className='hidden md:col-span-2 md:block lg:col-span-1'>
            <div className='sticky top-20 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 '>
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

              <div id='purpose' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  1.1 Purpose
                </h3>
                <p className='mb-4 text-xs text-gray-600  md:text-sm'>
                  This Refund and Cancellation Policy ("Policy") establishes the
                  terms and conditions under which{' '}
                  <strong>FileSure India Private Limited</strong> ("Filesure,"
                  "we," "us," or "our") processes refund requests and accepts
                  cancellations for the various paid services offered through
                  its platform. This Policy is intended to provide transparency,
                  set clear expectations, and protect the interests of both
                  Filesure and its Users.
                </p>
              </div>

              <div id='scope' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  1.2 Scope
                </h3>
                <p className='mb-4 text-xs text-gray-600  md:text-sm'>
                  This Policy applies to all payments made for Filesure's paid
                  offerings, including but not limited to:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    <strong>Business Services</strong>, which involve compliance
                    and incorporation assistance delivered exclusively through
                    Filesure's network of authorized partners, such as Chartered
                    Accountants (CAs) and Company Secretaries (CSs);
                  </li>
                  <li>
                    <strong>Data Services</strong>, which include single and
                    bulk unlocks providing access to director contact
                    information, daily alerts with newly registered company
                    data, and similar offerings;
                  </li>
                  <li>
                    <strong>Public Document Services</strong>, encompassing
                    automated downloads and extraction of MCA V2 and V3 portal
                    documents, financial statements, LLP filings, GST filings,
                    compliance tables, and related data, sold primarily on a
                    per-company basis.
                  </li>
                </ul>
              </div>

              <div id='legal-binding' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  1.3 Legal Binding
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  By purchasing any paid Service from Filesure, you ("User")
                  agree to comply with this Policy. All refund and cancellation
                  requests shall be governed exclusively by the terms set forth
                  herein.
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
                    2.1 "Refund"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means the return of funds to a User for Services that have
                    not been delivered or are otherwise eligible under this
                    Policy.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.2 "Cancellation"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Refers to the termination of a service order or subscription
                    by either the User or Filesure before the completion or
                    delivery of the Services.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.3 "Services"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Refers collectively to all paid services provided by
                    Filesure as described in section 1.2, including Business
                    Services, Data Services, and Public Document Services.
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-800 md:text-lg'>
                    2.4 "User"
                  </h3>
                  <p className='text-xs text-gray-600  md:text-sm'>
                    Means any individual or entity that purchases or uses paid
                    Services provided by Filesure.
                  </p>
                </div>
              </div>
            </section>

            <section id='applicability' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                3. Applicability
              </h2>

              <div className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  3.1 Services Covered
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  This Refund and Cancellation Policy applies exclusively to all
                  paid services provided by Filesure, including but not limited
                  to:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Business Services facilitated through Filesure's authorized
                    partners (such as Chartered Accountants and Company
                    Secretaries);
                  </li>
                  <li>
                    Data Services, including single and bulk unlocks, new
                    company alerts, and similar data-driven offerings;
                  </li>
                  <li>
                    Public Document Services, encompassing automated downloads,
                    extraction, and sales of MCA portal documents, GST filings,
                    compliance tables, and related company data.
                  </li>
                </ul>
              </div>

              <div className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  3.2 Payment Conditions
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Full payment or agreed advance payment must be received by
                  Filesure prior to the commencement or delivery of any paid
                  Services unless otherwise expressly agreed in writing. Refunds
                  and cancellations shall be processed only for Services that
                  fall within this paid scope.
                </p>
              </div>

              <div className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  3.3 Exclusions
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  This Policy does not apply to free services, promotional
                  offers, trials, or any unpaid access to Filesure's platform or
                  data unless expressly stated.
                </p>
              </div>
            </section>

            <section id='refund-eligibility' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                4. Refund Eligibility
              </h2>

              <div id='non-refundable' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.1 Non-Refundable Services
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Given the nature of digital and data-driven services, the
                  following are generally non-refundable once access or delivery
                  has occurred:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Data Services, including single and bulk unlocks providing
                    director contact information, new company alerts, and
                    similar data products, once data has been accessed or
                    delivered to the User. Users acknowledge that such contact
                    information is aggregated from publicly available sources
                    and Filesure does not guarantee its accuracy, completeness,
                    or currency (see Section 4.5 below for further details);
                  </li>
                  <li>
                    Public Document Services, including automated downloads and
                    sales of MCA portal documents, financial statements, LLP
                    filings, GST filings, compliance tables, and other related
                    data, once documents have been downloaded or access granted;
                  </li>
                  <li>
                    Business Services for which Filesure's authorized partners
                    have commenced engagement, including incorporation
                    assistance, annual compliance services, and related
                    professional services.
                  </li>
                </ul>
              </div>

              <div id='refundable' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.2 Refundable Services
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Refunds may be considered under the following circumstances:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Failure by Filesure to deliver the purchased Services due to
                    Filesure's fault despite reasonable remedial attempts;
                  </li>
                  <li>
                    Duplicate or erroneous billing resulting in overpayment;
                  </li>
                  <li>
                    Cancellation of Services by Filesure prior to delivery or
                    commencement;
                  </li>
                  <li>
                    Any other cases expressly specified by Filesure in writing.
                  </li>
                </ul>
              </div>

              <div id='refund-conditions' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.3 Conditions for Refund
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Refund eligibility is subject to:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    The User submitting a written refund request within seven
                    (7) calendar days from the date of payment or service
                    delivery, whichever is earlier;
                  </li>
                  <li>
                    Verification by Filesure of the claim, including review of
                    usage data, service logs, and communications;
                  </li>
                  <li>
                    The User's compliance with all Terms of Use and this Policy
                    without breach;
                  </li>
                  <li>
                    No prior history of fraudulent or abusive refund requests by
                    the User.
                  </li>
                </ul>
              </div>

              <div id='discretionary' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.4 Discretionary Nature
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure reserves sole discretion to approve or deny refund
                  requests based on the merits of each case and may, where
                  appropriate, offer partial refunds or credits in lieu of full
                  refunds.
                </p>
              </div>

              <div id='accuracy-disclaimer' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  4.5 Accuracy Disclaimer for Contact Data
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Users acknowledge and agree that contact details provided
                  through Filesure's Data Services are aggregated from publicly
                  available sources and third-party repositories. Filesure makes
                  reasonable efforts to present accurate data but does not
                  guarantee the correctness, completeness, or current validity
                  of any contact information. Reliance on such data is at the
                  User's sole risk. Complaints or refund requests based solely
                  on perceived inaccuracies of contact details will be handled
                  in accordance with the limitations set forth in this Policy
                  and may not be eligible for refund unless Filesure, at its
                  sole discretion, determines a service failure has occurred.
                </p>
              </div>
            </section>

            <section id='cancellation-policy' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                5. Cancellation Policy
              </h2>

              <div id='user-cancellation' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  5.1 User-Initiated Cancellation
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  You may request cancellation of your service order prior to
                  delivery or commencement of the Services by providing written
                  notice to Filesure via designated contact channels.
                  Cancellation requests received after the commencement of
                  Services, including data delivery or partner engagement, may
                  be subject to partial or no refund, as outlined in Section 4
                  of this Policy.
                </p>
              </div>

              <div id='filesure-cancellation' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  5.2 Filesure-Initiated Cancellation
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Filesure reserves the right to cancel or suspend any service
                  order at its sole discretion, including but not limited to
                  cases of:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>
                    Violation of these Terms or breach of payment obligations;
                  </li>
                  <li>
                    Failure to provide accurate or complete information required
                    for service delivery;
                  </li>
                  <li>
                    Force majeure events or technical failures impacting service
                    provision;
                  </li>
                  <li>
                    Any other circumstances Filesure deems necessary for legal
                    or operational reasons.
                  </li>
                </ul>
              </div>

              <div id='cancellation-notice' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  5.3 Cancellation Notice and Effects
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Upon cancellation by either party, Filesure will notify the
                  User in writing. Cancellation shall not relieve the User of
                  any payment obligations for Services already performed or
                  costs reasonably incurred. Filesure will make reasonable
                  efforts to cease Service delivery promptly following
                  cancellation.
                </p>
              </div>
            </section>

            <section id='refund-process' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                6. Refund Process
              </h2>

              <div id='request-procedure' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.1 Request Procedure
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  To request a refund, Users must submit a written request to
                  Filesure through the designated communication channels (e.g.,
                  email to {FILESURE_HELPDESK_EMAIL}) within seven (7) business
                  days from the date of payment or service delivery, whichever
                  is earlier. The request must include:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>User's full name and contact details;</li>
                  <li>Details of the Service purchased;</li>
                  <li>Payment transaction details;</li>
                  <li>
                    Reason for the refund request and supporting documentation,
                    if applicable.
                  </li>
                </ul>
              </div>

              <div id='acknowledgement' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.2 Acknowledgement and Verification
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure shall acknowledge receipt of the refund request
                  within seven (7) business days and begin a review process.
                  Verification may include examination of service logs, data
                  access records, payment confirmation, and any other relevant
                  information.
                </p>
              </div>

              <div id='resolution' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.3 Resolution and Processing
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Upon completion of verification, Filesure will communicate its
                  decision within thirty (30) calendar days from the date of
                  refund request receipt. Approved refunds will be processed
                  promptly, generally within fifteen (15) calendar days from the
                  approval date.
                </p>
              </div>

              <div id='refund-mode' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.4 Mode of Refund
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Refunds will be issued via the original payment method used by
                  the User unless otherwise mutually agreed. Filesure shall not
                  be responsible for delays caused by financial institutions or
                  payment processors.
                </p>
              </div>

              <div id='rejection' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  6.5 Rejection of Refund Requests
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Refund requests failing to meet eligibility criteria,
                  submitted after the prescribed time, or lacking sufficient
                  documentation may be rejected. Filesure will notify the User
                  in writing of any such rejection, with reasons.
                </p>
              </div>
            </section>

            <section id='limitations' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                7. Limitations and Exceptions
              </h2>

              <div id='data-delivery' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  7.1 No Refund for Data Already Delivered
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Due to the intangible and non-returnable nature of digital
                  data, once data access has been provided, downloads have
                  occurred, or information has been unlocked, no refunds shall
                  be granted for such Services, including but not limited to
                  director contact information, public document downloads,
                  compliance data, and alerts.
                </p>
              </div>

              <div id='disruptions' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  7.2 Service Disruptions Due to Third Parties
                </h3>
                <p className='mb-3 text-xs text-gray-600  md:text-sm'>
                  Filesure shall not be liable for delays, failures, or
                  interruptions in service delivery caused by third-party
                  entities, including but not limited to:
                </p>
                <ul className='ml-6 list-disc space-y-2 text-xs text-gray-600  md:text-sm'>
                  <li>Ministry of Corporate Affairs ("MCA") portals;</li>
                  <li>
                    Goods and Services Tax ("GST") portal or authorized GST
                    Suvidha Providers;
                  </li>
                  <li>
                    Authorized partner professionals facilitating business
                    services;
                  </li>
                  <li>Payment gateways or financial institutions.</li>
                </ul>
              </div>

              <div id='force-majeure' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  7.3 Force Majeure
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure shall not be responsible for failure or delay in
                  performing its obligations due to causes beyond its reasonable
                  control, including but not limited to natural disasters,
                  pandemics, acts of government, war, terrorism, strikes, labor
                  disputes, or technical failures.
                </p>
              </div>

              <div id='user-actions' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  7.4 No Liability for User Actions
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Filesure disclaims liability for losses or damages arising
                  from User misuse, unauthorized sharing of data, or failure to
                  comply with applicable laws or these Terms.
                </p>
              </div>
            </section>

            <section id='dispute-resolution' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                8. Dispute Resolution Regarding Refunds
              </h2>

              <div id='good-faith' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.1 Good Faith Negotiations
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  In the event of any dispute, controversy, or claim arising
                  from or relating to refund or cancellation matters, the User
                  and Filesure shall first attempt to resolve the issue amicably
                  through good faith negotiations within fourteen (14) calendar
                  days of written notice of the dispute.
                </p>
              </div>

              <div id='escalation' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.2 Escalation to Dispute Resolution Mechanism
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  If the dispute remains unresolved after the negotiation
                  period, the parties may pursue resolution through the dispute
                  resolution procedures outlined in Filesure's Terms of Use,
                  including but not limited to mediation or binding arbitration
                  conducted in Mumbai, Maharashtra, India.
                </p>
              </div>

              <div id='finality' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.3 Finality of Resolution
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Any arbitration award or settlement reached pursuant to the
                  dispute resolution process shall be final, binding, and
                  enforceable in accordance with applicable laws.
                </p>
              </div>

              <div id='continued-obligations' className='mb-6'>
                <h3 className='mb-3 text-base font-semibold text-gray-800 md:text-lg'>
                  8.4 Continued Obligations
                </h3>
                <p className='text-xs text-gray-600  md:text-sm'>
                  Pending resolution of any refund dispute, Filesure reserves
                  the right to withhold refunds or suspend related Services
                  until the dispute is finally resolved.
                </p>
              </div>
            </section>

            <section id='contact-information' className='mb-8'>
              <h2 className='mb-4 text-lg font-bold text-gray-800 md:text-xl'>
                9. Contact Information
              </h2>
              <p className='mb-4 text-xs text-gray-600 md:text-sm'>
                For any queries, concerns, or requests relating to refunds,
                cancellations, or this Policy, please contact Filesure's
                designated principal officer at:
              </p>
              <div className='rounded-lg bg-gray-50 p-4'>
                <p className='text-xs font-medium text-gray-600 dark:text-gray-300 md:text-sm'>
                  Email: {FILESURE_HELPDESK_EMAIL}
                </p>
                <p className='text-xs font-medium text-gray-600 dark:text-gray-300 md:text-sm'>
                  Phone: +91 8104946419
                </p>
                <p className='text-xs font-medium text-gray-600 dark:text-gray-300 md:text-sm'>
                  Postal Address:
                </p>
                <address className='mb-0 not-italic'>
                  <p className='text-xs text-gray-600 md:text-sm'>
                    Principal Officer
                    <br />
                    FileSure India Private Limited
                    <br />
                    6th Floor, Rahimtoola House, Homji Street, Near Horniman
                    Circle, Fort,
                    <br />
                    Mumbai, Maharashtra - 400001, India
                  </p>
                </address>
              </div>
              <p className='mt-4 text-xs text-gray-600  md:text-sm'>
                Filesure is committed to addressing all communications promptly,
                professionally, and in accordance with applicable laws.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
