import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  blur?: boolean; // Enable blur-in effect
}

const ScrollSection = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up",
  blur = true // Default to blur enabled for premium feel
}: ScrollSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-80px 0px -80px 0px",
    amount: 0.15 
  });

  const getInitialState = () => {
    const base: Record<string, number> = { opacity: 0 };
    if (blur) base.filter = 8; // blur(8px)
    
    switch (direction) {
      case "up":
        return { ...base, y: 50 };
      case "down":
        return { ...base, y: -50 };
      case "left":
        return { ...base, x: 50 };
      case "right":
        return { ...base, x: -50 };
      case "fade":
        return { ...base, scale: 0.98 };
      default:
        return { ...base, y: 50 };
    }
  };

  const getFinalState = () => {
    const base: Record<string, number> = { opacity: 1 };
    if (blur) base.filter = 0; // blur(0px)
    
    switch (direction) {
      case "up":
      case "down":
        return { ...base, y: 0 };
      case "left":
      case "right":
        return { ...base, x: 0 };
      case "fade":
        return { ...base, scale: 1 };
      default:
        return { ...base, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isInView ? getFinalState() : getInitialState()}
      transition={{
        duration: 1.1,
        delay: delay,
        ease: [0.22, 1, 0.36, 1], // Ultra-smooth cubic bezier
        filter: { duration: 0.8 }, // Slightly faster blur transition
      }}
      style={{
        filter: isInView ? 'blur(0px)' : (blur ? 'blur(8px)' : 'blur(0px)'),
        willChange: 'transform, opacity, filter',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollSection;
