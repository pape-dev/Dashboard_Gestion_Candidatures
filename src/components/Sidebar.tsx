
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
        "fixed left-0 top-0 z-40 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 transition-all duration-300 shadow-xl",
        // Desktop
        "hidden lg:block",
        open ? "w-64" : "w-16",
        // Mobile
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0 block w-64" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          {(open || mobileOpen) && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">JobTracker</span>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Pro</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hidden lg:flex hover:bg-slate-100 dark:hover:bg-slate-800"
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
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                  {user.user_metadata?.first_name?.[0]}{user.user_metadata?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-3">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
                      !(open || mobileOpen) && "justify-center lg:px-3"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {(open || mobileOpen) && <span>{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-2",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                !(open || mobileOpen) && "justify-center"
              )
            }
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {(open || mobileOpen) && <span>Paramètres</span>}
          </NavLink>
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200",
              !(open || mobileOpen) && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {(open || mobileOpen) && <span>Déconnexion</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
