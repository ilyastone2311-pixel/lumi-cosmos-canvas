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
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-16 animate-fade-in">
          How Lumi works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.link)}
              className="group relative animate-fade-in text-left"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Card */}
              <div className="relative p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]">
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                
                {/* Hover glow effect */}
                <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r from-primary to-secondary blur-xl" />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                    <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;