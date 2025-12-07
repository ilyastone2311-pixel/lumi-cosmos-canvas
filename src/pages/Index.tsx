import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import BackgroundEffects from "@/components/BackgroundEffects";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import IllustrationSection from "@/components/IllustrationSection";
import ScrollSection from "@/components/ScrollSection";
import { SectionHeader, CardGrid } from "@/components/PageLoadAnimation";
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

// Premium easing
const premiumEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

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
    <>
      {/* Navigation - Outside overflow container */}
      <Navbar />
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <BackgroundEffects />

        {/* Main Content - Seamless flow */}
        <main className="relative z-10 pt-24 sm:pt-28">
        {/* Hero Section */}
        <HeroSection />

        {/* Seamless transition - Hero to HowItWorks */}
        <div className="relative h-16 md:h-24 -mt-8 pointer-events-none" />

        {/* How It Works - Floating Section */}
        <ScrollSection direction="up">
          <div className="relative -mt-16">
            {/* Section glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
            </div>
            <HowItWorks />
          </div>
        </ScrollSection>

        {/* Seamless transition - HowItWorks to Illustration */}
        <div className="relative h-12 md:h-16 pointer-events-none" />

        {/* Illustration Section - Hybrid pastel pocket */}
        <ScrollSection direction="fade" delay={0.05}>
          <IllustrationSection />
        </ScrollSection>

        {/* Seamless transition - Illustration to Categories */}
        <div className="relative h-12 md:h-16 pointer-events-none" />

        {/* Categories Section - Enhanced with staggered load animations */}
        <ScrollSection direction="up" delay={0.15}>
          <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
            {/* Section ambient glow with fade-in */}
            <motion.div 
              className="absolute inset-0 pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: premiumEase }}
            >
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[180px]" />
              <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[200px]" />
            </motion.div>

            <div className="container mx-auto max-w-7xl relative">
              {/* Section Header with premium entrance animation */}
              <SectionHeader className="text-center mb-12 sm:mb-20 relative">
                <motion.h2 
                  className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4"
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: premiumEase }}
                  style={{
                    textShadow: '0 4px 30px hsla(190, 100%, 50%, 0.15)',
                  }}
                >
                  Explore Categories
                </motion.h2>
                <motion.p 
                  className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4"
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.15, ease: premiumEase }}
                >
                  {user 
                    ? "Click the heart to save your favorites" 
                    : "Dive into topics that spark your curiosity"
                  }
                </motion.p>
                
                {/* Decorative line with entrance animation */}
                <motion.div 
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }}
                >
                  <div 
                    className="w-24 h-0.5 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, hsl(190 100% 50% / 0.5), transparent)',
                      boxShadow: '0 0 20px hsl(190 100% 50% / 0.3)',
                    }}
                  />
                </motion.div>
              </SectionHeader>

              {/* Categories Grid with staggered card animations */}
              <CardGrid 
                staggerDelay={0.08} 
                baseDelay={0.2}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-10"
              >
                {categories.map((category, index) => (
                  <CategoryCard
                    key={category.title}
                    title={category.title}
                    subtitle={category.subtitle}
                    image={category.image}
                    delay={index * 80}
                    isFavorite={isFavorite(category.title)}
                    onToggleFavorite={() => toggleFavorite(category.title)}
                  />
                ))}
              </CardGrid>
            </div>
          </section>
        </ScrollSection>

        {/* Seamless transition - Categories to CTA */}
        <div className="relative h-12 md:h-16 pointer-events-none" />

        {/* Bottom CTA - Elevated floating card with entrance animations */}
        <ScrollSection direction="up" delay={0.1}>
          <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
            {/* Background glow with fade-in */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: premiumEase }}
            >
              <div className="w-[600px] h-[400px] bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-full blur-[120px]" />
            </motion.div>

            <div className="container mx-auto max-w-4xl text-center relative">
              {/* Floating CTA Card with premium entrance - theme aware */}
              <motion.div 
                className="relative p-8 sm:p-14 rounded-3xl overflow-hidden bg-card/80 backdrop-blur-xl border border-border"
                initial={{ opacity: 0, y: 30, scale: 0.98, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: premiumEase }}
                style={{
                  boxShadow: `
                    0 0 0 1px hsl(var(--primary) / 0.05),
                    0 4px 20px hsl(var(--primary) / 0.08),
                    0 8px 40px hsl(var(--secondary) / 0.06),
                    0 20px 60px hsl(var(--foreground) / 0.1)
                  `,
                }}
              >
                {/* Inner glow effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 pointer-events-none" />
                <motion.div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }}
                />
                
                {/* Floating orbs with entrance */}
                <motion.div 
                  className="absolute top-4 right-8 w-20 h-20 bg-primary/10 rounded-full blur-2xl"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: premiumEase }}
                />
                <motion.div 
                  className="absolute bottom-4 left-8 w-16 h-16 bg-secondary/10 rounded-full blur-xl"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5, ease: premiumEase }}
                />
                
                <motion.h3 
                  className="relative font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4"
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: premiumEase }}
                >
                  Ready to expand your mind?
                </motion.h3>
                <motion.p 
                  className="relative text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.35, ease: premiumEase }}
                >
                  {user 
                    ? "Explore your saved favorites anytime" 
                    : "Join thousands of curious minds on their learning journey"
                  }
                </motion.p>
                <motion.button 
                  onClick={() => {
                    const randomArticle = getRandomArticle();
                    navigate(`/article/${randomArticle.category}/${randomArticle.id}`);
                  }}
                  className="relative group px-6 sm:px-10 py-3 sm:py-4 rounded-full font-display font-semibold overflow-hidden transition-all duration-300 bg-muted/80 border border-primary/20 text-foreground text-sm sm:text-base"
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5, ease: premiumEase }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: `
                      0 0 20px hsl(var(--primary) / 0.1),
                      0 4px 15px hsl(var(--foreground) / 0.08)
                    `,
                  }}
                >
                  {/* Glow effect on hover */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-full" />
                  
                  {/* Text */}
                  <span className="relative flex items-center gap-3">
                    <span 
                      className="w-2 h-2 rounded-full bg-primary animate-pulse"
                      style={{ boxShadow: '0 0 10px hsl(var(--primary))' }}
                    />
                    Surprise Me
                  </span>
                </motion.button>
              </motion.div>

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
        </ScrollSection>

        {/* Bottom spacing */}
        <div className="h-20" />
      </main>
      </div>
    </>
  );
};

export default Index;