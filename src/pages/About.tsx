import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import { ArrowLeft, Sparkles, BookOpen, Target, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 mb-8 group btn-hover"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Header */}
          <header className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                About Lumi
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your gateway to knowledge in bite-sized pieces
            </p>
          </header>

          {/* Mission Section */}
          <section className="mb-16 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="glass gradient-border rounded-2xl p-8 md:p-12">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At Lumi, we believe that knowledge should be accessible, engaging, and efficient. 
                In today's fast-paced world, finding time to read lengthy books and articles can be challenging. 
                That's why we've created a platform that distills the essence of the world's best ideas into 
                short, impactful reads that you can consume in just 5 minutes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our team of experts carefully curates and summarizes content across diverse topics—from 
                psychology and technology to history and personal growth—ensuring you get maximum value 
                from minimal time investment.
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-8 text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
              What Makes Us Different
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: "Expertly Curated",
                  description: "Every piece of content is handpicked and summarized by subject matter experts."
                },
                {
                  icon: Sparkles,
                  title: "Science-Backed",
                  description: "Our learning approach is based on cognitive science research for optimal retention."
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  description: "Join thousands of curious minds on their journey to continuous learning."
                },
                {
                  icon: Target,
                  title: "Goal Oriented",
                  description: "Track your progress and build consistent reading habits with our tools."
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="glass rounded-xl p-6 animate-fade-in hover:bg-white/10 transition-all duration-300"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="glass gradient-border rounded-2xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <p className="font-display text-3xl font-bold text-primary mb-1">500+</p>
                  <p className="text-sm text-muted-foreground">Book Summaries</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-secondary mb-1">50K+</p>
                  <p className="text-sm text-muted-foreground">Active Readers</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-accent mb-1">9</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-foreground mb-1">5 min</p>
                  <p className="text-sm text-muted-foreground">Average Read</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;