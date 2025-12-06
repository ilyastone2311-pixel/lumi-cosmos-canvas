import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "wave" | "gradient" | "glow";
  flip?: boolean;
}

const SectionDivider = ({ variant = "wave", flip = false }: SectionDividerProps) => {
  if (variant === "wave") {
    return (
      <div 
        className={`relative w-full h-32 md:h-48 overflow-hidden pointer-events-none ${flip ? 'rotate-180' : ''}`}
        style={{ marginTop: flip ? 0 : '-1px', marginBottom: flip ? '-1px' : 0 }}
      >
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsla(190, 100%, 50%, 0.1)" />
              <stop offset="50%" stopColor="hsla(270, 100%, 65%, 0.15)" />
              <stop offset="100%" stopColor="hsla(190, 100%, 50%, 0.1)" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsla(270, 100%, 65%, 0.05)" />
              <stop offset="50%" stopColor="hsla(190, 100%, 50%, 0.08)" />
              <stop offset="100%" stopColor="hsla(270, 100%, 65%, 0.05)" />
            </linearGradient>
          </defs>
          
          {/* Background wave */}
          <motion.path
            d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,128C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#waveGradient2)"
            initial={{ x: 0 }}
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Foreground wave */}
          <motion.path
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#waveGradient)"
            initial={{ x: 0 }}
            animate={{ x: [20, -20, 20] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        
        {/* Glow line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, hsla(190, 100%, 50%, 0.3), hsla(270, 100%, 65%, 0.3), transparent)',
            boxShadow: '0 0 20px hsla(190, 100%, 50%, 0.2)',
          }}
        />
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className="relative w-full h-24 md:h-32 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              transparent 0%, 
              hsla(270, 60%, 20%, 0.1) 30%,
              hsla(190, 80%, 30%, 0.08) 50%,
              hsla(270, 60%, 20%, 0.1) 70%,
              transparent 100%
            )`,
          }}
        />
        
        {/* Animated particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${15 + i * 18}%`,
              top: '50%',
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Center glow line */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px"
          style={{
            width: '60%',
            background: 'linear-gradient(90deg, transparent, hsla(190, 100%, 50%, 0.4), transparent)',
            boxShadow: '0 0 30px hsla(190, 100%, 50%, 0.3)',
          }}
          animate={{
            scaleX: [0.8, 1, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  // Glow variant
  return (
    <div className="relative w-full h-20 md:h-28 overflow-hidden pointer-events-none">
      {/* Ambient glow blob */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsla(190, 100%, 50%, 0.15) 0%, hsla(270, 100%, 65%, 0.1) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Subtle line */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, hsla(190, 100%, 50%, 0.5), transparent)',
        }}
      />
    </div>
  );
};

export default SectionDivider;
