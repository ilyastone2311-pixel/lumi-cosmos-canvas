import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";
import heroReaderNew from "@/assets/hero-reader-new.png";

const HeroIllustration = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxOffset = useParallax(0.15);

  // Mouse position for parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !isHovered) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Handle mobile tap
  const handleTap = () => {
    setIsTapped(true);
    setIsHovered(true);
    setTimeout(() => {
      setIsTapped(false);
      setIsHovered(false);
    }, 2500);
  };

  // Memoized falling stars
  const fallingStars = useMemo(() => 
    [...Array(12)].map((_, i) => ({
      id: i,
      size: 2 + Math.random() * 4,
      left: 15 + Math.random() * 70,
      startTop: -10 - Math.random() * 20,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.5,
    })), []
  );

  // Static sparkle accents
  const sparkles = useMemo(() => [
    { top: "8%", right: "25%", size: 12, delay: 0 },
    { top: "18%", right: "10%", size: 8, delay: 0.5 },
    { top: "35%", left: "8%", size: 10, delay: 1 },
    { bottom: "25%", right: "12%", size: 10, delay: 1.5 },
    { bottom: "35%", left: "15%", size: 8, delay: 2 },
  ], []);

  // Ripple effect positions
  const [ripples, setRipples] = useState<{id: number, x: number, y: number}[]>([]);
  
  useEffect(() => {
    if (isHovered && ripples.length === 0) {
      setRipples([{ id: Date.now(), x: 50, y: 50 }]);
    }
    if (!isHovered) {
      setRipples([]);
    }
  }, [isHovered]);

  const isActive = isHovered || isTapped;

  return (
    <div 
      ref={containerRef}
      className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55vw] h-[80vh] min-w-[350px] max-w-[750px] min-h-[450px] max-h-[800px] z-10"
      style={{
        transform: `translateY(calc(-50% + ${parallaxOffset}px))`,
        perspective: "1000px",
      }}
    >
      {/* Invisible hover zone covering the illustration area */}
      <div
        className="absolute inset-[10%] cursor-pointer z-50"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTap}
      />

      {/* Background gradient blend */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, 
            hsla(250, 60%, 15%, 0.6) 0%, 
            hsla(230, 50%, 10%, 0.4) 40%, 
            transparent 70%
          )`,
          filter: 'blur(40px)',
        }}
      />

      {/* Ambient glow layers */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsla(190, 100%, 55%, 0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: isActive ? [1, 1.25, 1.15] : [1, 1.08, 1],
          opacity: isActive ? [0.4, 0.8, 0.6] : [0.3, 0.45, 0.3],
        }}
        transition={{ duration: isActive ? 1.5 : 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsla(270, 100%, 60%, 0.12) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: isActive ? [0.3, 0.6, 0.4] : [0.25, 0.35, 0.25],
        }}
        transition={{ duration: isActive ? 1.2 : 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Falling stars */}
      {fallingStars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.left}%`,
            background: star.id % 2 === 0 
              ? 'radial-gradient(circle, hsla(190, 100%, 80%, 1) 0%, hsla(190, 100%, 60%, 0.6) 50%, transparent 100%)'
              : 'radial-gradient(circle, hsla(270, 100%, 85%, 1) 0%, hsla(270, 100%, 65%, 0.6) 50%, transparent 100%)',
            boxShadow: star.id % 2 === 0
              ? '0 0 8px hsla(190, 100%, 65%, 0.9)'
              : '0 0 8px hsla(270, 100%, 70%, 0.9)',
          }}
          animate={{
            y: ['0vh', '100vh'],
            opacity: [0, star.opacity, star.opacity, 0],
            scale: isActive ? [1, 1.3, 1.2] : [1, 1.1, 1],
          }}
          transition={{
            y: {
              duration: isActive ? star.duration * 0.7 : star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "linear",
            },
            opacity: {
              duration: isActive ? star.duration * 0.7 : star.duration,
              repeat: Infinity,
              delay: star.delay,
              times: [0, 0.1, 0.9, 1],
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}

      {/* Main illustration container with 3D tilt */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Illustration with floating animation */}
        <motion.div
          className="relative w-[85%] h-auto"
          animate={{
            y: isActive ? [0, -20, 0] : [0, -12, 0],
            scale: isActive ? 1.07 : 1,
            z: isActive ? 30 : 0,
          }}
          transition={{
            y: {
              duration: isActive ? 2.5 : 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: { duration: 0.4, ease: [0.2, 0.9, 0.2, 1] },
            z: { duration: 0.4 },
          }}
        >
          {/* Bottom fade gradient mask */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 25%)',
            }}
          />

          {/* Glow behind image - intensifies on hover */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(ellipse at 50% 40%, 
                hsla(190, 100%, 55%, ${isActive ? 0.25 : 0.12}) 0%, 
                hsla(270, 100%, 60%, ${isActive ? 0.15 : 0.08}) 30%, 
                transparent 60%
              )`,
              filter: `blur(${isActive ? 35 : 25}px)`,
              transform: 'scale(1.3)',
            }}
            animate={{
              opacity: isActive ? [0.8, 1, 0.8] : [0.6, 0.75, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* The image */}
          <motion.img
            src={heroReaderNew}
            alt="Magical reading illustration"
            className="w-full h-auto object-contain relative z-10"
            style={{
              filter: isActive 
                ? 'drop-shadow(0 0 50px hsla(190, 100%, 60%, 0.5)) drop-shadow(0 0 100px hsla(270, 100%, 65%, 0.35)) drop-shadow(0 0 25px hsla(200, 100%, 75%, 0.4))' 
                : 'drop-shadow(0 0 30px hsla(190, 100%, 55%, 0.3)) drop-shadow(0 0 60px hsla(270, 100%, 60%, 0.2))',
              transition: 'filter 0.4s ease-out',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Sparkle accents */}
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: sparkle.top,
            bottom: sparkle.bottom,
            left: sparkle.left,
            right: sparkle.right,
          }}
          animate={{
            opacity: isActive ? [0.6, 1, 0.6] : [0.3, 0.7, 0.3],
            scale: isActive ? [1.1, 1.5, 1.1] : [0.9, 1.2, 0.9],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: isActive ? 2 : 3,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" 
              fill={i % 2 === 0 ? "hsla(190, 100%, 75%, 0.95)" : "hsla(270, 100%, 80%, 0.95)"}
              style={{
                filter: i % 2 === 0 
                  ? 'drop-shadow(0 0 6px hsla(190, 100%, 60%, 0.9))'
                  : 'drop-shadow(0 0 6px hsla(270, 100%, 65%, 0.9))',
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Ripple ring effect on hover */}
      <AnimatePresence>
        {isActive && ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              border: '2px solid hsla(190, 100%, 70%, 0.5)',
              boxShadow: '0 0 20px hsla(190, 100%, 55%, 0.3), 0 0 40px hsla(270, 100%, 60%, 0.2)',
            }}
            initial={{ width: '40%', height: '40%', opacity: 0.8 }}
            animate={{ 
              width: ['40%', '95%'],
              height: ['40%', '95%'],
              opacity: [0.8, 0],
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Secondary expanding glow ring */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full pointer-events-none"
            style={{
              border: '1.5px solid hsla(270, 100%, 70%, 0.4)',
              boxShadow: '0 0 25px hsla(270, 100%, 60%, 0.25), inset 0 0 25px hsla(190, 100%, 55%, 0.1)',
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.08, 1],
            }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>

      {/* Spark burst on hover activation */}
      <AnimatePresence>
        {isActive && [...Array(8)].map((_, i) => {
          const angle = (i / 8) * 360;
          return (
            <motion.div
              key={`burst-${i}`}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none"
              style={{
                background: i % 2 === 0 
                  ? 'hsla(190, 100%, 70%, 0.9)'
                  : 'hsla(270, 100%, 75%, 0.9)',
                boxShadow: i % 2 === 0
                  ? '0 0 10px hsla(190, 100%, 60%, 0.8)'
                  : '0 0 10px hsla(270, 100%, 65%, 0.8)',
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0,
                opacity: 1,
              }}
              animate={{ 
                x: Math.cos(angle * Math.PI / 180) * 120,
                y: Math.sin(angle * Math.PI / 180) * 120,
                scale: [0, 1.5, 0],
                opacity: [1, 0.8, 0],
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default HeroIllustration;
