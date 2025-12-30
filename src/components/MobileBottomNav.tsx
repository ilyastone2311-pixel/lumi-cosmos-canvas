import { Home, Library, Zap, User, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Library, label: "Library", path: "/library" },
    ...(user ? [{ icon: Zap, label: "For You", path: "/recommended" }] : []),
    { icon: User, label: user ? "Profile" : "Login", path: user ? "/profile" : "/auth" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Gradient fade at top */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      {/* Main nav container */}
      <div 
        className="mx-4 mb-3 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50"
        style={{
          boxShadow: `
            0 -4px 20px hsl(var(--background) / 0.5),
            0 0 0 1px hsl(var(--primary) / 0.1),
            0 0 15px hsl(var(--primary) / 0.06)
          `,
        }}
      >
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center min-h-[52px] min-w-[52px] px-3 py-2 rounded-xl transition-colors ${
                  active 
                    ? "text-primary" 
                    : "text-muted-foreground"
                }`}
                whileTap={{ scale: 0.92 }}
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
                
                <Icon 
                  className={`relative z-10 w-5 h-5 mb-0.5 transition-transform ${
                    active ? "scale-110" : ""
                  }`} 
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`relative z-10 text-[10px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
