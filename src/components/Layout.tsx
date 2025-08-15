
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

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
