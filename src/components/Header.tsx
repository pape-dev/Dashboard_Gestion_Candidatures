
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, User, Settings, LogOut, Crown } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 lg:px-8 py-4 shadow-lg relative z-10 sticky top-0">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent dark:via-blue-950/20" />
      <div className="flex items-center justify-between relative">
        {/* Barre de recherche */}
        <div className="flex-1 max-w-lg hidden md:block relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher des candidatures, entreprises..."
              className="pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm"
            />
          </div>
        </div>

        {/* Mobile title */}
        <div className="flex-1 md:hidden relative">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              JobTracker Pro
            </h1>
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex items-center gap-4 relative">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-slate-100/80 dark:hover:bg-slate-800/80 backdrop-blur-sm transition-all duration-300 rounded-xl">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white text-xs shadow-lg animate-pulse rounded-full">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-2xl rounded-xl">
              <DropdownMenuLabel className="text-slate-900 dark:text-slate-100">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 rounded-xl m-1 cursor-pointer">
                <div className="font-medium text-slate-900 dark:text-slate-100">Entretien demain</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Entretien chez TechCorp à 14h00
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 rounded-xl m-1 cursor-pointer">
                <div className="font-medium text-slate-900 dark:text-slate-100">Nouvelle réponse</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Réponse positive de StartupXYZ
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 rounded-xl m-1 cursor-pointer">
                <div className="font-medium text-slate-900 dark:text-slate-100">Rappel</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Relancer candidature DataCorp
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profil utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300 ring-2 ring-transparent hover:ring-blue-500/20">
                <Avatar className="h-12 w-12 ring-2 ring-blue-500/30 shadow-lg">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="Utilisateur" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-2xl rounded-xl" align="end">
              <DropdownMenuLabel className="font-normal text-slate-900 dark:text-slate-100">
                <div className="flex flex-col space-y-2 p-2">
                  <p className="text-base font-semibold leading-none">
                    {user?.user_metadata?.first_name && user?.user_metadata?.last_name 
                      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                      : user?.email?.split('@')[0] || 'Utilisateur'
                    }
                  </p>
                  <p className="text-sm leading-none text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 rounded-xl m-1 cursor-pointer">
                <User className="mr-2 h-4 w-4 text-slate-500" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 rounded-xl m-1 cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-950/50 rounded-xl m-1 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
