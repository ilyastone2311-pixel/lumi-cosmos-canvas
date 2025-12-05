import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
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
  ChevronRight
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

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState<any[]>([]);
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Header */}
          <div className="glass gradient-border rounded-3xl p-8 mb-8 animate-fade-in">
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
              <button className="p-3 rounded-full glass hover:bg-white/10 transition-all btn-hover">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Articles Read", value: stats.totalArticles, icon: <BookOpen className="w-5 h-5" /> },
              { label: "Categories", value: stats.categoriesExplored, icon: <TrendingUp className="w-5 h-5" /> },
              { label: "Current Streak", value: `${stats.currentStreak} days`, icon: <Flame className="w-5 h-5 text-orange-500" /> },
              { label: "Favorites", value: favorites.length, icon: <Heart className="w-5 h-5 text-red-500" /> },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-5 text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-2 text-muted-foreground">
                  {stat.icon}
                </div>
                <div className="font-display text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
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
                <div
                  key={achievement.id}
                  className={`glass rounded-xl p-5 transition-all animate-fade-in ${
                    achievement.unlocked ? "border border-primary/30" : "opacity-60"
                  }`}
                  style={{ animationDelay: `${200 + index * 50}ms` }}
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
                </div>
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
                  <button
                    key={category}
                    onClick={() => navigate(`/category/${category.toLowerCase().replace(" ", "-")}`)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-border/20 last:border-0"
                  >
                    <span className="font-medium text-foreground">{category}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
