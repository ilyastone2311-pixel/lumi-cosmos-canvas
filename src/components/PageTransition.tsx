import { motion, type Transition } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// GPU-optimized page variants - only transform and opacity
const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -8,
  },
};

// Smooth, fast transition curve
const pageTransition: Transition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1], // Smooth cubic bezier
  duration: 0.3,
};

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{ 
        minHeight: "100vh",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
