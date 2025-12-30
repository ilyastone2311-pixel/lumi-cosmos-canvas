import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedHeading from "./AnimatedHeading";
import { useIsMobile } from "@/hooks/use-mobile";

import illustrationLearnTogether from "@/assets/illustration-learn-together.webp";
import illustrationDiscoverNewIdeas from "@/assets/illustration-discover-new-ideas.webp";
import illustrationLearnAtYourPace from "@/assets/illustration-learn-at-your-pace.webp";

const IllustrationSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  const featureCards = [
    {
      id: 1,
      image: illustrationDiscoverNewIdeas,
      alt: "Discover new ideas illustration",
      title: "Discover New Ideas",
      description: "Every article sparks curiosity and opens doors to new perspectives.",
      glowColor: "via-amber-500/30 dark:via-yellow-500/30",
      hoverRotate: 2,
    },
    {
      id: 2,
      image: illustrationLearnAtYourPace,
      alt: "Learn at your pace illustration",
      title: "Learn at Your Pace",
      description: "Short reads designed for busy minds seeking meaningful growth.",
      glowColor: "via-secondary/40",
      hoverRotate: -2,
    },
  ];

  // Handle mobile carousel scroll
  useEffect(() => {
    if (!isMobile || !carouselRef.current) return;

    const handleScroll = () => {
      const container = carouselRef.current;
      if (!container) return;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.8;
      const newActive = Math.round(scrollLeft / cardWidth);
      setActiveCard(Math.min(newActive, featureCards.length - 1));
    };

    const container = carouselRef.current;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, featureCards.length]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, x: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  // Mobile layout
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative py-12 overflow-hidden"
      >
        {/* Subtle cosmic glow - reduced for mobile */}
        <div className="absolute top-1/4 left-4 w-24 h-24 rounded-full bg-gradient-to-br from-primary/8 to-secondary/6 blur-2xl" />
        <div className="absolute bottom-1/4 right-4 w-32 h-32 rounded-full bg-gradient-to-tl from-accent/6 to-primary/8 blur-2xl" />

        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="space-y-8"
          >
            {/* Mobile: Illustration first */}
            <motion.div variants={imageVariants}>
              <div 
                className="relative rounded-2xl overflow-hidden p-4 bg-card/95 dark:bg-card/80 backdrop-blur-xl border border-border/50 mx-auto max-w-sm"
                style={{
                  boxShadow: `
                    0 0 0 1px hsla(var(--border), 0.2),
                    0 12px 40px hsla(var(--foreground), 0.08)
                  `,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <img
                  src={illustrationLearnTogether}
                  alt="Learn together and grow together"
                  className="w-full h-auto rounded-xl"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </motion.div>

            {/* Mobile: Headline and description */}
            <motion.div variants={itemVariants} className="space-y-4 text-center">
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-medium text-primary bg-primary/10 border border-primary/20"
              >
                Community
              </span>
              
              <AnimatedHeading 
                text="Learn Together, Grow Together"
                tag="h2"
                className="font-display text-2xl font-bold text-foreground"
                delay={100}
                duration={0.5}
                stagger={0.025}
                threshold={0.2}
                textAlign="center"
              />
              <p className="text-base text-muted-foreground leading-relaxed px-2">
                Join thousands of curious minds exploring ideas across psychology, 
                technology, mindfulness, and more.
              </p>
            </motion.div>

            {/* Mobile: Swipeable feature cards carousel */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div 
                ref={carouselRef}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featureCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex-shrink-0 snap-center"
                    style={{ width: '80%' }}
                  >
                    <div
                      className="relative rounded-2xl overflow-hidden p-5 bg-card/95 dark:bg-card/80 backdrop-blur-xl border border-border/50 h-full"
                      style={{
                        boxShadow: `
                          0 0 0 1px hsla(var(--border), 0.2),
                          0 10px 30px hsla(var(--foreground), 0.06)
                        `,
                      }}
                    >
                      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${card.glowColor} to-transparent`} />
                      
                      <div className="flex flex-col items-center text-center gap-4">
                        <img
                          src={card.image}
                          alt={card.alt}
                          className="w-20 h-20 object-contain"
                          loading="lazy"
                          decoding="async"
                          style={{
                            filter: 'drop-shadow(0 6px 15px hsla(var(--foreground), 0.12))',
                          }}
                        />
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-1.5">
                            {card.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination dots */}
              <div className="flex justify-center gap-2">
                {featureCards.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeCard === index
                        ? 'bg-primary w-5'
                        : 'bg-muted-foreground/30'
                    }`}
                    onClick={() => {
                      carouselRef.current?.scrollTo({
                        left: index * carouselRef.current.offsetWidth * 0.8,
                        behavior: 'smooth',
                      });
                    }}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Desktop layout (unchanged)
  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-24 overflow-hidden"
    >
      {/* Decorative glowing shapes - theme aware */}
      <div className="absolute top-1/4 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-secondary/8 blur-3xl dark:opacity-100 opacity-50" />
      <div className="absolute bottom-1/4 right-10 w-56 h-56 rounded-full bg-gradient-to-tl from-accent/8 to-primary/10 blur-3xl dark:opacity-100 opacity-50" />

      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-20"
        >
          {/* Main Illustration Block */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={imageVariants} className="order-2 lg:order-1">
              <div 
                className="relative rounded-3xl overflow-hidden p-8 bg-card/95 dark:bg-card/80 backdrop-blur-xl border border-border/50"
                style={{
                  boxShadow: `
                    0 0 0 1px hsla(var(--border), 0.2),
                    0 20px 60px hsla(var(--foreground), 0.1),
                    inset 0 1px 1px hsla(var(--card), 0.5)
                  `,
                }}
              >
                {/* Top edge glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                
                <img
                  src={illustrationLearnTogether}
                  alt="Learn together and grow together"
                  className="w-full h-auto rounded-2xl"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  style={{
                    filter: 'drop-shadow(0 10px 30px hsla(var(--foreground), 0.1))',
                    willChange: 'transform',
                  }}
                />
                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/30 blur-xl"
                  animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-secondary/25 blur-lg"
                  animate={{ y: [0, 8, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 lg:order-2 space-y-6">
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-primary bg-primary/10 border border-primary/20"
              >
                Community
              </span>
              
              {/* Glass panel for readability (keeps spacing from "Community") */}
              <div className="rounded-2xl bg-background/60 backdrop-blur-md border border-border/40 p-6 sm:p-8">
                <AnimatedHeading 
                  text="Learn Together, Grow Together"
                  tag="h2"
                  className="font-display text-3xl md:text-4xl font-bold text-foreground"
                  delay={100}
                  duration={0.5}
                  stagger={0.025}
                  threshold={0.2}
                  textAlign="left"
                />
                <p className="text-lg text-muted-foreground leading-relaxed mt-5">
                  Join thousands of curious minds exploring ideas across psychology, 
                  technology, mindfulness, and more. Our bite-sized insights make 
                  learning accessible and enjoyable.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Feature Cards with Illustrations */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Discovery Card */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-3xl overflow-hidden p-8 hover-lift bg-card/95 dark:bg-card/80 backdrop-blur-xl border border-border/50"
              style={{
                boxShadow: `
                  0 0 0 1px hsla(var(--border), 0.2),
                  0 15px 50px hsla(var(--foreground), 0.08),
                  inset 0 1px 1px hsla(var(--card), 0.5)
                `,
              }}
            >
              {/* Top edge glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 dark:via-yellow-500/30 to-transparent" />
              
              <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.img
                  src={illustrationDiscoverNewIdeas}
                  alt="Discover new ideas illustration"
                  className="w-32 h-32 object-contain"
                  loading="lazy"
                  decoding="async"
                  style={{
                    filter: 'drop-shadow(0 8px 20px hsla(var(--foreground), 0.15))',
                    willChange: 'transform',
                  }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="text-center md:text-left">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Discover New Ideas
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every article sparks curiosity and opens doors to new perspectives.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mindful Card */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-3xl overflow-hidden p-8 hover-lift bg-card/95 dark:bg-card/80 backdrop-blur-xl border border-border/50"
              style={{
                boxShadow: `
                  0 0 0 1px hsla(var(--border), 0.2),
                  0 15px 50px hsla(var(--foreground), 0.08),
                  inset 0 1px 1px hsla(var(--card), 0.5)
                `,
              }}
            >
              {/* Top edge glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
              
              <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.img
                  src={illustrationLearnAtYourPace}
                  alt="Learn at your pace illustration"
                  className="w-32 h-32 object-contain"
                  loading="lazy"
                  decoding="async"
                  style={{
                    filter: 'drop-shadow(0 8px 20px hsla(var(--foreground), 0.15))',
                    willChange: 'transform',
                  }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="text-center md:text-left">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Learn at Your Pace
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Short reads designed for busy minds seeking meaningful growth.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IllustrationSection;