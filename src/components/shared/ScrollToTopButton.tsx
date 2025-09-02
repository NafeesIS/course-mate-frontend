'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ScrollToTopButton: React.FC = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={cn(
        'group fixed bottom-24 right-8 z-50 w-fit transition-opacity duration-300 ease-in-out md:bottom-24 md:right-7',
        showScroll
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      )}
    >
      <Button
        variant='default'
        size='icon'
        aria-label='Scroll to top'
        onClick={handleScrollToTop}
        className='size-6 bg-opacity-40 ring-2 backdrop-blur-sm md:size-8'
      >
        <ArrowUp className='size-4 md:size-5' />
      </Button>

      <span className='pointer-events-none absolute right-[120%] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary bg-opacity-60 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100'>
        Scroll to top
      </span>
    </div>
  );
};

export default ScrollToTopButton;
