import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";

const CyberLofiReader = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBookText, setShowBookText] = useState(false);
  const parallaxOffset = useParallax(0.2);
  const ringControls = useAnimation();
  const textTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const bookInsights = [
    "Bitesized Insight",
    "Curated Knowledge", 
    "Accessible Format",
  ];

  useEffect(() => {
    if (isHovered) {
      // Accelerate rings briefly
      ringControls.start({
        transition: { duration: 0.2 }
      });
      
      // Show book text with pixelate effect
      setShowBookText(true);
      
      // Clear any existing timeout
      if (textTimeoutRef.current) {
        clearTimeout(textTimeoutRef.current);
      }
      
      // Fade out text after 1.5s
      textTimeoutRef.current = setTimeout(() => {
        setShowBookText(false);
      }, 1500);
    }
    
    return () => {
      if (textTimeoutRef.current) {
        clearTimeout(textTimeoutRef.current);
      }
    };
  }, [isHovered, ringControls]);

  return (
    <div 
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[45vw] h-[70vh] min-w-[300px] max-w-[600px] min-h-[400px] max-h-[700px] pointer-events-none lg:pointer-events-auto z-10"
      style={{
        transform: `translateY(calc(-50% + ${parallaxOffset}px))`,
      }}
    >
      {/* Cosmic nebula background with parallax */}
      <motion.div 
        className="absolute inset-0 overflow-hidden rounded-3xl"
        style={{
          transform: `translateY(${parallaxOffset * 0.5}px)`,
        }}
      >
        {/* Deep space gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsla(270, 80%, 25%, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, hsla(280, 70%, 20%, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, hsla(250, 60%, 15%, 0.5) 0%, transparent 70%),
              linear-gradient(180deg, hsla(260, 50%, 8%, 0.9) 0%, hsla(240, 40%, 5%, 0.95) 100%)
            `,
          }}
        />
        
        {/* Nebula dust particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsla(${200 + Math.random() * 80}, 80%, 70%, ${0.3 + Math.random() * 0.4})`,
              boxShadow: `0 0 ${4 + Math.random() * 6}px hsla(${200 + Math.random() * 80}, 100%, 60%, 0.5)`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Neon energy rings - counter-rotating */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer ring - electric blue */}
        <motion.div
          className="absolute w-[80%] h-[80%] rounded-full"
          style={{
            border: '2px solid transparent',
            background: `linear-gradient(hsla(260, 50%, 10%, 0.3), hsla(260, 50%, 10%, 0.3)) padding-box,
                        linear-gradient(135deg, hsla(190, 100%, 50%, 0.8) 0%, hsla(190, 100%, 60%, 0.2) 25%, hsla(300, 100%, 60%, 0.8) 50%, hsla(190, 100%, 60%, 0.2) 75%, hsla(190, 100%, 50%, 0.8) 100%) border-box`,
            boxShadow: `
              0 0 30px hsla(190, 100%, 50%, 0.3),
              inset 0 0 30px hsla(190, 100%, 50%, 0.1)
            `,
          }}
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: isHovered ? 4 : 20, 
            repeat: Infinity, 
            ease: "linear",
          }}
        />
        
        {/* Inner ring - magenta */}
        <motion.div
          className="absolute w-[60%] h-[60%] rounded-full"
          style={{
            border: '2px solid transparent',
            background: `linear-gradient(hsla(260, 50%, 10%, 0.2), hsla(260, 50%, 10%, 0.2)) padding-box,
                        linear-gradient(45deg, hsla(300, 100%, 60%, 0.8) 0%, hsla(300, 100%, 70%, 0.2) 25%, hsla(190, 100%, 50%, 0.8) 50%, hsla(300, 100%, 70%, 0.2) 75%, hsla(300, 100%, 60%, 0.8) 100%) border-box`,
            boxShadow: `
              0 0 25px hsla(300, 100%, 60%, 0.3),
              inset 0 0 25px hsla(300, 100%, 60%, 0.1)
            `,
          }}
          animate={{ 
            rotate: -360,
          }}
          transition={{ 
            duration: isHovered ? 3 : 20, 
            repeat: Infinity, 
            ease: "linear",
          }}
        />

        {/* Third energy ring - cyan accent */}
        <motion.div
          className="absolute w-[45%] h-[45%] rounded-full"
          style={{
            border: '1px solid hsla(180, 100%, 50%, 0.4)',
            boxShadow: `0 0 15px hsla(180, 100%, 50%, 0.2)`,
          }}
          animate={{ 
            rotate: 360,
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            rotate: { duration: isHovered ? 6 : 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>

      {/* Central figure - stylized reading silhouette */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -3 : 0,
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ perspective: 1000 }}
      >
        {/* Figure container with metallic effect */}
        <div 
          className="relative w-[35%] h-[55%] flex items-center justify-center"
          style={{
            filter: isHovered 
              ? 'drop-shadow(0 0 40px hsla(190, 100%, 50%, 0.6)) drop-shadow(0 0 80px hsla(300, 100%, 60%, 0.4))' 
              : 'drop-shadow(0 0 20px hsla(190, 100%, 50%, 0.3)) drop-shadow(0 0 40px hsla(300, 100%, 60%, 0.2))',
            transition: 'filter 0.2s ease-out',
          }}
        >
          {/* Reading figure SVG */}
          <svg 
            viewBox="0 0 200 300" 
            className="w-full h-full"
            style={{
              filter: isHovered ? 'brightness(1.5)' : 'brightness(1)',
              transition: 'filter 0.2s ease-out',
            }}
          >
            <defs>
              {/* Metallic gradient for figure */}
              <linearGradient id="metallicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsla(220, 30%, 25%, 1)" />
                <stop offset="30%" stopColor="hsla(240, 20%, 35%, 1)" />
                <stop offset="50%" stopColor="hsla(260, 25%, 40%, 1)" />
                <stop offset="70%" stopColor="hsla(280, 20%, 30%, 1)" />
                <stop offset="100%" stopColor="hsla(250, 30%, 20%, 1)" />
              </linearGradient>
              
              {/* Neon reflection gradient */}
              <linearGradient id="neonReflection" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsla(190, 100%, 50%, 0.3)" />
                <stop offset="50%" stopColor="hsla(270, 100%, 60%, 0.2)" />
                <stop offset="100%" stopColor="hsla(300, 100%, 60%, 0.3)" />
              </linearGradient>

              {/* Book glow effect */}
              <filter id="bookGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Head - smooth oval */}
            <ellipse 
              cx="100" 
              cy="50" 
              rx="28" 
              ry="35" 
              fill="url(#metallicGradient)"
              style={{
                filter: 'drop-shadow(0 0 8px hsla(190, 100%, 50%, 0.3))',
              }}
            />
            
            {/* Neck */}
            <rect 
              x="90" 
              y="80" 
              width="20" 
              height="25" 
              fill="url(#metallicGradient)"
            />
            
            {/* Torso - reading posture, slightly hunched */}
            <path 
              d="M60 100 Q100 95 140 100 L145 180 Q100 185 55 180 Z" 
              fill="url(#metallicGradient)"
              style={{
                filter: 'drop-shadow(0 0 10px hsla(190, 100%, 50%, 0.2))',
              }}
            />
            
            {/* Left arm - holding book */}
            <path 
              d="M60 110 Q40 130 35 170 Q40 175 50 170 Q55 140 70 125" 
              fill="url(#metallicGradient)"
            />
            
            {/* Right arm - holding book */}
            <path 
              d="M140 110 Q160 130 165 170 Q160 175 150 170 Q145 140 130 125" 
              fill="url(#metallicGradient)"
            />
            
            {/* Hands merged into book shape */}
            <ellipse 
              cx="100" 
              cy="175" 
              rx="55" 
              ry="8" 
              fill="url(#metallicGradient)"
            />

            {/* Book - open with glow */}
            <g filter="url(#bookGlow)">
              <path 
                d="M50 165 Q100 155 150 165 L150 205 Q100 195 50 205 Z" 
                fill="hsla(220, 40%, 20%, 0.9)"
                stroke="hsla(190, 100%, 50%, 0.5)"
                strokeWidth="1"
              />
              {/* Book pages glow */}
              <path 
                d="M55 170 Q100 162 145 170 L145 200 Q100 192 55 200 Z" 
                fill="hsla(190, 100%, 50%, 0.1)"
              />
              
              {/* Book spine highlight */}
              <line 
                x1="100" 
                y1="158" 
                x2="100" 
                y2="198" 
                stroke="hsla(190, 100%, 50%, 0.4)" 
                strokeWidth="1"
              />
            </g>

            {/* Neon reflection overlay */}
            <ellipse 
              cx="100" 
              cy="50" 
              rx="26" 
              ry="33" 
              fill="url(#neonReflection)"
              opacity="0.5"
            />
            <path 
              d="M62 102 Q100 97 138 102 L143 178 Q100 183 57 178 Z" 
              fill="url(#neonReflection)"
              opacity="0.3"
            />
          </svg>

          {/* Book text overlay - appears on hover */}
          {showBookText && (
            <motion.div
              className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-[70%] text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pixelate/flicker effect container */}
              <motion.div
                initial={{ filter: 'blur(4px)', opacity: 0.5 }}
                animate={{ 
                  filter: ['blur(4px)', 'blur(0px)'],
                  opacity: [0.5, 1],
                }}
                transition={{ duration: 0.3 }}
                className="space-y-1"
              >
                {bookInsights.map((insight, i) => (
                  <motion.p
                    key={insight}
                    className="text-[0.5rem] sm:text-[0.6rem] font-medium tracking-wide"
                    style={{
                      color: 'hsla(190, 100%, 60%, 1)',
                      textShadow: '0 0 10px hsla(190, 100%, 50%, 0.8), 0 0 20px hsla(190, 100%, 50%, 0.4)',
                    }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.2 }}
                  >
                    • {insight}
                  </motion.p>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Ambient floating particles around figure */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            left: `${30 + Math.random() * 40}%`,
            top: `${20 + Math.random() * 60}%`,
            background: i % 2 === 0 
              ? 'hsla(190, 100%, 50%, 0.6)' 
              : 'hsla(300, 100%, 60%, 0.6)',
            boxShadow: i % 2 === 0
              ? '0 0 12px hsla(190, 100%, 50%, 0.8)'
              : '0 0 12px hsla(300, 100%, 60%, 0.8)',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() > 0.5 ? 10 : -10, 0],
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Corner energy accents */}
      <motion.div
        className="absolute top-[10%] right-[15%] w-16 h-16"
        style={{
          background: 'radial-gradient(circle, hsla(190, 100%, 50%, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[20%] w-12 h-12"
        style={{
          background: 'radial-gradient(circle, hsla(300, 100%, 60%, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
};

export default CyberLofiReader;
