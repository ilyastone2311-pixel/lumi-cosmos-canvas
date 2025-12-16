import { Clock, List, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Clock,
    title: "Bitesized",
    description: "Get the key insights of the world's best books in 5 min.",
    link: "/about",
  },
  {
    icon: List,
    title: "Curated",
    description: "Explore top content on diverse topics selected by experts",
    link: "/experts",
  },
  {
    icon: Smartphone,
    title: "Accessible",
    description: "Read and listen on your phone, tablet or computer",
    link: "/downloads",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 relative">
      {/* Ambient section glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-primary/3 via-secondary/3 to-primary/3 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-6 relative">
        <h2 
          className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-20 animate-fade-in"
        >
          How Lumi works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const cardRef = useRef<HTMLButtonElement>(null);

            const handleMouseMove = (e: React.MouseEvent) => {
              if (!cardRef.current) return;
              const rect = cardRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              
              const rotateX = ((y - centerY) / centerY) * -2;
              const rotateY = ((x - centerX) / centerX) * 2;
              
              cardRef.current.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-8px) 
                scale(1.02)
              `;
            };

            const handleMouseLeave = () => {
              if (cardRef.current) {
                cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
              }
            };

            return (
            <motion.button
              ref={cardRef}
              key={feature.title}
              onClick={() => navigate(feature.link)}
              className="group relative text-left"
              style={{ 
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1), box-shadow 0.4s ease',
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.2, 0.9, 0.2, 1]
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Multi-layer shadow base */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{
                  background: 'radial-gradient(ellipse at center bottom, hsla(var(--primary), 0.2) 0%, transparent 60%)',
                  filter: 'blur(25px)',
                  transform: 'translateY(15px)',
                }}
              />

              {/* Card - Glass Panel */}
              <div 
                className="relative p-8 rounded-2xl transition-all duration-400 bg-card/60 backdrop-blur-md border border-border/30"
                style={{
                  boxShadow: `
                    0 0 0 1px hsla(var(--primary), 0.03),
                    0 8px 24px hsla(var(--foreground), 0.06),
                    0 4px 12px hsla(var(--foreground), 0.03)
                  `,
                }}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 pointer-events-none" />
                
                {/* Top edge highlight */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon with enhanced glow */}
                <div className="relative mb-6">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-primary/10"
                  >
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  {/* Icon glow */}
                  <div className="absolute inset-0 w-14 h-14 rounded-xl bg-primary/15 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <h3 className="relative font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <div 
                  className="absolute bottom-8 right-8 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-primary/10"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                    <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Floating shadow underneath */}
              <div 
                className="absolute inset-x-4 -bottom-3 h-12 rounded-2xl -z-20 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-foreground/10 blur-xl"
              />
            </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
