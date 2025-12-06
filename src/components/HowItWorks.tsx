import { Clock, List, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      {/* Top blend gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none -z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, hsla(230, 50%, 8%, 0.1))',
        }}
      />
      
      {/* Ambient section glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-primary/5 via-secondary/8 to-primary/5 rounded-full blur-[150px]" />
      </div>
      
      {/* Bottom blend gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none -z-10"
        style={{
          background: 'linear-gradient(to top, transparent, hsla(270, 50%, 10%, 0.1))',
        }}
      />

      <div className="container mx-auto max-w-7xl px-6 relative">
        <h2 
          className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-20 animate-fade-in"
          style={{
            textShadow: '0 4px 30px hsla(190, 100%, 50%, 0.15)',
          }}
        >
          How Lumi works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.link)}
              className="group relative animate-fade-in text-left"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Multi-layer shadow base */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{
                  background: 'radial-gradient(ellipse at center bottom, hsla(190, 100%, 50%, 0.15) 0%, transparent 60%)',
                  filter: 'blur(25px)',
                  transform: 'translateY(10px)',
                }}
              />

              {/* Card */}
              <div 
                className="relative p-8 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 active:scale-[0.98]"
                style={{
                  background: 'hsla(230, 50%, 8%, 0.5)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid hsla(210, 40%, 98%, 0.06)',
                  boxShadow: `
                    0 0 0 1px hsla(190, 100%, 50%, 0.03),
                    0 4px 15px hsla(230, 50%, 5%, 0.3),
                    0 8px 30px hsla(230, 50%, 5%, 0.2),
                    inset 0 1px 0 hsla(210, 40%, 98%, 0.04)
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
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'hsla(190, 100%, 50%, 0.1)',
                      boxShadow: '0 0 20px hsla(190, 100%, 50%, 0.1)',
                    }}
                  >
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  {/* Icon glow */}
                  <div className="absolute inset-0 w-14 h-14 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
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
                  className="absolute bottom-8 right-8 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                  style={{
                    background: 'hsla(190, 100%, 50%, 0.1)',
                    boxShadow: '0 0 15px hsla(190, 100%, 50%, 0.2)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                    <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Floating shadow underneath */}
              <div 
                className="absolute inset-x-4 -bottom-3 h-12 rounded-2xl -z-20 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(ellipse at center, hsla(230, 50%, 5%, 0.8) 0%, transparent 70%)',
                  filter: 'blur(15px)',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;