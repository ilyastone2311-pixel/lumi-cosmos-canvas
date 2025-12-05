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
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
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
          {["Explore", "Library", "Premium"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium neon-underline"
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
                  className="glass-strong px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-white/15 transition-all duration-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="glass-strong px-5 py-2 rounded-full text-sm font-medium text-foreground hover:bg-white/15 transition-all duration-300 glow-cyan"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
