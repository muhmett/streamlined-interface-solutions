import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import RoleSelect from "./pages/RoleSelect";
import ArtisanSetup from "./pages/ArtisanSetup";
import Home from "./pages/Home";
import ArtisanProfile from "./pages/ArtisanProfile";
import Jobs from "./pages/Jobs";
import Urgent from "./pages/Urgent";
import MyPortfolio from "./pages/MyPortfolio";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Verification from "./pages/Verification";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

/** AnimatePresence needs the location key so exit animations run between routes. */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/role"
          element={
            <ProtectedRoute>
              <RoleSelect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan-setup"
          element={
            <ProtectedRoute>
              <ArtisanSetup />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Home />} />
        <Route path="/urgent" element={<Urgent />} />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-portfolio"
          element={
            <ProtectedRoute>
              <MyPortfolio />
            </ProtectedRoute>
          }
        />
        <Route path="/artisan/:id" element={<ArtisanProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/verification"
          element={
            <ProtectedRoute>
              <Verification />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = ({ basename }: { basename?: string }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner position="top-center" dir="rtl" />
        <BrowserRouter basename={basename}>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
