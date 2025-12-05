import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import BackgroundEffects from "@/components/BackgroundEffects";
import ParticleField from "@/components/ParticleField";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";

import categoryPolitics from "@/assets/category-politics.jpg";
import categoryPsychology from "@/assets/category-psychology.jpg";
import categoryCulture from "@/assets/category-culture.jpg";
import categoryTechnology from "@/assets/category-technology.jpg";
import categoryMindfulness from "@/assets/category-mindfulness.jpg";
import categoryHistory from "@/assets/category-history.jpg";
import categoryGrowth from "@/assets/category-growth.jpg";
import categoryScience from "@/assets/category-science.jpg";
import categoryBusiness from "@/assets/category-business.jpg";

const categories = [
  {
    title: "Politics",
    subtitle: "Global affairs, governance, and power dynamics shaping our world",
    image: categoryPolitics,
  },
  {
    title: "Psychology",
    subtitle: "Explore the depths of the human mind and behavior",
    image: categoryPsychology,
  },
  {
    title: "Culture",
    subtitle: "Art, traditions, and the threads that connect humanity",
    image: categoryCulture,
  },
  {
    title: "Technology",
    subtitle: "Innovations and digital frontiers reshaping tomorrow",
    image: categoryTechnology,
  },
  {
    title: "Mindfulness",
    subtitle: "Inner peace, meditation, and conscious living practices",
    image: categoryMindfulness,
  },
  {
    title: "History",
    subtitle: "Journey through time and learn from our collective past",
    image: categoryHistory,
  },
  {
    title: "Personal Growth",
    subtitle: "Self-improvement strategies for your best life",
    image: categoryGrowth,
  },
  {
    title: "Science",
    subtitle: "Discoveries that expand our understanding of reality",
    image: categoryScience,
  },
  {
    title: "Business",
    subtitle: "Strategy, leadership, and entrepreneurial wisdom",
    image: categoryBusiness,
  },
];

const Index = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundEffects />
      <ParticleField />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wider mb-6 animate-fade-in">
              <span className="text-glow bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Choose Your World
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              Explore short reads across every topic
            </p>
            
            {/* User greeting */}
            {user && (
              <p className="text-primary mt-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                Welcome back! Click the heart to save your favorites.
              </p>
            )}
            
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
              <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
          </header>

          {/* Categories Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <div
                key={category.title}
                className="animate-fade-in"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <CategoryCard
                  title={category.title}
                  subtitle={category.subtitle}
                  image={category.image}
                  delay={index * 100}
                  isFavorite={isFavorite(category.title)}
                  onToggleFavorite={() => toggleFavorite(category.title)}
                />
              </div>
            ))}
          </section>

          {/* Bottom CTA */}
          <footer className="text-center mt-20 animate-fade-in" style={{ animationDelay: '1200ms' }}>
            <p className="text-muted-foreground mb-6">
              {user ? "Explore your saved favorites anytime." : "Sign in to save your favorites."}
            </p>
            <button className="group relative px-8 py-4 rounded-full font-display font-semibold tracking-wider text-foreground overflow-hidden transition-all duration-300 hover:scale-105">
              {/* Button background */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full" />
              <span className="absolute inset-0 border border-primary/30 rounded-full" />
              
              {/* Glow effect */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-xl" />
              
              {/* Text */}
              <span className="relative flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Random Read
              </span>
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
