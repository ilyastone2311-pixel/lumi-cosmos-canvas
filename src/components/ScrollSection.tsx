import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  blur?: boolean;
  staggerIndex?: number; // For staggered animations in lists
}

const ScrollSection = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up",
  blur = false, // Disabled by default for performance
  staggerIndex = 0,
}: ScrollSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-50px 0px -50px 0px",
    amount: 0.1 
  });

  // Calculate total delay including stagger
  const totalDelay = delay + (staggerIndex * 0.12);

  const getTranslateValue = () => {
    switch (direction) {
      case "up": return { y: 16 };
      case "down": return { y: -16 };
      case "left": return { x: 16 };
      case "right": return { x: -16 };
      case "fade": return { scale: 0.98 };
      default: return { y: 16 };
    }
  };

  const getResetValue = () => {
    switch (direction) {
      case "up":
      case "down": return { y: 0 };
      case "left":
      case "right": return { x: 0 };
      case "fade": return { scale: 1 };
      default: return { y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...getTranslateValue(),
        filter: blur ? 'blur(4px)' : 'blur(0px)',
      }}
      animate={isInView ? { 
        opacity: 1, 
        ...getResetValue(),
        filter: 'blur(0px)',
      } : undefined}
      transition={{
        duration: 0.55,
        delay: totalDelay,
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease-out-quart
      }}
      style={{
        willChange: 'transform, opacity',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollSection;
