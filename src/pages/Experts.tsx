import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import AnimatedHeading from "@/components/AnimatedHeading";
import { motion } from "framer-motion";
import { ArrowLeft, Award, BookOpen, Linkedin, Twitter, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const experts = [
  {
    name: "Sarah Chen",
    role: "Psychology & Mindfulness",
    bio: "Former therapist who got tired of seeing the same advice repackaged. Now she distills what actually works.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    articles: 48,
    quote: "Most self-help books have one good idea stretched over 300 pages.",
  },
  {
    name: "Marcus Thompson",
    role: "Tech & Innovation",
    bio: "Ex-engineer who realized he was better at explaining things than building them. Your friendly tech translator.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    articles: 62,
    quote: "Technology should make sense, not make you feel dumb.",
  },
  {
    name: "Elena Rodriguez",
    role: "History & Culture",
    bio: "History PhD who thinks dusty textbooks are a crime. Making the past feel surprisingly relevant.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    articles: 35,
    quote: "History isn't about memorizing dates. It's about recognizing patterns.",
  },
  {
    name: "James Nakamura",
    role: "Business & Leadership",
    bio: "Spent 20 years in boardrooms, now spends time making leadership advice actually actionable.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    articles: 54,
    quote: "Every 'overnight success' story skips the boring middle part.",
  },
  {
    name: "Priya Sharma",
    role: "Science & Health",
    bio: "Doctor by training, science communicator by passion. Explains complex stuff without the jargon.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    articles: 41,
    quote: "Your body is wild. Most people have no idea what's happening inside them.",
  },
  {
    name: "Alex Rivera",
    role: "Personal Growth",
    bio: "Former skeptic of self-help who found the gems worth sharing. Now helps others skip the fluff.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    articles: 73,
    quote: "Growth isn't linear. It's more like a weird squiggle.",
  },
];

const Experts = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
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
            <AnimatedHeading
              text="The Humans Behind Lumi"
              tag="h1"
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
              delay={100}
              duration={0.5}
              stagger={0.025}
              threshold={0.1}
              textAlign="center"
            />
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Real people who read way too many books so you don't have to.
            </motion.p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert, index) => (
              <motion.div
                key={expert.name}
                className="glass organic-border p-6 imperfect-card hover:bg-white/5 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Avatar */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 group-hover:border-primary/60 transition-colors"
                  />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {expert.name}
                    </h3>
                    <p className="text-sm text-primary">{expert.role}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {expert.bio}
                </p>

                {/* Quote */}
                <div className="flex gap-2 mb-4 p-3 bg-white/5 rounded-lg">
                  <Quote className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 italic">
                    "{expert.quote}"
                  </p>
                </div>

                {/* Stats & Social */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>{expert.articles} articles</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors btn-hover">
                      <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors btn-hover">
                      <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Join CTA */}
          <motion.section 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass gradient-border organic-border p-8 md:p-12">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <AnimatedHeading
                text="Think you'd fit in?"
                tag="h2"
                className="font-display text-2xl font-semibold text-foreground mb-3"
                delay={100}
                duration={0.5}
                stagger={0.03}
                threshold={0.2}
                textAlign="center"
              />
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We're always looking for curious minds who can turn complex ideas into 
                something you'd actually want to read. No corporate speak required.
              </p>
              <button className="btn-primary px-8 py-3 rounded-full font-display font-semibold btn-hover">
                Say hi →
              </button>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Experts;