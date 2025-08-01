
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
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-4 lg:px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Barre de recherche */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher des candidatures, entreprises..."
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Mobile title */}
        <div className="flex-1 md:hidden">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              JobTracker Pro
            </h1>
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white text-xs shadow-lg">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xl">
              <DropdownMenuLabel className="text-slate-900 dark:text-slate-100">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="font-medium text-slate-900 dark:text-slate-100">Entretien demain</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Entretien chez TechCorp à 14h00
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="font-medium text-slate-900 dark:text-slate-100">Nouvelle réponse</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Réponse positive de StartupXYZ
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
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
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="Utilisateur" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xl" align="end">
              <DropdownMenuLabel className="font-normal text-slate-900 dark:text-slate-100">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </p>
                  <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <User className="mr-2 h-4 w-4 text-slate-500" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
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
