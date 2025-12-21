import { motion } from "framer-motion";

interface AnimatedLettersProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

const AnimatedLetters = ({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.03 
}: AnimatedLettersProps) => {
  const letters = text.split("");

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: delay },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: "100%",
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ visibility: "visible" }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden"
          style={{ 
            display: letter === " " ? "inline-block" : "inline-block",
            width: letter === " " ? "0.3em" : "auto",
          }}
        >
          <motion.span
            variants={child}
            className="inline-block"
            style={{ 
              willChange: "transform, opacity",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default AnimatedLetters;
