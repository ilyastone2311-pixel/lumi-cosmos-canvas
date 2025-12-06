import { useState } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";
import heroReaderIllustration from "@/assets/hero-reader-illustration.png";

const CyberLofiReader = () => {
  const [isHovered, setIsHovered] = useState(false);
  const parallaxOffset = useParallax(0.15);

  return (
    <div 
      className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55vw] h-[80vh] min-w-[350px] max-w-[750px] min-h-[450px] max-h-[800px] pointer-events-none lg:pointer-events-auto z-10"
      style={{
        transform: `translateY(calc(-50% + ${parallaxOffset}px))`,
      }}
    >
      {/* Flowing energy rings container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer flowing ring - cyan */}
        <motion.div
          className="absolute w-[95%] h-[95%]"
          style={{
            borderRadius: '50%',
            border: '2px solid transparent',
            background: `linear-gradient(transparent, transparent) padding-box,
                        conic-gradient(from 0deg, 
                          hsla(190, 100%, 50%, 0) 0%, 
                          hsla(190, 100%, 60%, 0.8) 15%, 
                          hsla(200, 100%, 50%, 0.4) 30%,
                          hsla(190, 100%, 50%, 0) 45%,
                          hsla(280, 100%, 60%, 0.6) 60%,
                          hsla(260, 100%, 50%, 0) 75%,
                          hsla(190, 100%, 50%, 0) 100%
                        ) border-box`,
            filter: 'blur(1px)',
          }}
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: isHovered ? 8 : 20, 
            repeat: Infinity, 
            ease: "linear",
          }}
        />

        {/* Second flowing ring - inner */}
        <motion.div
          className="absolute w-[80%] h-[80%]"
          style={{
            borderRadius: '50%',
            border: '2px solid transparent',
            background: `linear-gradient(transparent, transparent) padding-box,
                        conic-gradient(from 180deg, 
                          hsla(280, 100%, 60%, 0) 0%, 
                          hsla(190, 100%, 60%, 0.7) 20%, 
                          hsla(190, 100%, 50%, 0) 40%,
                          hsla(260, 100%, 60%, 0.5) 60%,
                          hsla(280, 100%, 50%, 0) 80%,
                          hsla(280, 100%, 60%, 0) 100%
                        ) border-box`,
            filter: 'blur(1px)',
          }}
          animate={{ 
            rotate: -360,
          }}
          transition={{ 
            duration: isHovered ? 6 : 18, 
            repeat: Infinity, 
            ease: "linear",
          }}
        />

        {/* Third ring - accent glow */}
        <motion.div
          className="absolute w-[70%] h-[70%]"
          style={{
            borderRadius: '50%',
            border: '1.5px solid transparent',
            background: `linear-gradient(transparent, transparent) padding-box,
                        conic-gradient(from 90deg, 
                          hsla(190, 100%, 50%, 0) 0%, 
                          hsla(190, 100%, 70%, 0.6) 10%,
                          hsla(190, 100%, 50%, 0) 25%,
                          hsla(270, 100%, 60%, 0.4) 50%,
                          hsla(190, 100%, 50%, 0) 75%,
                          hsla(190, 100%, 60%, 0.5) 90%,
                          hsla(190, 100%, 50%, 0) 100%
                        ) border-box`,
          }}
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: isHovered ? 10 : 25, 
            repeat: Infinity, 
            ease: "linear",
          }}
        />
      </div>

      {/* Glow effects behind the illustration */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(190, 100%, 50%, 0.15) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: isHovered ? [1, 1.1, 1] : [1, 1.05, 1],
          opacity: isHovered ? [0.6, 0.8, 0.6] : [0.4, 0.5, 0.4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(270, 100%, 60%, 0.12) 0%, transparent 60%)',
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Main illustration */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.img
          src={heroReaderIllustration}
          alt="Person reading a book with magical glow"
          className="w-[75%] h-auto object-contain relative z-10"
          style={{
            filter: isHovered 
              ? 'drop-shadow(0 0 30px hsla(190, 100%, 50%, 0.5)) drop-shadow(0 0 60px hsla(270, 100%, 60%, 0.3))' 
              : 'drop-shadow(0 0 20px hsla(190, 100%, 50%, 0.3)) drop-shadow(0 0 40px hsla(270, 100%, 60%, 0.2))',
          }}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Sparkle/star accents */}
      {[
        { top: "15%", right: "25%", size: 12, delay: 0 },
        { top: "25%", right: "10%", size: 8, delay: 0.5 },
        { bottom: "30%", right: "8%", size: 10, delay: 1 },
        { top: "60%", left: "15%", size: 6, delay: 1.5 },
        { top: "20%", left: "25%", size: 8, delay: 2 },
        { bottom: "25%", left: "20%", size: 10, delay: 0.8 },
      ].map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: sparkle.top,
            bottom: sparkle.bottom,
            left: sparkle.left,
            right: sparkle.right,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        >
          {/* 4-point star shape */}
          <svg 
            width={sparkle.size} 
            height={sparkle.size} 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" 
              fill="hsla(190, 100%, 70%, 0.9)"
              style={{
                filter: 'drop-shadow(0 0 4px hsla(190, 100%, 50%, 0.8))',
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 3,
            height: 3 + Math.random() * 3,
            left: `${25 + Math.random() * 50}%`,
            top: `${20 + Math.random() * 60}%`,
            background: i % 2 === 0 
              ? 'hsla(190, 100%, 60%, 0.7)' 
              : 'hsla(270, 100%, 70%, 0.7)',
            boxShadow: i % 2 === 0
              ? '0 0 8px hsla(190, 100%, 50%, 0.6)'
              : '0 0 8px hsla(270, 100%, 60%, 0.6)',
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default CyberLofiReader;
