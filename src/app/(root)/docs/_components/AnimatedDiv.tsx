'use client';
import { motion, MotionProps, Variants } from 'framer-motion';
import { HTMLAttributes, ReactNode } from 'react';

interface AnimatedDivProps
  extends Omit<MotionProps, 'children'>,
    Omit<HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  children: ReactNode;
  variants?: Variants;
  enableViewportAnimation?: boolean; // ✅ New prop
}

export const AnimatedDiv = ({
  children,
  variants,
  enableViewportAnimation = false, // ✅ Default disabled for child elements
  ...props
}: AnimatedDivProps) => {
  const viewportAnimationProps = enableViewportAnimation
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.4, ease: 'easeOut' },
      }
    : {};

  return (
    <motion.div variants={variants} {...viewportAnimationProps} {...props}>
      {children}
    </motion.div>
  );
};
