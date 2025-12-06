import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useParallax } from "@/hooks/useParallax";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import HeroIllustration from "./HeroIllustration";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const parallaxOffset = useParallax(0.3);
  const parallaxOffsetSlow = useParallax(0.15);
  const parallaxOffsetFast = useParallax(0.5);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Illustration - positioned on the right */}
      <div className="hidden lg:block">
        <HeroIllustration />
      </div>

      {/* Ambient glow effects for depth with parallax */}
      <motion.div 
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"
        style={{
          transform: `translate(${parallaxOffsetSlow * 0.5}px, calc(-50% + ${parallaxOffsetSlow}px))`,
        }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none"
        style={{
          transform: `translateY(${parallaxOffset * 0.8}px)`,
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-[15%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"
        style={{
          transform: `translateY(${parallaxOffsetFast * 0.6}px)`,
        }}
      />

      {/* Background geometric shapes with parallax */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 border border-primary/10 rounded-lg rotate-45 pointer-events-none"
        style={{
          transform: `rotate(45deg) translateY(${parallaxOffset}px)`,
        }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-20 h-20 border border-secondary/15 rounded-full pointer-events-none"
        style={{
          transform: `translateY(${parallaxOffsetFast}px)`,
        }}
      />
      <motion.div
        className="absolute top-1/3 left-20 w-16 h-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg rotate-12 pointer-events-none"
        style={{
          transform: `rotate(12deg) translateY(${parallaxOffsetSlow}px)`,
        }}
      />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content with parallax */}
          <motion.div 
            className="space-y-8 relative z-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              transform: `translateY(${parallaxOffset * 0.2}px)`,
            }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'linear-gradient(135deg, hsla(190, 100%, 50%, 0.1) 0%, hsla(270, 100%, 65%, 0.1) 100%)',
                  border: '1px solid hsla(190, 100%, 50%, 0.2)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-foreground/80">Expand your mind daily</span>
              </span>
            </motion.div>

            <motion.h1 
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <span 
                className="text-foreground block"
                style={{
                  textShadow: '0 0 40px hsla(190, 100%, 50%, 0.1)',
                }}
              >
                Short reads
              </span>
              <span 
                className="text-foreground block"
                style={{
                  textShadow: '0 0 40px hsla(270, 100%, 65%, 0.1)',
                }}
              >
                for quick insights
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Discover books, articles, and ideas for self-improvement
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate(user ? "/library" : "/auth")}
                className="group relative px-8 py-4 rounded-full font-display font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-[0.98]"
              >
                {/* Button gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-shimmer rounded-full" />
                
                {/* Glow effect */}
                <span className="absolute inset-0 opacity-50 blur-xl bg-gradient-to-r from-primary to-secondary rounded-full group-hover:opacity-70 transition-opacity" />
                
                {/* Text */}
                <span className="relative">Get started</span>
              </button>

              <button
                onClick={() => navigate("/library")}
                className="group px-8 py-4 rounded-full font-display font-semibold text-foreground overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-[0.98]"
                style={{
                  background: 'hsla(230, 40%, 15%, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid hsla(210, 40%, 98%, 0.1)',
                }}
              >
                <span className="relative flex items-center gap-2">
                  Explore Library
                  <ChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right side - placeholder for layout balance */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[500px]" />
        </div>
      </div>

      {/* Scroll Hint Arrow */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        aria-label="Scroll to content"
      >
        <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
          Scroll to explore
        </span>
        <motion.div
          className="relative"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'hsla(230, 40%, 15%, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid hsla(190, 100%, 50%, 0.2)',
              boxShadow: '0 0 20px hsla(190, 100%, 50%, 0.1)',
            }}
          >
            <ChevronDown className="w-5 h-5 text-primary" />
          </div>
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>
      </motion.button>

      {/* Bottom fade gradient - extended for seamless transition */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 md:h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)) 0%, hsla(var(--background), 0.8) 30%, transparent 100%)',
        }}
      />
    </section>
  );
};

export default HeroSection;