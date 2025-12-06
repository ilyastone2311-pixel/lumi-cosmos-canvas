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
      className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[60vw] h-[85vh] min-w-[380px] max-w-[800px] min-h-[480px] max-h-[850px] z-10 pointer-events-auto"
      style={{
        transform: `translateY(calc(-50% + ${parallaxOffset}px))`,
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTap}
    >
      {/* Seamless ambient background blend - NO hard edges */}
      <div 
        className="absolute inset-[-20%] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 70% at 50% 45%, 
            hsla(250, 60%, 12%, 0.5) 0%, 
            hsla(230, 55%, 8%, 0.3) 35%, 
            transparent 65%
          )`,
          filter: 'blur(60px)',
        }}
      />

      {/* Secondary soft blend layer */}
      <div 
        className="absolute inset-[-15%] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 55% 50%, 
            hsla(270, 50%, 15%, 0.35) 0%, 
            hsla(200, 60%, 12%, 0.2) 40%, 
            transparent 70%
          )`,
          filter: 'blur(80px)',
        }}
      />

      {/* Ambient glow layers - soft and diffused */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, hsla(190, 100%, 55%, 0.12) 0%, transparent 55%)',
          filter: 'blur(70px)',
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1.1] : [1, 1.06, 1],
          opacity: isActive ? [0.35, 0.7, 0.5] : [0.25, 0.4, 0.25],
        }}
        transition={{ duration: isActive ? 1.5 : 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-[38%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[55%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, hsla(270, 100%, 60%, 0.1) 0%, transparent 55%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: isActive ? [1, 1.15, 1] : [1, 1.08, 1],
          opacity: isActive ? [0.25, 0.5, 0.35] : [0.2, 0.3, 0.2],
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
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Illustration with floating animation */}
        <motion.div
          className="relative w-[90%] h-auto"
          animate={{
            y: isActive ? [0, -18, 0] : [0, -10, 0],
            scale: isActive ? 1.06 : 1,
            z: isActive ? 25 : 0,
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
          {/* Soft ambient glow behind image - seamless blend */}
          <motion.div
            className="absolute inset-[-25%] -z-10"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 45%, 
                hsla(190, 100%, 55%, ${isActive ? 0.2 : 0.1}) 0%, 
                hsla(270, 100%, 60%, ${isActive ? 0.12 : 0.06}) 35%, 
                transparent 60%
              )`,
              filter: `blur(${isActive ? 50 : 40}px)`,
            }}
            animate={{
              opacity: isActive ? [0.7, 1, 0.7] : [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Soft edge blend - bottom fade into background */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: `linear-gradient(to top, 
                hsl(var(--background)) 0%, 
                hsla(var(--background), 0.8) 8%,
                hsla(var(--background), 0.4) 15%,
                hsla(var(--background), 0.1) 25%,
                transparent 35%
              )`,
            }}
          />

          {/* Side edge blends for seamless integration */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: `
                linear-gradient(to left, 
                  hsla(var(--background), 0.6) 0%, 
                  hsla(var(--background), 0.2) 5%,
                  transparent 15%
                ),
                linear-gradient(to right, 
                  hsla(var(--background), 0.3) 0%, 
                  transparent 10%
                )
              `,
            }}
          />

          {/* The image - full visibility, no clipping */}
          <motion.img
            src={heroReaderNew}
            alt="Magical reading illustration"
            className="w-full h-auto object-contain relative z-10"
            style={{
              filter: isActive 
                ? 'drop-shadow(0 0 40px hsla(190, 100%, 60%, 0.45)) drop-shadow(0 0 80px hsla(270, 100%, 65%, 0.3)) drop-shadow(0 0 20px hsla(200, 100%, 75%, 0.35))' 
                : 'drop-shadow(0 0 25px hsla(190, 100%, 55%, 0.25)) drop-shadow(0 0 50px hsla(270, 100%, 60%, 0.15))',
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
            opacity: isActive ? [0.5, 0.9, 0.5] : [0.25, 0.6, 0.25],
            scale: isActive ? [1.1, 1.4, 1.1] : [0.9, 1.15, 0.9],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: isActive ? 2 : 3.5,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" 
              fill={i % 2 === 0 ? "hsla(190, 100%, 75%, 0.9)" : "hsla(270, 100%, 80%, 0.9)"}
              style={{
                filter: i % 2 === 0 
                  ? 'drop-shadow(0 0 5px hsla(190, 100%, 60%, 0.85))'
                  : 'drop-shadow(0 0 5px hsla(270, 100%, 65%, 0.85))',
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
              border: '1.5px solid hsla(190, 100%, 70%, 0.4)',
              boxShadow: '0 0 15px hsla(190, 100%, 55%, 0.25), 0 0 30px hsla(270, 100%, 60%, 0.15)',
            }}
            initial={{ width: '35%', height: '35%', opacity: 0.7 }}
            animate={{ 
              width: ['35%', '90%'],
              height: ['35%', '90%'],
              opacity: [0.7, 0],
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Secondary expanding glow ring */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full pointer-events-none"
            style={{
              border: '1px solid hsla(270, 100%, 70%, 0.3)',
              boxShadow: '0 0 20px hsla(270, 100%, 60%, 0.2), inset 0 0 20px hsla(190, 100%, 55%, 0.08)',
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ 
              opacity: [0.35, 0.6, 0.35],
              scale: [1, 1.06, 1],
            }}
            exit={{ opacity: 0, scale: 1.08 }}
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
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                background: i % 2 === 0 
                  ? 'hsla(190, 100%, 70%, 0.85)'
                  : 'hsla(270, 100%, 75%, 0.85)',
                boxShadow: i % 2 === 0
                  ? '0 0 8px hsla(190, 100%, 60%, 0.75)'
                  : '0 0 8px hsla(270, 100%, 65%, 0.75)',
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0,
                opacity: 1,
              }}
              animate={{ 
                x: Math.cos(angle * Math.PI / 180) * 100,
                y: Math.sin(angle * Math.PI / 180) * 100,
                scale: [0, 1.3, 0],
                opacity: [1, 0.7, 0],
              }}
              transition={{ 
                duration: 0.7,
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
