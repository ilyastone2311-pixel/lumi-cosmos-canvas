import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion, type Variants } from "framer-motion";

import illustrationReaders from "@/assets/illustration-readers.png";
import illustrationDiscovery from "@/assets/illustration-discovery.png";
import illustrationMindful from "@/assets/illustration-mindful.png";

const IllustrationSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

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
                className="relative rounded-3xl overflow-hidden p-8 bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50"
                style={{
                  boxShadow: `
                    0 0 0 1px hsla(var(--primary), 0.1),
                    0 20px 60px hsla(var(--foreground), 0.1)
                  `,
                }}
              >
                {/* Top edge glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                
                <img
                  src={illustrationReaders}
                  alt="People reading together"
                  className="w-full h-auto rounded-2xl"
                  style={{
                    filter: 'drop-shadow(0 10px 30px hsla(var(--foreground), 0.1))',
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
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Learn Together, Grow Together
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join thousands of curious minds exploring ideas across psychology, 
                technology, mindfulness, and more. Our bite-sized insights make 
                learning accessible and enjoyable.
              </p>
            </motion.div>
          </div>

          {/* Feature Cards with Illustrations */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Discovery Card */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-3xl overflow-hidden p-8 hover-lift bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50"
              style={{
                boxShadow: `
                  0 0 0 1px hsla(var(--primary), 0.08),
                  0 15px 50px hsla(var(--foreground), 0.08)
                `,
              }}
            >
              {/* Top edge glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 dark:via-yellow-500/30 to-transparent" />
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.img
                  src={illustrationDiscovery}
                  alt="Discovery moment"
                  className="w-32 h-32 object-contain"
                  style={{
                    filter: 'drop-shadow(0 8px 20px hsla(var(--foreground), 0.15))',
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
              className="relative rounded-3xl overflow-hidden p-8 hover-lift bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50"
              style={{
                boxShadow: `
                  0 0 0 1px hsla(var(--primary), 0.08),
                  0 15px 50px hsla(var(--foreground), 0.08)
                `,
              }}
            >
              {/* Top edge glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.img
                  src={illustrationMindful}
                  alt="Mindful learning"
                  className="w-32 h-32 object-contain"
                  style={{
                    filter: 'drop-shadow(0 8px 20px hsla(var(--foreground), 0.15))',
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