import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import BackgroundEffects from "@/components/BackgroundEffects";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
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

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <HeroSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Categories Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in">
                Explore Categories
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
                {user 
                  ? "Click the heart to save your favorites" 
                  : "Dive into topics that spark your curiosity"
                }
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.title}
                  className="animate-fade-in"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
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
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="relative p-12 rounded-3xl glass gradient-border animate-fade-in">
              {/* Background glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
              
              <h3 className="relative font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to expand your mind?
              </h3>
              <p className="relative text-muted-foreground mb-8 max-w-md mx-auto">
                {user 
                  ? "Explore your saved favorites anytime" 
                  : "Join thousands of curious minds on their learning journey"
                }
              </p>
              <button className="relative group px-8 py-4 rounded-full font-display font-semibold overflow-hidden transition-all duration-300 hover:scale-105">
                {/* Button background */}
                <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-full border border-primary/30" />
                
                {/* Glow effect on hover */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-xl rounded-full" />
                
                {/* Text */}
                <span className="relative flex items-center gap-3 text-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Random Read
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;