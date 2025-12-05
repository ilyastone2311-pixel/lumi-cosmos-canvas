import { Clock, List, Smartphone } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Bitesized",
    description: "Get the key insights of the world's best books in 5 min.",
  },
  {
    icon: List,
    title: "Curated",
    description: "Explore top content on diverse topics selected by experts",
  },
  {
    icon: Smartphone,
    title: "Accessible",
    description: "Read and listen on your phone, tablet or computer",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-16 animate-fade-in">
          How Lumi works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Card */}
              <div className="relative p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80">
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;