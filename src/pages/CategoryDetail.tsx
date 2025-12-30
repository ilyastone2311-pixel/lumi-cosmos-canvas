import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import ArticlePreviewCard from "@/components/ArticlePreviewCard";
import AnimatedHeading from "@/components/AnimatedHeading";
import { motion } from "framer-motion";
import { SkeletonGrid } from "@/components/ui/skeleton-card";
import { ArrowLeft, Clock, Star, ChevronRight, TrendingUp, Sparkles, Timer } from "lucide-react";
import { getArticlesByCategory, Article } from "@/data/articles";
import { useIsMobile } from "@/hooks/use-mobile";

import categoryPolitics from "@/assets/category-politics-new.webp";
import categoryPsychology from "@/assets/category-psychology-new.webp";
import categoryCulture from "@/assets/category-culture-new.webp";
import categoryTechnology from "@/assets/category-technology-new.webp";
import categoryMindfulness from "@/assets/category-mindfulness-new.webp";
import categoryHistory from "@/assets/category-history-new.webp";
import categoryGrowth from "@/assets/category-growth-new.webp";
import categoryScience from "@/assets/category-science-new.webp";
import categoryBusiness from "@/assets/category-business-new.webp";

const categoryData: Record<string, { image: string; description: string; articles: { id: string; title: string; author: string; readTime: number; rating: number }[] }> = {
  politics: {
    image: categoryPolitics,
    description: "Explore global affairs, governance, and power dynamics shaping our world today.",
    articles: [
      { id: "1", title: "The Future of Democracy in the Digital Age", author: "Dr. Sarah Chen", readTime: 5, rating: 4.8 },
      { id: "2", title: "Understanding Global Trade Dynamics", author: "Marcus Thompson", readTime: 4, rating: 4.5 },
      { id: "3", title: "Climate Policy: A Political Challenge", author: "Elena Rodriguez", readTime: 6, rating: 4.7 },
      { id: "4", title: "The Rise of Political Polarization", author: "James Nakamura", readTime: 5, rating: 4.6 },
    ]
  },
  psychology: {
    image: categoryPsychology,
    description: "Dive deep into the human mind, behavior patterns, and cognitive sciences.",
    articles: [
      { id: "1", title: "The Science of Habit Formation", author: "Dr. Priya Sharma", readTime: 5, rating: 4.9 },
      { id: "2", title: "Understanding Emotional Intelligence", author: "Alex Rivera", readTime: 4, rating: 4.7 },
      { id: "3", title: "Cognitive Biases That Affect Decisions", author: "Dr. Sarah Chen", readTime: 6, rating: 4.8 },
      { id: "4", title: "The Psychology of Motivation", author: "James Nakamura", readTime: 5, rating: 4.5 },
    ]
  },
  culture: {
    image: categoryCulture,
    description: "Discover art, traditions, and the threads that connect humanity across time.",
    articles: [
      { id: "1", title: "The Evolution of Modern Art", author: "Elena Rodriguez", readTime: 5, rating: 4.6 },
      { id: "2", title: "Cultural Traditions Around the World", author: "Dr. Sarah Chen", readTime: 6, rating: 4.8 },
      { id: "3", title: "Music's Impact on Society", author: "Alex Rivera", readTime: 4, rating: 4.5 },
      { id: "4", title: "The Future of Cultural Identity", author: "Marcus Thompson", readTime: 5, rating: 4.7 },
    ]
  },
  technology: {
    image: categoryTechnology,
    description: "Stay updated on innovations and digital frontiers reshaping tomorrow.",
    articles: [
      { id: "1", title: "AI and the Future of Work", author: "Marcus Thompson", readTime: 5, rating: 4.9 },
      { id: "2", title: "Blockchain Beyond Cryptocurrency", author: "Dr. Priya Sharma", readTime: 6, rating: 4.6 },
      { id: "3", title: "The Ethics of Artificial Intelligence", author: "James Nakamura", readTime: 5, rating: 4.8 },
      { id: "4", title: "Quantum Computing Explained", author: "Marcus Thompson", readTime: 7, rating: 4.7 },
    ]
  },
  mindfulness: {
    image: categoryMindfulness,
    description: "Find inner peace through meditation and conscious living practices.",
    articles: [
      { id: "1", title: "The Science of Meditation", author: "Dr. Sarah Chen", readTime: 5, rating: 4.9 },
      { id: "2", title: "Building a Daily Mindfulness Practice", author: "Alex Rivera", readTime: 4, rating: 4.8 },
      { id: "3", title: "Stress Management Techniques", author: "Dr. Priya Sharma", readTime: 5, rating: 4.7 },
      { id: "4", title: "The Art of Present Living", author: "Alex Rivera", readTime: 4, rating: 4.6 },
    ]
  },
  history: {
    image: categoryHistory,
    description: "Journey through time and learn from our collective past.",
    articles: [
      { id: "1", title: "Lessons from Ancient Civilizations", author: "Elena Rodriguez", readTime: 6, rating: 4.8 },
      { id: "2", title: "The Industrial Revolution's Legacy", author: "Dr. Sarah Chen", readTime: 5, rating: 4.7 },
      { id: "3", title: "World Wars: A Historical Analysis", author: "Elena Rodriguez", readTime: 7, rating: 4.9 },
      { id: "4", title: "The Digital Age Origins", author: "Marcus Thompson", readTime: 5, rating: 4.6 },
    ]
  },
  "personal-growth": {
    image: categoryGrowth,
    description: "Transform yourself with proven self-improvement strategies.",
    articles: [
      { id: "1", title: "Building Unshakeable Confidence", author: "Alex Rivera", readTime: 5, rating: 4.9 },
      { id: "2", title: "The Power of Morning Routines", author: "James Nakamura", readTime: 4, rating: 4.8 },
      { id: "3", title: "Goal Setting That Actually Works", author: "Alex Rivera", readTime: 5, rating: 4.7 },
      { id: "4", title: "Overcoming Fear of Failure", author: "Dr. Sarah Chen", readTime: 5, rating: 4.8 },
    ]
  },
  science: {
    image: categoryScience,
    description: "Expand your understanding of the universe and its wonders.",
    articles: [
      { id: "1", title: "The Mysteries of Dark Matter", author: "Dr. Priya Sharma", readTime: 6, rating: 4.8 },
      { id: "2", title: "CRISPR and Gene Editing", author: "Marcus Thompson", readTime: 5, rating: 4.9 },
      { id: "3", title: "Climate Science Fundamentals", author: "Dr. Priya Sharma", readTime: 5, rating: 4.7 },
      { id: "4", title: "The Human Brain: Latest Discoveries", author: "Dr. Sarah Chen", readTime: 6, rating: 4.8 },
    ]
  },
  business: {
    image: categoryBusiness,
    description: "Master strategy, leadership, and entrepreneurial wisdom.",
    articles: [
      { id: "1", title: "Building a Startup from Zero", author: "James Nakamura", readTime: 6, rating: 4.9 },
      { id: "2", title: "Leadership in the Modern Era", author: "Alex Rivera", readTime: 5, rating: 4.7 },
      { id: "3", title: "Financial Literacy Essentials", author: "James Nakamura", readTime: 5, rating: 4.6 },
      { id: "4", title: "The Art of Negotiation", author: "Dr. Sarah Chen", readTime: 5, rating: 4.8 },
    ]
  },
};

