import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import BackgroundEffects from '@/components/BackgroundEffects';
import { Button } from '@/components/ui/button';
import LikeButton from '@/components/LikeButton';
import { useAuth } from '@/hooks/useAuth';
import { useArticleLikes } from '@/hooks/useArticleLikes';
import { useArticleReads } from '@/hooks/useArticleReads';
import { useArticleViews } from '@/hooks/useArticleViews';
import { articles, Article } from '@/data/articles';

const Recommended = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { likedArticles, loading: likesLoading } = useArticleLikes();
  const { readArticles, loading: readsLoading } = useArticleReads();
  const { getTopCategories } = useArticleViews();
  const [recommendations, setRecommendations] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const generateRecommendations = async () => {
      if (likesLoading || readsLoading || !user) return;

      setLoading(true);

      try {
        const topCategories = await getTopCategories();
        
        // Get categories from liked articles
        const likedCategories = likedArticles
          .map(id => articles.find(a => a.id === id)?.category)
          .filter(Boolean) as string[];

        // Get categories from read articles
        const readCategories = readArticles
          .map(id => articles.find(a => a.id === id)?.category)
          .filter(Boolean) as string[];

        // Combine and weight categories
        const categoryScores: Record<string, number> = {};
        
        likedCategories.forEach(cat => {
          categoryScores[cat] = (categoryScores[cat] || 0) + 3;
        });
        
        readCategories.forEach(cat => {
          categoryScores[cat] = (categoryScores[cat] || 0) + 2;
        });
        
        topCategories.forEach((cat, idx) => {
          categoryScores[cat] = (categoryScores[cat] || 0) + (5 - idx);
        });

        // Sort categories by score
        const sortedCategories = Object.entries(categoryScores)
          .sort((a, b) => b[1] - a[1])
          .map(([cat]) => cat);

        // Get articles from top categories, excluding already read/liked
        const interactedIds = new Set([...likedArticles, ...readArticles]);
        
        let recommended: Article[] = [];
        
        for (const category of sortedCategories) {
          const categoryArticles = articles.filter(
            a => a.category === category && !interactedIds.has(a.id)
          );
          recommended.push(...categoryArticles);
          if (recommended.length >= 12) break;
        }

        // If not enough recommendations, add random articles
        if (recommended.length < 6) {
          const remaining = articles.filter(a => !interactedIds.has(a.id) && !recommended.includes(a));
          recommended.push(...remaining.slice(0, 6 - recommended.length));
        }

        setRecommendations(recommended.slice(0, 12));
      } catch (error) {
        console.error('Error generating recommendations:', error);
        // Fallback to random articles
        setRecommendations(articles.slice(0, 9));
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [user, likedArticles, readArticles, likesLoading, readsLoading, getTopCategories]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />

      <main className="relative z-10 pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="p-3 rounded-xl bg-primary/10"
                animate={{ 
                  boxShadow: [
                    '0 0 20px hsl(var(--primary) / 0.3)',
                    '0 0 40px hsl(var(--primary) / 0.5)',
                    '0 0 20px hsl(var(--primary) / 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Recommended</h1>
                <p className="text-muted-foreground">Articles curated just for you</p>
              </div>
            </div>
          </motion.div>

          {/* Shimmer overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Cosmic shimmer effect */}
            <motion.div
              animate={{
                background: [
                  'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.1) 50%, transparent 100%)',
                  'linear-gradient(90deg, transparent 100%, hsl(var(--primary) / 0.1) 150%, transparent 200%)'
                ],
                backgroundPosition: ['0% 0%', '200% 0%']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 -z-10 rounded-3xl pointer-events-none"
            />

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recommendations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No recommendations yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Read and like articles to get personalized recommendations
                </p>
                <Button onClick={() => navigate('/library')}>
                  Go to Library
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.08,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      y: -4,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => navigate(`/article/${article.category}/${article.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] relative overflow-hidden">
                      {/* Shimmer effect on load */}
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ 
                          delay: index * 0.1 + 0.5,
                          duration: 0.8,
                          ease: 'easeInOut'
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none"
                      />

                      {/* Hover glow border */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 rounded-2xl border border-primary/30 pointer-events-none"
                        style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.2)' }}
                      />

                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                          {article.category}
                        </span>
                        <LikeButton articleId={article.id} size="sm" />
                      </div>

                      <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{article.author}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Recommended;
