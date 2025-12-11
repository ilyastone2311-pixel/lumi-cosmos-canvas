import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight, X } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

const categories = [
  { id: "politics", name: "Politics", emoji: "🏛️" },
  { id: "psychology", name: "Psychology", emoji: "🧠" },
  { id: "culture", name: "Culture", emoji: "🎭" },
  { id: "technology", name: "Technology", emoji: "💻" },
  { id: "mindfulness", name: "Mindfulness", emoji: "🧘" },
  { id: "history", name: "History", emoji: "📜" },
  { id: "growth", name: "Personal Growth", emoji: "🌱" },
  { id: "science", name: "Science", emoji: "🔬" },
  { id: "business", name: "Business", emoji: "💼" },
];

interface OnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const { addFavorite } = useFavorites();

  const toggleCategory = (categoryId: string) => {
    if (allSelected) {
      setAllSelected(false);
      setSelectedCategories([categoryId]);
    } else {
      setSelectedCategories(prev =>
        prev.includes(categoryId)
          ? prev.filter(id => id !== categoryId)
          : [...prev, categoryId]
      );
    }
  };

  const toggleAll = () => {
    if (allSelected) {
      setAllSelected(false);
      setSelectedCategories([]);
    } else {
      setAllSelected(true);
      setSelectedCategories(categories.map(c => c.id));
    }
  };

  const handleContinue = async () => {
    if (step === 1) {
      // Save selected categories as favorites
      for (const categoryId of selectedCategories) {
        await addFavorite(categoryId);
      }
      setStep(2);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  // Don't render anything if not open
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onComplete(); }}>
      <DialogContent 
        className="sm:max-w-lg p-0 overflow-hidden border-primary/20 bg-background/95 backdrop-blur-xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-6"
            >
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 rounded-full bg-primary" />
                  <div className="w-8 h-1 rounded-full bg-muted" />
                </div>
                <span className="text-xs text-muted-foreground">Step 1 of 2</span>
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-primary" />
                </motion.div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  What topics interest you?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select categories to personalize your feed
                </p>
              </div>

              {/* All categories option */}
              <motion.button
                onClick={toggleAll}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full mb-4 p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                  allSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 text-foreground"
                }`}
              >
                <span className="font-medium">✨ All categories</span>
                {allSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>

              {/* Category grid */}
              <div className="grid grid-cols-3 gap-2 mb-6">
              {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                      selectedCategories.includes(category.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-xl">{category.emoji}</span>
                    <span className={`text-xs font-medium ${
                      selectedCategories.includes(category.id)
                        ? "text-primary"
                        : "text-foreground"
                    }`}>
                      {category.name}
                    </span>
                    {selectedCategories.includes(category.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip personalization
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={selectedCategories.length === 0}
                  className="gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-6"
            >
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 rounded-full bg-primary" />
                  <div className="w-8 h-1 rounded-full bg-primary" />
                </div>
                <span className="text-xs text-muted-foreground">Step 2 of 2</span>
              </div>

              {/* Success animation */}
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30"
                >
                  <Check className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold text-foreground mb-3"
                >
                  Thank you!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground mb-2"
                >
                  Your recommendation feed is ready.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-muted-foreground mb-8"
                >
                  Start reading — it will become more personalized as you read and like articles.
                </motion.p>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        opacity: 0, 
                        scale: 0,
                        x: "50%",
                        y: "50%"
                      }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        scale: [0, 1, 0.5],
                        x: `${50 + (Math.random() - 0.5) * 100}%`,
                        y: `${50 + (Math.random() - 0.5) * 100}%`
                      }}
                      transition={{ 
                        delay: 0.3 + i * 0.1,
                        duration: 1.5,
                        ease: "easeOut"
                      }}
                      className="absolute w-2 h-2 rounded-full bg-primary"
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className="gap-2 px-8"
                  >
                    <Sparkles className="w-4 h-4" />
                    Start exploring
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