type SortOption = 'top' | 'new' | 'short';

const sortOptions: { id: SortOption; label: string; icon: typeof TrendingUp }[] = [
  { id: 'top', label: 'Top', icon: TrendingUp },
  { id: 'new', label: 'New', icon: Sparkles },
  { id: 'short', label: 'Short reads', icon: Timer },
];

// Mobile compact article card component
const MobileArticleCard = ({ 
  article, 
  index,
  categoryImage 
}: { 
  article: Article; 
  index: number;
  categoryImage: string;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article.category}/${article.id}`);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="w-full flex gap-3 p-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 text-left active:scale-[0.98] transition-transform"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        boxShadow: '0 2px 12px hsla(var(--foreground), 0.04)',
      }}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
        <img
          src={categoryImage}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-1">
            {article.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {article.excerpt}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {article.rating}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 flex items-center">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </motion.button>
  );
};

const CategoryDetail = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSort, setActiveSort] = useState<SortOption>('top');

  const categoryKey = category?.toLowerCase().replace(/\s+/g, '-') || '';
  const data = categoryData[categoryKey];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [categoryKey]);

  // Get and sort articles
  const sortedArticles = useMemo(() => {
    const categoryArticles = getArticlesByCategory(categoryKey);
    
    // Use category data if no articles found
    const articles: Article[] = categoryArticles.length > 0 
      ? categoryArticles 
      : (data?.articles || []).map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: `Explore insights from ${a.author} in this ${a.readTime} minute read.`,
          category: categoryKey,
          author: a.author,
          readTime: `${a.readTime} min`,
          rating: a.rating,
        }));

    // Sort based on active option
    switch (activeSort) {
      case 'top':
        return [...articles].sort((a, b) => b.rating - a.rating);
      case 'new':
        return [...articles].reverse();
      case 'short':
        return [...articles].sort((a, b) => {
          const aTime = parseInt(a.readTime) || 0;
          const bTime = parseInt(b.readTime) || 0;
          return aTime - bTime;
        });
      default:
        return articles;
    }
  }, [categoryKey, data, activeSort]);

  if (!data) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <BackgroundEffects />
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Category not found</h1>
          <button onClick={() => navigate('/library')} className="btn-primary px-6 py-2 rounded-full">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const displayName = category?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <BackgroundEffects />

        <main className="relative z-10 pt-16 pb-24 px-4">
          <div className="container mx-auto">
            {/* Compact Header */}
            <header className="mb-4">
              <button
                onClick={() => navigate('/library')}
                className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Library
              </button>

              {/* Mini hero */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={data.image} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-foreground">
                    {displayName}
                  </h1>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {sortedArticles.length} articles
                  </p>
                </div>
              </div>
            </header>

            {/* Sticky Sort Controls */}
            <div className="sticky top-14 z-20 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/30">
              <div 
                className="flex gap-2 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setActiveSort(option.id)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        activeSort === option.id
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "bg-card/80 text-muted-foreground border border-border/50 hover:bg-card"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Articles List */}
            <section className="mt-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-card/50 animate-pulse">
                      <div className="w-20 h-20 rounded-lg bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-full" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedArticles.map((article, index) => (
                    <MobileArticleCard
                      key={article.id}
                      article={article}
                      index={index}
                      categoryImage={data.image}
                    />
                  ))}
                </div>
              )}

              {!isLoading && sortedArticles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">No articles found</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    );
  }

  // Desktop Layout (unchanged)
  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back button */}
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 mb-8 group btn-hover"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Library
          </button>

          {/* Hero */}
          <header className="mb-12">
            <motion.div 
              className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={data.image} 
                alt={displayName} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <AnimatedHeading
                  text={displayName || ''}
                  tag="h1"
                  className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2"
                  delay={200}
                  duration={0.5}
                  stagger={0.03}
                  threshold={0.1}
                />
                <motion.p 
                  className="text-lg text-foreground/80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {data.description}
                </motion.p>
              </div>
            </motion.div>
          </header>

          {/* Articles List with Preview Cards */}
          <section>
            <AnimatedHeading
              text="Popular Articles"
              tag="h2"
              className="font-display text-2xl font-semibold text-foreground mb-6"
              delay={400}
              duration={0.5}
              stagger={0.03}
              threshold={0.15}
            />
            {isLoading ? (
              <SkeletonGrid count={6} variant="article" />
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article, index) => (
                <ArticlePreviewCard 
                  key={article.id} 
                  article={article} 
                  index={index}
                />
              ))}
            </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CategoryDetail;