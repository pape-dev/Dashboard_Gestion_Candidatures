import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:32px_32px] opacity-[0.02]" />
      
      <div className="relative w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-6 ring-4 ring-blue-500/20">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-3">
            JobTracker Pro
          </h1>
          <div className="flex items-center justify-center gap-2 text-base text-slate-600 dark:text-slate-400">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Votre plateforme professionnelle de gestion de carrière</span>
          </div>
        </div>

        {/* Carte d'authentification */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {subtitle}
              </p>
            </div>
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2025 JobTracker Pro. Plateforme sécurisée et professionnelle.</p>
          <p className="mt-1">Vos données sont protégées et chiffrées.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;