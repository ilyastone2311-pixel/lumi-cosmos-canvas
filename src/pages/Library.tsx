import BackgroundEffects from "@/components/BackgroundEffects";
import CategoryCard from "@/components/CategoryCard";
import AnimatedHeading from "@/components/AnimatedHeading";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";

import categoryPolitics from "@/assets/category-politics-neon.png";
import categoryPsychology from "@/assets/category-psychology-neon.png";
import categoryCulture from "@/assets/category-culture-neon.png";
import categoryTechnology from "@/assets/category-technology-neon.png";
import categoryMindfulness from "@/assets/category-mindfulness-neon.png";
import categoryHistory from "@/assets/category-history-neon.png";
import categoryGrowth from "@/assets/category-growth-neon.png";
import categoryScience from "@/assets/category-science-neon.png";
import categoryBusiness from "@/assets/category-business-neon.png";

const categories = [
  {
    title: "Politics",
    subtitle: "Global affairs, governance, and power dynamics shaping our world",
    image: categoryPolitics,
    articleCount: 24,
  },
  {
    title: "Psychology",
    subtitle: "Explore the depths of the human mind and behavior",
    image: categoryPsychology,
    articleCount: 32,
  },
  {
    title: "Culture",
    subtitle: "Art, traditions, and the threads that connect humanity",
    image: categoryCulture,
    articleCount: 18,
  },
  {
    title: "Technology",
    subtitle: "Innovations and digital frontiers reshaping tomorrow",
    image: categoryTechnology,
    articleCount: 45,
  },
  {
    title: "Mindfulness",
    subtitle: "Inner peace, meditation, and conscious living practices",
    image: categoryMindfulness,
    articleCount: 28,
  },
  {
    title: "History",
    subtitle: "Journey through time and learn from our collective past",
    image: categoryHistory,
    articleCount: 36,
  },
  {
    title: "Personal Growth",
    subtitle: "Self-improvement strategies for your best life",
    image: categoryGrowth,
    articleCount: 52,
  },
  {
    title: "Science",
    subtitle: "Discoveries that expand our understanding of reality",
    image: categoryScience,
    articleCount: 41,
  },
  {
    title: "Business",
    subtitle: "Strategy, leadership, and entrepreneurial wisdom",
    image: categoryBusiness,
    articleCount: 38,
  },
];

const Library = () => {
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { user } = useAuth();

  const favoriteCategories = categories.filter(cat => isFavorite(cat.title));
  const otherCategories = categories.filter(cat => !isFavorite(cat.title));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundEffects />

        {/* Main Content */}
        <main id="main-content" className="relative z-10 pt-20 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-10 sm:mb-16">
            <AnimatedHeading 
              text="Your Library"
              tag="h1"
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4"
              delay={50}
              duration={0.5}
              stagger={0.03}
              threshold={0.1}
              textAlign="left"
            />
            <motion.p 
              className="text-base sm:text-xl text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Browse through our curated collection of insights. 
              {user ? " Your favorites are marked with a heart." : " Sign in to save your favorites."}
            </motion.p>
          </header>

          {/* Favorites Section - Show only if user has favorites */}
          {user && favoriteCategories.length > 0 && (
            <section className="mb-10 sm:mb-16">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <AnimatedHeading
                  text="Your Favorites"
                  tag="h2"
                  className="font-display text-xl sm:text-2xl font-semibold text-foreground"
                  delay={200}
                  duration={0.5}
                  stagger={0.025}
                  threshold={0.1}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {favoriteCategories.map((category, index) => (
                  <div
                    key={category.title}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CategoryCard
                      title={category.title}
                      subtitle={category.subtitle}
                      image={category.image}
                      isFavorite={true}
                      onToggleFavorite={() => toggleFavorite(category.title)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Categories */}
          <section>
            <AnimatedHeading
              text={user && favoriteCategories.length > 0 ? "Explore More" : "All Categories"}
              tag="h2"
              className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-6 sm:mb-8"
              delay={300}
              duration={0.5}
              stagger={0.025}
              threshold={0.1}
            />
            
            {/* Multi-column layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {(user && favoriteCategories.length > 0 ? otherCategories : categories).map((category, index) => (
                <div
                  key={category.title}
                  className="animate-fade-in"
                  style={{ animationDelay: `${150 + index * 80}ms` }}
                >
                  <CategoryCard
                    title={category.title}
                    subtitle={category.subtitle}
                    image={category.image}
                    isFavorite={isFavorite(category.title)}
                    onToggleFavorite={() => toggleFavorite(category.title)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Stats Footer */}
          <footer className="mt-12 sm:mt-20 pt-8 sm:pt-12 border-t border-border/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
              <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                <p className="font-display text-2xl sm:text-3xl font-bold text-primary mb-1">9</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Categories</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
                <p className="font-display text-2xl sm:text-3xl font-bold text-secondary mb-1">314</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Articles</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
                <p className="font-display text-2xl sm:text-3xl font-bold text-accent mb-1">5 min</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Avg. Read</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '700ms' }}>
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {favorites.length}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Your Favorites</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Library;