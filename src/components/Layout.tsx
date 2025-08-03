
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/50 flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:32px_32px] opacity-[0.02]" />
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-8 shadow-xl"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">JobTracker Pro</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">Chargement de votre espace professionnel</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">Synchronisation des données en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30">
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:32px_32px] opacity-[0.015] pointer-events-none" />
      <div className="flex">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} ml-0 relative`}>
          <Header />
          
          <main className="p-4 lg:p-8 relative min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
