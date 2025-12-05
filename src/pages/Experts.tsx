import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import { ArrowLeft, Award, BookOpen, Linkedin, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const experts = [
  {
    name: "Dr. Sarah Chen",
    role: "Psychology & Mindfulness Expert",
    bio: "Former Stanford researcher with 15 years of experience in cognitive behavioral therapy and mindfulness practices.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    articles: 48,
  },
  {
    name: "Marcus Thompson",
    role: "Technology & Innovation Writer",
    bio: "Ex-Google engineer turned tech journalist. Covers AI, blockchain, and emerging technologies.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    articles: 62,
  },
  {
    name: "Dr. Elena Rodriguez",
    role: "History & Culture Curator",
    bio: "Harvard PhD in Ancient History. Passionate about making historical insights relevant to modern life.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    articles: 35,
  },
  {
    name: "James Nakamura",
    role: "Business & Leadership Coach",
    bio: "Former Fortune 500 CEO advisor. Specializes in leadership development and organizational psychology.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    articles: 54,
  },
  {
    name: "Dr. Priya Sharma",
    role: "Science & Health Editor",
    bio: "Medical doctor and science communicator. Makes complex scientific concepts accessible to everyone.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    articles: 41,
  },
  {
    name: "Alex Rivera",
    role: "Personal Growth Specialist",
    bio: "Life coach and bestselling author. Helps readers unlock their potential through actionable insights.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    articles: 73,
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
          <header className="text-center mb-16 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Expert Curators
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the minds behind our carefully curated content
            </p>
          </header>

          {/* Experts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert, index) => (
              <div
                key={expert.name}
                className="glass gradient-border rounded-2xl p-6 animate-fade-in hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Avatar */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
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

                {/* Stats & Social */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>{expert.articles} articles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors btn-hover">
                      <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors btn-hover">
                      <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Join CTA */}
          <section className="mt-16 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="glass gradient-border rounded-2xl p-8 md:p-12">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Become a Curator
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Are you an expert in your field? Join our team of curators and help shape the future of learning.
              </p>
              <button className="btn-primary px-8 py-3 rounded-full font-display font-semibold">
                Apply Now
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Experts;