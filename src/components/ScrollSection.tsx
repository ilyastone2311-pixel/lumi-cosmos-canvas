import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

const ScrollSection = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up" 
}: ScrollSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px -100px 0px",
    amount: 0.2 
  });

  const getInitialState = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 60 };
      case "down":
        return { opacity: 0, y: -60 };
      case "left":
        return { opacity: 0, x: 60 };
      case "right":
        return { opacity: 0, x: -60 };
      case "fade":
        return { opacity: 0 };
      default:
        return { opacity: 0, y: 60 };
    }
  };

  const getFinalState = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "fade":
        return { opacity: 1 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isInView ? getFinalState() : getInitialState()}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollSection;
