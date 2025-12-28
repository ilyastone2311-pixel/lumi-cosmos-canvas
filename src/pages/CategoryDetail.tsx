import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import ArticlePreviewCard from "@/components/ArticlePreviewCard";
import AnimatedHeading from "@/components/AnimatedHeading";
import { motion } from "framer-motion";
import { SkeletonGrid } from "@/components/ui/skeleton-card";
import { ArrowLeft } from "lucide-react";
import { getArticlesByCategory, articles } from "@/data/articles";

import categoryPolitics from "@/assets/category-politics-new.webp";
import categoryPsychology from "@/assets/category-psychology-neon.png";
import categoryCulture from "@/assets/category-culture-new.webp";
import categoryTechnology from "@/assets/category-technology-neon.png";
import categoryMindfulness from "@/assets/category-mindfulness-new.webp";
import categoryHistory from "@/assets/category-history-new.webp";
import categoryGrowth from "@/assets/category-growth-new.webp";
import categoryScience from "@/assets/category-science-neon.png";
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

const CategoryDetail = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const categoryKey = category?.toLowerCase().replace(/\s+/g, '-') || '';
  const data = categoryData[categoryKey];

  useEffect(() => {
    // Simulate loading for skeleton demo
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [categoryKey]);

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
              {(() => {
                const categoryArticles = getArticlesByCategory(categoryKey);
                // Fallback to legacy data if no articles found
                if (categoryArticles.length > 0) {
                  return categoryArticles.map((article, index) => (
                    <ArticlePreviewCard 
                      key={article.id} 
                      article={article} 
                      index={index}
                    />
                  ));
                }
                // Use legacy data from categoryData
                return data.articles.map((article, index) => (
                  <ArticlePreviewCard 
                    key={article.id} 
                    article={{
                      id: article.id,
                      title: article.title,
                      excerpt: `Explore insights from ${article.author} in this ${article.readTime} minute read.`,
                      category: categoryKey,
                      author: article.author,
                      readTime: `${article.readTime} min`,
                      rating: article.rating,
                    }} 
                    index={index}
                  />
                ));
              })()}
            </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CategoryDetail;