import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingDialog } from "./OnboardingDialog";

export function OnboardingWrapper() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user just registered and needs onboarding
    if (user) {
      const shouldShowOnboarding = localStorage.getItem("lumi_show_onboarding");
      const hasCompletedOnboarding = localStorage.getItem("lumi_onboarding_completed");
      
      if (shouldShowOnboarding === "true" && !hasCompletedOnboarding) {
        // Small delay to let the page render first
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleComplete = () => {
    setShowOnboarding(false);
    localStorage.removeItem("lumi_show_onboarding");
    localStorage.setItem("lumi_onboarding_completed", "true");
  };

  return (
    <OnboardingDialog 
      open={showOnboarding} 
      onComplete={handleComplete} 
    />
  );
}
