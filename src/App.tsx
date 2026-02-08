import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import ReactBitsLoader from "./components/ReactBitsLoader";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OAuthCallback from "./pages/OAuthCallback";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const AppContent = () => {
  const { loading } = useAuth();
  const [showReactBits, setShowReactBits] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show the welcome loader if not already shown in this session and not on reset-password page
    if (!sessionStorage.getItem('welcomeShown') && location.pathname !== '/reset-password') {
      setShowReactBits(true);
    }
  }, [location.pathname]);

  const handleReactBitsComplete = () => {
    setShowReactBits(false);
    sessionStorage.setItem('welcomeShown', 'true');
  };

  if (showReactBits) {
    return <ReactBitsLoader onComplete={handleReactBitsComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <img 
              src="/translogo.png" 
              alt="Bookish Notes Organizer" 
              className="h-20 w-20 mx-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
          <p className="text-white font-['Orbitron',monospace] text-2xl font-medium">Loading your personal library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/add-book" element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          } />
          <Route path="/edit-book/:id" element={
            <ProtectedRoute>
              <EditBook />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {['/', '/add-book', '/edit-book', '/edit-book/'].some(path => location.pathname === path || location.pathname.startsWith('/edit-book')) && (
        <Footer />
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
