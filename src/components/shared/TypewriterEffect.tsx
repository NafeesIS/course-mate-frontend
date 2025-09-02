'use client';

import { cn } from '@/lib/utils';
import { Cursor, useTypewriter } from 'react-simple-typewriter';

const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: string[];
  className?: string;
  cursorClassName?: string;
}) => {
  const [text] = useTypewriter({
    words: words,
    loop: true,
    typeSpeed: 120,
    deleteSpeed: 80,
    delaySpeed: 4000,
  });

  return (
    <>
      <span className={cn(className)}>{text}</span>
      <span className={cn(cursorClassName)}>
        <Cursor cursorStyle='|' />
      </span>
    </>
  );
};

export default TypewriterEffect;
