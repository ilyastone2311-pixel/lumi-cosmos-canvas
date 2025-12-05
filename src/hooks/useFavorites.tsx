import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("category")
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data?.map((f) => f.category) || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (category: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your favorites",
        variant: "destructive",
      });
      return;
    }

    const isFavorited = favorites.includes(category);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("category", category);

        if (error) throw error;
        setFavorites(favorites.filter((f) => f !== category));
        toast({
          title: "Removed from favorites",
          description: `${category} has been removed from your favorites`,
        });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, category });

        if (error) throw error;
        setFavorites([...favorites, category]);
        toast({
          title: "Added to favorites",
          description: `${category} has been added to your favorites`,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (category: string) => favorites.includes(category);

  return { favorites, loading, toggleFavorite, isFavorite };
}
