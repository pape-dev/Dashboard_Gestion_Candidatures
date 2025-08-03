
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Briefcase, Calendar, Users, User, FileText, Settings,
  Search, Target, TrendingUp, Bell, ChevronLeft, ChevronRight,
  LogOut, Menu, X
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: TrendingUp },
    { name: "Candidatures", href: "/applications", icon: Briefcase },
    { name: "Calendrier", href: "/calendar", icon: Calendar },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Recherche d'emploi", href: "/job-search", icon: Search },
    { name: "Profil & CV", href: "/profile", icon: User },
    { name: "Tâches", href: "/tasks", icon: Target },
    { name: "Documents", href: "/documents", icon: FileText },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/90 backdrop-blur-sm shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 shadow-2xl",
        // Desktop
        "hidden lg:block",
        open ? "w-64" : "w-16",
        // Mobile
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0 block w-64" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          {(open || mobileOpen) && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xl">JobTracker</span>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Pro</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hidden lg:flex hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-300"
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User Profile Section */}
        {(open || mobileOpen) && user && (
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/30 dark:to-purple-950/30">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-blue-500/30 shadow-lg">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                  {user.user_metadata?.first_name?.[0]}{user.user_metadata?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user.user_metadata?.first_name && user.user_metadata?.last_name 
                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                    : user.email?.split('@')[0] || 'Utilisateur'
                  }
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30 scale-105"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-105",
                      !(open || mobileOpen) && "justify-center lg:px-4"
                    )
                  }
                >
                  {/* Effet de brillance pour l'élément actif */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {(open || mobileOpen) && <span>{item.name}</span>}
                  
                  {/* Badge pour les notifications */}
                  {item.name === "Candidatures" && (open || mobileOpen) && (
                    <Badge className="ml-auto bg-blue-500 text-white text-xs px-2 py-1">
                      4
                    </Badge>
                  )}
                  {item.name === "Calendrier" && (open || mobileOpen) && (
                    <Badge className="ml-auto bg-green-500 text-white text-xs px-2 py-1">
                      2
                    </Badge>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 mb-3 relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80",
                !(open || mobileOpen) && "justify-center"
              )
            }
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <Settings className="h-5 w-5 flex-shrink-0" />
            {(open || mobileOpen) && <span>Paramètres</span>}
          </NavLink>
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-950/50 transition-all duration-300 relative overflow-hidden mt-2",
              !(open || mobileOpen) && "justify-center"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {(open || mobileOpen) && <span>Déconnexion</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
