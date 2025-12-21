import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import AnimatedHeading from "@/components/AnimatedHeading";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, BookOpen, Target, Users, Coffee, Heart } from "lucide-react";
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
          <header className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              <AnimatedHeading
                text="About Lumi"
                tag="h1"
                className="font-display text-4xl md:text-5xl font-bold text-foreground"
                delay={100}
                duration={0.5}
                stagger={0.035}
                threshold={0.1}
                textAlign="center"
              />
            </div>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              We're a small team who got tired of never finishing books.
            </motion.p>
          </header>

          <section className="mb-16">
            <motion.div 
              className="glass organic-border p-8 md:p-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Coffee className="w-6 h-6 text-primary" />
                <AnimatedHeading
                  text="How it started"
                  tag="h2"
                  className="font-display text-2xl font-semibold text-foreground"
                  delay={400}
                  duration={0.5}
                  stagger={0.03}
                  threshold={0.1}
                />
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Real talk: we started Lumi because our reading lists were getting out of control. 
                Hundreds of books saved "for later," browser tabs we'd never get back to, and that 
                guilty feeling every time we walked past our bookshelves.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                So we asked ourselves—what if we could capture the <span className="text-primary">
                soul of a book</span> in 5 minutes? Not cliff notes. Not dumbed-down summaries. 
                But the actual insights that stick with you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                That's Lumi. It's what we wished existed when we were drowning in our "to-read" 
                pile at 2am. We hope it helps you too.
              </p>
            </motion.div>
          </section>

          {/* What we care about */}
          <section className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Heart className="w-5 h-5 text-accent" />
              <AnimatedHeading
                text="What we actually care about"
                tag="h2"
                className="font-display text-2xl font-semibold text-foreground text-center"
                delay={100}
                duration={0.5}
                stagger={0.02}
                threshold={0.15}
                textAlign="center"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: "Quality over quantity",
                  description: "We'd rather have 50 great summaries than 5000 mediocre ones. Every piece goes through actual humans (not just AI)."
                },
                {
                  icon: Sparkles,
                  title: "Making you smarter",
                  description: "We use spaced repetition and key takeaways because we actually researched what helps people remember stuff."
                },
                {
                  icon: Users,
                  title: "Our weird community",
                  description: "We have a Discord. People share book recommendations at 3am. It's lovely and slightly chaotic."
                },
                {
                  icon: Target,
                  title: "Your time matters",
                  description: "No dark patterns. No infinite scroll traps. Read, learn, go live your life. That's the whole point."
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="glass organic-border p-6 imperfect-card hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Numbers - less corporate */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass gradient-border organic-border p-8">
              <p className="text-center text-muted-foreground mb-6 text-sm">
                Some numbers (we're not obsessed with metrics, promise)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <p className="font-display text-3xl font-bold text-primary mb-1">500+</p>
                  <p className="text-sm text-muted-foreground">Summaries</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-secondary mb-1">50K</p>
                  <p className="text-sm text-muted-foreground">Readers</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-accent mb-1">4.8★</p>
                  <p className="text-sm text-muted-foreground">Avg rating</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-foreground mb-1">∞</p>
                  <p className="text-sm text-muted-foreground">Coffee consumed</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default About;