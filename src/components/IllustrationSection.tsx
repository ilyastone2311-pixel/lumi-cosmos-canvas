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
      className="relative py-24 overflow-hidden"
    >
      {/* Soft pastel gradient background pocket */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(var(--background)) 0%, 
              hsla(270, 30%, 95%, 0.08) 15%,
              hsla(200, 40%, 95%, 0.1) 50%,
              hsla(270, 30%, 95%, 0.08) 85%,
              hsl(var(--background)) 100%
            )
          `,
        }}
      />

      {/* Decorative soft shapes */}
      <div className="absolute top-1/4 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-56 h-56 rounded-full bg-gradient-to-tl from-accent/5 to-primary/5 blur-3xl" />

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
                className="relative rounded-3xl overflow-hidden p-8"
                style={{
                  background: 'linear-gradient(135deg, hsla(270, 40%, 97%, 0.95) 0%, hsla(200, 40%, 97%, 0.9) 100%)',
                  boxShadow: '0 20px 60px hsla(230, 50%, 5%, 0.15), 0 0 0 1px hsla(210, 40%, 98%, 0.1)',
                }}
              >
                <img
                  src={illustrationReaders}
                  alt="People reading together"
                  className="w-full h-auto rounded-2xl"
                />
                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/20 blur-xl"
                  animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 lg:order-2 space-y-6">
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: 'linear-gradient(135deg, hsla(var(--primary), 0.15) 0%, hsla(var(--secondary), 0.15) 100%)',
                  border: '1px solid hsla(var(--primary), 0.2)',
                }}
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
              className="relative rounded-3xl overflow-hidden p-8 hover-lift"
              style={{
                background: 'linear-gradient(135deg, hsla(40, 50%, 97%, 0.9) 0%, hsla(320, 40%, 97%, 0.85) 100%)',
                boxShadow: '0 15px 50px hsla(230, 50%, 5%, 0.1)',
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.img
                  src={illustrationDiscovery}
                  alt="Discovery moment"
                  className="w-32 h-32 object-contain"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="text-center md:text-left">
                  <h3 className="font-display text-xl font-semibold text-gray-800 mb-2">
                    Discover New Ideas
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Every article sparks curiosity and opens doors to new perspectives.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mindful Card */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-3xl overflow-hidden p-8 hover-lift"
              style={{
                background: 'linear-gradient(135deg, hsla(270, 40%, 97%, 0.9) 0%, hsla(180, 40%, 97%, 0.85) 100%)',
                boxShadow: '0 15px 50px hsla(230, 50%, 5%, 0.1)',
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.img
                  src={illustrationMindful}
                  alt="Mindful learning"
                  className="w-32 h-32 object-contain"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="text-center md:text-left">
                  <h3 className="font-display text-xl font-semibold text-gray-800 mb-2">
                    Learn at Your Pace
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
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
