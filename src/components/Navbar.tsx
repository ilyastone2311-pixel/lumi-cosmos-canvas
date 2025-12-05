import { Sparkles, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-primary animate-pulse-slow" />
            <div className="absolute inset-0 blur-md bg-primary/50 animate-glow-pulse rounded-full" />
          </div>
          <span className="font-display text-2xl font-bold tracking-wider text-foreground">
            Lumi
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "About", "Blog", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        {!loading && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="relative px-6 py-2.5 rounded-full text-sm font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-105"
              >
                {/* Button gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full" />
                {/* Glow */}
                <span className="absolute inset-0 opacity-50 blur-md bg-gradient-to-r from-primary to-secondary rounded-full" />
                <span className="relative">Sign Up</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;