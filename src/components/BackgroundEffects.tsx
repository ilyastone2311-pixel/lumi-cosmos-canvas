const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main cosmic gradient */}
      <div className="absolute inset-0 cosmic-bg" />

      {/* Animated gradient waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[600px]">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(270 100% 65% / 0.2)" />
              <stop offset="50%" stopColor="hsl(190 100% 50% / 0.15)" />
              <stop offset="100%" stopColor="hsl(270 100% 65% / 0.2)" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(190 100% 50% / 0.1)" />
              <stop offset="50%" stopColor="hsl(320 100% 60% / 0.08)" />
              <stop offset="100%" stopColor="hsl(190 100% 50% / 0.1)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient1)"
            d="M0,300 C360,400 720,200 1080,300 C1260,350 1440,280 1440,280 L1440,600 L0,600 Z"
            className="animate-pulse-slow"
          />
          <path
            fill="url(#waveGradient2)"
            d="M0,400 C240,350 480,450 720,380 C960,310 1200,420 1440,380 L1440,600 L0,600 Z"
            className="animate-pulse-slow"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>

      {/* Diagonal accent line */}
      <div 
        className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-30"
        style={{
          background: 'linear-gradient(135deg, transparent 40%, hsl(190 100% 50% / 0.3) 50%, transparent 60%)',
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-[10%] right-[20%] w-96 h-96 bg-primary/15 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute top-[30%] left-[5%] w-64 h-64 bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-secondary/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />

      {/* Sparkle stars */}
      <div className="absolute top-[15%] right-[35%] w-1 h-1 bg-foreground/80 rounded-full animate-pulse" />
      <div className="absolute top-[25%] left-[20%] w-1.5 h-1.5 bg-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[45%] right-[15%] w-1 h-1 bg-foreground/70 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[35%] left-[30%] w-1 h-1 bg-foreground/50 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[60%] right-[40%] w-0.5 h-0.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default BackgroundEffects;