import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import FloatingCrystal from "./FloatingCrystal";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Floating Crystal - positioned on the right */}
      <div className="hidden lg:block">
        <FloatingCrystal />
      </div>

      {/* Ambient glow effects for depth */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[15%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in relative z-20">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg">
              <span className="text-foreground">Short reads</span>
              <br />
              <span className="text-foreground">for quick insights</span>
            </h1>
            
            <p className="text-xl text-foreground/80 max-w-md drop-shadow-md">
              Discover books, articles, and ideas for self-improvement
            </p>

            <button
              onClick={() => navigate(user ? "/" : "/auth")}
              className="group relative px-8 py-4 rounded-full font-display font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-105 btn-hover"
            >
              {/* Button gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-shimmer rounded-full" />
              
              {/* Glow effect */}
              <span className="absolute inset-0 opacity-50 blur-xl bg-gradient-to-r from-primary to-secondary rounded-full" />
              
              {/* Text */}
              <span className="relative">Get started</span>
            </button>
          </div>

          {/* Right side - space for crystal */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[500px]">
            {/* Decorative rings behind the crystal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[350px] h-[350px] border border-primary/20 rounded-full animate-spin" style={{ animationDuration: '25s' }} />
              <div className="absolute w-[280px] h-[280px] border border-secondary/15 rounded-full animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
              <div className="absolute w-[200px] h-[200px] border border-accent/10 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
            </div>

            {/* Sparkle accents */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-foreground rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 right-1/6 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;