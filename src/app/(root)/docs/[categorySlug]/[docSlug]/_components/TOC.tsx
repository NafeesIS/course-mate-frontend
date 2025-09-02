'use client';

import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Heading } from '../_utils/parseHeadingsFromHtml';
// import { Heading } from '../_services/parseHeadingsFromHtml';
// import type { Heading } from '../_utils/parseHeadingsFromHtml';

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Scroll to section
  const scrollToSection = (headingId: string) => {
    const target = document.getElementById(headingId);
    if (!target) return;

    const header = document.querySelector(
      '[data-sticky-header]'
    ) as HTMLElement | null;
    const offset = header?.offsetHeight ?? 64;
    const top =
      target.getBoundingClientRect().top + window.scrollY - offset - 8; // little extra gap

    window.scrollTo({ top, behavior: 'smooth' });
    setTocOpen(false);
    setActiveSection(headingId);
  };

  const scrollToSectionMobile = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const yOffset = -520; // Additional offset to account for the header
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Update active section
      setActiveSection(headingId);
    }
    setTocOpen(false); // Close mobile TOC after clicking
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingEls = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      for (let i = headingEls.length - 1; i >= 0; i--) {
        const heading = headingEls[i];
        const rect = heading?.getBoundingClientRect();
        if (rect && rect.top <= 250) {
          setActiveSection(heading ? heading.id : '');
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);
  const getHeadingClasses = (heading: Heading, isActive: boolean) => {
    const baseClasses = `block w-full rounded-md px-3 py-2 text-left text-sm transition-colors duration-200 ${
      isActive
        ? 'bg-blue-50 text-primary'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

    const levelClasses =
      heading.level === 1
        ? 'font-semibold'
        : heading.level === 2
          ? 'ml-2'
          : heading.level === 3
            ? 'ml-4 text-xs'
            : 'ml-6 text-xs';

    return `${baseClasses} ${levelClasses}`;
  };

  // Responsive: show dropdown on mobile, sidebar on desktop
  return (
    <>
      {/* Desktop */}
      <div className='hidden lg:block'>
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900'>
            Table of Contents
          </h3>
          <nav className='space-y-1'>
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToSection(heading.id)}
                className={getHeadingClasses(
                  heading,
                  activeSection === heading.id
                )}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Mobile */}
      <div className='lg:hidden'>
        <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
          <button
            onClick={() => setTocOpen((v) => !v)}
            className='flex w-full items-center justify-between gap-2 p-4 text-left'
          >
            <div className='flex items-center gap-2'>
              <Menu className='min-h-4 min-w-4 text-gray-500' />
              <span className='text-sm font-medium text-gray-900'>
                Table of Contents
              </span>
            </div>
            {tocOpen ? (
              <ChevronDown className='min-h-4 min-w-4 text-gray-500' />
            ) : (
              <ChevronRight className='min-h-4 min-w-4 text-gray-500' />
            )}
          </button>
          {tocOpen && (
            <div className='border-t border-gray-200 p-4'>
              <nav className='space-y-1'>
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToSectionMobile(heading.id)}
                    className={getHeadingClasses(
                      heading,
                      activeSection === heading.id
                    )}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TableOfContents;
