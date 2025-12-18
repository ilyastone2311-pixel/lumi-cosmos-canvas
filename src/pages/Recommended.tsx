import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Loader2, Heart, Wand2, Headphones, BookOpen, TrendingUp } from 'lucide-react';
import BackgroundEffects from '@/components/BackgroundEffects';
import ArticlePreviewCard from '@/components/ArticlePreviewCard';
import SplitText from '@/components/SplitText';
import { SkeletonGrid } from '@/components/ui/skeleton-card';
import { Button } from '@/components/ui/button';
import { OnboardingDialog } from '@/components/OnboardingDialog';
import { useAuth } from '@/hooks/useAuth';
import { useArticleLikes } from '@/hooks/useArticleLikes';
import { useArticleReads } from '@/hooks/useArticleReads';
import { useArticleViews } from '@/hooks/useArticleViews';
import { useFavorites } from '@/hooks/useFavorites';
import { articles, Article } from '@/data/articles';

const Recommended = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { likedArticles, loading: likesLoading } = useArticleLikes();
  const { readArticles, loading: readsLoading } = useArticleReads();
  const { getTopCategories } = useArticleViews();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [recommendations, setRecommendations] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasNoActivity, setHasNoActivity] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const generateRecommendations = async () => {
      if (likesLoading || readsLoading || favoritesLoading || !user) return;

      setLoading(true);

      try {
        const topCategories = await getTopCategories();
        
        // Check if user has any activity
        const hasLikes = likedArticles.length > 0;
        const hasReads = readArticles.length > 0;
        const hasFavorites = favorites.length > 0;
        const hasViews = topCategories.length > 0;
        
        // If user has no activity at all, show empty state
        if (!hasLikes && !hasReads && !hasFavorites && !hasViews) {
          setHasNoActivity(true);
          setRecommendations([]);
          setLoading(false);
          return;
        }
        
        setHasNoActivity(false);

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
        
        // Favorites get highest weight
        favorites.forEach(cat => {
          categoryScores[cat] = (categoryScores[cat] || 0) + 5;
        });
        
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
  }, [user, likedArticles, readArticles, favorites, likesLoading, readsLoading, favoritesLoading, getTopCategories]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Trigger recommendations refresh
    setLoading(true);
    setHasNoActivity(false);
  };

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
      
      {/* Semantic overlay layer - reduces background interference */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(11, 16, 32, 0.55) 0%, rgba(11, 16, 32, 0.65) 50%, rgba(11, 16, 32, 0.7) 100%)',
          backdropFilter: 'blur(2px)',
        }}
      />

      <main className="relative z-10 pt-20 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 mb-6 sm:mb-8 group active:scale-95 font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Hero Section with improved contrast */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-12"
          >
            {/* Hero Card - Enhanced surface separation */}
            <div 
              className="relative h-48 sm:h-64 md:h-72 rounded-2xl overflow-hidden mb-6 sm:mb-8"
              style={{
                background: 'rgba(15, 20, 40, 0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
              }}
            >
              {/* Dimmed animated gradient background */}
              <motion.div 
                className="absolute inset-0 opacity-40"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--secondary) / 0.2) 50%, hsl(var(--accent) / 0.3) 100%)',
                }}
                animate={{
                  background: [
                    'linear-gradient(135deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--secondary) / 0.2) 50%, hsl(var(--accent) / 0.3) 100%)',
                    'linear-gradient(135deg, hsl(var(--accent) / 0.3) 0%, hsl(var(--primary) / 0.2) 50%, hsl(var(--secondary) / 0.3) 100%)',
                    'linear-gradient(135deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--secondary) / 0.2) 50%, hsl(var(--accent) / 0.3) 100%)',
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              {/* Floating particles - reduced opacity */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background: `hsl(var(--${['primary', 'secondary', 'accent'][i % 3]}) / 0.5)`,
                      left: `${10 + (i * 10) % 80}%`,
                      top: `${20 + (i * 15) % 60}%`,
                    }}
                    animate={{
                      y: [0, -15, 0],
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              {/* Dark gradient scrim for text area */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(11, 16, 32, 0.95) 0%, rgba(11, 16, 32, 0.7) 40%, rgba(11, 16, 32, 0.3) 100%)',
                }}
              />
              
              {/* Content with improved typography */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <motion.div 
                    className="p-2.5 sm:p-3 rounded-xl"
                    style={{
                      background: 'rgba(15, 20, 40, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
                    }}
                    animate={{ 
                      boxShadow: [
                        '0 0 20px hsl(var(--primary) / 0.3)',
                        '0 0 35px hsl(var(--primary) / 0.4)',
                        '0 0 20px hsl(var(--primary) / 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </motion.div>
                  <div>
                    <SplitText 
                      text="For You"
                      tag="h1"
                      className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white"
                      splitType="chars"
                      delay={50}
                      duration={0.85}
                      ease="power3.out"
                      from={{ opacity: 0, y: 50, scale: 0.96 }}
                      to={{ opacity: 1, y: 0, scale: 1 }}
                      threshold={0.1}
                      textAlign="left"
                    />
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed mt-1">
                      Personalized recommendations based on your interests
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar - Enhanced card surface */}
            <div 
              className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm p-4 rounded-xl"
              style={{
                background: 'rgba(15, 20, 40, 0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-white/80 font-medium">{recommendations.length} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-secondary" />
                <span className="text-white/80 font-medium">Audio available</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-white/80 font-medium">Updated daily</span>
              </div>
            </div>
          </motion.header>

          {/* Content Section */}
          <section>
            {loading ? (
              <SkeletonGrid count={6} variant="article" />
            ) : hasNoActivity ? (
              /* Empty state for new users - Enhanced card */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 rounded-2xl"
                style={{
                  background: 'rgba(15, 20, 40, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                }}
              >
                {/* Animated icon container */}
                <motion.div
                  className="relative mb-6 sm:mb-8"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.2), rgba(var(--accent-rgb), 0.2))',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    animate={{ 
                      boxShadow: [
                        '0 0 30px hsl(var(--primary) / 0.2)',
                        '0 0 50px hsl(var(--primary) / 0.35)',
                        '0 0 30px hsl(var(--primary) / 0.2)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </motion.div>
                  
                  {/* Floating sparkles */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </motion.div>
                </motion.div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 text-center">
                  Let's personalize your feed
                </h2>
                
                <p className="text-sm sm:text-base text-white/70 text-center max-w-md mb-6 sm:mb-8 leading-relaxed">
                  Tell us what topics interest you most, and we'll curate the perfect reading experience just for you.
                </p>

                {/* Personalization button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    onClick={() => setShowOnboarding(true)}
                    className="group relative overflow-hidden px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl w-full sm:w-auto"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <Wand2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Choose Your Interests
                  </Button>
                </motion.div>

                {/* Secondary option */}
                <p className="text-sm text-white/60 mt-5 sm:mt-6 text-center">
                  Or{' '}
                  <button 
                    onClick={() => navigate('/library')} 
                    className="text-primary hover:underline font-medium"
                  >
                    browse the library
                  </button>
                  {' '}and start reading
                </p>
              </motion.div>
            ) : recommendations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 sm:py-20 rounded-2xl"
                style={{
                  background: 'rgba(15, 20, 40, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-white/40 mx-auto mb-4" />
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  No recommendations yet
                </h2>
                <p className="text-sm sm:text-base text-white/70 mb-6">
                  Read and like articles to get personalized recommendations
                </p>
                <Button onClick={() => navigate('/library')} className="w-full sm:w-auto">
                  Go to Library
                </Button>
              </motion.div>
            ) : (
              <>
                {/* Section heading with scrim */}
                <div 
                  className="mb-4 sm:mb-6 p-4 rounded-xl inline-block"
                  style={{
                    background: 'rgba(15, 20, 40, 0.5)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-white">
                    Recommended Articles
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {recommendations.map((article, index) => (
                    <ArticlePreviewCard 
                      key={article.id} 
                      article={article} 
                      index={index}
                    />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Bottom CTA for users with recommendations */}
          {!loading && !hasNoActivity && recommendations.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 sm:mt-16 pt-8 sm:pt-12"
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div 
                className="text-center p-8 rounded-2xl"
                style={{
                  background: 'rgba(15, 20, 40, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-2">
                  Want more personalized content?
                </h3>
                <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 leading-relaxed">
                  Explore more categories to improve your recommendations
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/library')}
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                >
                  Browse All Categories
                </Button>
              </div>
            </motion.section>
          )}
        </div>
      </main>

      {/* Onboarding Dialog */}
      <OnboardingDialog 
        open={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
    </div>
  );
};

export default Recommended;
