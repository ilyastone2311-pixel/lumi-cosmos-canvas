import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroIllustration from "@/assets/hero-illustration.png";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-foreground">Short reads</span>
              <br />
              <span className="text-foreground">for quick insights</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-md">
              Discover books, articles, and ideas for self-improvement
            </p>

            <button
              onClick={() => navigate(user ? "/" : "/auth")}
              className="group relative px-8 py-4 rounded-full font-display font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-105"
            >
              {/* Button gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-shimmer rounded-full" />
              
              {/* Glow effect */}
              <span className="absolute inset-0 opacity-50 blur-xl bg-gradient-to-r from-primary to-secondary rounded-full" />
              
              {/* Text */}
              <span className="relative">Get started</span>
            </button>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '200ms' }}>
            {/* Glowing orb behind illustration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-secondary/30 rounded-full blur-[80px]" />
            
            {/* Light trails */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[400px] h-[400px] border border-primary/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute w-[320px] h-[320px] border border-secondary/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            </div>

            {/* Illustration */}
            <img
              src={heroIllustration}
              alt="Person reading with glowing lights"
              className="relative z-10 w-full max-w-lg mx-auto animate-float"
            />

            {/* Sparkles */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-foreground rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 right-1/6 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;