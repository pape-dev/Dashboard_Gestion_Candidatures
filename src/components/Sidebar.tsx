
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, Calendar, Users, User, FileText, Settings,
  Search, Target, TrendingUp, Bell, ChevronLeft, ChevronRight
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ open, onToggle }: SidebarProps) => {
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

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
      open ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {open && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">JobTracker</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2"
        >
          {open ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-100",
                    !open && "justify-center"
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {open && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-4 left-3 right-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-700 hover:bg-gray-100",
              !open && "justify-center"
            )
          }
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {open && <span>Paramètres</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
