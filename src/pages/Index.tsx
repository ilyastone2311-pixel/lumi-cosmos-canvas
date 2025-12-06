import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import BackgroundEffects from "@/components/BackgroundEffects";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { getRandomArticle } from "@/data/articles";

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
  const navigate = useNavigate();

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

        {/* How It Works - Floating Section */}
        <div className="relative">
          {/* Section glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
          </div>
          <HowItWorks />
        </div>

        {/* Categories Section - Enhanced with depth */}
        <section className="py-24 px-6 relative">
          {/* Section ambient glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[180px]" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[200px]" />
          </div>

          <div className="container mx-auto max-w-7xl relative">
            {/* Section Header with floating effect */}
            <div 
              className="text-center mb-20 relative"
              style={{
                transform: 'translateZ(20px)',
              }}
            >
              <h2 
                className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in"
                style={{
                  textShadow: '0 4px 30px hsla(190, 100%, 50%, 0.15)',
                }}
              >
                Explore Categories
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
                {user 
                  ? "Click the heart to save your favorites" 
                  : "Dive into topics that spark your curiosity"
                }
              </p>
              
              {/* Decorative line */}
              <div className="mt-8 flex justify-center">
                <div 
                  className="w-24 h-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, hsl(190 100% 50% / 0.5), transparent)',
                    boxShadow: '0 0 20px hsl(190 100% 50% / 0.3)',
                  }}
                />
              </div>
            </div>

            {/* Categories Grid with enhanced depth */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {categories.map((category, index) => (
                <div
                  key={category.title}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${200 + index * 100}ms`,
                    transform: `translateZ(${10 + (index % 3) * 5}px)`,
                  }}
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

        {/* Bottom CTA - Elevated floating card */}
        <section className="py-24 px-6 relative">
          {/* Background glow for section */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[400px] bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto max-w-4xl text-center relative">
            {/* Floating CTA Card */}
            <div 
              className="relative p-14 rounded-3xl animate-fade-in overflow-hidden"
              style={{
                background: 'hsla(230, 50%, 8%, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid hsla(210, 40%, 98%, 0.08)',
                boxShadow: `
                  0 0 0 1px hsla(190, 100%, 50%, 0.05),
                  0 4px 20px hsla(190, 100%, 50%, 0.08),
                  0 8px 40px hsla(270, 100%, 60%, 0.06),
                  0 20px 60px hsla(230, 50%, 5%, 0.5),
                  0 40px 80px hsla(230, 50%, 5%, 0.3)
                `,
              }}
            >
              {/* Inner glow effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              
              {/* Floating orbs inside */}
              <div className="absolute top-4 right-8 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute bottom-4 left-8 w-16 h-16 bg-secondary/10 rounded-full blur-xl" />
              
              <h3 
                className="relative font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
                style={{
                  textShadow: '0 2px 20px hsla(190, 100%, 50%, 0.2)',
                }}
              >
                Ready to expand your mind?
              </h3>
              <p className="relative text-muted-foreground mb-10 max-w-md mx-auto">
                {user 
                  ? "Explore your saved favorites anytime" 
                  : "Join thousands of curious minds on their learning journey"
                }
              </p>
              <button 
                onClick={() => {
                  const randomArticle = getRandomArticle();
                  navigate(`/article/${randomArticle.category}/${randomArticle.id}`);
                }}
                className="relative group px-10 py-4 rounded-full font-display font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  background: 'hsla(230, 40%, 12%, 0.8)',
                  border: '1px solid hsla(190, 100%, 50%, 0.2)',
                  boxShadow: `
                    0 0 20px hsla(190, 100%, 50%, 0.1),
                    0 4px 15px hsla(230, 50%, 5%, 0.4),
                    inset 0 1px 0 hsla(210, 40%, 98%, 0.05)
                  `,
                }}
              >
                {/* Glow effect on hover */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-full" />
                
                {/* Text */}
                <span className="relative flex items-center gap-3 text-foreground">
                  <span 
                    className="w-2 h-2 rounded-full bg-primary animate-pulse"
                    style={{ boxShadow: '0 0 10px hsl(190 100% 50%)' }}
                  />
                  Surprise Me
                </span>
              </button>
            </div>

            {/* Shadow layer underneath */}
            <div 
              className="absolute inset-x-8 -bottom-4 h-20 rounded-3xl -z-10"
              style={{
                background: 'radial-gradient(ellipse at center, hsla(270, 80%, 50%, 0.15) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
          </div>
        </section>

        {/* Bottom spacing */}
        <div className="h-20" />
      </main>
    </div>
  );
};

export default Index;