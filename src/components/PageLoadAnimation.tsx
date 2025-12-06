import { motion, type Variants, type Transition } from "framer-motion";
import { ReactNode } from "react";

interface PageLoadAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  blur?: boolean;
  duration?: number;
  className?: string;
}

// Premium easing curve for smooth, natural motion
const premiumEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const getVariants = (direction: string, blur: boolean): Variants => {
  const blurStart = blur ? "blur(8px)" : "blur(0px)";
  const blurEnd = "blur(0px)";

  const baseHidden = {
    opacity: 0,
    filter: blurStart,
  };

  const baseVisible = {
    opacity: 1,
    filter: blurEnd,
  };

  switch (direction) {
    case "up":
      return {
        hidden: { ...baseHidden, y: 20 },
        visible: { ...baseVisible, y: 0 },
      };
    case "down":
      return {
        hidden: { ...baseHidden, y: -20 },
        visible: { ...baseVisible, y: 0 },
      };
    case "left":
      return {
        hidden: { ...baseHidden, x: 20 },
        visible: { ...baseVisible, x: 0 },
      };
    case "right":
      return {
        hidden: { ...baseHidden, x: -20 },
        visible: { ...baseVisible, x: 0 },
      };
    case "scale":
      return {
        hidden: { ...baseHidden, scale: 0.95 },
        visible: { ...baseVisible, scale: 1 },
      };
    default:
      return {
        hidden: { ...baseHidden, y: 20 },
        visible: { ...baseVisible, y: 0 },
      };
  }
};

const PageLoadAnimation = ({
  children,
  delay = 0,
  direction = "up",
  blur = true,
  duration = 0.6,
  className = "",
}: PageLoadAnimationProps) => {
  const variants = getVariants(direction, blur);

  const transition: Transition = {
    duration,
    delay,
    ease: premiumEase,
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={transition}
      className={className}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
};

// Staggered container for groups of elements
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  baseDelay?: number;
  className?: string;
}

export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  baseDelay = 0,
  className = "",
}: StaggerContainerProps) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: baseDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger item to be used inside StaggerContainer
interface StaggerItemProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  blur?: boolean;
  duration?: number;
  className?: string;
}

export const StaggerItem = ({
  children,
  direction = "up",
  blur = true,
  duration = 0.6,
  className = "",
}: StaggerItemProps) => {
  const variants = getVariants(direction, blur);

  return (
    <motion.div
      variants={variants}
      transition={{ duration, ease: premiumEase }}
      className={className}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
};

// Hero-specific animations
export const HeroHeadline = ({ children, delay = 0.2, className = "" }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ duration: 0.7, delay, ease: premiumEase }}
    className={className}
    style={{ willChange: "transform, opacity, filter" }}
  >
    {children}
  </motion.div>
);

export const HeroSubtext = ({ children, delay = 0.4, className = "" }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ duration: 0.6, delay, ease: premiumEase }}
    className={className}
    style={{ willChange: "transform, opacity, filter" }}
  >
    {children}
  </motion.div>
);

export const HeroCTA = ({ children, delay = 0.6, className = "" }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    transition={{ duration: 0.5, delay, ease: premiumEase }}
    className={className}
    style={{ willChange: "transform, opacity, filter" }}
  >
    {children}
  </motion.div>
);

// Image entrance with levitate effect
export const ImageEntrance = ({ 
  children, 
  delay = 0.3, 
  className = "",
  enableLevitate = true 
}: { 
  children: ReactNode; 
  delay?: number; 
  className?: string;
  enableLevitate?: boolean;
}) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      scale: 1.03, 
      y: 20,
      filter: "blur(8px)" 
    }}
    animate={{ 
      opacity: 1, 
      scale: 1, 
      y: enableLevitate ? [0, -8, 0] : 0,
      filter: "blur(0px)" 
    }}
    transition={{ 
      duration: 0.8, 
      delay,
      ease: premiumEase,
      y: enableLevitate ? {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay + 0.8,
      } : undefined,
    }}
    className={className}
    style={{ willChange: "transform, opacity, filter" }}
  >
    {children}
  </motion.div>
);

// Card grid animation for staggered card appearance
interface CardGridProps {
  children: ReactNode[];
  staggerDelay?: number;
  baseDelay?: number;
  className?: string;
}

export const CardGrid = ({
  children,
  staggerDelay = 0.08,
  baseDelay = 0.2,
  className = "",
}: CardGridProps) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: baseDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 15, 
      filter: "blur(6px)",
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: premiumEase,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Section header animation
export const SectionHeader = ({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: ReactNode; 
  delay?: number; 
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: premiumEase }}
    className={className}
    style={{ willChange: "transform, opacity, filter" }}
  >
    {children}
  </motion.div>
);

// Background blur-to-clear transition
export const BackgroundReveal = ({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(20px)" }}
    animate={{ opacity: 1, filter: "blur(0px)" }}
    transition={{ duration: 1.2, delay, ease: premiumEase }}
    className={className}
  >
    {children}
  </motion.div>
);

export default PageLoadAnimation;
