import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useParallax } from "@/hooks/useParallax";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import HeroIllustration from "./HeroIllustration";

// Premium easing
const premiumEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

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
    <section className="relative min-h-[85vh] sm:min-h-[100vh] flex items-center pt-16 sm:pt-0 overflow-visible">
      {/* Hero Illustration - positioned on the right */}
      <motion.div 
        className="hidden lg:block absolute inset-0 overflow-visible pointer-events-none"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: premiumEase }}
      >
        <HeroIllustration />
      </motion.div>

      {/* Subtle ambient glow effects */}
      <motion.div 
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: premiumEase }}
        style={{
          transform: `translate(${parallaxOffsetSlow * 0.5}px, calc(-50% + ${parallaxOffsetSlow}px))`,
        }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: premiumEase }}
        style={{
          transform: `translateY(${parallaxOffset * 0.8}px)`,
        }}
      />

      {/* Background geometric shape - subtle */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 border border-primary/5 rounded-lg rotate-45 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: premiumEase }}
        style={{
          transform: `rotate(45deg) translateY(${parallaxOffset * 0.3}px)`,
        }}
      />

      {/* Main content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text content - Left side */}
          <motion.div 
            className="text-center lg:text-left space-y-6 sm:space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: premiumEase }}
          >
            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: premiumEase }}
            >
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                <span className="block mb-2">Your shortcut</span>
                <span 
                  className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer"
                >
                  for quick insights
                </span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: premiumEase }}
            >
              Discover books, articles, and ideas for self-improvement
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start pt-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: premiumEase }}
            >
              <motion.button
                onClick={() => user ? navigate("/library") : navigate("/auth")}
                className="group relative px-6 sm:px-8 py-4 sm:py-4 rounded-2xl sm:rounded-full font-display font-semibold text-primary-foreground overflow-hidden transition-all duration-300 min-h-[52px] active:scale-[0.97]"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Button gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-shimmer rounded-2xl sm:rounded-full" />
                
                {/* Glow effect */}
                <span className="absolute inset-0 opacity-50 blur-xl bg-gradient-to-r from-primary to-secondary rounded-2xl sm:rounded-full group-hover:opacity-70 transition-opacity" />
                
                {/* Text */}
                <span className="relative text-base">Get started</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/library")}
                className="group w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-4 rounded-2xl sm:rounded-full font-display font-semibold text-foreground overflow-hidden transition-all duration-300 bg-card/60 backdrop-blur-md border border-border/50 text-center min-h-[52px] active:scale-[0.97]"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative flex items-center justify-center gap-2 text-base">
                  Explore Library
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Mobile illustration placeholder */}
          <div className="lg:hidden" />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
        onClick={scrollToContent}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1, ease: premiumEase }}
      >
        <span className="text-muted-foreground text-sm font-medium">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-card/60 backdrop-blur-md border border-primary/20"
            style={{
              boxShadow: '0 0 20px hsl(var(--primary) / 0.1)',
            }}
          >
            <ChevronDown className="w-5 h-5 text-primary" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
