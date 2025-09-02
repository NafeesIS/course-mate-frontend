import { useEffect, useState } from 'react';

const useScroll = () => {
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setScrolling(scrollTop > 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrolling;
};

export default useScroll;
