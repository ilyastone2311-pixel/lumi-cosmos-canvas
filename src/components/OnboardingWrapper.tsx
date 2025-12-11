import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingDialog } from "./OnboardingDialog";

export function OnboardingWrapper() {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;
    
    // Check if user just registered and needs onboarding
    if (user) {
      const shouldShowOnboarding = localStorage.getItem("lumi_show_onboarding");
      const hasCompletedOnboarding = localStorage.getItem("lumi_onboarding_completed");
      
      if (shouldShowOnboarding === "true" && hasCompletedOnboarding !== "true") {
        // Small delay to let the page render first
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 300);
        return () => clearTimeout(timer);
      }
    } else {
      // Reset if user logs out
      setShowOnboarding(false);
    }
  }, [user, loading]);

  const handleComplete = () => {
    setShowOnboarding(false);
    localStorage.removeItem("lumi_show_onboarding");
    localStorage.setItem("lumi_onboarding_completed", "true");
  };

  if (!showOnboarding) return null;

  return (
    <OnboardingDialog 
      open={showOnboarding} 
      onComplete={handleComplete} 
    />
  );
}
