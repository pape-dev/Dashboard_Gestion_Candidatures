import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:32px_32px] opacity-[0.02]" />
      
      <Card className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900 w-fit mx-auto mb-6">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Page introuvable</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="space-y-3">
            <Link to="/">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
                <Home className="h-4 w-4" />
                Retour au dashboard
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full gap-2" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Page précédente
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              URL tentée: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{location.pathname}</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;