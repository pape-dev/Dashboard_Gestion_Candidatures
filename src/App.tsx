
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import Index from "./pages/Index";
import Applications from "./pages/Applications";
import Calendar from "./pages/Calendar";
import Contacts from "./pages/Contacts";
import JobSearch from "./pages/JobSearch";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs d'authentification
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // Log pour debugging
    console.log('App mounted, user:', user?.email, 'loading:', loading);
  }, [user, loading]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">JobTracker Pro</h2>
          <p className="text-slate-600 dark:text-slate-400">Initialisation de l'application...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Routes protégées */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppProvider>
            <Index />
          </AppProvider>
        </ProtectedRoute>
      } />
      <Route path="/applications" element={
        <ProtectedRoute>
          <AppProvider>
            <Applications />
          </AppProvider>
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <AppProvider>
            <Calendar />
          </AppProvider>
        </ProtectedRoute>
      } />
      <Route path="/contacts" element={
        <ProtectedRoute>
          <AppProvider>
            <Contacts />
          </AppProvider>
        </ProtectedRoute>
      } />
      <Route path="/job-search" element={
        <ProtectedRoute>
          <AppProvider>
            <JobSearch />
          </AppProvider>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppProvider>
            <Profile />
          </AppProvider>
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <AppProvider>
            <Tasks />
          </AppProvider>
        </ProtectedRoute>
      } />
      <Route path="/documents" element={
        <ProtectedRoute>
          <AppProvider>
            <Documents />
          </AppProvider>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppProvider>
            <Settings />
          </AppProvider>
        </ProtectedRoute>
      } />
      
      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
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
