import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedLetters from "@/components/AnimatedLetters";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const headlines = [
  "Design in Motion",
  "Create Beautiful",
  "Animate Everything",
  "Typography Lives",
  "Spring Physics",
];

const MotionShowcase = () => {
  const [key, setKey] = useState(0);
  const [activeDemo, setActiveDemo] = useState(0);

  const resetAnimation = () => {
    setKey(prev => prev + 1);
  };

  // Auto-cycle demos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo(prev => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Motion Typography Showcase</span>
          <Button
            variant="outline"
            size="sm"
            onClick={resetAnimation}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Replay
          </Button>
        </div>
      </div>

      {/* Main showcase area */}
      <div className="pt-24 pb-16">
        {/* Hero demo */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
              Spring Animation • Letter by Letter
            </span>
          </div>
          
          <div className="relative flex items-center justify-center min-h-[200px]" key={key}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute"
              >
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-center">
                  <AnimatedLetters 
                    text={headlines[activeDemo]} 
                    staggerDelay={0.04}
                  />
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Demo indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {headlines.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveDemo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeDemo 
                    ? "bg-primary w-8" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Stagger variations */}
        <section className="container mx-auto px-6 py-16 border-t border-border/40">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
              Stagger Timing Variations
            </span>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Different stagger delays create unique rhythmic effects
            </p>
          </div>

          <div className="space-y-16" key={`stagger-${key}`}>
            {/* Fast stagger */}
            <div className="text-center">
              <span className="text-xs text-muted-foreground/60 mb-4 block">Fast (0.02s delay)</span>
              <h2 className="text-4xl md:text-6xl font-bold">
                <AnimatedLetters text="Quick Cascade" staggerDelay={0.02} delay={0} />
              </h2>
            </div>

            {/* Medium stagger */}
            <div className="text-center">
              <span className="text-xs text-muted-foreground/60 mb-4 block">Medium (0.05s delay)</span>
              <h2 className="text-4xl md:text-6xl font-bold">
                <AnimatedLetters text="Smooth Flow" staggerDelay={0.05} delay={0.5} />
              </h2>
            </div>

            {/* Slow stagger */}
            <div className="text-center">
              <span className="text-xs text-muted-foreground/60 mb-4 block">Slow (0.08s delay)</span>
              <h2 className="text-4xl md:text-6xl font-bold">
                <AnimatedLetters text="Dramatic Entry" staggerDelay={0.08} delay={1} />
              </h2>
            </div>
          </div>
        </section>

        {/* Motion breakdown */}
        <section className="container mx-auto px-6 py-16 border-t border-border/40">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
              Motion Breakdown
            </span>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Visualizing the animation phases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Start state */}
            <div className="bg-muted/30 rounded-2xl p-8 border border-border/40">
              <span className="text-xs uppercase tracking-wider text-muted-foreground mb-4 block">Start</span>
              <div className="h-24 flex items-end justify-center">
                <div className="flex gap-1">
                  {["A", "n", "i", "m", "a", "t", "e"].map((letter, i) => (
                    <span 
                      key={i} 
                      className="text-4xl font-bold opacity-20 translate-y-8"
                      style={{ transform: `translateY(${20 + i * 2}px) rotateX(-45deg)` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Letters positioned below with rotation
              </p>
            </div>

            {/* Mid state */}
            <div className="bg-muted/30 rounded-2xl p-8 border border-border/40">
              <span className="text-xs uppercase tracking-wider text-muted-foreground mb-4 block">Mid</span>
              <div className="h-24 flex items-end justify-center">
                <div className="flex gap-1">
                  {["A", "n", "i", "m", "a", "t", "e"].map((letter, i) => (
                    <span 
                      key={i} 
                      className="text-4xl font-bold"
                      style={{ 
                        opacity: 0.3 + (i * 0.1),
                        transform: `translateY(${10 - i * 3}px)`,
                        filter: `blur(${Math.max(0, 3 - i)}px)`
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Spring motion with staggered timing
              </p>
            </div>

            {/* End state */}
            <div className="bg-muted/30 rounded-2xl p-8 border border-border/40">
              <span className="text-xs uppercase tracking-wider text-muted-foreground mb-4 block">End</span>
              <div className="h-24 flex items-end justify-center">
                <div className="flex gap-1">
                  {["A", "n", "i", "m", "a", "t", "e"].map((letter, i) => (
                    <span 
                      key={i} 
                      className="text-4xl font-bold"
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Letters settled in final position
              </p>
            </div>
          </div>
        </section>

        {/* Spring physics */}
        <section className="container mx-auto px-6 py-16 border-t border-border/40">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
              Spring Physics Parameters
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-xl p-6 border border-primary/20">
              <span className="text-3xl font-bold text-primary">200</span>
              <p className="text-xs text-muted-foreground mt-2">Stiffness</p>
            </div>
            <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-xl p-6 border border-primary/20">
              <span className="text-3xl font-bold text-primary">12</span>
              <p className="text-xs text-muted-foreground mt-2">Damping</p>
            </div>
            <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-xl p-6 border border-primary/20">
              <span className="text-3xl font-bold text-primary">0.8</span>
              <p className="text-xs text-muted-foreground mt-2">Mass</p>
            </div>
            <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-xl p-6 border border-primary/20">
              <span className="text-3xl font-bold text-primary">50px</span>
              <p className="text-xs text-muted-foreground mt-2">Y Offset</p>
            </div>
          </div>
        </section>

        {/* Mixed content demo */}
        <section className="container mx-auto px-6 py-20 border-t border-border/40">
          <div className="max-w-4xl mx-auto" key={`mixed-${key}`}>
            <div className="mb-8">
              <h2 className="text-5xl md:text-7xl font-bold mb-4">
                <AnimatedLetters text="Build Interfaces" delay={0} staggerDelay={0.03} />
              </h2>
              <h2 className="text-5xl md:text-7xl font-bold text-muted-foreground/50 mb-4">
                <AnimatedLetters text="That Feel Alive" delay={0.5} staggerDelay={0.03} />
              </h2>
              <h2 className="text-5xl md:text-7xl font-bold text-primary">
                <AnimatedLetters text="With Motion" delay={1} staggerDelay={0.04} />
              </h2>
            </div>
            <motion.p 
              className="text-lg text-muted-foreground max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              Create memorable user experiences with thoughtfully crafted typography animations that guide attention and bring your interface to life.
            </motion.p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MotionShowcase;
