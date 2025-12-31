import { useState, useRef, useEffect } from "react";
import BackgroundEffects from "@/components/BackgroundEffects";
import CategoryCard from "@/components/CategoryCard";
import AnimatedHeading from "@/components/AnimatedHeading";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, X } from "lucide-react";

import categoryPolitics from "@/assets/category-politics-new.webp";
import categoryPsychology from "@/assets/category-psychology-new.webp";
import categoryCulture from "@/assets/category-culture-new.webp";
import categoryTechnology from "@/assets/category-technology-new.webp";
import categoryMindfulness from "@/assets/category-mindfulness-new.webp";
import categoryHistory from "@/assets/category-history-new.webp";
import categoryGrowth from "@/assets/category-growth-new.webp";
import categoryScience from "@/assets/category-science-new.webp";
import categoryBusiness from "@/assets/category-business-new.webp";

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

const filterOptions = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
  { id: "popular", label: "Popular" },
  { id: "recent", label: "Recent" },
];

const Library = () => {
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const favoriteCategories = categories.filter(cat => isFavorite(cat.title));
  const otherCategories = categories.filter(cat => !isFavorite(cat.title));

  // Filter categories based on search and filter
  const getFilteredCategories = () => {
    let filtered = categories;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(cat => 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeFilter === "favorites" && user) {
      filtered = filtered.filter(cat => isFavorite(cat.title));
    } else if (activeFilter === "popular") {
      filtered = [...filtered].sort((a, b) => b.articleCount - a.articleCount);
    }
    
    return filtered;
  };

  const filteredCategories = getFilteredCategories();

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <BackgroundEffects />

        <main id="main-content" className="relative z-10 pt-20 pb-24 px-4">
          <div className="container mx-auto">
            {/* Header */}
            <header className="mb-4">
              <AnimatedHeading 
                text="Your Library"
                tag="h1"
                className="font-display text-2xl font-bold text-foreground mb-2"
                delay={50}
                duration={0.5}
                stagger={0.03}
                threshold={0.1}
                textAlign="left"
              />
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {user ? "Your favorites are marked with a heart." : "Sign in to save favorites."}
              </motion.p>
            </header>

            {/* Sticky Search & Filters */}
            <div className="sticky top-14 z-20 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/30">
              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-card/80 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Filter Chips */}
              <div 
                className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeFilter === filter.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-card/80 text-muted-foreground border border-border/50 hover:bg-card"
                    }`}
                  >
                    {filter.label}
                    {filter.id === "favorites" && user && (
                      <span className="ml-1 opacity-70">({favorites.length})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Grid - 2 columns on mobile, single column on very small */}
            <section className="mt-4">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">No categories found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 min-[320px]:grid-cols-2 max-[319px]:grid-cols-1 gap-2.5">
                  {filteredCategories.map((category, index) => (
                    <div
                      key={category.title}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <CategoryCard
                        title={category.title}
                        subtitle={category.subtitle}
                        image={category.image}
                        isFavorite={isFavorite(category.title)}
                        onToggleFavorite={() => toggleFavorite(category.title)}
                        libraryCompact
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Stats Footer - Compact */}
            <footer className="mt-8 pt-6 border-t border-border/30">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="font-display text-lg font-bold text-primary">9</p>
                  <p className="text-[10px] text-muted-foreground">Categories</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-secondary">314</p>
                  <p className="text-[10px] text-muted-foreground">Articles</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-accent">5m</p>
                  <p className="text-[10px] text-muted-foreground">Avg. Read</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-foreground">{favorites.length}</p>
                  <p className="text-[10px] text-muted-foreground">Favorites</p>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    );
  }

  // Desktop Layout (unchanged)
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