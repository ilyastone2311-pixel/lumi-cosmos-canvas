import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundEffects from "@/components/BackgroundEffects";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useArticleLikes } from "@/hooks/useArticleLikes";
import { useArticleReads } from "@/hooks/useArticleReads";
import { supabase } from "@/integrations/supabase/client";
import { articles, getArticleById } from "@/data/articles";
import LikeButton from "@/components/LikeButton";
import { 
  User, 
  Heart, 
  BookOpen, 
  Trophy, 
  Flame, 
  Star,
  TrendingUp,
  Calendar,
  Settings,
  ChevronRight,
  Check
} from "lucide-react";

interface ReadingStats {
  totalArticles: number;
  categoriesExplored: number;
  currentStreak: number;
  longestStreak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

type TabType = 'overview' | 'liked' | 'read';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { favorites } = useFavorites();
  const { getLikedArticlesData, likedArticles } = useArticleLikes();
  const { getReadArticlesData, readArticles } = useArticleReads();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [likedArticlesList, setLikedArticlesList] = useState<any[]>([]);
  const [readArticlesList, setReadArticlesList] = useState<any[]>([]);
  const [stats, setStats] = useState<ReadingStats>({
    totalArticles: 0,
    categoriesExplored: 0,
    currentStreak: 3,
    longestStreak: 7,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchReadingProgress();
      fetchLikedArticles();
      fetchReadArticles();
    }
  }, [user]);

  const fetchReadingProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) {
      setReadingProgress(data);
      const total = data.reduce((sum, item) => sum + item.articles_read, 0);
      setStats({
        totalArticles: total,
        categoriesExplored: data.length,
        currentStreak: 3,
        longestStreak: 7,
      });
    }
  };

  const fetchLikedArticles = async () => {
    const data = await getLikedArticlesData();
    const articlesWithDetails = data.map(item => {
      const article = getArticleById(item.article_id);
      return { ...item, article };
    }).filter(item => item.article);
    setLikedArticlesList(articlesWithDetails);
  };

  const fetchReadArticles = async () => {
    const data = await getReadArticlesData();
    const articlesWithDetails = data.map(item => {
      const article = getArticleById(item.article_id);
      return { ...item, article };
    }).filter(item => item.article);
    setReadArticlesList(articlesWithDetails);
  };

  const achievements: Achievement[] = [
    {
      id: "first-read",
      title: "First Steps",
      description: "Read your first article",
      icon: <BookOpen className="w-6 h-6" />,
      unlocked: stats.totalArticles >= 1,
    },
    {
      id: "bookworm",
      title: "Bookworm",
      description: "Read 10 articles",
      icon: <Star className="w-6 h-6" />,
      unlocked: stats.totalArticles >= 10,
      progress: Math.min(stats.totalArticles, 10),
      maxProgress: 10,
    },
    {
      id: "explorer",
      title: "Explorer",
      description: "Explore 5 different categories",
      icon: <TrendingUp className="w-6 h-6" />,
      unlocked: stats.categoriesExplored >= 5,
      progress: Math.min(stats.categoriesExplored, 5),
      maxProgress: 5,
    },
    {
      id: "streak-master",
      title: "Streak Master",
      description: "Maintain a 7-day reading streak",
      icon: <Flame className="w-6 h-6" />,
      unlocked: stats.longestStreak >= 7,
      progress: Math.min(stats.currentStreak, 7),
      maxProgress: 7,
    },
    {
      id: "collector",
      title: "Collector",
      description: "Save 3 favorite categories",
      icon: <Heart className="w-6 h-6" />,
      unlocked: favorites.length >= 3,
      progress: Math.min(favorites.length, 3),
      maxProgress: 3,
    },
    {
      id: "champion",
      title: "Knowledge Champion",
      description: "Read 50 articles",
      icon: <Trophy className="w-6 h-6" />,
      unlocked: stats.totalArticles >= 50,
      progress: Math.min(stats.totalArticles, 50),
      maxProgress: 50,
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'liked' as const, label: 'Liked', icon: <Heart className="w-4 h-4" />, count: likedArticles.length },
    { id: 'read' as const, label: 'Read', icon: <Check className="w-4 h-4" />, count: readArticles.length },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass gradient-border rounded-3xl p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background flex items-center justify-center border-2 border-primary">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-display text-2xl font-bold text-foreground mb-1">
                  {user.email?.split("@")[0] || "Reader"}
                </h1>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Member since {memberSince}
                  </span>
                </div>
              </div>

              {/* Settings Button */}
              <button 
                onClick={() => navigate('/settings')}
                className="p-3 rounded-full glass hover:bg-white/10 transition-all btn-hover"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-8 overflow-x-auto pb-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="profileTab"
                    className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                    style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.2)' }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Articles Read", value: stats.totalArticles, icon: <BookOpen className="w-5 h-5" /> },
                    { label: "Categories", value: stats.categoriesExplored, icon: <TrendingUp className="w-5 h-5" /> },
                    { label: "Current Streak", value: `${stats.currentStreak} days`, icon: <Flame className="w-5 h-5 text-orange-500" /> },
                    { label: "Favorites", value: favorites.length, icon: <Heart className="w-5 h-5 text-red-500" /> },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-xl p-5 text-center"
                    >
                      <div className="flex justify-center mb-2 text-muted-foreground">
                        {stat.icon}
                      </div>
                      <div className="font-display text-2xl font-bold text-foreground mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Achievements */}
                <section className="mb-8">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Achievements
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className={`glass rounded-xl p-5 transition-all ${
                          achievement.unlocked ? "border border-primary/30" : "opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              achievement.unlocked
                                ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground mb-0.5">
                              {achievement.title}
                              {achievement.unlocked && (
                                <span className="ml-2 text-xs text-primary">✓ Unlocked</span>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {achievement.description}
                            </p>
                            {achievement.progress !== undefined && !achievement.unlocked && (
                              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                                  style={{
                                    width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Favorite Categories */}
                {favorites.length > 0 && (
                  <section>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Favorite Categories
                    </h2>
                    <div className="glass rounded-xl overflow-hidden">
                      {favorites.map((category, index) => (
                        <motion.button
                          key={category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => navigate(`/category/${category.toLowerCase().replace(" ", "-")}`)}
                          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-border/20 last:border-0"
                        >
                          <span className="font-medium text-foreground">{category}</span>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </motion.button>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}

            {activeTab === 'liked' && (
              <motion.div
                key="liked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Liked Articles
                </h2>
                
                {likedArticlesList.length === 0 ? (
                  <div className="glass rounded-xl p-12 text-center">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">You haven't liked any articles yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {likedArticlesList.map((item, index) => (
                      <motion.div
                        key={item.article_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        whileHover={{ y: -3 }}
                        onClick={() => navigate(`/article/${item.article.category}/${item.article_id}`)}
                        className="group cursor-pointer"
                      >
                        <div className="glass-card rounded-xl p-5 h-full transition-all duration-300 group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.15)] group-hover:border-primary/20">
                          <div className="flex items-start justify-between mb-2">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                              {item.article.category}
                            </span>
                            <LikeButton articleId={item.article_id} size="sm" />
                          </div>
                          <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {item.article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {item.article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.article.author}</span>
                            <span>{item.article.readTime}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'read' && (
              <motion.div
                key="read"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Read Articles
                </h2>
                
                {readArticlesList.length === 0 ? (
                  <div className="glass rounded-xl p-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No completed articles yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {readArticlesList.map((item, index) => (
                      <motion.div
                        key={item.article_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        whileHover={{ 
                          y: -3,
                          rotateX: 2,
                          rotateY: 2,
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                        onClick={() => navigate(`/article/${item.article.category}/${item.article_id}`)}
                        className="group cursor-pointer"
                      >
                        <div className="glass-card rounded-xl p-5 h-full transition-all duration-300 relative overflow-hidden">
                          {/* Hover glow border */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 rounded-xl border border-green-500/30 pointer-events-none"
                            style={{ boxShadow: '0 0 15px hsl(142 76% 36% / 0.2)' }}
                          />
                          
                          <div className="flex items-start justify-between mb-2">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Read
                            </span>
                            <LikeButton articleId={item.article_id} size="sm" />
                          </div>
                          <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {item.article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {item.article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.article.author}</span>
                            <span>{item.article.readTime}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Profile;
