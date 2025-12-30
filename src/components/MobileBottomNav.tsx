import { Home, Library, Search, Bookmark, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useState } from "react";
import SearchBar from "./SearchBar";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: "Home", path: "/", action: () => navigate("/") },
    { icon: Library, label: "Library", path: "/library", action: () => navigate("/library") },
    { icon: Search, label: "Search", path: null, action: () => setSearchOpen(true) },
    { icon: Bookmark, label: "Saved", path: "/recommended", action: () => navigate(user ? "/recommended" : "/auth") },
    { icon: User, label: "Profile", path: user ? "/profile" : "/auth", action: () => navigate(user ? "/profile" : "/auth") },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
        {/* Gradient fade at top */}
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        
        {/* Main nav container */}
        <div 
          className="mx-3 mb-2 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50"
          style={{
            boxShadow: `
              0 -4px 20px hsl(var(--background) / 0.5),
              0 0 0 1px hsl(var(--primary) / 0.1),
              0 0 15px hsl(var(--primary) / 0.06)
            `,
          }}
        >
          <div className="flex items-center justify-around px-1 py-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = item.path ? isActive(item.path) : false;
              const isSearch = item.label === "Search";
              
              return (
                <motion.button
                  key={item.label}
                  onClick={item.action}
                  className={`relative flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 py-1.5 rounded-xl transition-colors ${
                    active 
                      ? "text-primary" 
                      : isSearch
                        ? "text-muted-foreground"
                        : "text-muted-foreground"
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="mobileNavIndicator"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'hsl(var(--primary) / 0.12)',
                        border: '1px solid hsl(var(--primary) / 0.2)',
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Search has special center styling */}
                  {isSearch ? (
                    <div 
                      className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center -mt-3"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                        boxShadow: '0 4px 15px hsl(var(--primary) / 0.4)',
                      }}
                    >
                      <Icon className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <Icon 
                      className={`relative z-10 w-5 h-5 mb-0.5 transition-transform ${
                        active ? "scale-110" : ""
                      }`} 
                      strokeWidth={active ? 2.5 : 2}
                    />
                  )}
                  
                  <span className={`relative z-10 text-[10px] font-medium ${
                    active ? "text-primary" : "text-muted-foreground"
                  } ${isSearch ? "mt-0.5" : ""}`}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default MobileBottomNav;
