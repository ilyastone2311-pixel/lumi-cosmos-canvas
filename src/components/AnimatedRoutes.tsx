import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Library from "@/pages/Library";
import About from "@/pages/About";
import Experts from "@/pages/Experts";
import Downloads from "@/pages/Downloads";
import CategoryDetail from "@/pages/CategoryDetail";
import Article from "@/pages/Article";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import AdminArticles from "@/pages/AdminArticles";
import Recommended from "@/pages/Recommended";
import NotFound from "@/pages/NotFound";
import MotionShowcase from "@/pages/MotionShowcase";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <div className="pb-20 md:pb-0">
      {/* Navbar outside AnimatePresence for fixed positioning */}
      <Navbar />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/auth"
          element={
            <PageTransition>
              <Auth />
            </PageTransition>
          }
        />
        <Route
          path="/library"
          element={
            <PageTransition>
              <Library />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/experts"
          element={
            <PageTransition>
              <Experts />
            </PageTransition>
          }
        />
        <Route
          path="/downloads"
          element={
            <PageTransition>
              <Downloads />
            </PageTransition>
          }
        />
        <Route
          path="/category/:category"
          element={
            <PageTransition>
              <CategoryDetail />
            </PageTransition>
          }
        />
        <Route
          path="/article/:category/:articleId"
          element={
            <PageTransition>
              <Article />
            </PageTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition>
              <Settings />
            </PageTransition>
          }
        />
        <Route
          path="/recommended"
          element={
            <PageTransition>
              <Recommended />
            </PageTransition>
          }
        />
        <Route
          path="/admin"
          element={
            <PageTransition>
              <Admin />
            </PageTransition>
          }
        />
        <Route
          path="/admin/articles"
          element={
            <PageTransition>
              <AdminArticles />
            </PageTransition>
          }
        />
        <Route
          path="/motion-showcase"
          element={
            <PageTransition>
              <MotionShowcase />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedRoutes;
