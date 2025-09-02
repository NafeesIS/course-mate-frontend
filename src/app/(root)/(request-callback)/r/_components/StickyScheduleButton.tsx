import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

const StickyScrollButton = ({ targetSectionId }: any) => {
  const stickyButtonRef = useRef(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  useEffect(() => {
    const targetSection = document.getElementById(targetSectionId);

    const handleScroll = () => {
      if (!targetSection) return;
      const targetRect = targetSection.getBoundingClientRect();
      const showStickyButton = targetRect.bottom > window.innerHeight;
      setIsStickyVisible(showStickyButton);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [targetSectionId]);

  const handleButtonClick = () => {
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {isStickyVisible && (
        <div
          ref={stickyButtonRef}
          className='fixed bottom-0 left-0 right-0 p-4 shadow-lg'
        >
          <div className='fixed inset-x-0 bottom-0 z-50 block border-t bg-background p-4 shadow sm:hidden'>
            <Button
              variant='default'
              size='sm'
              className='mt-2 w-full py-2 text-xs text-white'
              onClick={handleButtonClick}
            >
              Scroll to Schedule Callback Form
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default StickyScrollButton;
