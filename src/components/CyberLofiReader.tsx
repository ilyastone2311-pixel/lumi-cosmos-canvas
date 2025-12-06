import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";
import heroReaderCharacter from "@/assets/hero-reader-character.png";

const CyberLofiReader = () => {
  const [isHovered, setIsHovered] = useState(false);
  const parallaxOffset = useParallax(0.15);

  // Memoize particle positions to avoid re-randomizing on re-render
  const particles = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      id: i,
      width: 2 + Math.random() * 3,
      left: 25 + Math.random() * 50,
      top: 20 + Math.random() * 60,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
      isAlt: i % 2 === 0,
    })), []
  );

  // Memoize sparkle positions
  const sparkles = useMemo(() => [
    { top: "12%", right: "30%", size: 14, delay: 0 },
    { top: "22%", right: "12%", size: 10, delay: 0.5 },
    { bottom: "28%", right: "15%", size: 12, delay: 1 },
    { top: "55%", left: "12%", size: 8, delay: 1.5 },
    { top: "18%", left: "28%", size: 10, delay: 2 },
    { bottom: "22%", left: "18%", size: 12, delay: 0.8 },
  ], []);

  // Hover sparkles that appear on interaction
  const hoverSparkles = useMemo(() => [
    { top: "8%", right: "20%", size: 16, delay: 0 },
    { top: "30%", right: "5%", size: 12, delay: 0.1 },
    { bottom: "20%", right: "10%", size: 14, delay: 0.2 },
    { top: "40%", left: "8%", size: 10, delay: 0.15 },
    { bottom: "35%", left: "15%", size: 12, delay: 0.25 },
    { top: "50%", right: "18%", size: 8, delay: 0.3 },
  ], []);

  return (
    <div 
      className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55vw] h-[80vh] min-w-[350px] max-w-[750px] min-h-[450px] max-h-[800px] pointer-events-none lg:pointer-events-auto z-10"
      style={{
        transform: `translateY(calc(-50% + ${parallaxOffset}px))`,
      }}
    >
      {/* 3D Rotating rings container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {/* Outer 3D ring - cyan/purple gradient */}
        <motion.div
          className="absolute w-[90%] h-[90%]"
          style={{
            borderRadius: '50%',
            border: '3px solid transparent',
            background: `linear-gradient(transparent, transparent) padding-box,
                        conic-gradient(from 0deg, 
                          hsla(190, 100%, 50%, 0) 0%, 
                          hsla(190, 100%, 65%, 0.9) 15%, 
                          hsla(200, 100%, 55%, 0.5) 30%,
                          hsla(190, 100%, 50%, 0) 45%,
                          hsla(280, 100%, 65%, 0.7) 60%,
                          hsla(260, 100%, 55%, 0) 75%,
                          hsla(190, 100%, 50%, 0) 100%
                        ) border-box`,
            filter: 'blur(0.5px)',
            transformStyle: 'preserve-3d',
          }}
          animate={{ 
            rotate: 360,
            rotateX: isHovered ? [0, 15, -10, 0] : 0,
            rotateY: isHovered ? [0, -20, 15, 0] : 0,
          }}
          transition={{ 
            rotate: {
              duration: isHovered ? 4 : 20, 
              repeat: Infinity, 
              ease: "linear",
            },
            rotateX: {
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            },
            rotateY: {
              duration: 2.5,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            },
          }}
        />

        {/* Middle 3D ring - flowing gradient */}
        <motion.div
          className="absolute w-[75%] h-[75%]"
          style={{
            borderRadius: '50%',
            border: '2.5px solid transparent',
            background: `linear-gradient(transparent, transparent) padding-box,
                        conic-gradient(from 180deg, 
                          hsla(280, 100%, 65%, 0) 0%, 
                          hsla(190, 100%, 70%, 0.85) 20%, 
                          hsla(190, 100%, 55%, 0) 40%,
                          hsla(260, 100%, 65%, 0.6) 60%,
                          hsla(280, 100%, 55%, 0) 80%,
                          hsla(280, 100%, 65%, 0) 100%
                        ) border-box`,
            filter: 'blur(0.5px)',
            transformStyle: 'preserve-3d',
          }}
          animate={{ 
            rotate: -360,
            rotateX: isHovered ? [0, -12, 18, 0] : 0,
            rotateY: isHovered ? [0, 25, -15, 0] : 0,
          }}
          transition={{ 
            rotate: {
              duration: isHovered ? 3 : 18, 
              repeat: Infinity, 
              ease: "linear",
            },
            rotateX: {
              duration: 2.3,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            },
            rotateY: {
              duration: 1.8,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            },
          }}
        />

        {/* Inner 3D ring - accent glow */}
        <motion.div
          className="absolute w-[60%] h-[60%]"
          style={{
            borderRadius: '50%',
            border: '2px solid transparent',
            background: `linear-gradient(transparent, transparent) padding-box,
                        conic-gradient(from 90deg, 
                          hsla(190, 100%, 55%, 0) 0%, 
                          hsla(190, 100%, 75%, 0.75) 10%,
                          hsla(190, 100%, 55%, 0) 25%,
                          hsla(270, 100%, 65%, 0.5) 50%,
                          hsla(190, 100%, 55%, 0) 75%,
                          hsla(190, 100%, 70%, 0.6) 90%,
                          hsla(190, 100%, 55%, 0) 100%
                        ) border-box`,
            transformStyle: 'preserve-3d',
          }}
          animate={{ 
            rotate: 360,
            rotateX: isHovered ? [0, 20, -15, 0] : 0,
            rotateY: isHovered ? [0, -18, 22, 0] : 0,
          }}
          transition={{ 
            rotate: {
              duration: isHovered ? 5 : 25, 
              repeat: Infinity, 
              ease: "linear",
            },
            rotateX: {
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            },
            rotateY: {
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            },
          }}
        />
      </div>

      {/* Background glow effects */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(190, 100%, 55%, 0.2) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: isHovered ? [1, 1.3, 1.1] : [1, 1.08, 1],
          opacity: isHovered ? [0.5, 1, 0.7] : [0.4, 0.55, 0.4],
        }}
        transition={{ duration: isHovered ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-[42%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(270, 100%, 65%, 0.15) 0%, transparent 60%)',
          filter: 'blur(35px)',
        }}
        animate={{
          scale: isHovered ? [1, 1.25, 1] : [1, 1.1, 1],
          opacity: isHovered ? [0.4, 0.8, 0.5] : [0.3, 0.45, 0.3],
        }}
        transition={{ duration: isHovered ? 1.2 : 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Book glow effect - appears on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute top-[45%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-[20%] h-[15%] rounded-lg"
            style={{
              background: 'radial-gradient(ellipse, hsla(50, 100%, 70%, 0.6) 0%, hsla(40, 100%, 60%, 0.3) 40%, transparent 70%)',
              filter: 'blur(15px)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.6, 1, 0.7],
              scale: [1, 1.15, 1],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>

      {/* Main character illustration with levitation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.03 : 1,
          rotateZ: isHovered ? [-1, 1, -1] : 0,
        }}
        transition={{ 
          scale: { duration: 0.3, ease: "easeOut" },
          rotateZ: { duration: 2, repeat: isHovered ? Infinity : 0, ease: "easeInOut" },
        }}
      >
        <motion.img
          src={heroReaderCharacter}
          alt="Person reading a book with magical glowing rings"
          className="w-[80%] h-auto object-contain relative z-10"
          style={{
            filter: isHovered 
              ? 'drop-shadow(0 0 40px hsla(190, 100%, 55%, 0.6)) drop-shadow(0 0 80px hsla(270, 100%, 65%, 0.4)) drop-shadow(0 0 20px hsla(50, 100%, 70%, 0.3))' 
              : 'drop-shadow(0 0 25px hsla(190, 100%, 55%, 0.35)) drop-shadow(0 0 50px hsla(270, 100%, 65%, 0.25))',
          }}
          animate={{
            y: isHovered ? [0, -15, 0] : [0, -10, 0],
          }}
          transition={{
            duration: isHovered ? 2.5 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Default sparkle/star accents */}
      {sparkles.map((sparkle, i) => (
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
            opacity: [0.4, 1, 0.4],
            scale: [0.9, 1.3, 0.9],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        >
          <svg 
            width={sparkle.size} 
            height={sparkle.size} 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" 
              fill="hsla(190, 100%, 75%, 0.95)"
              style={{
                filter: 'drop-shadow(0 0 6px hsla(190, 100%, 55%, 0.9))',
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Hover-triggered sparkle burst */}
      <AnimatePresence>
        {isHovered && hoverSparkles.map((sparkle, i) => (
          <motion.div
            key={`hover-sparkle-${i}`}
            className="absolute"
            style={{
              top: sparkle.top,
              bottom: sparkle.bottom,
              left: sparkle.left,
              right: sparkle.right,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.8],
              scale: [0, 1.5, 1.2],
              rotate: [0, 360],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.8,
              delay: sparkle.delay,
              ease: "easeOut",
            }}
          >
            <svg 
              width={sparkle.size} 
              height={sparkle.size} 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path 
                d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" 
                fill="hsla(50, 100%, 80%, 0.95)"
                style={{
                  filter: 'drop-shadow(0 0 8px hsla(50, 100%, 65%, 1))',
                }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full"
          style={{
            width: particle.width,
            height: particle.width,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: particle.isAlt 
              ? 'hsla(190, 100%, 65%, 0.8)' 
              : 'hsla(270, 100%, 75%, 0.8)',
            boxShadow: particle.isAlt
              ? '0 0 10px hsla(190, 100%, 55%, 0.7)'
              : '0 0 10px hsla(270, 100%, 65%, 0.7)',
          }}
          animate={{
            y: isHovered ? [0, -25, 0] : [0, -15, 0],
            opacity: isHovered ? [0.5, 1, 0.5] : [0.4, 0.7, 0.4],
            scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1],
          }}
          transition={{
            duration: isHovered ? particle.duration * 0.7 : particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Magical aura ring on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full pointer-events-none"
            style={{
              border: '2px solid hsla(190, 100%, 70%, 0.4)',
              boxShadow: '0 0 30px hsla(190, 100%, 55%, 0.3), inset 0 0 30px hsla(190, 100%, 55%, 0.1)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.05, 1],
            }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberLofiReader;